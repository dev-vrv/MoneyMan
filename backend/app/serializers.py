from __future__ import annotations

from decimal import Decimal

from django.db.models import Q
from rest_framework import serializers

from .models import Account, Budget, Category, Currency, ExchangeRate, Transaction
from .services import category_queryset_for_user, create_transaction, refresh_budget_spent_amount, update_transaction


class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = (
            "code",
            "name",
            "symbol",
            "numeric_code",
            "decimal_places",
            "is_active",
            "is_default",
        )


class ExchangeRateSerializer(serializers.ModelSerializer):
    base_currency = CurrencySerializer(read_only=True)
    quote_currency = CurrencySerializer(read_only=True)

    class Meta:
        model = ExchangeRate
        fields = (
            "id",
            "base_currency",
            "quote_currency",
            "rate",
            "rate_date",
            "source",
            "is_active",
            "created_at",
            "updated_at",
        )


class CategorySerializer(serializers.ModelSerializer):
    parent_name = serializers.CharField(source="parent.name", read_only=True)
    is_editable = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = (
            "id",
            "parent",
            "parent_name",
            "kind",
            "name",
            "slug",
            "description",
            "icon",
            "color",
            "sort_order",
            "is_system",
            "is_active",
            "is_editable",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("is_system",)

    def get_is_editable(self, obj):
        return not obj.is_system

    def validate_parent(self, value):
        if not value:
            return value

        request = self.context["request"]
        if not value.is_system and value.owner_id != request.user.id:
            raise serializers.ValidationError("Parent category is not available for this user.")
        return value

    def validate_slug(self, value):
        return value.strip().lower()

    def validate(self, attrs):
        request = self.context["request"]
        kind = attrs.get("kind", getattr(self.instance, "kind", None))
        parent = attrs.get("parent", getattr(self.instance, "parent", None))

        if parent and kind and parent.kind != kind:
            raise serializers.ValidationError({"parent": "Parent category must use the same kind."})

        slug = attrs.get("slug", getattr(self.instance, "slug", None))
        if slug and kind:
            qs = Category.objects.filter(owner=request.user, kind=kind, slug=slug)
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError({"slug": "Category slug must be unique per type."})
        return attrs

    def create(self, validated_data):
        return Category.objects.create(owner=self.context["request"].user, **validated_data)

    def update(self, instance, validated_data):
        if instance.is_system:
            raise serializers.ValidationError("System categories cannot be modified.")
        return super().update(instance, validated_data)


class AccountSerializer(serializers.ModelSerializer):
    currency = serializers.SlugRelatedField(slug_field="code", queryset=Currency.objects.filter(is_active=True))
    available_credit = serializers.SerializerMethodField()
    current_balance = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)

    class Meta:
        model = Account
        fields = (
            "id",
            "currency",
            "name",
            "kind",
            "status",
            "institution",
            "account_number_mask",
            "iban",
            "note",
            "color",
            "include_in_net_worth",
            "opening_balance",
            "current_balance",
            "credit_limit",
            "available_credit",
            "created_at",
            "updated_at",
        )

    def get_available_credit(self, obj):
        if obj.kind != Account.AccountKind.CREDIT_CARD:
            return None
        return f"{(obj.credit_limit + obj.current_balance):.2f}"

    def create(self, validated_data):
        validated_data["current_balance"] = validated_data.get("opening_balance", Decimal("0.00"))
        return Account.objects.create(owner=self.context["request"].user, **validated_data)


