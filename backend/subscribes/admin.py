from django.contrib import admin

from .models import SubscriptionPlan, SubscriptionPlanFeature, UserSubscription


class SubscriptionPlanFeatureInline(admin.TabularInline):
    model = SubscriptionPlanFeature
    extra = 1
    fields = ("title", "sort_order", "is_active")


@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "code",
        "billing_mode",
        "duration_value",
        "duration_unit",
        "price_usd",
        "price_currency",
        "sort_order",
        "is_highlighted",
        "is_public",
        "is_active",
    )
    list_filter = ("duration_unit", "billing_mode", "is_highlighted", "is_public", "is_active")
    search_fields = ("name", "code", "description")
    ordering = ("sort_order", "price_usd", "name")
    inlines = (SubscriptionPlanFeatureInline,)


@admin.register(SubscriptionPlanFeature)
class SubscriptionPlanFeatureAdmin(admin.ModelAdmin):
    list_display = ("title", "plan", "sort_order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("title", "plan__name", "plan__code")
    ordering = ("plan__sort_order", "sort_order", "id")


@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "plan",
        "status",
        "started_at",
        "expires_at",
        "next_billing_at",
        "auto_renew",
    )
    list_filter = ("status", "auto_renew", "cancel_at_period_end")
    search_fields = ("user__email", "plan__name", "plan__code", "external_subscription_id")
    autocomplete_fields = ("user", "plan")
    ordering = ("-created_at",)
