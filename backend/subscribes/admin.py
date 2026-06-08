from django.contrib import admin

from .models import SubscriptionPlan, SubscriptionPlanFeature


class SubscriptionPlanFeatureInline(admin.TabularInline):
    model = SubscriptionPlanFeature
    extra = 1
    fields = ("title", "sort_order", "is_active")


@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "code",
        "duration_value",
        "duration_unit",
        "price_usd",
        "sort_order",
        "is_highlighted",
        "is_active",
    )
    list_filter = ("duration_unit", "is_highlighted", "is_active")
    search_fields = ("name", "code", "description")
    ordering = ("sort_order", "price_usd", "name")
    inlines = (SubscriptionPlanFeatureInline,)


@admin.register(SubscriptionPlanFeature)
class SubscriptionPlanFeatureAdmin(admin.ModelAdmin):
    list_display = ("title", "plan", "sort_order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("title", "plan__name", "plan__code")
    ordering = ("plan__sort_order", "sort_order", "id")