class TransactionSerializer(serializers.ModelSerializer):
    account = serializers.PrimaryKeyRelatedField(queryset=Account.objects.none())
    destination_account = serializers.PrimaryKeyRelatedField(
        queryset=Account.objects.none(),
        required=False,
        allow_null=True,
    )
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.none(),
        required=False,
        allow_null=True,
    )
    currency = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = (
            "id",
            "account",
            "destination_account",
            "category",
            "type",
            "status",
            "amount",
            "destination_amount",
            "exchange_rate",
            "title",
            "merchant",
            "counterparty",
            "description",
            "occurred_on",
            "posted_at",
            "cleared_at",
            "external_reference",
            "idempotency_key",
            "currency",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("posted_at", "cleared_at")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        if request:
            self.fields["account"].queryset = Account.objects.filter(owner=request.user)
            self.fields["destination_account"].queryset = Account.objects.filter(owner=request.user)
            self.fields["category"].queryset = category_queryset_for_user(request.user)

    def get_currency(self, obj):
        return obj.account.currency_id

    def validate(self, attrs):
        request = self.context["request"]
        transaction_type = attrs.get("type", getattr(self.instance, "type", None))
        account = attrs.get("account", getattr(self.instance, "account", None))
        destination_account = attrs.get(
            "destination_account",
            getattr(self.instance, "destination_account", None),
        )
        category = attrs.get("category", getattr(self.instance, "category", None))
        amount = attrs.get("amount", getattr(self.instance, "amount", None))
        destination_amount = attrs.get(
            "destination_amount",
            getattr(self.instance, "destination_amount", None),
        )
        exchange_rate = attrs.get("exchange_rate", getattr(self.instance, "exchange_rate", None))

        if not account or account.owner_id != request.user.id:
            raise serializers.ValidationError({"account": "Account is not available for this user."})

        if category:
            category_allowed = category.is_system or category.owner_id == request.user.id
            if not category_allowed:
                raise serializers.ValidationError({"category": "Category is not available for this user."})
            if transaction_type and category.kind != transaction_type:
                raise serializers.ValidationError({"category": "Category type must match transaction type."})

        if transaction_type == Transaction.TransactionType.TRANSFER:
            if category:
                raise serializers.ValidationError({"category": "Transfer should not use income or expense category."})
            if not destination_account:
                raise serializers.ValidationError({"destination_account": "Transfer requires a destination account."})
            if destination_account.owner_id != request.user.id:
                raise serializers.ValidationError({"destination_account": "Destination account is not available for this user."})
            if destination_account.id == account.id:
                raise serializers.ValidationError({"destination_account": "Source and destination accounts must differ."})
            if account.currency_id != destination_account.currency_id and not destination_amount:
                raise serializers.ValidationError(
                    {"destination_amount": "Transfer between different currencies requires destination amount."}
                )
            if destination_amount and not exchange_rate and amount:
                attrs["exchange_rate"] = destination_amount / amount
        else:
            attrs["destination_account"] = None
            attrs["destination_amount"] = None
            attrs["exchange_rate"] = None
            if not category:
                raise serializers.ValidationError({"category": "Category is required for income and expense."})

        return attrs

    def create(self, validated_data):
        return create_transaction(user=self.context["request"].user, validated_data=validated_data)

    def update(self, instance, validated_data):
        return update_transaction(transaction_obj=instance, validated_data=validated_data)


class BudgetSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.none())
    currency = serializers.SlugRelatedField(slug_field="code", queryset=Currency.objects.filter(is_active=True))
    utilization_percent = serializers.SerializerMethodField()

    class Meta:
        model = Budget
        fields = (
            "id",
            "category",
            "currency",
            "period",
            "amount",
            "spent_amount",
            "utilization_percent",
            "start_date",
            "end_date",
            "alert_threshold",
            "rollover_enabled",
            "is_active",
            "note",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("spent_amount",)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        if request:
            self.fields["category"].queryset = Category.objects.filter(
                Q(owner=request.user) | Q(is_system=True),
                kind=Category.CategoryKind.EXPENSE,
            )

    def get_utilization_percent(self, obj):
        if not obj.amount:
            return 0
        return round((obj.spent_amount / obj.amount) * 100, 2)

    def validate(self, attrs):
        start_date = attrs.get("start_date", getattr(self.instance, "start_date", None))
        end_date = attrs.get("end_date", getattr(self.instance, "end_date", None))
        category = attrs.get("category", getattr(self.instance, "category", None))
        currency = attrs.get("currency", getattr(self.instance, "currency", None))

        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError({"end_date": "End date must be greater than or equal to start date."})
        if category and category.kind != Category.CategoryKind.EXPENSE:
            raise serializers.ValidationError({"category": "Budget category must be an expense category."})
        if category and not (category.is_system or category.owner_id == self.context["request"].user.id):
            raise serializers.ValidationError({"category": "Category is not available for this user."})
        if currency and not currency.is_active:
            raise serializers.ValidationError({"currency": "Currency must be active."})
        return attrs

    def create(self, validated_data):
        budget = Budget.objects.create(owner=self.context["request"].user, **validated_data)
        return refresh_budget_spent_amount(budget=budget)

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        return refresh_budget_spent_amount(budget=instance)
