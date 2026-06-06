from __future__ import annotations

from datetime import date
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.db import DatabaseError, transaction
from django.db.models import Q, Sum
from django.db.models.functions import Coalesce

from app.services import ensure_user_finance_setup

from .models import Budget, FinancialAccount, Transaction, TransactionCategory, UserProfile

logger = __import__("logging").getLogger(__name__)

User = get_user_model()

def normalize_email(email: str) -> str:
    return email.strip().lower()


def ensure_user_profile(user: User) -> None:
    try:
        with transaction.atomic():
            profile, created = UserProfile.objects.get_or_create(
                user=user,
                defaults={"phone": user.phone},
            )
            if user.phone and profile.phone != user.phone:
                profile.phone = user.phone
                profile.save(update_fields=["phone"])
    except DatabaseError:
        logger.warning("UserProfile table is unavailable during auth bootstrap", extra={"user_id": user.id})


def ensure_workspace_seed(user: User) -> None:
    try:
        with transaction.atomic():
            seed_workspace_for_user(user)
    except DatabaseError:
        logger.warning("Workspace seed tables are unavailable during auth bootstrap", extra={"user_id": user.id})


def ensure_finance_seed(user: User) -> None:
    try:
        ensure_user_finance_setup(user=user)
    except DatabaseError:
        logger.warning("Finance tables are unavailable during auth bootstrap", extra={"user_id": user.id})


def create_user_with_workspace(*, email: str, phone: str = "", password: str) -> User:
    normalized_email = normalize_email(email)
    normalized_phone = phone.strip()

    with transaction.atomic():
        user = User.objects.create_user(
            email=normalized_email,
            phone=normalized_phone,
            password=password,
            first_name=normalized_email.split("@")[0][:30],
        )

    ensure_user_profile(user)
    ensure_workspace_seed(user)
    ensure_finance_seed(user)
    return user


def ensure_user_bootstrap(user: User) -> None:
    ensure_user_profile(user)
    ensure_workspace_seed(user)
    ensure_finance_seed(user)


def get_user_phone(user: User) -> str:
    if user.phone:
        return user.phone

    try:
        return user.profile.phone
    except (ObjectDoesNotExist, DatabaseError):
        return ""


@transaction.atomic
def seed_workspace_for_user(user: User) -> None:
    return None


def build_workspace_overview(user: User) -> dict:
    ensure_user_bootstrap(user)

    transactions_qs = (
        Transaction.objects.filter(owner=user)
        .select_related("account", "category")
        .order_by("-transaction_date", "-created_at")
    )
    budgets_qs = Budget.objects.filter(owner=user).select_related("category")

    total_balance = user.financial_accounts.aggregate(
        total=Coalesce(Sum("balance"), Decimal("0"))
    )["total"]
    monthly_spend = transactions_qs.filter(
        amount__lt=0,
        status__in=[
            Transaction.TransactionStatus.CLEARED,
            Transaction.TransactionStatus.PENDING,
        ],
    ).aggregate(total=Coalesce(Sum("amount"), Decimal("0")))["total"]
    monthly_income = transactions_qs.filter(
        amount__gt=0,
        status=Transaction.TransactionStatus.CLEARED,
    ).aggregate(total=Coalesce(Sum("amount"), Decimal("0")))["total"]

    recent_transactions = [
        {
            "id": transaction.id,
            "title": transaction.title,
            "amount": f"{transaction.amount:.2f}",
            "status": transaction.status,
            "date": transaction.transaction_date.isoformat(),
            "merchant": transaction.merchant,
            "account": transaction.account.name,
            "category": transaction.category.name if transaction.category else None,
        }
        for transaction in transactions_qs[:8]
    ]

    budgets = [
        {
            "id": budget.id,
            "category": budget.category.name,
            "limit": f"{budget.monthly_limit:.2f}",
            "spent": f"{budget.spent:.2f}",
            "progress": float(
                (budget.spent / budget.monthly_limit * Decimal("100"))
                if budget.monthly_limit
                else Decimal("0")
            ),
            "alertThreshold": budget.alert_threshold,
        }
        for budget in budgets_qs
    ]

    accounts = [
        {
            "id": account.id,
            "name": account.name,
            "kind": account.kind,
            "balance": f"{account.balance:.2f}",
            "currency": account.currency,
            "institution": account.institution,
            "colorToken": account.color_token,
        }
        for account in user.financial_accounts.all()
    ]

    upcoming_transactions = transactions_qs.filter(
        Q(status=Transaction.TransactionStatus.SCHEDULED)
        | Q(status=Transaction.TransactionStatus.PENDING)
    )[:4]

    widgets = {
        "runwayDays": 184,
        "savingsRate": 26,
        "upcoming": [
            {
                "title": transaction.title,
                "date": transaction.transaction_date.isoformat(),
                "amount": f"{transaction.amount:.2f}",
            }
            for transaction in upcoming_transactions
        ],
    }

    return {
        "summary": {
            "netWorth": f"{total_balance:.2f}",
            "monthlyIncome": f"{monthly_income:.2f}",
            "monthlySpend": f"{abs(monthly_spend):.2f}",
            "cashFlow": f"{(monthly_income + monthly_spend):.2f}",
        },
        "accounts": accounts,
        "budgets": budgets,
        "transactions": recent_transactions,
        "widgets": widgets,
        "highlights": [
            {
                "label": "Top account",
                "value": max(accounts, key=lambda item: Decimal(item["balance"]))["name"]
                if accounts
                else "N/A",
            },
            {
                "label": "Largest expense",
                "value": max(
                    [item for item in recent_transactions if Decimal(item["amount"]) < 0],
                    key=lambda item: abs(Decimal(item["amount"])),
                    default={"title": "N/A"},
                )["title"],
            },
            {
                "label": "Active budgets",
                "value": f"{len(budgets)} active budgets",
            },
        ],
    }
