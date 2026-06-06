from decimal import Decimal, ROUND_HALF_UP

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator, RegexValidator
from django.db import models
from django.db.models import F, Q
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


currency_code_validator = RegexValidator(
    regex=r"^[A-Z]{3}$",
    message=_("Код валюты должен состоять из 3 символов ISO."),
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
        verbose_name=_("Код"),
    )
    name = models.CharField(max_length=64, verbose_name=_("Название"))
    symbol = models.CharField(max_length=8, blank=True, verbose_name=_("Символ"))
    numeric_code = models.CharField(max_length=3, blank=True, verbose_name=_("Цифровой код"))
    decimal_places = models.PositiveSmallIntegerField(
        default=2,
        validators=[MinValueValidator(0), MaxValueValidator(6)],
        verbose_name=_("Количество знаков"),
    )
    is_active = models.BooleanField(default=True, verbose_name=_("Активна"))
    is_default = models.BooleanField(default=False, verbose_name=_("По умолчанию"))

    class Meta:
        ordering = ("code",)
        verbose_name = _("Валюта")
        verbose_name_plural = _("Валюты")

    def save(self, *args, **kwargs):
        self.code = self.code.upper().strip()
        self.numeric_code = self.numeric_code.strip()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.code} - {self.name}"


class Category(TimeStampedModel):
    class CategoryKind(models.TextChoices):
        INCOME = "income", _("Доход")
        EXPENSE = "expense", _("Расход")
        TRANSFER = "transfer", _("Перевод")

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
    name_ru = models.CharField(max_length=128, blank=True, default="")
    name_en = models.CharField(max_length=128, blank=True, default="")
    name_kg = models.CharField(max_length=128, blank=True, default="")
    slug = models.SlugField(max_length=160)
    description = models.CharField(max_length=255, blank=True)
    icon = models.CharField(max_length=32, blank=True)
    color = models.CharField(max_length=16, default="slate")
    sort_order = models.PositiveSmallIntegerField(default=0)
    is_system = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("kind", "sort_order", "name")
        verbose_name = _("Категория")
        verbose_name_plural = _("Категории")
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

    def get_localized_name(self, locale: str | None) -> str:
        if not self.is_system:
            return self.name

        localized_value = {
            "ru": self.name_ru,
            "en": self.name_en,
            "kg": self.name_kg,
        }.get((locale or "").lower(), "")
        return localized_value or self.name_en or self.name_ru or self.name_kg or self.name


class Account(TimeStampedModel):
    class AccountKind(models.TextChoices):
        CASH = "cash", _("Наличные")
        BANK = "bank", _("Банковский счет")
        SAVINGS = "savings", _("Сбережения")
        DEPOSIT = "deposit", _("Депозит")
        CREDIT_CARD = "credit_card", _("Кредитная карта")
        E_WALLET = "e_wallet", _("Электронный кошелек")
        INVESTMENT = "investment", _("Инвестиции")
        ENTREPRENEUR = "entrepreneur", _("Счет ИП")
        COMPANY = "company", _("Счет ОсОО")
        LOAN = "loan", _("Займ")
        OTHER = "other", _("Другое")

    class AccountStatus(models.TextChoices):
        ACTIVE = "active", _("Активен")
        FROZEN = "frozen", _("Заморожен")
        ARCHIVED = "archived", _("Архив")
        CLOSED = "closed", _("Закрыт")

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
    icon = models.CharField(max_length=32, blank=True)
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
        verbose_name = _("Счет")
        verbose_name_plural = _("Счета")
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


