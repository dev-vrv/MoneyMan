from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AccountViewSet,
    BudgetViewSet,
    CategoryViewSet,
    CurrencyViewSet,
    DashboardOverviewView,
    ExchangeRateViewSet,
    TransactionViewSet,
)

router = DefaultRouter()
router.register("currencies", CurrencyViewSet, basename="finance-currency")
router.register("exchange-rates", ExchangeRateViewSet, basename="finance-exchange-rate")
router.register("categories", CategoryViewSet, basename="finance-category")
router.register("accounts", AccountViewSet, basename="finance-account")
router.register("transactions", TransactionViewSet, basename="finance-transaction")
router.register("budgets", BudgetViewSet, basename="finance-budget")

urlpatterns = [
    path("dashboard/", DashboardOverviewView.as_view(), name="finance-dashboard"),
    path("", include(router.urls)),
]
