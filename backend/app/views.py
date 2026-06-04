from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Account, Budget, Currency, ExchangeRate, Transaction
from .serializers import (
    AccountSerializer,
    BudgetSerializer,
    CategorySerializer,
    CurrencySerializer,
    ExchangeRateSerializer,
    TransactionSerializer,
)
from .services import build_dashboard_overview, category_queryset_for_user, delete_transaction


class DashboardOverviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response(build_dashboard_overview(user=request.user))


class CurrencyViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CurrencySerializer
    queryset = Currency.objects.filter(is_active=True).order_by("code")


class ExchangeRateViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ExchangeRateSerializer

    def get_queryset(self):
        queryset = ExchangeRate.objects.filter(is_active=True).select_related(
            "base_currency", "quote_currency"
        )
        base_currency = self.request.query_params.get("base_currency")
        quote_currency = self.request.query_params.get("quote_currency")
        if base_currency:
            queryset = queryset.filter(base_currency_id=base_currency.upper())
        if quote_currency:
            queryset = queryset.filter(quote_currency_id=quote_currency.upper())
        return queryset


class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer

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

    def get_queryset(self):
        queryset = Account.objects.filter(owner=self.request.user).select_related("currency")
        status_param = self.request.query_params.get("status")
        kind = self.request.query_params.get("kind")
        if status_param:
            queryset = queryset.filter(status=status_param)
        if kind:
            queryset = queryset.filter(kind=kind)
        return queryset.order_by("name")


class TransactionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer

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


class BudgetViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BudgetSerializer

    def get_queryset(self):
        queryset = Budget.objects.filter(owner=self.request.user).select_related("category", "currency")
        active = self.request.query_params.get("active")
        if active == "true":
            queryset = queryset.filter(is_active=True)
        elif active == "false":
            queryset = queryset.filter(is_active=False)
        return queryset.order_by("-start_date", "category__name")