class AccountDepositProfile(TimeStampedModel):
    class InterestPayoutFrequency(models.TextChoices):
        MONTHLY = "monthly", _("Ежемесячно")
        QUARTERLY = "quarterly", _("Ежеквартально")
        YEARLY = "yearly", _("Ежегодно")
        AT_MATURITY = "at_maturity", _("В конце срока")

    class DayCountConvention(models.TextChoices):
        ACTUAL_365 = "actual_365", _("Actual/365")
        ACTUAL_366 = "actual_366", _("Actual/366")
        ACTUAL_ACTUAL = "actual_actual", _("Actual/Actual")
        THIRTY_360 = "thirty_360", _("30/360")

    account = models.OneToOneField(
        Account,
        on_delete=models.CASCADE,
        related_name="deposit_profile",
    )
    annual_interest_rate = models.DecimalField(
        max_digits=7,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0.0000"))],
    )
    interest_payout_frequency = models.CharField(
        max_length=16,
        choices=InterestPayoutFrequency.choices,
        default=InterestPayoutFrequency.MONTHLY,
    )
    day_count_convention = models.CharField(
        max_length=16,
        choices=DayCountConvention.choices,
        default=DayCountConvention.ACTUAL_365,
    )
    term_start_date = models.DateField()
    maturity_date = models.DateField(null=True, blank=True)
    capitalization_enabled = models.BooleanField(default=False)
    auto_renewal = models.BooleanField(default=False)
    allow_top_up = models.BooleanField(default=True)
    allow_partial_withdrawal = models.BooleanField(default=False)
    minimum_balance = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=Decimal("0.00"),
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    note = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = _("Депозитный профиль счета")
        verbose_name_plural = _("Депозитные профили счетов")

    def __str__(self) -> str:
        return f"{self.account.name} · {self.annual_interest_rate}%"

    @staticmethod
    def quantize_amount(value: Decimal) -> Decimal:
        return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


class AccountTaxProfile(TimeStampedModel):
    class EntityType(models.TextChoices):
        ENTREPRENEUR = "entrepreneur", _("ИП")
        COMPANY = "company", _("ОсОО")

    class TemplateCode(models.TextChoices):
        KG_IP_SIMPLIFIED_4 = "kg_ip_simplified_4", _("КР ИП 4% с оборота")
        KG_SOCIAL_FUND = "kg_social_fund", _("Соцфонд КР")
        CUSTOM = "custom", _("Произвольный")

    class CalculationSource(models.TextChoices):
        TRANSACTIONS = "transactions", _("По транзакциям")
        MANUAL = "manual", _("Ручной ввод")

    class ReportingPeriod(models.TextChoices):
        MONTHLY = "monthly", _("Ежемесячно")
        QUARTERLY = "quarterly", _("Ежеквартально")
        YEARLY = "yearly", _("Ежегодно")

    account = models.OneToOneField(
        Account,
        on_delete=models.CASCADE,
        related_name="tax_profile",
    )
    entity_type = models.CharField(max_length=24, choices=EntityType.choices)
    template_code = models.CharField(
        max_length=32,
        choices=TemplateCode.choices,
        default=TemplateCode.CUSTOM,
    )
    calculation_source = models.CharField(
        max_length=16,
        choices=CalculationSource.choices,
        default=CalculationSource.TRANSACTIONS,
    )
    reporting_period = models.CharField(
        max_length=16,
        choices=ReportingPeriod.choices,
        default=ReportingPeriod.QUARTERLY,
    )
    due_day = models.PositiveSmallIntegerField(
        default=20,
        validators=[MinValueValidator(1), MaxValueValidator(31)],
    )
    tax_rate = models.DecimalField(
        max_digits=7,
        decimal_places=4,
        default=Decimal("0.0000"),
        validators=[MinValueValidator(Decimal("0.0000"))],
    )
    social_fund_rate = models.DecimalField(
        max_digits=7,
        decimal_places=4,
        default=Decimal("0.0000"),
        validators=[MinValueValidator(Decimal("0.0000"))],
    )
    manual_tax_base = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    manual_tax_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    manual_social_fund_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    note = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = _("Налоговый профиль счета")
        verbose_name_plural = _("Налоговые профили счетов")

    def __str__(self) -> str:
        return f"{self.account.name} · {self.get_template_code_display()}"


