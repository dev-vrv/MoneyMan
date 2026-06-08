from django.db.models import Prefetch, Q
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .market_data import (
    CRYPTO_MARKET_PROVIDER_BINANCE,
    CRYPTO_MARKET_PROVIDER_OKX,
    CryptoMarketDataError,
    fetch_crypto_market_snapshot,
    normalize_crypto_market_provider,
)
from .currency_sync import CurrencySyncError, sync_fx_kg_reference_data
from .models import (
    Account,
    AccountTaxProfile,
    Budget,
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
    TransactionTemplate,
)
from .serializers import (
    AccountSerializer,
    AccountTaxProfileSerializer,
    BudgetSerializer,
    CategorySerializer,
    CryptoAssetNetworkSerializer,
    CryptoAssetSerializer,
    CryptoHoldingSerializer,
    CryptoNetworkSerializer,
    CryptoWalletSerializer,
    CurrencySerializer,
    ExchangeRateSerializer,
    NotificationSerializer,
    TaxObligationTransactionCreateSerializer,
    TransactionSerializer,
    TransactionTemplateSerializer,
    get_request_locale,
)
from .services import build_dashboard_overview, category_queryset_for_user, delete_transaction


def get_active_exchange_rates_queryset(*, quote_currency: str, base_currency: str | None = None):
    queryset = ExchangeRate.objects.filter(is_active=True, quote_currency_id=quote_currency).select_related(
        "base_currency", "quote_currency"
    )
    if base_currency:
        queryset = queryset.filter(base_currency_id=base_currency)
    queryset = queryset.order_by("base_currency__code", "quote_currency__code")

    if queryset.exists():
        return queryset

    try:
        sync_fx_kg_reference_data()
    except CurrencySyncError:
        return queryset

    refreshed_queryset = ExchangeRate.objects.filter(is_active=True, quote_currency_id=quote_currency).select_related(
        "base_currency", "quote_currency"
    )
    if base_currency:
        refreshed_queryset = refreshed_queryset.filter(base_currency_id=base_currency)
    return refreshed_queryset.order_by("base_currency__code", "quote_currency__code")


class DashboardOverviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response(
            build_dashboard_overview(
                user=request.user,
                locale=get_request_locale(request),
            )
        )


class CurrencyViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CurrencySerializer
    queryset = Currency.objects.filter(is_active=True).order_by("code")
    pagination_class = None


class ExchangeRateViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ExchangeRateSerializer
    pagination_class = None

    def get_queryset(self):
        base_currency = self.request.query_params.get("base_currency")
        quote_currency = self.request.query_params.get("quote_currency")
        normalized_quote_currency = quote_currency.upper() if quote_currency else "KGS"
        normalized_base_currency = base_currency.upper() if base_currency else None
        return get_active_exchange_rates_queryset(
            quote_currency=normalized_quote_currency,
            base_currency=normalized_base_currency,
        )


