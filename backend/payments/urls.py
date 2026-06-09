from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import PaymentOrderViewSet, PaymentTransactionViewSet

router = DefaultRouter()
router.register("orders", PaymentOrderViewSet, basename="payment-order")
router.register("transactions", PaymentTransactionViewSet, basename="payment-transaction")

urlpatterns = [
    path("", include(router.urls)),
]