class CryptoNetwork(TimeStampedModel):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="crypto_networks",
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=96)
    code = models.SlugField(max_length=48)
    chain_id = models.CharField(max_length=32, blank=True)
    protocol = models.CharField(max_length=32, blank=True)
    native_symbol = models.CharField(max_length=16, blank=True)
    icon = models.CharField(max_length=32, blank=True)
    color = models.CharField(max_length=16, default="slate")
    explorer_url = models.URLField(blank=True)
    is_evm = models.BooleanField(default=False)
    is_system = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("name",)
        verbose_name = _("Крипто сеть")
        verbose_name_plural = _("Крипто сети")
        constraints = [
            models.UniqueConstraint(
                fields=("owner", "code"),
                name="finance_crypto_network_owner_code_unique",
            ),
            models.CheckConstraint(
                condition=(
                    Q(is_system=True, owner__isnull=True)
                    | Q(is_system=False, owner__isnull=False)
                ),
                name="finance_crypto_network_owner_scope_check",
            ),
        ]

    def save(self, *args, **kwargs):
        self.code = self.code.strip().lower()
        self.chain_id = self.chain_id.strip()
        self.protocol = self.protocol.strip().upper()
        self.native_symbol = self.native_symbol.strip().upper()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class CryptoAsset(TimeStampedModel):
    class AssetType(models.TextChoices):
        COIN = "coin", _("Монета")
        TOKEN = "token", _("Токен")
        STABLECOIN = "stablecoin", _("Стейблкоин")
        WRAPPED = "wrapped", _("Обернутый актив")
        OTHER = "other", _("Другое")

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="crypto_assets",
        null=True,
        blank=True,
    )
    symbol = models.CharField(max_length=16)
    name = models.CharField(max_length=96)
    slug = models.SlugField(max_length=120)
    asset_type = models.CharField(
        max_length=16,
        choices=AssetType.choices,
        default=AssetType.COIN,
    )
    decimals = models.PositiveSmallIntegerField(
        default=8,
        validators=[MinValueValidator(0), MaxValueValidator(30)],
    )
    icon = models.CharField(max_length=32, blank=True)
    color = models.CharField(max_length=16, default="amber")
    coingecko_id = models.CharField(max_length=64, blank=True)
    cmc_slug = models.CharField(max_length=64, blank=True)
    description = models.CharField(max_length=255, blank=True)
    is_system = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("symbol",)
        verbose_name = _("Крипто актив")
        verbose_name_plural = _("Крипто активы")
        constraints = [
            models.UniqueConstraint(
                fields=("owner", "slug"),
                name="finance_crypto_asset_owner_slug_unique",
            ),
            models.UniqueConstraint(
                fields=("owner", "symbol"),
                name="finance_crypto_asset_owner_symbol_unique",
            ),
            models.CheckConstraint(
                condition=(
                    Q(is_system=True, owner__isnull=True)
                    | Q(is_system=False, owner__isnull=False)
                ),
                name="finance_crypto_asset_owner_scope_check",
            ),
        ]

    def save(self, *args, **kwargs):
        self.symbol = self.symbol.strip().upper()
        self.slug = self.slug.strip().lower()
        self.coingecko_id = self.coingecko_id.strip().lower()
        self.cmc_slug = self.cmc_slug.strip().lower()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.symbol} · {self.name}"


class CryptoAssetNetwork(TimeStampedModel):
    asset = models.ForeignKey(
        CryptoAsset,
        on_delete=models.CASCADE,
        related_name="network_links",
    )
    network = models.ForeignKey(
        CryptoNetwork,
        on_delete=models.CASCADE,
        related_name="asset_links",
    )
    contract_address = models.CharField(max_length=128, blank=True)
    token_standard = models.CharField(max_length=24, blank=True)
    decimals_override = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(30)],
    )
    is_native = models.BooleanField(default=False)
    deposit_enabled = models.BooleanField(default=True)
    withdrawal_enabled = models.BooleanField(default=True)
    sort_order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("asset__symbol", "sort_order", "network__name")
        verbose_name = _("Сеть крипто актива")
        verbose_name_plural = _("Сети крипто активов")
        constraints = [
            models.UniqueConstraint(
                fields=("asset", "network", "contract_address"),
                name="finance_crypto_asset_network_unique",
            ),
        ]

    def save(self, *args, **kwargs):
        self.contract_address = self.contract_address.strip()
        self.token_standard = self.token_standard.strip().upper()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.asset.symbol} on {self.network.code}"