class MarketSnapshotView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        quote_currency = request.query_params.get("quote_currency", "KGS").upper()
        fiat_rates = get_active_exchange_rates_queryset(quote_currency=quote_currency)
        provider = normalize_crypto_market_provider(request.query_params.get("provider"))
        provider_error = None

        try:
            crypto_snapshot = fetch_crypto_market_snapshot(provider)
        except CryptoMarketDataError as exc:
            crypto_snapshot = None
            provider_error = str(exc)

        should_fallback_to_okx = provider == CRYPTO_MARKET_PROVIDER_BINANCE and (
            crypto_snapshot is None or not crypto_snapshot.assets
        )
        if should_fallback_to_okx:
            fallback_reason = provider_error or "Binance returned no market data."
            try:
                fallback_snapshot = fetch_crypto_market_snapshot(CRYPTO_MARKET_PROVIDER_OKX)
            except CryptoMarketDataError:
                fallback_snapshot = None
            else:
                if fallback_snapshot.assets:
                    crypto_snapshot = fallback_snapshot
                    provider_error = f"Binance unavailable, switched to {CRYPTO_MARKET_PROVIDER_OKX.upper()}: {fallback_reason}"

        return Response(
            {
                "provider": crypto_snapshot.provider if crypto_snapshot else provider,
                "provider_error": provider_error,
                "fiat_rates": ExchangeRateSerializer(fiat_rates, many=True).data,
                "crypto_assets": crypto_snapshot.assets if crypto_snapshot else [],
                "crypto_updated_at": crypto_snapshot.fetched_at if crypto_snapshot else None,
            }
        )


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer
    pagination_class = None

    def get_queryset(self):
        now = timezone.now()
        user = self.request.user
        receipt_queryset = NotificationReceipt.objects.filter(user=user)
        return (
            Notification.objects.filter(
                Q(scope=Notification.Scope.BROADCAST)
                | Q(scope=Notification.Scope.PERSONAL, recipient=user),
                is_active=True,
                published_at__lte=now,
            )
            .filter(Q(expires_at__isnull=True) | Q(expires_at__gt=now))
            .prefetch_related(
                Prefetch(
                    "receipts",
                    queryset=receipt_queryset,
                    to_attr="user_receipts",
                )
            )
            .order_by("-published_at", "-created_at")
        )

    @action(detail=True, methods=["post"], url_path="mark-read")
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        receipt, _ = NotificationReceipt.objects.get_or_create(
            notification=notification,
            user=request.user,
        )
        if receipt.read_at is None:
            receipt.read_at = timezone.now()
            receipt.save(update_fields=["read_at", "updated_at"])
        notification.user_receipts = [receipt]
        return Response(self.get_serializer(notification).data)

    @action(detail=False, methods=["post"], url_path="mark-all-read")
    def mark_all_read(self, request):
        now = timezone.now()
        notification_ids = list(self.get_queryset().values_list("id", flat=True))
        if not notification_ids:
            return Response(status=status.HTTP_204_NO_CONTENT)

        receipts = {
            receipt.notification_id: receipt
            for receipt in NotificationReceipt.objects.filter(
                user=request.user,
                notification_id__in=notification_ids,
            )
        }

        unread_existing_ids = [receipt.id for receipt in receipts.values() if receipt.read_at is None]
        if unread_existing_ids:
            NotificationReceipt.objects.filter(id__in=unread_existing_ids).update(read_at=now)

        missing_receipts = [
            NotificationReceipt(notification_id=notification_id, user=request.user, read_at=now)
            for notification_id in notification_ids
            if notification_id not in receipts
        ]
        if missing_receipts:
            NotificationReceipt.objects.bulk_create(missing_receipts)

        return Response(status=status.HTTP_204_NO_CONTENT)


class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer
    pagination_class = None

    def get_queryset(self):
        queryset = category_queryset_for_user(self.request.user)
        kind = self.request.query_params.get("kind")
        scope = self.request.query_params.get("scope")
        if kind:
            queryset = queryset.filter(kind=kind)
        if scope == "custom":
            queryset = queryset.filter(owner=self.request.user)
        elif scope == "system":
            queryset = queryset.filter(is_system=True)
        return queryset.order_by("kind", "sort_order", "name")

    def perform_destroy(self, instance):
        if instance.is_system:
            raise PermissionDenied("System categories cannot be deleted.")
        instance.delete()


class AccountViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AccountSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Account.objects.filter(owner=self.request.user).select_related(
            "currency",
            "tax_profile",
            "deposit_profile",
        )
        status_param = self.request.query_params.get("status")
        kind = self.request.query_params.get("kind")
        if status_param:
            queryset = queryset.filter(status=status_param)
        if kind:
            queryset = queryset.filter(kind=kind)
        return queryset.order_by("name")

    @action(detail=True, methods=["post"], url_path="create-tax-transactions")
    def create_tax_transactions(self, request, pk=None):
        account = self.get_object()
        serializer = TaxObligationTransactionCreateSerializer(
            data=request.data,
            context={
                "request": request,
                "account": account,
            },
        )
        serializer.is_valid(raise_exception=True)
        result = serializer.save()
        return Response(
            {
                "obligation": result["obligation"],
                "transactions": TransactionSerializer(
                    result["transactions"],
                    many=True,
                    context={"request": request},
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )


class AccountTaxProfileViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AccountTaxProfileSerializer
    pagination_class = None

    def get_queryset(self):
        return AccountTaxProfile.objects.filter(account__owner=self.request.user).select_related(
            "account",
            "account__currency",
        ).order_by("account__name")


class CryptoNetworkViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CryptoNetworkSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = CryptoNetwork.objects.filter(
            Q(is_system=True) | Q(owner=self.request.user)
        ).order_by("name")
        scope = self.request.query_params.get("scope")
        if scope == "custom":
            queryset = queryset.filter(owner=self.request.user)
        elif scope == "system":
            queryset = queryset.filter(is_system=True)
        return queryset

    def perform_destroy(self, instance):
        if instance.is_system:
            raise PermissionDenied("System crypto networks cannot be deleted.")
        instance.delete()


class CryptoAssetViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CryptoAssetSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = CryptoAsset.objects.filter(
            Q(is_system=True) | Q(owner=self.request.user)
        ).order_by("symbol")
        scope = self.request.query_params.get("scope")
        asset_type = self.request.query_params.get("asset_type")
        if scope == "custom":
            queryset = queryset.filter(owner=self.request.user)
        elif scope == "system":
            queryset = queryset.filter(is_system=True)
        if asset_type:
            queryset = queryset.filter(asset_type=asset_type)
        return queryset

    def perform_destroy(self, instance):
        if instance.is_system:
            raise PermissionDenied("System crypto assets cannot be deleted.")
        instance.delete()


class CryptoAssetNetworkViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CryptoAssetNetworkSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = CryptoAssetNetwork.objects.select_related("asset", "network").filter(
            Q(asset__is_system=True) | Q(asset__owner=self.request.user)
        ).order_by("asset__symbol", "sort_order", "network__name")
        asset_id = self.request.query_params.get("asset")
        network_id = self.request.query_params.get("network")
        if asset_id:
            queryset = queryset.filter(asset_id=asset_id)
        if network_id:
            queryset = queryset.filter(network_id=network_id)
        return queryset


class CryptoWalletViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CryptoWalletSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = CryptoWallet.objects.filter(owner=self.request.user).select_related("network")
        network_id = self.request.query_params.get("network")
        wallet_type = self.request.query_params.get("wallet_type")
        if network_id:
            queryset = queryset.filter(network_id=network_id)
        if wallet_type:
            queryset = queryset.filter(wallet_type=wallet_type)
        return queryset.order_by("name")


class CryptoHoldingViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CryptoHoldingSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = CryptoHolding.objects.filter(wallet__owner=self.request.user).select_related(
            "wallet",
            "wallet__network",
            "asset",
            "asset_network",
            "asset_network__network",
            "price_currency",
        )
        wallet_id = self.request.query_params.get("wallet")
        asset_id = self.request.query_params.get("asset")
        if wallet_id:
            queryset = queryset.filter(wallet_id=wallet_id)
        if asset_id:
            queryset = queryset.filter(asset_id=asset_id)
        return queryset.order_by("wallet__name", "asset__symbol")


class TransactionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Transaction.objects.filter(owner=self.request.user).select_related(
            "account",
            "destination_account",
            "category",
        )
        account_id = self.request.query_params.get("account")
        category_id = self.request.query_params.get("category")
        transaction_type = self.request.query_params.get("type")
        status_param = self.request.query_params.get("status")
        date_from = self.request.query_params.get("date_from")
        date_to = self.request.query_params.get("date_to")

        if account_id:
            queryset = queryset.filter(Q(account_id=account_id) | Q(destination_account_id=account_id))
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        if transaction_type:
            queryset = queryset.filter(type=transaction_type)
        if status_param:
            queryset = queryset.filter(status=status_param)
        if date_from:
            queryset = queryset.filter(occurred_on__gte=date_from)
        if date_to:
            queryset = queryset.filter(occurred_on__lte=date_to)
        return queryset.order_by("-occurred_on", "-created_at")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        delete_transaction(transaction_obj=instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class TransactionTemplateViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionTemplateSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = TransactionTemplate.objects.filter(owner=self.request.user).select_related(
            "account",
            "destination_account",
            "category",
        )
        active = self.request.query_params.get("active")
        template_type = self.request.query_params.get("type")

        if active == "true":
            queryset = queryset.filter(is_active=True)
        elif active == "false":
            queryset = queryset.filter(is_active=False)
        if template_type:
            queryset = queryset.filter(type=template_type)
        return queryset.order_by("sort_order", "name")


class BudgetViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BudgetSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Budget.objects.filter(owner=self.request.user).select_related("category", "currency")
        active = self.request.query_params.get("active")
        if active == "true":
            queryset = queryset.filter(is_active=True)
        elif active == "false":
            queryset = queryset.filter(is_active=False)
        return queryset.order_by("-start_date", "category__name")
