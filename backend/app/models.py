from decimal import Decimal

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator, RegexValidator
from django.db import models
from django.db.models import F, Q


currency_code_validator = RegexValidator(
    regex=r"^[A-Z]{3}$",
    message="Currency code must be a 3-letter ISO code.",
)


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Currency(TimeStampedModel):
    code = models.CharField(
        max_length=3,
        primary_key=True,
        validators=[currency_code_validator],
    )
    name = models.CharField(max_length=64)
    symbol = models.CharField(max_length=8, blank=True)
    numeric_code = models.CharField(max_length=3, blank=True)
    decimal_places = models.PositiveSmallIntegerField(
        default=2,
        validators=[MinValueValidator(0), MaxValueValidator(6)],
    )
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)

    class Meta:
        ordering = ("code",)

    def save(self, *args, **kwargs):
        self.code = self.code.upper().strip()
        self.numeric_code = self.numeric_code.strip()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.code} - {self.name}"


class Category(TimeStampedModel):
    class CategoryKind(models.TextChoices):
        INCOME = "income", "Income"
        EXPENSE = "expense", "Expense"
        TRANSFER = "transfer", "Transfer"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="finance_categories",
        null=True,
        blank=True,
    )
    parent = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        related_name="children",
        null=True,
        blank=True,
    )
    kind = models.CharField(max_length=16, choices=CategoryKind.choices)
    name = models.CharField(max_length=128)
    slug = models.SlugField(max_length=160)
    description = models.CharField(max_length=255, blank=True)
    icon = models.CharField(max_length=32, blank=True)
    color = models.CharField(max_length=16, default="slate")
    sort_order = models.PositiveSmallIntegerField(default=0)
    is_system = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("kind", "sort_order", "name")
        constraints = [
            models.UniqueConstraint(
                fields=("owner", "kind", "slug"),
                name="finance_category_owner_kind_slug_unique",
            ),
            models.CheckConstraint(
                condition=(
                    Q(is_system=True, owner__isnull=True)
                    | Q(is_system=False, owner__isnull=False)
                ),
                name="finance_category_owner_scope_check",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.name} [{self.kind}]"


class Account(TimeStampedModel):
    class AccountKind(models.TextChoices):
        CASH = "cash", "Cash"
        BANK = "bank", "Bank account"
        SAVINGS = "savings", "Savings"
        CREDIT_CARD = "credit_card", "Credit card"
        E_WALLET = "e_wallet", "E-wallet"
        INVESTMENT = "investment", "Investment"
        LOAN = "loan", "Loan"
        OTHER = "other", "Other"

    class AccountStatus(models.TextChoices):
        ACTIVE = "active", "Active"
        FROZEN = "frozen", "Frozen"
        ARCHIVED = "archived", "Archived"
        CLOSED = "closed", "Closed"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="finance_accounts",
    )
    currency = models.ForeignKey(
        Currency,
        on_delete=models.PROTECT,
        related_name="accounts",
    )
    name = models.CharField(max_length=128)
    kind = models.CharField(max_length=24, choices=AccountKind.choices)
    status = models.CharField(
        max_length=16,
        choices=AccountStatus.choices,
        default=AccountStatus.ACTIVE,
    )
    institution = models.CharField(max_length=128, blank=True)
    account_number_mask = models.CharField(max_length=32, blank=True)
    iban = models.CharField(max_length=34, blank=True)
    note = models.TextField(blank=True)
    color = models.CharField(max_length=16, default="emerald")
    include_in_net_worth = models.BooleanField(default=True)
    opening_balance = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=Decimal("0.00"),
    )
    current_balance = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=Decimal("0.00"),
    )
    credit_limit = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    class Meta:
        ordering = ("name",)
        constraints = [
            models.UniqueConstraint(
                fields=("owner", "name", "currency"),
                name="finance_account_owner_name_currency_unique",
            ),
        ]
        indexes = [
            models.Index(fields=("owner", "status")),
            models.Index(fields=("owner", "kind")),
        ]

    def __str__(self) -> str:
        return f"{self.name} ({self.currency_id})"


