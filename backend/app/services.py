from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass
from decimal import Decimal

from django.db import transaction
from django.db.models import Q, Sum
from django.db.models.functions import Coalesce
from django.utils import timezone

from .models import Account, Budget, Category, Transaction


@dataclass(frozen=True)
class AccountDelta:
    account_id: int
    amount: Decimal


ZERO = Decimal("0.00")


def category_queryset_for_user(user):
    return Category.objects.filter(Q(owner=user) | Q(is_system=True)).select_related("parent")


@transaction.atomic
def create_transaction(*, user, validated_data: dict) -> Transaction:
    status = validated_data.get("status", Transaction.TransactionStatus.CLEARED)
    if status == Transaction.TransactionStatus.CLEARED and not validated_data.get("cleared_at"):
        validated_data["cleared_at"] = timezone.now()
    if status != Transaction.TransactionStatus.DRAFT and not validated_data.get("posted_at"):
        validated_data["posted_at"] = timezone.now()

    transaction_obj = Transaction.objects.create(owner=user, **validated_data)
    _apply_transaction_balance_effects(transaction_obj)
    return transaction_obj


@transaction.atomic
def update_transaction(*, transaction_obj: Transaction, validated_data: dict) -> Transaction:
    transaction_obj = (
        Transaction.objects.select_related("account", "destination_account")
        .select_for_update()
        .get(pk=transaction_obj.pk)
    )
    _apply_transaction_balance_effects(transaction_obj, reverse=True)

    for field, value in validated_data.items():
        setattr(transaction_obj, field, value)

    if transaction_obj.status == Transaction.TransactionStatus.CLEARED and not transaction_obj.cleared_at:
        transaction_obj.cleared_at = timezone.now()
    if transaction_obj.status != Transaction.TransactionStatus.CLEARED:
        transaction_obj.cleared_at = None
    if transaction_obj.status != Transaction.TransactionStatus.DRAFT and not transaction_obj.posted_at:
        transaction_obj.posted_at = timezone.now()

    transaction_obj.save()
    _apply_transaction_balance_effects(transaction_obj)
    return transaction_obj


@transaction.atomic
def delete_transaction(*, transaction_obj: Transaction) -> None:
    transaction_obj = (
        Transaction.objects.select_related("account", "destination_account")
        .select_for_update()
        .get(pk=transaction_obj.pk)
    )
    _apply_transaction_balance_effects(transaction_obj, reverse=True)
    transaction_obj.delete()


@transaction.atomic
def refresh_budget_spent_amount(*, budget: Budget) -> Budget:
    total = (
        Transaction.objects.filter(
            owner=budget.owner,
            category=budget.category,
            type=Transaction.TransactionType.EXPENSE,
            status=Transaction.TransactionStatus.CLEARED,
            occurred_on__gte=budget.start_date,
            occurred_on__lte=budget.end_date,
            account__currency=budget.currency,
        ).aggregate(total=Coalesce(Sum("amount"), ZERO))["total"]
        or ZERO
    )
    budget.spent_amount = total
    budget.save(update_fields=["spent_amount", "updated_at"])
    return budget


@transaction.atomic
def refresh_all_budget_spent_amounts(*, user) -> None:
    for budget in Budget.objects.filter(owner=user).select_related("category", "currency"):
        refresh_budget_spent_amount(budget=budget)


