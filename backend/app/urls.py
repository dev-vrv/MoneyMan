from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AccountViewSet,
    AccountTaxProfileViewSet,
    BudgetViewSet,
    CategoryViewSet,
    CryptoAssetNetworkViewSet,
    CryptoAssetViewSet,
    CryptoHoldingViewSet,
    CryptoNetworkViewSet,
    CryptoWalletViewSet,
    CurrencyViewSet,
    DashboardOverviewView,
    ExchangeRateViewSet,
    MarketSnapshotView,
    NotificationViewSet,
    TransactionViewSet,
    TransactionTemplateViewSet,
)

router = DefaultRouter()
router.register("currencies", CurrencyViewSet, basename="finance-currency")
router.register("exchange-rates", ExchangeRateViewSet, basename="finance-exchange-rate")
router.register("notifications", NotificationViewSet, basename="finance-notification")
router.register("categories", CategoryViewSet, basename="finance-category")
router.register("accounts", AccountViewSet, basename="finance-account")
router.register("account-tax-profiles", AccountTaxProfileViewSet, basename="finance-account-tax-profile")
router.register("crypto-networks", CryptoNetworkViewSet, basename="finance-crypto-network")
router.register("crypto-assets", CryptoAssetViewSet, basename="finance-crypto-asset")
router.register("crypto-asset-networks", CryptoAssetNetworkViewSet, basename="finance-crypto-asset-network")
router.register("crypto-wallets", CryptoWalletViewSet, basename="finance-crypto-wallet")
router.register("crypto-holdings", CryptoHoldingViewSet, basename="finance-crypto-holding")
router.register("transactions", TransactionViewSet, basename="finance-transaction")
router.register("transaction-templates", TransactionTemplateViewSet, basename="finance-transaction-template")
router.register("budgets", BudgetViewSet, basename="finance-budget")

urlpatterns = [
    path("dashboard/", DashboardOverviewView.as_view(), name="finance-dashboard"),
    path("market-snapshot/", MarketSnapshotView.as_view(), name="finance-market-snapshot"),
    path("", include(router.urls)),
]
