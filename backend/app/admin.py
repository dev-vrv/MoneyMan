from django.contrib import admin

from .models import Account, Budget, Category, Currency, ExchangeRate, Transaction


@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "symbol", "decimal_places", "is_default", "is_active")
    list_filter = ("is_default", "is_active")
    search_fields = ("code", "name", "numeric_code")
    ordering = ("code",)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "kind", "owner", "parent", "is_system", "is_active", "sort_order")
    list_filter = ("kind", "is_system", "is_active")
    search_fields = ("name", "slug", "owner__email")
    autocomplete_fields = ("owner", "parent")
    ordering = ("kind", "sort_order", "name")


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "owner",
        "kind",
        "status",
        "currency",
        "current_balance",
        "credit_limit",
        "include_in_net_worth",
    )
    list_filter = ("kind", "status", "currency", "include_in_net_worth")
    search_fields = ("name", "owner__email", "institution", "account_number_mask", "iban")
    autocomplete_fields = ("owner", "currency")
    ordering = ("owner", "name")


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "owner",
        "type",
        "status",
        "account",
        "destination_account",
        "amount",
        "occurred_on",
    )
    list_filter = ("type", "status", "occurred_on", "account__currency")
    search_fields = (
        "title",
        "merchant",
        "counterparty",
        "owner__email",
        "external_reference",
        "idempotency_key",
    )
    autocomplete_fields = ("owner", "account", "destination_account", "category")
    ordering = ("-occurred_on", "-created_at")


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = (
        "category",
        "owner",
        "currency",
        "period",
        "amount",
        "spent_amount",
        "alert_threshold",
        "is_active",
    )
    list_filter = ("period", "currency", "is_active")
    search_fields = ("category__name", "owner__email")
    autocomplete_fields = ("owner", "category", "currency")
    ordering = ("-start_date", "category__name")


@admin.register(ExchangeRate)
class ExchangeRateAdmin(admin.ModelAdmin):
    list_display = ("base_currency", "quote_currency", "rate", "rate_date", "source", "is_active")
    list_filter = ("source", "is_active", "rate_date")
    search_fields = ("base_currency__code", "quote_currency__code", "source")
    autocomplete_fields = ("base_currency", "quote_currency")
    ordering = ("-rate_date", "base_currency", "quote_currency")