class Transaction(TimeStampedModel):
    class TransactionType(models.TextChoices):
        INCOME = "income", "Income"
        EXPENSE = "expense", "Expense"
        TRANSFER = "transfer", "Transfer"

    class TransactionStatus(models.TextChoices):
        DRAFT = "draft", "Draft"
        PENDING = "pending", "Pending"
        CLEARED = "cleared", "Cleared"
        CANCELED = "canceled", "Canceled"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="finance_transactions",
    )
    account = models.ForeignKey(
        Account,
        on_delete=models.PROTECT,
        related_name="outgoing_transactions",
    )
    destination_account = models.ForeignKey(
        Account,
        on_delete=models.PROTECT,
        related_name="incoming_transfers",
        null=True,
        blank=True,
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        related_name="transactions",
        null=True,
        blank=True,
    )
    type = models.CharField(max_length=16, choices=TransactionType.choices)
    status = models.CharField(
        max_length=16,
        choices=TransactionStatus.choices,
        default=TransactionStatus.CLEARED,
    )
    amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))],
    )
    destination_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal("0.01"))],
    )
    exchange_rate = models.DecimalField(
        max_digits=18,
        decimal_places=8,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal("0.00000001"))],
    )
    title = models.CharField(max_length=160)
    merchant = models.CharField(max_length=128, blank=True)
    counterparty = models.CharField(max_length=128, blank=True)
    description = models.TextField(blank=True)
    occurred_on = models.DateField()
    posted_at = models.DateTimeField(null=True, blank=True)
    cleared_at = models.DateTimeField(null=True, blank=True)
    external_reference = models.CharField(max_length=128, blank=True)
    idempotency_key = models.CharField(max_length=64, blank=True)

    class Meta:
        ordering = ("-occurred_on", "-created_at")
        constraints = [
            models.CheckConstraint(
                condition=~Q(account=F("destination_account")),
                name="finance_transaction_distinct_accounts_check",
            ),
            models.UniqueConstraint(
                fields=("owner", "idempotency_key"),
                condition=~Q(idempotency_key=""),
                name="finance_transaction_owner_idempotency_unique",
            ),
        ]
        indexes = [
            models.Index(fields=("owner", "occurred_on")),
            models.Index(fields=("owner", "type", "status")),
            models.Index(fields=("account", "occurred_on")),
            models.Index(fields=("category", "occurred_on")),
        ]

    @property
    def signed_amount(self) -> Decimal:
        if self.type == self.TransactionType.EXPENSE:
            return -self.amount
        if self.type == self.TransactionType.TRANSFER:
            return Decimal("0.00")
        return self.amount

    def __str__(self) -> str:
        return f"{self.title} [{self.type}] {self.amount}"


class Budget(TimeStampedModel):
    class BudgetPeriod(models.TextChoices):
        WEEKLY = "weekly", "Weekly"
        MONTHLY = "monthly", "Monthly"
        QUARTERLY = "quarterly", "Quarterly"
        YEARLY = "yearly", "Yearly"
        CUSTOM = "custom", "Custom"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="finance_budgets",
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="budgets",
    )
    currency = models.ForeignKey(
        Currency,
        on_delete=models.PROTECT,
        related_name="budgets",
    )
    period = models.CharField(max_length=16, choices=BudgetPeriod.choices)
    amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))],
    )
    spent_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=Decimal("0.00"),
    )
    start_date = models.DateField()
    end_date = models.DateField()
    alert_threshold = models.PositiveSmallIntegerField(
        default=80,
        validators=[MinValueValidator(1), MaxValueValidator(100)],
    )
    rollover_enabled = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    note = models.TextField(blank=True)

    class Meta:
        ordering = ("-start_date", "category__name")
        constraints = [
            models.UniqueConstraint(
                fields=("owner", "category", "period", "start_date"),
                name="finance_budget_owner_category_period_start_unique",
            ),
            models.CheckConstraint(
                condition=Q(end_date__gte=F("start_date")),
                name="finance_budget_date_range_check",
            ),
        ]
        indexes = [
            models.Index(fields=("owner", "is_active")),
            models.Index(fields=("owner", "start_date", "end_date")),
        ]

    def __str__(self) -> str:
        return f"{self.category.name} budget"


class ExchangeRate(TimeStampedModel):
    base_currency = models.ForeignKey(
        Currency,
        on_delete=models.PROTECT,
        related_name="base_exchange_rates",
    )
    quote_currency = models.ForeignKey(
        Currency,
        on_delete=models.PROTECT,
        related_name="quote_exchange_rates",
    )
    rate = models.DecimalField(
        max_digits=18,
        decimal_places=8,
        validators=[MinValueValidator(Decimal("0.00000001"))],
    )
    rate_date = models.DateField()
    source = models.CharField(max_length=64, default="manual")
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("-rate_date", "base_currency_id", "quote_currency_id")
        constraints = [
            models.CheckConstraint(
                condition=~Q(base_currency=F("quote_currency")),
                name="finance_exchange_rate_distinct_pair_check",
            ),
            models.UniqueConstraint(
                fields=("base_currency", "quote_currency", "rate_date", "source"),
                name="finance_exchange_rate_pair_date_source_unique",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.base_currency_id}/{self.quote_currency_id} {self.rate}"
