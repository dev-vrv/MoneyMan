# Generated manually for the finance manager domain.

from decimal import Decimal

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator, RegexValidator
from django.db import migrations, models
import django.db.models.deletion


currency_code_validator = RegexValidator(
    regex=r"^[A-Z]{3}$",
    message="Currency code must be a 3-letter ISO code.",
)


def seed_reference_data(apps, schema_editor):
    Currency = apps.get_model("app", "Currency")
    Category = apps.get_model("app", "Category")

    currencies = [
        {"code": "USD", "name": "US Dollar", "symbol": "$", "numeric_code": "840", "decimal_places": 2, "is_default": True},
        {"code": "EUR", "name": "Euro", "symbol": "€", "numeric_code": "978", "decimal_places": 2, "is_default": False},
        {"code": "KGS", "name": "Kyrgyzstani Som", "symbol": "сом", "numeric_code": "417", "decimal_places": 2, "is_default": False},
        {"code": "RUB", "name": "Russian Ruble", "symbol": "₽", "numeric_code": "643", "decimal_places": 2, "is_default": False},
    ]
    for payload in currencies:
        Currency.objects.update_or_create(code=payload["code"], defaults=payload)

    categories = [
        {"kind": "income", "name": "Salary", "slug": "salary", "icon": "wallet", "color": "emerald", "sort_order": 10},
        {"kind": "income", "name": "Bonus", "slug": "bonus", "icon": "sparkles", "color": "amber", "sort_order": 20},
        {"kind": "income", "name": "Freelance", "slug": "freelance", "icon": "briefcase", "color": "blue", "sort_order": 30},
        {"kind": "income", "name": "Investments", "slug": "investment-income", "icon": "chart", "color": "violet", "sort_order": 40},
        {"kind": "expense", "name": "Food", "slug": "food", "icon": "utensils", "color": "rose", "sort_order": 10},
        {"kind": "expense", "name": "Housing", "slug": "housing", "icon": "home", "color": "orange", "sort_order": 20},
        {"kind": "expense", "name": "Transport", "slug": "transport", "icon": "car", "color": "sky", "sort_order": 30},
        {"kind": "expense", "name": "Utilities", "slug": "utilities", "icon": "bolt", "color": "yellow", "sort_order": 40},
        {"kind": "expense", "name": "Health", "slug": "health", "icon": "heart-pulse", "color": "red", "sort_order": 50},
        {"kind": "expense", "name": "Education", "slug": "education", "icon": "graduation-cap", "color": "indigo", "sort_order": 60},
        {"kind": "expense", "name": "Entertainment", "slug": "entertainment", "icon": "clapperboard", "color": "fuchsia", "sort_order": 70},
        {"kind": "expense", "name": "Subscriptions", "slug": "subscriptions", "icon": "repeat", "color": "teal", "sort_order": 80},
        {"kind": "expense", "name": "Travel", "slug": "travel", "icon": "plane", "color": "cyan", "sort_order": 90},
        {"kind": "expense", "name": "Taxes", "slug": "taxes", "icon": "receipt", "color": "stone", "sort_order": 100},
        {"kind": "expense", "name": "Gifts", "slug": "gifts", "icon": "gift", "color": "pink", "sort_order": 110},
        {"kind": "transfer", "name": "Internal transfer", "slug": "internal-transfer", "icon": "arrow-right-left", "color": "slate", "sort_order": 10},
    ]
    for payload in categories:
        Category.objects.update_or_create(
            owner=None,
            kind=payload["kind"],
            slug=payload["slug"],
            defaults={**payload, "is_system": True, "is_active": True},
        )


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Currency",
            fields=[
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("code", models.CharField(max_length=3, primary_key=True, serialize=False, validators=[currency_code_validator])),
                ("name", models.CharField(max_length=64)),
                ("symbol", models.CharField(blank=True, max_length=8)),
                ("numeric_code", models.CharField(blank=True, max_length=3)),
                ("decimal_places", models.PositiveSmallIntegerField(default=2, validators=[MinValueValidator(0), MaxValueValidator(6)])),
                ("is_active", models.BooleanField(default=True)),
                ("is_default", models.BooleanField(default=False)),
            ],
            options={"ordering": ("code",)},
        ),
        migrations.CreateModel(
            name="Category",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("kind", models.CharField(choices=[("income", "Income"), ("expense", "Expense"), ("transfer", "Transfer")], max_length=16)),
                ("name", models.CharField(max_length=128)),
                ("slug", models.SlugField(max_length=160)),
                ("description", models.CharField(blank=True, max_length=255)),
                ("icon", models.CharField(blank=True, max_length=32)),
                ("color", models.CharField(default="slate", max_length=16)),
                ("sort_order", models.PositiveSmallIntegerField(default=0)),
                ("is_system", models.BooleanField(default=False)),
                ("is_active", models.BooleanField(default=True)),
                ("owner", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="finance_categories", to=settings.AUTH_USER_MODEL)),
                ("parent", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="children", to="app.category")),
            ],
            options={"ordering": ("kind", "sort_order", "name")},
        ),
        migrations.CreateModel(
            name="Account",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=128)),
                ("kind", models.CharField(choices=[("cash", "Cash"), ("bank", "Bank account"), ("savings", "Savings"), ("credit_card", "Credit card"), ("e_wallet", "E-wallet"), ("investment", "Investment"), ("loan", "Loan"), ("other", "Other")], max_length=24)),
                ("status", models.CharField(choices=[("active", "Active"), ("frozen", "Frozen"), ("archived", "Archived"), ("closed", "Closed")], default="active", max_length=16)),
                ("institution", models.CharField(blank=True, max_length=128)),
                ("account_number_mask", models.CharField(blank=True, max_length=32)),
                ("iban", models.CharField(blank=True, max_length=34)),
                ("note", models.TextField(blank=True)),
                ("color", models.CharField(default="emerald", max_length=16)),
                ("include_in_net_worth", models.BooleanField(default=True)),
                ("opening_balance", models.DecimalField(decimal_places=2, default=Decimal("0.00"), max_digits=14)),
                ("current_balance", models.DecimalField(decimal_places=2, default=Decimal("0.00"), max_digits=14)),
                ("credit_limit", models.DecimalField(decimal_places=2, default=Decimal("0.00"), max_digits=14)),
                ("currency", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="accounts", to="app.currency")),
                ("owner", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="finance_accounts", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ("name",)},
        ),
        migrations.CreateModel(
            name="ExchangeRate",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("rate", models.DecimalField(decimal_places=8, max_digits=18, validators=[MinValueValidator(Decimal("0.00000001"))])),
                ("rate_date", models.DateField()),
                ("source", models.CharField(default="manual", max_length=64)),
                ("is_active", models.BooleanField(default=True)),
                ("base_currency", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="base_exchange_rates", to="app.currency")),
                ("quote_currency", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="quote_exchange_rates", to="app.currency")),
            ],
            options={"ordering": ("-rate_date", "base_currency_id", "quote_currency_id")},
        ),
        migrations.CreateModel(
            name="Transaction",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("type", models.CharField(choices=[("income", "Income"), ("expense", "Expense"), ("transfer", "Transfer")], max_length=16)),
                ("status", models.CharField(choices=[("draft", "Draft"), ("pending", "Pending"), ("cleared", "Cleared"), ("canceled", "Canceled")], default="cleared", max_length=16)),
                ("amount", models.DecimalField(decimal_places=2, max_digits=14, validators=[MinValueValidator(Decimal("0.01"))])),
                ("destination_amount", models.DecimalField(blank=True, decimal_places=2, max_digits=14, null=True, validators=[MinValueValidator(Decimal("0.01"))])),
                ("exchange_rate", models.DecimalField(blank=True, decimal_places=8, max_digits=18, null=True, validators=[MinValueValidator(Decimal("0.00000001"))])),
                ("title", models.CharField(max_length=160)),
                ("merchant", models.CharField(blank=True, max_length=128)),
                ("counterparty", models.CharField(blank=True, max_length=128)),
                ("description", models.TextField(blank=True)),
                ("occurred_on", models.DateField()),
                ("posted_at", models.DateTimeField(blank=True, null=True)),
                ("cleared_at", models.DateTimeField(blank=True, null=True)),
                ("external_reference", models.CharField(blank=True, max_length=128)),
                ("idempotency_key", models.CharField(blank=True, max_length=64)),
                ("account", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="outgoing_transactions", to="app.account")),
                ("category", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="transactions", to="app.category")),
                ("destination_account", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name="incoming_transfers", to="app.account")),
                ("owner", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="finance_transactions", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ("-occurred_on", "-created_at")},
        ),
        migrations.CreateModel(
            name="Budget",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("period", models.CharField(choices=[("weekly", "Weekly"), ("monthly", "Monthly"), ("quarterly", "Quarterly"), ("yearly", "Yearly"), ("custom", "Custom")], max_length=16)),
                ("amount", models.DecimalField(decimal_places=2, max_digits=14, validators=[MinValueValidator(Decimal("0.01"))])),
                ("spent_amount", models.DecimalField(decimal_places=2, default=Decimal("0.00"), max_digits=14)),
                ("start_date", models.DateField()),
                ("end_date", models.DateField()),
                ("alert_threshold", models.PositiveSmallIntegerField(default=80, validators=[MinValueValidator(1), MaxValueValidator(100)])),
                ("rollover_enabled", models.BooleanField(default=False)),
                ("is_active", models.BooleanField(default=True)),
                ("note", models.TextField(blank=True)),
                ("category", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="budgets", to="app.category")),
                ("currency", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="budgets", to="app.currency")),
                ("owner", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="finance_budgets", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ("-start_date", "category__name")},
        ),
        migrations.AddConstraint(
            model_name="category",
            constraint=models.UniqueConstraint(fields=("owner", "kind", "slug"), name="finance_category_owner_kind_slug_unique"),
        ),
        migrations.AddConstraint(
            model_name="category",
            constraint=models.CheckConstraint(condition=models.Q(models.Q(("is_system", True), ("owner__isnull", True)), models.Q(("is_system", False), ("owner__isnull", False)), _connector="OR"), name="finance_category_owner_scope_check"),
        ),
        migrations.AddConstraint(
            model_name="account",
            constraint=models.UniqueConstraint(fields=("owner", "name", "currency"), name="finance_account_owner_name_currency_unique"),
        ),
        migrations.AddIndex(model_name="account", index=models.Index(fields=["owner", "status"], name="app_account_owner_s_4f9f0f_idx")),
        migrations.AddIndex(model_name="account", index=models.Index(fields=["owner", "kind"], name="app_account_owner_k_fa7f87_idx")),
        migrations.AddConstraint(
            model_name="exchangerate",
            constraint=models.CheckConstraint(condition=~models.Q(("base_currency", models.F("quote_currency"))), name="finance_exchange_rate_distinct_pair_check"),
        ),
        migrations.AddConstraint(
            model_name="exchangerate",
            constraint=models.UniqueConstraint(fields=("base_currency", "quote_currency", "rate_date", "source"), name="finance_exchange_rate_pair_date_source_unique"),
        ),
        migrations.AddConstraint(
            model_name="transaction",
            constraint=models.CheckConstraint(condition=~models.Q(("account", models.F("destination_account"))), name="finance_transaction_distinct_accounts_check"),
        ),
        migrations.AddConstraint(
            model_name="transaction",
            constraint=models.UniqueConstraint(condition=~models.Q(("idempotency_key", "")), fields=("owner", "idempotency_key"), name="finance_transaction_owner_idempotency_unique"),
        ),
        migrations.AddIndex(model_name="transaction", index=models.Index(fields=["owner", "occurred_on"], name="app_transac_owner_i_4fe4db_idx")),
        migrations.AddIndex(model_name="transaction", index=models.Index(fields=["owner", "type", "status"], name="app_transac_owner_i_5f287c_idx")),
        migrations.AddIndex(model_name="transaction", index=models.Index(fields=["account", "occurred_on"], name="app_transac_account_7d80fb_idx")),
        migrations.AddIndex(model_name="transaction", index=models.Index(fields=["category", "occurred_on"], name="app_transac_categor_a33df0_idx")),
        migrations.AddConstraint(
            model_name="budget",
            constraint=models.UniqueConstraint(fields=("owner", "category", "period", "start_date"), name="finance_budget_owner_category_period_start_unique"),
        ),
        migrations.AddConstraint(
            model_name="budget",
            constraint=models.CheckConstraint(condition=models.Q(("end_date__gte", models.F("start_date"))), name="finance_budget_date_range_check"),
        ),
        migrations.AddIndex(model_name="budget", index=models.Index(fields=["owner", "is_active"], name="app_budget_owner_i_a9387d_idx")),
        migrations.AddIndex(model_name="budget", index=models.Index(fields=["owner", "start_date", "end_date"], name="app_budget_owner_i_0fb3c6_idx")),
        migrations.RunPython(seed_reference_data, migrations.RunPython.noop),
    ]
