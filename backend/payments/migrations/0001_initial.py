from decimal import Decimal

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("subscribes", "0002_subscriptionplan_commerce_and_usersubscription"),
    ]

    operations = [
        migrations.CreateModel(
            name="PaymentWebhookEvent",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("provider", models.CharField(choices=[("freedompay", "FreedomPay")], max_length=24)),
                ("event_type", models.CharField(max_length=64)),
                ("event_id", models.CharField(max_length=128, unique=True)),
                ("status", models.CharField(choices=[("received", "Received"), ("processed", "Processed"), ("failed", "Failed")], default="received", max_length=16)),
                ("payload", models.JSONField(blank=True, default=dict)),
                ("processed_at", models.DateTimeField(blank=True, null=True)),
                ("error_message", models.CharField(blank=True, default="", max_length=255)),
            ],
            options={
                "verbose_name": "Payment webhook event",
                "verbose_name_plural": "Payment webhook events",
                "ordering": ("-created_at",),
            },
        ),
        migrations.CreateModel(
            name="PaymentOrder",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("provider", models.CharField(choices=[("freedompay", "FreedomPay")], default="freedompay", max_length=24)),
                ("status", models.CharField(choices=[("created", "Created"), ("pending", "Pending"), ("paid", "Paid"), ("failed", "Failed"), ("canceled", "Canceled"), ("refunded", "Refunded"), ("expired", "Expired")], default="created", max_length=16)),
                ("amount", models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(Decimal("0.00"))])),
                ("currency", models.CharField(default="USD", max_length=3)),
                ("description", models.CharField(blank=True, default="", max_length=255)),
                ("external_order_id", models.CharField(blank=True, db_index=True, default="", max_length=128)),
                ("provider_payment_id", models.CharField(blank=True, default="", max_length=128)),
                ("provider_session_id", models.CharField(blank=True, default="", max_length=128)),
                ("success_url", models.URLField(blank=True, default="")),
                ("fail_url", models.URLField(blank=True, default="")),
                ("provider_payload", models.JSONField(blank=True, default=dict)),
                ("paid_at", models.DateTimeField(blank=True, null=True)),
                ("expires_at", models.DateTimeField(blank=True, null=True)),
                ("plan", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="payment_orders", to="subscribes.subscriptionplan")),
                ("subscription", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="payment_orders", to="subscribes.usersubscription")),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="payment_orders", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "verbose_name": "Payment order",
                "verbose_name_plural": "Payment orders",
                "ordering": ("-created_at",),
            },
        ),
        migrations.AddIndex(
            model_name="paymentorder",
            index=models.Index(fields=["user", "status"], name="payments_pa_user_id_7f575c_idx"),
        ),
        migrations.AddIndex(
            model_name="paymentorder",
            index=models.Index(fields=["provider", "status"], name="payments_pa_provide_676276_idx"),
        ),
        migrations.CreateModel(
            name="PaymentTransaction",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("kind", models.CharField(choices=[("payment", "Payment"), ("refund", "Refund"), ("webhook", "Webhook")], default="payment", max_length=16)),
                ("status", models.CharField(choices=[("initiated", "Initiated"), ("authorized", "Authorized"), ("captured", "Captured"), ("failed", "Failed"), ("refunded", "Refunded")], default="initiated", max_length=16)),
                ("amount", models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(Decimal("0.00"))])),
                ("currency", models.CharField(default="USD", max_length=3)),
                ("provider_transaction_id", models.CharField(blank=True, db_index=True, default="", max_length=128)),
                ("provider_status", models.CharField(blank=True, default="", max_length=64)),
                ("payload", models.JSONField(blank=True, default=dict)),
                ("processed_at", models.DateTimeField(blank=True, null=True)),
                ("order", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="transactions", to="payments.paymentorder")),
            ],
            options={
                "verbose_name": "Payment transaction",
                "verbose_name_plural": "Payment transactions",
                "ordering": ("-created_at",),
            },
        ),
    ]
