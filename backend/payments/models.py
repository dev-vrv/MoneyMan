from decimal import Decimal

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models

from app.models import TimeStampedModel


class PaymentOrder(TimeStampedModel):
    class Provider(models.TextChoices):
        FREEDOMPAY = "freedompay", "FreedomPay"

    class Status(models.TextChoices):
        CREATED = "created", "Created"
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        FAILED = "failed", "Failed"
        CANCELED = "canceled", "Canceled"
        REFUNDED = "refunded", "Refunded"
        EXPIRED = "expired", "Expired"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="payment_orders",
    )
    plan = models.ForeignKey(
        "subscribes.SubscriptionPlan",
        on_delete=models.PROTECT,
        related_name="payment_orders",
    )
    subscription = models.ForeignKey(
        "subscribes.UserSubscription",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="payment_orders",
    )
    provider = models.CharField(max_length=24, choices=Provider.choices, default=Provider.FREEDOMPAY)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.CREATED)
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    currency = models.CharField(max_length=3, default="USD")
    description = models.CharField(max_length=255, blank=True, default="")
    external_order_id = models.CharField(max_length=128, blank=True, default="", db_index=True)
    provider_payment_id = models.CharField(max_length=128, blank=True, default="")
    provider_session_id = models.CharField(max_length=128, blank=True, default="")
    success_url = models.URLField(blank=True, default="")
    fail_url = models.URLField(blank=True, default="")
    provider_payload = models.JSONField(default=dict, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ("-created_at",)
        verbose_name = "Payment order"
        verbose_name_plural = "Payment orders"
        indexes = [
            models.Index(fields=("user", "status")),
            models.Index(fields=("provider", "status")),
        ]

    def __str__(self) -> str:
        return f"{self.user.email} - {self.plan.code} - {self.amount} {self.currency}"

    def save(self, *args, **kwargs):
        self.currency = self.currency.strip().upper() or "USD"
        self.description = self.description.strip()
        self.external_order_id = self.external_order_id.strip()
        self.provider_payment_id = self.provider_payment_id.strip()
        self.provider_session_id = self.provider_session_id.strip()
        super().save(*args, **kwargs)


class PaymentTransaction(TimeStampedModel):
    class Kind(models.TextChoices):
        PAYMENT = "payment", "Payment"
        REFUND = "refund", "Refund"
        WEBHOOK = "webhook", "Webhook"

    class Status(models.TextChoices):
        INITIATED = "initiated", "Initiated"
        AUTHORIZED = "authorized", "Authorized"
        CAPTURED = "captured", "Captured"
        FAILED = "failed", "Failed"
        REFUNDED = "refunded", "Refunded"

    order = models.ForeignKey(
        PaymentOrder,
        on_delete=models.CASCADE,
        related_name="transactions",
    )
    kind = models.CharField(max_length=16, choices=Kind.choices, default=Kind.PAYMENT)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.INITIATED)
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    currency = models.CharField(max_length=3, default="USD")
    provider_transaction_id = models.CharField(max_length=128, blank=True, default="", db_index=True)
    provider_status = models.CharField(max_length=64, blank=True, default="")
    payload = models.JSONField(default=dict, blank=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ("-created_at",)
        verbose_name = "Payment transaction"
        verbose_name_plural = "Payment transactions"

    def __str__(self) -> str:
        return f"{self.order_id} - {self.kind} - {self.status}"

    def save(self, *args, **kwargs):
        self.currency = self.currency.strip().upper() or "USD"
        self.provider_transaction_id = self.provider_transaction_id.strip()
        self.provider_status = self.provider_status.strip()
        super().save(*args, **kwargs)


class PaymentWebhookEvent(TimeStampedModel):
    class ProcessingStatus(models.TextChoices):
        RECEIVED = "received", "Received"
        PROCESSED = "processed", "Processed"
        FAILED = "failed", "Failed"

    provider = models.CharField(max_length=24, choices=PaymentOrder.Provider.choices)
    event_type = models.CharField(max_length=64)
    event_id = models.CharField(max_length=128, unique=True)
    status = models.CharField(max_length=16, choices=ProcessingStatus.choices, default=ProcessingStatus.RECEIVED)
    payload = models.JSONField(default=dict, blank=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    error_message = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        ordering = ("-created_at",)
        verbose_name = "Payment webhook event"
        verbose_name_plural = "Payment webhook events"

    def __str__(self) -> str:
        return f"{self.provider} - {self.event_type} - {self.event_id}"

    def save(self, *args, **kwargs):
        self.event_type = self.event_type.strip()
        self.event_id = self.event_id.strip()
        self.error_message = self.error_message.strip()
        super().save(*args, **kwargs)
