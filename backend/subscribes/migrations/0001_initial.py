from decimal import Decimal

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="SubscriptionPlan",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("code", models.SlugField(max_length=64, unique=True)),
                ("name", models.CharField(max_length=128)),
                ("description", models.CharField(blank=True, max_length=255)),
                ("duration_value", models.PositiveSmallIntegerField(default=1)),
                (
                    "duration_unit",
                    models.CharField(
                        choices=[("day", "Day"), ("month", "Month"), ("year", "Year")],
                        default="month",
                        max_length=16,
                    ),
                ),
                ("price_usd", models.DecimalField(decimal_places=2, default=Decimal("0.00"), max_digits=10)),
                ("sort_order", models.PositiveSmallIntegerField(default=0)),
                ("is_highlighted", models.BooleanField(default=False)),
                ("is_active", models.BooleanField(default=True)),
            ],
            options={
                "verbose_name": "Subscription plan",
                "verbose_name_plural": "Subscription plans",
                "ordering": ("sort_order", "price_usd", "name"),
            },
        ),
        migrations.CreateModel(
            name="SubscriptionPlanFeature",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("title", models.CharField(max_length=160)),
                ("sort_order", models.PositiveSmallIntegerField(default=0)),
                ("is_active", models.BooleanField(default=True)),
                (
                    "plan",
                    models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="features", to="subscribes.subscriptionplan"),
                ),
            ],
            options={
                "verbose_name": "Subscription plan feature",
                "verbose_name_plural": "Subscription plan features",
                "ordering": ("sort_order", "id"),
            },
        ),
    ]
