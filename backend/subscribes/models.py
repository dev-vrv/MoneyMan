from decimal import Decimal

from django.core.validators import MinValueValidator
from django.db import models
from django.conf import settings

from app.models import TimeStampedModel


class SubscriptionPlan(TimeStampedModel):
    class DurationUnit(models.TextChoices):
        DAY = "day", "Day"
        MONTH = "month", "Month"
        YEAR = "year", "Year"

    class BillingMode(models.TextChoices):
        ONE_TIME = "one_time", "One-time"
        RECURRING = "recurring", "Recurring"

    code = models.SlugField(max_length=64, unique=True)
    name = models.CharField(max_length=128)
    description = models.CharField(max_length=255, blank=True)
    duration_value = models.PositiveSmallIntegerField(default=1)
    duration_unit = models.CharField(max_length=16, choices=DurationUnit.choices, default=DurationUnit.MONTH)
    billing_mode = models.CharField(
        max_length=16,
        choices=BillingMode.choices,
        default=BillingMode.RECURRING,
    )
    price_usd = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    price_currency = models.CharField(max_length=3, default="USD")
    trial_days = models.PositiveSmallIntegerField(default=0)
    grace_period_days = models.PositiveSmallIntegerField(default=0)
    freedompay_product_id = models.CharField(max_length=128, blank=True, default="")
    freedompay_payment_page_id = models.CharField(max_length=128, blank=True, default="")
    sort_order = models.PositiveSmallIntegerField(default=0)
    is_highlighted = models.BooleanField(default=False)
    is_public = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("sort_order", "price_usd", "name")
        verbose_name = "Subscription plan"
        verbose_name_plural = "Subscription plans"

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        self.code = self.code.strip().lower()
        self.name = self.name.strip()
        self.description = self.description.strip()
        self.price_currency = self.price_currency.strip().upper() or "USD"
        self.freedompay_product_id = self.freedompay_product_id.strip()
        self.freedompay_payment_page_id = self.freedompay_payment_page_id.strip()
        super().save(*args, **kwargs)


class SubscriptionPlanFeature(TimeStampedModel):
    plan = models.ForeignKey(
        SubscriptionPlan,
        on_delete=models.CASCADE,
        related_name="features",
    )
    title = models.CharField(max_length=160)
    sort_order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("sort_order", "id")
        verbose_name = "Subscription plan feature"
        verbose_name_plural = "Subscription plan features"

    def __str__(self) -> str:
        return f"{self.plan.name}: {self.title}"


class UserSubscription(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        ACTIVE = "active", "Active"
        PAST_DUE = "past_due", "Past due"
        CANCELED = "canceled", "Canceled"
        EXPIRED = "expired", "Expired"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="subscriptions",
    )
    plan = models.ForeignKey(
        SubscriptionPlan,
        on_delete=models.PROTECT,
        related_name="subscriptions",
    )
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING)
    started_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    trial_ends_at = models.DateTimeField(null=True, blank=True)
    next_billing_at = models.DateTimeField(null=True, blank=True)
    last_payment_at = models.DateTimeField(null=True, blank=True)
    canceled_at = models.DateTimeField(null=True, blank=True)
    cancel_at_period_end = models.BooleanField(default=False)
    auto_renew = models.BooleanField(default=True)
    external_customer_id = models.CharField(max_length=128, blank=True, default="")
    external_subscription_id = models.CharField(max_length=128, blank=True, default="")

    class Meta:
        ordering = ("-created_at",)
        verbose_name = "User subscription"
        verbose_name_plural = "User subscriptions"
        indexes = [
            models.Index(fields=("user", "status")),
            models.Index(fields=("external_subscription_id",)),
        ]

    def __str__(self) -> str:
        return f"{self.user.email} - {self.plan.code} [{self.status}]"

    def save(self, *args, **kwargs):
        self.external_customer_id = self.external_customer_id.strip()
        self.external_subscription_id = self.external_subscription_id.strip()
        super().save(*args, **kwargs)
