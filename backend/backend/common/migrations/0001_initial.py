from decimal import Decimal

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="FinancialAccount",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=128)),
                ("kind", models.CharField(choices=[("cash", "Cash"), ("savings", "Savings"), ("investment", "Investment"), ("credit", "Credit")], max_length=24)),
                ("currency", models.CharField(default="USD", max_length=8)),
                ("balance", models.DecimalField(decimal_places=2, default=Decimal("0"), max_digits=12)),
                ("institution", models.CharField(blank=True, max_length=128)),
                ("color_token", models.CharField(default="emerald", max_length=32)),
                ("owner", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="financial_accounts", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ("name",)},
        ),
        migrations.CreateModel(
            name="UserProfile",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("phone", models.CharField(max_length=32)),
                ("user", models.OneToOneField(on_delete=models.deletion.CASCADE, related_name="profile", to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name="TransactionCategory",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=128)),
                ("kind", models.CharField(choices=[("income", "Income"), ("expense", "Expense"), ("transfer", "Transfer")], max_length=24)),
                ("icon", models.CharField(blank=True, max_length=32)),
                ("owner", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="transaction_categories", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "ordering": ("kind", "name"),
                "unique_together": {("owner", "name", "kind")},
            },
        ),
        migrations.CreateModel(
            name="Transaction",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("title", models.CharField(max_length=160)),
                ("amount", models.DecimalField(decimal_places=2, max_digits=12)),
                ("transaction_date", models.DateField()),
                ("status", models.CharField(choices=[("cleared", "Cleared"), ("pending", "Pending"), ("scheduled", "Scheduled")], max_length=24)),
                ("note", models.CharField(blank=True, max_length=255)),
                ("merchant", models.CharField(blank=True, max_length=128)),
                ("account", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="transactions", to="common.financialaccount")),
                ("category", models.ForeignKey(blank=True, null=True, on_delete=models.deletion.SET_NULL, related_name="transactions", to="common.transactioncategory")),
                ("owner", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="transactions", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ("-transaction_date", "-created_at")},
        ),
        migrations.CreateModel(
            name="Budget",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("monthly_limit", models.DecimalField(decimal_places=2, max_digits=12)),
                ("spent", models.DecimalField(decimal_places=2, default=Decimal("0"), max_digits=12)),
                ("alert_threshold", models.PositiveSmallIntegerField(default=85)),
                ("category", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="budgets", to="common.transactioncategory")),
                ("owner", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="budgets", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "ordering": ("category__name",),
                "unique_together": {("owner", "category")},
            },
        ),
    ]
