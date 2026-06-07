from decimal import Decimal

from django.conf import settings
from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class UserProfile(TimeStampedModel):
    class CashFlowChartDefault(models.TextChoices):
        BARS = "bars", "Столбцы"
        LINE = "line", "Кривая"
        TRADINGVIEW = "tradingview", "Область"
        CANDLES = "candles", "Свечи"
        STRUCTURE = "structure", "Структура"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    phone = models.CharField(max_length=32, blank=True, default="")
    cash_flow_chart_default = models.CharField(
        max_length=16,
        choices=CashFlowChartDefault.choices,
        default=CashFlowChartDefault.BARS,
    )
    default_currency = models.CharField(max_length=8, default="USD")

    class Meta:
        verbose_name = "Профиль пользователя"
        verbose_name_plural = "Профили пользователей"

    def __str__(self) -> str:
        return f"Profile<{self.user_id}>"


class FinancialAccount(TimeStampedModel):
    class AccountKind(models.TextChoices):
        CASH = "cash", "Наличные"
        SAVINGS = "savings", "Сбережения"
        INVESTMENT = "investment", "Инвестиции"
        CREDIT = "credit", "Кредит"

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
        verbose_name = "Финансовый счет"
        verbose_name_plural = "Финансовые счета"

    def __str__(self) -> str:
        return f"{self.name} ({self.owner_id})"


class TransactionCategory(TimeStampedModel):
    class CategoryKind(models.TextChoices):
        INCOME = "income", "Доход"
        EXPENSE = "expense", "Расход"
        TRANSFER = "transfer", "Перевод"

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
        verbose_name = "Категория транзакций"
        verbose_name_plural = "Категории транзакций"

    def __str__(self) -> str:
        return f"{self.name} ({self.kind})"


class Transaction(TimeStampedModel):
    class TransactionStatus(models.TextChoices):
        CLEARED = "cleared", "Проведена"
        PENDING = "pending", "В ожидании"
        SCHEDULED = "scheduled", "Запланирована"

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
        verbose_name = "Транзакция"
        verbose_name_plural = "Транзакции"

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
        verbose_name = "Бюджет"
        verbose_name_plural = "Бюджеты"

    def __str__(self) -> str:
        return f"Budget<{self.category.name}>"
