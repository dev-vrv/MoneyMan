from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from .models import PaymentOrder, PaymentTransaction
from .serializers import (
    PaymentOrderCreateSerializer,
    PaymentOrderSerializer,
    PaymentTransactionSerializer,
)


class PaymentOrderViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PaymentOrder.objects.filter(user=self.request.user).select_related("plan", "subscription")

    def get_serializer_class(self):
        if self.action == "create":
            return PaymentOrderCreateSerializer
        return PaymentOrderSerializer

    def perform_create(self, serializer):
        serializer.save()


class PaymentTransactionViewSet(ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentTransactionSerializer
    pagination_class = None

    def get_queryset(self):
        return PaymentTransaction.objects.filter(order__user=self.request.user).select_related("order")