class CryptoWallet(TimeStampedModel):
    class WalletType(models.TextChoices):
        SOFTWARE = "software", _("Программный")
        HARDWARE = "hardware", _("Аппаратный")
        EXCHANGE = "exchange", _("Биржевой")
        DEFI = "defi", _("DeFi")
        CUSTODIAL = "custodial", _("Кастодиальный")
        WATCH_ONLY = "watch_only", _("Только просмотр")
        OTHER = "other", _("Другое")

    class SyncStatus(models.TextChoices):
        IDLE = "idle", _("Не запускалась")
        PENDING = "pending", _("В очереди")
        SYNCED = "synced", _("Синхронизирован")
        ERROR = "error", _("Ошибка")

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="crypto_wallets",
    )
    network = models.ForeignKey(
        CryptoNetwork,
        on_delete=models.PROTECT,
        related_name="wallets",
    )
    name = models.CharField(max_length=128)
    wallet_type = models.CharField(
        max_length=24,
        choices=WalletType.choices,
        default=WalletType.SOFTWARE,
    )
    provider = models.CharField(max_length=96, blank=True)
    address = models.CharField(max_length=255, blank=True)
    address_label = models.CharField(max_length=96, blank=True)
    xpub = models.CharField(max_length=255, blank=True)
    note = models.TextField(blank=True)
    color = models.CharField(max_length=16, default="amber")
    is_active = models.BooleanField(default=True)
    is_watch_only = models.BooleanField(default=False)
    last_synced_at = models.DateTimeField(null=True, blank=True)
    sync_status = models.CharField(
        max_length=16,
        choices=SyncStatus.choices,
        default=SyncStatus.IDLE,
    )
    last_sync_error = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ("name",)
        verbose_name = _("Крипто кошелек")
        verbose_name_plural = _("Крипто кошельки")
        constraints = [
            models.UniqueConstraint(
                fields=("owner", "network", "name"),
                name="finance_crypto_wallet_owner_network_name_unique",
            ),
        ]
        indexes = [
            models.Index(fields=("owner", "network")),
            models.Index(fields=("owner", "is_active")),
        ]

    def __str__(self) -> str:
        return f"{self.name} [{self.network.code}]"


