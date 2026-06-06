from django.contrib import admin, messages
from django.core.exceptions import PermissionDenied
from django.http import HttpRequest, HttpResponseRedirect
from django.urls import path, reverse

from .currency_sync import CurrencySyncError, sync_fx_kg_reference_data
from .models import (
    Account,
    AccountDepositProfile,
    AccountTaxProfile,
    Budget,
    Category,
    CryptoAsset,
    CryptoAssetNetwork,
    CryptoHolding,
    CryptoNetwork,
    CryptoWallet,
    Currency,
    ExchangeRate,
    Notification,
    NotificationReceipt,
    Transaction,
)
from .services import ensure_default_crypto_reference_data


@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "symbol", "decimal_places", "is_default", "is_active")
    list_filter = ("is_default", "is_active")
    search_fields = ("code", "name", "numeric_code")
    ordering = ("code",)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "name_ru",
        "name_en",
        "name_kg",
        "kind",
        "owner",
        "parent",
        "is_system",
        "is_active",
        "sort_order",
    )
    list_filter = ("kind", "is_system", "is_active")
    search_fields = ("name", "name_ru", "name_en", "name_kg", "slug", "owner__email")
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


@admin.register(AccountTaxProfile)
class AccountTaxProfileAdmin(admin.ModelAdmin):
    list_display = (
        "account",
        "entity_type",
        "template_code",
        "calculation_source",
        "reporting_period",
        "tax_rate",
        "social_fund_rate",
        "due_day",
        "is_active",
    )
    list_filter = (
        "entity_type",
        "template_code",
        "calculation_source",
        "reporting_period",
        "is_active",
    )
    search_fields = ("account__name", "account__owner__email", "note")
    autocomplete_fields = ("account",)
    ordering = ("account__owner", "account__name")


@admin.register(AccountDepositProfile)
class AccountDepositProfileAdmin(admin.ModelAdmin):
    list_display = (
        "account",
        "annual_interest_rate",
        "interest_payout_frequency",
        "day_count_convention",
        "term_start_date",
        "maturity_date",
        "capitalization_enabled",
        "allow_top_up",
        "allow_partial_withdrawal",
        "minimum_balance",
        "is_active",
    )
    list_filter = (
        "interest_payout_frequency",
        "day_count_convention",
        "capitalization_enabled",
        "allow_top_up",
        "allow_partial_withdrawal",
        "is_active",
    )
    search_fields = ("account__name", "account__owner__email", "note")
    autocomplete_fields = ("account",)
    ordering = ("account__owner", "account__name")


@admin.register(CryptoNetwork)
class CryptoNetworkAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "code",
        "owner",
        "protocol",
        "native_symbol",
        "is_evm",
        "is_system",
        "is_active",
    )
    list_filter = ("protocol", "is_evm", "is_system", "is_active")
    search_fields = ("name", "code", "chain_id", "native_symbol", "owner__email")
    autocomplete_fields = ("owner",)
    ordering = ("name",)


@admin.register(CryptoAsset)
class CryptoAssetAdmin(admin.ModelAdmin):
    list_display = (
        "symbol",
        "name",
        "asset_type",
        "owner",
        "decimals",
        "coingecko_id",
        "is_system",
        "is_active",
    )
    list_filter = ("asset_type", "is_system", "is_active")
    search_fields = ("symbol", "name", "slug", "coingecko_id", "owner__email")
    autocomplete_fields = ("owner",)
    ordering = ("symbol",)
    change_list_template = "admin/app/cryptoasset/change_list.html"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "seed-reference/",
                self.admin_site.admin_view(self.seed_reference_view),
                name="app_cryptoasset_seed_reference",
            ),
        ]
        return custom_urls + urls

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context["seed_crypto_reference_url"] = reverse("admin:app_cryptoasset_seed_reference")
        return super().changelist_view(request, extra_context=extra_context)

    def seed_reference_view(self, request: HttpRequest):
        if not self.has_change_permission(request):
            raise PermissionDenied

        result = ensure_default_crypto_reference_data()
        self.message_user(
            request,
            (
                f"Crypto reference sync completed. Networks: {result.networks_synced}, "
                f"assets: {result.assets_synced}, links: {result.links_synced}."
            ),
            level=messages.SUCCESS,
        )
        return HttpResponseRedirect(reverse("admin:app_cryptoasset_changelist"))