def build_dashboard_overview(*, user) -> dict:
    refresh_all_budget_spent_amounts(user=user)

    accounts = list(
        Account.objects.filter(owner=user)
        .select_related("currency")
        .order_by("name")
    )
    transactions = list(
        Transaction.objects.filter(owner=user)
        .select_related("account", "destination_account", "category", "account__currency")
        .order_by("-occurred_on", "-created_at")[:10]
    )
    budgets = list(
        Budget.objects.filter(owner=user, is_active=True)
        .select_related("category", "currency")
        .order_by("start_date", "category__name")
    )

    balances_by_currency = defaultdict(lambda: ZERO)
    for account in accounts:
        balances_by_currency[account.currency_id] += account.current_balance

    income_total = (
        Transaction.objects.filter(
            owner=user,
            type=Transaction.TransactionType.INCOME,
            status=Transaction.TransactionStatus.CLEARED,
        ).aggregate(total=Coalesce(Sum("amount"), ZERO))["total"]
        or ZERO
    )
    expense_total = (
        Transaction.objects.filter(
            owner=user,
            type=Transaction.TransactionType.EXPENSE,
            status=Transaction.TransactionStatus.CLEARED,
        ).aggregate(total=Coalesce(Sum("amount"), ZERO))["total"]
        or ZERO
    )

    return {
        "totals": {
            "income": f"{income_total:.2f}",
            "expense": f"{expense_total:.2f}",
            "net": f"{(income_total - expense_total):.2f}",
            "balances_by_currency": [
                {"currency": currency, "balance": f"{amount:.2f}"}
                for currency, amount in sorted(balances_by_currency.items())
            ],
        },
        "accounts": [
            {
                "id": account.id,
                "name": account.name,
                "kind": account.kind,
                "status": account.status,
                "currency": account.currency_id,
                "current_balance": f"{account.current_balance:.2f}",
                "opening_balance": f"{account.opening_balance:.2f}",
                "institution": account.institution,
            }
            for account in accounts
        ],
        "budgets": [
            {
                "id": budget.id,
                "category": budget.category.name,
                "currency": budget.currency_id,
                "amount": f"{budget.amount:.2f}",
                "spent_amount": f"{budget.spent_amount:.2f}",
                "utilization_percent": (
                    round((budget.spent_amount / budget.amount) * 100, 2)
                    if budget.amount
                    else 0
                ),
                "start_date": budget.start_date.isoformat(),
                "end_date": budget.end_date.isoformat(),
            }
            for budget in budgets
        ],
        "recent_transactions": [
            {
                "id": item.id,
                "title": item.title,
                "type": item.type,
                "status": item.status,
                "amount": f"{item.amount:.2f}",
                "account": item.account.name,
                "destination_account": item.destination_account.name if item.destination_account else None,
                "currency": item.account.currency_id,
                "category": item.category.name if item.category else None,
                "occurred_on": item.occurred_on.isoformat(),
                "merchant": item.merchant,
            }
            for item in transactions
        ],
    }


def _apply_transaction_balance_effects(transaction_obj: Transaction, *, reverse: bool = False) -> None:
    if transaction_obj.status != Transaction.TransactionStatus.CLEARED:
        return

    direction = Decimal("-1") if reverse else Decimal("1")
    deltas = _build_account_deltas(transaction_obj)
    if not deltas:
        return

    account_ids = [delta.account_id for delta in deltas]
    accounts = {
        account.id: account
        for account in Account.objects.select_for_update().filter(id__in=account_ids)
    }

    aggregated_deltas = defaultdict(lambda: ZERO)
    for delta in deltas:
        aggregated_deltas[delta.account_id] += delta.amount * direction

    for account_id, amount in aggregated_deltas.items():
        account = accounts[account_id]
        account.current_balance += amount
        account.save(update_fields=["current_balance", "updated_at"])


def _build_account_deltas(transaction_obj: Transaction) -> list[AccountDelta]:
    if transaction_obj.type == Transaction.TransactionType.INCOME:
        return [AccountDelta(account_id=transaction_obj.account_id, amount=transaction_obj.amount)]

    if transaction_obj.type == Transaction.TransactionType.EXPENSE:
        return [AccountDelta(account_id=transaction_obj.account_id, amount=-transaction_obj.amount)]

    if transaction_obj.type == Transaction.TransactionType.TRANSFER and transaction_obj.destination_account_id:
        destination_amount = transaction_obj.destination_amount or transaction_obj.amount
        return [
            AccountDelta(account_id=transaction_obj.account_id, amount=-transaction_obj.amount),
            AccountDelta(account_id=transaction_obj.destination_account_id, amount=destination_amount),
        ]

    return []