class CryptoHolding(TimeStampedModel):
    wallet = models.ForeignKey(
        CryptoWallet,
        on_delete=models.CASCADE,
        related_name="holdings",
    )
    asset = models.ForeignKey(
        CryptoAsset,
        on_delete=models.PROTECT,
        related_name="holdings",
    )
    asset_network = models.ForeignKey(
        CryptoAssetNetwork,
        on_delete=models.PROTECT,
        related_name="holdings",
        null=True,
        blank=True,
    )
    wallet_address = models.CharField(max_length=255, blank=True)
    balance = models.DecimalField(max_digits=36, decimal_places=18, default=Decimal("0"))
    available_balance = models.DecimalField(max_digits=36, decimal_places=18, default=Decimal("0"))
    locked_balance = models.DecimalField(max_digits=36, decimal_places=18, default=Decimal("0"))
    average_cost = models.DecimalField(max_digits=24, decimal_places=8, null=True, blank=True)
    cost_basis = models.DecimalField(max_digits=24, decimal_places=8, null=True, blank=True)
    last_price = models.DecimalField(max_digits=24, decimal_places=8, null=True, blank=True)
    price_currency = models.ForeignKey(
        Currency,
        on_delete=models.PROTECT,
        related_name="crypto_priced_holdings",
        null=True,
        blank=True,
    )
    last_synced_at = models.DateTimeField(null=True, blank=True)
    is_tracked = models.BooleanField(default=True)

    class Meta:
        ordering = ("wallet__name", "asset__symbol")
        verbose_name = _("Крипто позиция")
        verbose_name_plural = _("Крипто позиции")
        constraints = [
            models.UniqueConstraint(
                fields=("wallet", "asset", "asset_network", "wallet_address"),
                name="finance_crypto_holding_wallet_asset_network_address_unique",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.wallet.name} · {self.asset.symbol}"


class Transaction(TimeStampedModel):
    class TransactionType(models.TextChoices):
        INCOME = "income", _("Доход")
        EXPENSE = "expense", _("Расход")
        TRANSFER = "transfer", _("Перевод")

    class TransactionStatus(models.TextChoices):
        DRAFT = "draft", _("Черновик")
        PENDING = "pending", _("В ожидании")
        CLEARED = "cleared", _("Проведена")
        CANCELED = "canceled", _("Отменена")

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
    title = models.CharField(max_length=160, blank=True, default="")
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
        verbose_name = _("Транзакция")
        verbose_name_plural = _("Транзакции")
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
        return f"{self.title or 'Transaction'} [{self.type}] {self.amount}"


class Budget(TimeStampedModel):
    class BudgetPeriod(models.TextChoices):
        WEEKLY = "weekly", _("Еженедельно")
        MONTHLY = "monthly", _("Ежемесячно")
        QUARTERLY = "quarterly", _("Ежеквартально")
        YEARLY = "yearly", _("Ежегодно")
        CUSTOM = "custom", _("Произвольный")

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
        verbose_name = _("Бюджет")
        verbose_name_plural = _("Бюджеты")
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
        verbose_name=_("Базовая валюта"),
    )
    quote_currency = models.ForeignKey(
        Currency,
        on_delete=models.PROTECT,
        related_name="quote_exchange_rates",
        verbose_name=_("Котируемая валюта"),
    )
    rate = models.DecimalField(
        max_digits=18,
        decimal_places=8,
        validators=[MinValueValidator(Decimal("0.00000001"))],
        verbose_name=_("Курс"),
    )
    rate_date = models.DateField(verbose_name=_("Дата курса"))
    source = models.CharField(max_length=64, default="manual", verbose_name=_("Источник"))
    is_active = models.BooleanField(default=True, verbose_name=_("Активен"))

    class Meta:
        ordering = ("-rate_date", "base_currency_id", "quote_currency_id")
        verbose_name = _("Курс валюты")
        verbose_name_plural = _("Курсы валют")
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


class Notification(TimeStampedModel):
    class Scope(models.TextChoices):
        PERSONAL = "personal", _("Личное")
        BROADCAST = "broadcast", _("Рассылка")

    class Level(models.TextChoices):
        INFO = "info", _("Инфо")
        SUCCESS = "success", _("Успех")
        WARNING = "warning", _("Внимание")
        ERROR = "error", _("Ошибка")

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="finance_notifications",
        null=True,
        blank=True,
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="finance_notifications_created",
        null=True,
        blank=True,
    )
    scope = models.CharField(
        max_length=16,
        choices=Scope.choices,
        default=Scope.PERSONAL,
    )
    level = models.CharField(
        max_length=16,
        choices=Level.choices,
        default=Level.INFO,
    )
    title = models.CharField(max_length=160)
    body = models.TextField()
    action_label = models.CharField(max_length=64, blank=True)
    action_url = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    published_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ("-published_at", "-created_at")
        verbose_name = _("Уведомление")
        verbose_name_plural = _("Уведомления")
        constraints = [
            models.CheckConstraint(
                condition=(
                    Q(scope="broadcast", recipient__isnull=True)
                    | Q(scope="personal", recipient__isnull=False)
                ),
                name="finance_notification_scope_recipient_check",
            ),
        ]
        indexes = [
            models.Index(fields=("scope", "is_active", "published_at")),
            models.Index(fields=("recipient", "is_active", "published_at")),
        ]

    def __str__(self) -> str:
        return self.title


class NotificationReceipt(TimeStampedModel):
    notification = models.ForeignKey(
        Notification,
        on_delete=models.CASCADE,
        related_name="receipts",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="finance_notification_receipts",
    )
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ("-updated_at",)
        verbose_name = _("Статус уведомления")
        verbose_name_plural = _("Статусы уведомлений")
        constraints = [
            models.UniqueConstraint(
                fields=("notification", "user"),
                name="finance_notification_receipt_unique",
            ),
        ]
        indexes = [
            models.Index(fields=("user", "read_at")),
        ]

    def __str__(self) -> str:
        return f"{self.user_id}:{self.notification_id}"