@admin.register(CryptoAssetNetwork)
class CryptoAssetNetworkAdmin(admin.ModelAdmin):
    list_display = (
        "asset",
        "network",
        "token_standard",
        "is_native",
        "deposit_enabled",
        "withdrawal_enabled",
        "is_active",
    )
    list_filter = ("network", "token_standard", "is_native", "is_active")
    search_fields = ("asset__symbol", "asset__name", "network__name", "contract_address")
    autocomplete_fields = ("asset", "network")
    ordering = ("asset__symbol", "sort_order", "network__name")


@admin.register(CryptoWallet)
class CryptoWalletAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "owner",
        "network",
        "wallet_type",
        "provider",
        "is_watch_only",
        "sync_status",
        "is_active",
        "last_synced_at",
    )
    list_filter = ("wallet_type", "network", "is_watch_only", "sync_status", "is_active")
    search_fields = ("name", "owner__email", "provider", "address", "xpub")
    autocomplete_fields = ("owner", "network")
    ordering = ("owner", "name")


@admin.register(CryptoHolding)
class CryptoHoldingAdmin(admin.ModelAdmin):
    list_display = (
        "wallet",
        "asset",
        "asset_network",
        "balance",
        "available_balance",
        "locked_balance",
        "last_price",
        "price_currency",
        "is_tracked",
    )
    list_filter = ("is_tracked", "price_currency", "wallet__network")
    search_fields = ("wallet__name", "wallet__owner__email", "asset__symbol", "wallet_address")
    autocomplete_fields = ("wallet", "asset", "asset_network", "price_currency")
    ordering = ("wallet__owner", "wallet__name", "asset__symbol")


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


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "scope",
        "recipient",
        "level",
        "is_active",
        "published_at",
        "expires_at",
        "created_by",
    )
    list_filter = ("scope", "level", "is_active", "published_at")
    search_fields = ("title", "body", "recipient__email", "created_by__email", "action_url")
    autocomplete_fields = ("recipient", "created_by")
    ordering = ("-published_at", "-created_at")


@admin.register(NotificationReceipt)
class NotificationReceiptAdmin(admin.ModelAdmin):
    list_display = ("notification", "user", "read_at", "created_at")
    list_filter = ("read_at", "created_at")
    search_fields = ("notification__title", "user__email")
    autocomplete_fields = ("notification", "user")
    ordering = ("-updated_at",)


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
    change_list_template = "admin/app/exchangerate/change_list.html"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "sync-fx-kg/",
                self.admin_site.admin_view(self.sync_fx_kg_view),
                name="app_exchangerate_sync_fx_kg",
            ),
        ]
        return custom_urls + urls

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context["sync_fx_kg_url"] = reverse("admin:app_exchangerate_sync_fx_kg")
        return super().changelist_view(request, extra_context=extra_context)

    def sync_fx_kg_view(self, request: HttpRequest):
        if not self.has_change_permission(request):
            raise PermissionDenied

        try:
            result = sync_fx_kg_reference_data()
        except CurrencySyncError as exc:
            self.message_user(request, str(exc), level=messages.ERROR)
        else:
            self.message_user(
                request,
                (
                    f"FX.kg sync completed. Currencies: {result.currencies_synced}, "
                    f"rates: {result.rates_synced}, date: {result.effective_date}."
                ),
                level=messages.SUCCESS,
            )

        return HttpResponseRedirect(reverse("admin:app_exchangerate_changelist"))
