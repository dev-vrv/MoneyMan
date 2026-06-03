from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Q, Sum
from django.db.models.functions import Coalesce

from .models import Budget, FinancialAccount, Transaction, TransactionCategory, UserProfile

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


@transaction.atomic
def create_user_with_workspace(*, email: str, password: str) -> User:
    normalized_email = normalize_email(email)
    user = User.objects.create_user(
        username=normalized_email,
        email=normalized_email,
        password=password,
        first_name=normalized_email.split("@")[0][:30],
    )
    UserProfile.objects.create(user=user)
    seed_workspace_for_user(user)
    return user


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
    total_balance = user.financial_accounts.aggregate(
        total=Coalesce(Sum("balance"), Decimal("0"))
    )["total"]
    monthly_income = (
        user.transactions.filter(
            category__kind=TransactionCategory.CategoryKind.INCOME,
            transaction_date__month=date.today().month,
            transaction_date__year=date.today().year,
        ).aggregate(total=Coalesce(Sum("amount"), Decimal("0")))["total"]
    )
    monthly_expenses = (
        user.transactions.filter(
            category__kind=TransactionCategory.CategoryKind.EXPENSE,
            transaction_date__month=date.today().month,
            transaction_date__year=date.today().year,
        ).aggregate(total=Coalesce(Sum("amount"), Decimal("0")))["total"]
    )
    monthly_expenses_abs = abs(monthly_expenses)
    savings_rate = (
        Decimal("0")
        if monthly_income <= 0
        else ((monthly_income - monthly_expenses_abs) / monthly_income) * Decimal("100")
    )

    accounts = [
        {
            "id": account.id,
            "name": account.name,
            "kind": account.kind,
            "institution": account.institution,
            "currency": account.currency,
            "balance": str(account.balance),
            "color_token": account.color_token,
        }
        for account in user.financial_accounts.all()
    ]

    budgets = []
    for budget in user.budgets.select_related("category").all():
        monthly_limit = budget.monthly_limit or Decimal("0")
        utilization = Decimal("0")
        if monthly_limit > 0:
            utilization = (budget.spent / monthly_limit) * Decimal("100")

        budgets.append(
            {
                "id": budget.id,
                "category": budget.category.name,
                "spent": str(budget.spent),
                "limit": str(monthly_limit),
                "utilization_percent": float(round(utilization, 2)),
                "remaining": str(monthly_limit - budget.spent),
                "alert_threshold": budget.alert_threshold,
            }
        )

    recent_transactions = [
        {
            "id": item.id,
            "title": item.title,
            "merchant": item.merchant,
            "amount": str(item.amount),
            "status": item.status,
            "category": item.category.name if item.category else "",
            "account": item.account.name,
            "transaction_date": item.transaction_date.isoformat(),
            "note": item.note,
        }
        for item in user.transactions.select_related("account", "category")[:8]
    ]

    scheduled_total = (
        user.transactions.filter(status=Transaction.TransactionStatus.SCHEDULED).aggregate(
            total=Coalesce(Sum("amount"), Decimal("0"))
        )["total"]
    )
    pending_count = user.transactions.filter(
        Q(status=Transaction.TransactionStatus.PENDING)
        | Q(status=Transaction.TransactionStatus.SCHEDULED)
    ).count()

    return {
        "user": {
            "email": user.email,
            "phone": getattr(user.profile, "phone", ""),
            "display_name": user.get_full_name() or user.first_name or user.email,
        },
        "summary": {
            "net_worth": str(total_balance),
            "monthly_income": str(monthly_income),
            "monthly_expenses": str(monthly_expenses_abs),
            "savings_rate": float(round(savings_rate, 2)),
            "scheduled_outflow": str(abs(scheduled_total)),
            "attention_count": pending_count,
        },
        "accounts": accounts,
        "budgets": budgets,
        "transactions": recent_transactions,
        "widgets": [
            {
                "title": "Cash control",
                "value": f"{len(accounts)} active accounts",
                "description": "Balances, reserve coverage and investment allocation at a glance.",
            },
            {
                "title": "Budget pressure",
                "value": f"{len([item for item in budgets if item['utilization_percent'] >= 70])} categories to watch",
                "description": "Track where monthly limits are moving close to alert thresholds.",
            },
            {
                "title": "Upcoming obligations",
                "value": f"{pending_count} items",
                "description": "Pending and scheduled movements that still need attention this cycle.",
            },
        ],
    }
