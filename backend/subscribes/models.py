from decimal import Decimal

from django.core.validators import MinValueValidator
from django.db import models

from app.models import TimeStampedModel


class SubscriptionPlan(TimeStampedModel):
    class DurationUnit(models.TextChoices):
        DAY = "day", "Day"
        MONTH = "month", "Month"
        YEAR = "year", "Year"

    code = models.SlugField(max_length=64, unique=True)
    name = models.CharField(max_length=128)
    description = models.CharField(max_length=255, blank=True)
    duration_value = models.PositiveSmallIntegerField(default=1)
    duration_unit = models.CharField(max_length=16, choices=DurationUnit.choices, default=DurationUnit.MONTH)
    price_usd = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    sort_order = models.PositiveSmallIntegerField(default=0)
    is_highlighted = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("sort_order", "price_usd", "name")
        verbose_name = "Subscription plan"
        verbose_name_plural = "Subscription plans"

    def __str__(self) -> str:
        return self.name


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
