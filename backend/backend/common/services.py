from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.db import DatabaseError, transaction
from django.db.models import Q, Sum
from django.db.models.functions import Coalesce

from .models import Budget, FinancialAccount, Transaction, TransactionCategory, UserProfile

logger = __import__("logging").getLogger(__name__)

User = get_user_model()


@dataclass(frozen=True)
class SeedTransaction:
    title: str
    account_name: str
    category_name: str
    amount: Decimal
    days_offset: int
    status: str
    merchant: str = ""
    note: str = ""


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
    return user


def ensure_user_bootstrap(user: User) -> None:
    ensure_user_profile(user)
    ensure_workspace_seed(user)


def get_user_phone(user: User) -> str:
    if user.phone:
        return user.phone

    try:
        return user.profile.phone
    except (ObjectDoesNotExist, DatabaseError):
        return ""


@transaction.atomic
def seed_workspace_for_user(user: User) -> None:
    if user.financial_accounts.exists():
        return

    accounts = {
        account.name: account
        for account in FinancialAccount.objects.bulk_create(
            [
                FinancialAccount(
                    owner=user,
                    name="Main Balance",
                    kind=FinancialAccount.AccountKind.CASH,
                    currency="USD",
                    balance=Decimal("4820.45"),
                    institution="Primary wallet",
                    color_token="emerald",
                ),
                FinancialAccount(
                    owner=user,
                    name="Safety Reserve",
                    kind=FinancialAccount.AccountKind.SAVINGS,
                    currency="USD",
                    balance=Decimal("12640.00"),
                    institution="Emergency bucket",
                    color_token="cyan",
                ),
                FinancialAccount(
                    owner=user,
                    name="Investment Core",
                    kind=FinancialAccount.AccountKind.INVESTMENT,
                    currency="USD",
                    balance=Decimal("8740.80"),
                    institution="Long-term allocation",
                    color_token="amber",
                ),
            ]
        )
    }

    categories = {
        category.name: category
        for category in TransactionCategory.objects.bulk_create(
            [
                TransactionCategory(
                    owner=user,
                    name="Salary",
                    kind=TransactionCategory.CategoryKind.INCOME,
                    icon="wallet",
                ),
                TransactionCategory(
                    owner=user,
                    name="Food",
                    kind=TransactionCategory.CategoryKind.EXPENSE,
                    icon="restaurant",
                ),
                TransactionCategory(
                    owner=user,
                    name="Housing",
                    kind=TransactionCategory.CategoryKind.EXPENSE,
                    icon="home",
                ),
                TransactionCategory(
                    owner=user,
                    name="Transport",
                    kind=TransactionCategory.CategoryKind.EXPENSE,
                    icon="car",
                ),
                TransactionCategory(
                    owner=user,
                    name="Investments",
                    kind=TransactionCategory.CategoryKind.TRANSFER,
                    icon="chart",
                ),
                TransactionCategory(
                    owner=user,
                    name="Subscriptions",
                    kind=TransactionCategory.CategoryKind.EXPENSE,
                    icon="stack",
                ),
            ]
        )
    }

    Budget.objects.bulk_create(
        [
            Budget(
                owner=user,
                category=categories["Food"],
                monthly_limit=Decimal("900.00"),
                spent=Decimal("542.18"),
                alert_threshold=80,
            ),
            Budget(
                owner=user,
                category=categories["Housing"],
                monthly_limit=Decimal("1800.00"),
                spent=Decimal("1380.00"),
                alert_threshold=85,
            ),
            Budget(
                owner=user,
                category=categories["Subscriptions"],
                monthly_limit=Decimal("220.00"),
                spent=Decimal("144.50"),
                alert_threshold=75,
            ),
        ]
    )

    today = date.today()
    seed_transactions = [
        SeedTransaction(
            title="Monthly salary",
            account_name="Main Balance",
            category_name="Salary",
            amount=Decimal("5200.00"),
            days_offset=-10,
            status=Transaction.TransactionStatus.CLEARED,
            merchant="Acme Corp",
            note="Primary payroll transfer",
        ),
        SeedTransaction(
            title="Apartment rent",
            account_name="Main Balance",
            category_name="Housing",
            amount=Decimal("-1380.00"),
            days_offset=-8,
            status=Transaction.TransactionStatus.CLEARED,
            merchant="Skyline Residences",
        ),
        SeedTransaction(
            title="Weekly groceries",
            account_name="Main Balance",
            category_name="Food",
            amount=Decimal("-126.44"),
            days_offset=-3,
            status=Transaction.TransactionStatus.CLEARED,
            merchant="Fresh Market",
        ),
        SeedTransaction(
            title="Fuel refill",
            account_name="Main Balance",
            category_name="Transport",
            amount=Decimal("-52.90"),
            days_offset=-2,
            status=Transaction.TransactionStatus.PENDING,
            merchant="Orbit Station",
        ),
        SeedTransaction(
            title="ETF contribution",
            account_name="Investment Core",
            category_name="Investments",
            amount=Decimal("-700.00"),
            days_offset=-1,
            status=Transaction.TransactionStatus.CLEARED,
            merchant="Broker Prime",
            note="Auto-invest schedule",
        ),
        SeedTransaction(
            title="Streaming stack renewal",
            account_name="Main Balance",
            category_name="Subscriptions",
            amount=Decimal("-36.50"),
            days_offset=2,
            status=Transaction.TransactionStatus.SCHEDULED,
            merchant="Media Cloud",
        ),
    ]

    Transaction.objects.bulk_create(
        [
            Transaction(
                owner=user,
                account=accounts[item.account_name],
                category=categories[item.category_name],
                title=item.title,
                amount=item.amount,
                transaction_date=today + timedelta(days=item.days_offset),
                status=item.status,
                merchant=item.merchant,
                note=item.note,
            )
            for item in seed_transactions
        ]
    )


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
