from decimal import Decimal

from django.conf import settings
from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class UserProfile(TimeStampedModel):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    phone = models.CharField(max_length=32, blank=True, default="")

    def __str__(self) -> str:
        return f"Profile<{self.user_id}>"


class FinancialAccount(TimeStampedModel):
    class AccountKind(models.TextChoices):
        CASH = "cash", "Cash"
        SAVINGS = "savings", "Savings"
        INVESTMENT = "investment", "Investment"
        CREDIT = "credit", "Credit"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="financial_accounts",
    )
    name = models.CharField(max_length=128)
    kind = models.CharField(max_length=24, choices=AccountKind.choices)
    currency = models.CharField(max_length=8, default="USD")
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0"))
    institution = models.CharField(max_length=128, blank=True)
    color_token = models.CharField(max_length=32, default="emerald")

    class Meta:
        ordering = ("name",)

    def __str__(self) -> str:
        return f"{self.name} ({self.owner_id})"


class TransactionCategory(TimeStampedModel):
    class CategoryKind(models.TextChoices):
        INCOME = "income", "Income"
        EXPENSE = "expense", "Expense"
        TRANSFER = "transfer", "Transfer"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="transaction_categories",
    )
    name = models.CharField(max_length=128)
    kind = models.CharField(max_length=24, choices=CategoryKind.choices)
    icon = models.CharField(max_length=32, blank=True)

    class Meta:
        ordering = ("kind", "name")
        unique_together = ("owner", "name", "kind")

    def __str__(self) -> str:
        return f"{self.name} ({self.kind})"


class Transaction(TimeStampedModel):
    class TransactionStatus(models.TextChoices):
        CLEARED = "cleared", "Cleared"
        PENDING = "pending", "Pending"
        SCHEDULED = "scheduled", "Scheduled"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="transactions",
    )
    account = models.ForeignKey(
        FinancialAccount,
        on_delete=models.CASCADE,
        related_name="transactions",
    )
    category = models.ForeignKey(
        TransactionCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transactions",
    )
    title = models.CharField(max_length=160)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_date = models.DateField()
    status = models.CharField(max_length=24, choices=TransactionStatus.choices)
    note = models.CharField(max_length=255, blank=True)
    merchant = models.CharField(max_length=128, blank=True)

    class Meta:
        ordering = ("-transaction_date", "-created_at")

    def __str__(self) -> str:
        return f"{self.title} {self.amount}"


class Budget(TimeStampedModel):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="budgets",
    )
    category = models.ForeignKey(
        TransactionCategory,
        on_delete=models.CASCADE,
        related_name="budgets",
    )
    monthly_limit = models.DecimalField(max_digits=12, decimal_places=2)
    spent = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0"))
    alert_threshold = models.PositiveSmallIntegerField(default=85)

    class Meta:
        ordering = ("category__name",)
        unique_together = ("owner", "category")

    def __str__(self) -> str:
        return f"Budget<{self.category.name}>"
