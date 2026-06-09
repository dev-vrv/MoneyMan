from django.contrib import admin

from .models import PaymentOrder, PaymentTransaction, PaymentWebhookEvent


class PaymentTransactionInline(admin.TabularInline):
    model = PaymentTransaction
    extra = 0
    fields = ("kind", "status", "amount", "currency", "provider_transaction_id", "processed_at")
    readonly_fields = fields
    can_delete = False


@admin.register(PaymentOrder)
class PaymentOrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "plan", "provider", "status", "amount", "currency", "paid_at", "created_at")
    list_filter = ("provider", "status", "currency")
    search_fields = ("user__email", "plan__name", "plan__code", "external_order_id", "provider_payment_id")
    autocomplete_fields = ("user", "plan", "subscription")
    ordering = ("-created_at",)
    inlines = (PaymentTransactionInline,)


@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "kind", "status", "amount", "currency", "provider_transaction_id", "processed_at")
    list_filter = ("kind", "status", "currency")
    search_fields = ("order__user__email", "provider_transaction_id", "provider_status")
    autocomplete_fields = ("order",)
    ordering = ("-created_at",)


@admin.register(PaymentWebhookEvent)
class PaymentWebhookEventAdmin(admin.ModelAdmin):
    list_display = ("event_id", "provider", "event_type", "status", "processed_at", "created_at")
    list_filter = ("provider", "status", "event_type")
    search_fields = ("event_id", "event_type", "error_message")
    ordering = ("-created_at",)
