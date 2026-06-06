from __future__ import annotations

from datetime import date
from decimal import Decimal

from django.db.models import Q
from django.utils.dateparse import parse_date
from rest_framework import serializers

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
    Transaction,
)
from .services import (
    calculate_deposit_snapshot,
    category_queryset_for_user,
    create_transaction,
    refresh_budget_spent_amount,
    update_transaction,
)


def get_request_locale(request) -> str:
    if not request:
        return "ru"

    raw_locale = (
        request.headers.get("X-Locale")
        or request.query_params.get("locale")
        or getattr(request, "LANGUAGE_CODE", "")
        or "ru"
    )
    return raw_locale.split(",")[0].split("-")[0].strip().lower() or "ru"


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


class NotificationSerializer(serializers.ModelSerializer):
    is_read = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = (
            "id",
            "scope",
            "level",
            "title",
            "body",
            "action_label",
            "action_url",
            "is_active",
            "published_at",
            "expires_at",
            "is_read",
            "created_at",
            "updated_at",
        )

    def get_is_read(self, obj):
        receipts = getattr(obj, "user_receipts", None)
        if receipts is None:
            return False
        receipt = next(iter(receipts), None)
        return bool(receipt and receipt.read_at)


class CategorySerializer(serializers.ModelSerializer):
    parent_name = serializers.SerializerMethodField()
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

    def get_parent_name(self, obj):
        if not obj.parent:
            return None
        return obj.parent.get_localized_name(get_request_locale(self.context.get("request")))

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

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["name"] = instance.get_localized_name(
            get_request_locale(self.context.get("request"))
        )
        return representation


class AccountSerializer(serializers.ModelSerializer):
    currency = serializers.SlugRelatedField(slug_field="code", queryset=Currency.objects.filter(is_active=True))
    currency_name = serializers.CharField(source="currency.name", read_only=True)
    available_credit = serializers.SerializerMethodField()
    current_balance = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)
    tax_profile = serializers.SerializerMethodField()
    deposit_profile = serializers.SerializerMethodField()

    class Meta:
        model = Account
        fields = (
            "id",
            "currency",
            "currency_name",
            "name",
            "kind",
            "status",
            "institution",
            "account_number_mask",
            "iban",
            "note",
            "icon",
            "color",
            "include_in_net_worth",
            "opening_balance",
            "current_balance",
            "credit_limit",
            "available_credit",
            "tax_profile",
            "deposit_profile",
            "created_at",
            "updated_at",
        )

    def get_available_credit(self, obj):
        if obj.kind != Account.AccountKind.CREDIT_CARD:
            return None
        return f"{(obj.credit_limit + obj.current_balance):.2f}"

    def create(self, validated_data):
        deposit_profile_payload = self.initial_data.get("deposit_profile")
        tax_profile_payload = self.initial_data.get("tax_profile")
        validated_data["current_balance"] = validated_data.get("opening_balance", Decimal("0.00"))
        account = Account.objects.create(owner=self.context["request"].user, **validated_data)
        if account.kind == Account.AccountKind.DEPOSIT:
            self._upsert_deposit_profile(account=account, payload=deposit_profile_payload)
        if account.kind in {Account.AccountKind.ENTREPRENEUR, Account.AccountKind.COMPANY}:
            self._upsert_tax_profile(account=account, payload=tax_profile_payload)
        return account

    def update(self, instance, validated_data):
        deposit_profile_payload = self.initial_data.get("deposit_profile")
        tax_profile_payload = self.initial_data.get("tax_profile")
        instance = super().update(instance, validated_data)
        if instance.kind == Account.AccountKind.DEPOSIT:
            if deposit_profile_payload is not None:
                self._upsert_deposit_profile(account=instance, payload=deposit_profile_payload)
        elif hasattr(instance, "deposit_profile"):
            instance.deposit_profile.delete()
        if instance.kind in {Account.AccountKind.ENTREPRENEUR, Account.AccountKind.COMPANY}:
            if tax_profile_payload is not None:
                self._upsert_tax_profile(account=instance, payload=tax_profile_payload)
        elif hasattr(instance, "tax_profile"):
            instance.tax_profile.delete()
        return instance

    def get_tax_profile(self, obj):
        tax_profile = getattr(obj, "tax_profile", None)
        if not tax_profile:
            return None

        return {
            "id": tax_profile.id,
            "entity_type": tax_profile.entity_type,
            "template_code": tax_profile.template_code,
            "calculation_source": tax_profile.calculation_source,
            "reporting_period": tax_profile.reporting_period,
            "due_day": tax_profile.due_day,
            "tax_rate": f"{tax_profile.tax_rate:.4f}",
            "social_fund_rate": f"{tax_profile.social_fund_rate:.4f}",
            "manual_tax_base": f"{tax_profile.manual_tax_base:.2f}" if tax_profile.manual_tax_base is not None else None,
            "manual_tax_amount": f"{tax_profile.manual_tax_amount:.2f}" if tax_profile.manual_tax_amount is not None else None,
            "manual_social_fund_amount": (
                f"{tax_profile.manual_social_fund_amount:.2f}"
                if tax_profile.manual_social_fund_amount is not None
                else None
            ),
            "note": tax_profile.note,
            "is_active": tax_profile.is_active,
        }

    def get_deposit_profile(self, obj):
        deposit_profile = getattr(obj, "deposit_profile", None)
        if not deposit_profile or obj.kind != Account.AccountKind.DEPOSIT:
            return None

        snapshot = calculate_deposit_snapshot(account=obj, profile=deposit_profile)
        return {
            "id": deposit_profile.id,
            "annual_interest_rate": f"{deposit_profile.annual_interest_rate:.4f}",
            "interest_payout_frequency": deposit_profile.interest_payout_frequency,
            "day_count_convention": deposit_profile.day_count_convention,
            "term_start_date": deposit_profile.term_start_date.isoformat(),
            "maturity_date": deposit_profile.maturity_date.isoformat() if deposit_profile.maturity_date else None,
            "capitalization_enabled": deposit_profile.capitalization_enabled,
            "auto_renewal": deposit_profile.auto_renewal,
            "allow_top_up": deposit_profile.allow_top_up,
            "allow_partial_withdrawal": deposit_profile.allow_partial_withdrawal,
            "minimum_balance": f"{deposit_profile.minimum_balance:.2f}",
            "note": deposit_profile.note,
            "is_active": deposit_profile.is_active,
            **snapshot,
        }

    def validate(self, attrs):
        attrs = super().validate(attrs)
        kind = attrs.get("kind", getattr(self.instance, "kind", None))
        deposit_profile_payload = self.initial_data.get("deposit_profile")
        tax_profile_payload = self.initial_data.get("tax_profile")

        if kind == Account.AccountKind.DEPOSIT and not deposit_profile_payload and not getattr(self.instance, "deposit_profile", None):
            raise serializers.ValidationError({"deposit_profile": "Deposit account requires a deposit profile."})
        if (
            kind in {Account.AccountKind.ENTREPRENEUR, Account.AccountKind.COMPANY}
            and not tax_profile_payload
            and not getattr(self.instance, "tax_profile", None)
        ):
            raise serializers.ValidationError({"tax_profile": "Business account requires a tax profile with a tax rate."})

        return attrs

    def _upsert_deposit_profile(self, *, account: Account, payload):
        if not isinstance(payload, dict):
            raise serializers.ValidationError({"deposit_profile": "Deposit profile payload must be an object."})

        annual_interest_rate = Decimal(str(payload.get("annual_interest_rate", "0")))
        minimum_balance = Decimal(str(payload.get("minimum_balance", "0")))
        term_start_date = self._parse_profile_date(
            payload.get("term_start_date"),
            field_name="term_start_date",
        )
        maturity_date = self._parse_profile_date(
            payload.get("maturity_date"),
            field_name="maturity_date",
            allow_blank=True,
        )

        if not term_start_date:
            raise serializers.ValidationError({"deposit_profile": "term_start_date is required."})
        if maturity_date and maturity_date < term_start_date:
            raise serializers.ValidationError({"deposit_profile": "maturity_date must be on or after term_start_date."})

        AccountDepositProfile.objects.update_or_create(
            account=account,
            defaults={
                "annual_interest_rate": annual_interest_rate,
                "interest_payout_frequency": payload.get(
                    "interest_payout_frequency",
                    AccountDepositProfile.InterestPayoutFrequency.MONTHLY,
                ),
                "day_count_convention": payload.get(
                    "day_count_convention",
                    AccountDepositProfile.DayCountConvention.ACTUAL_365,
                ),
                "term_start_date": term_start_date,
                "maturity_date": maturity_date,
                "capitalization_enabled": bool(payload.get("capitalization_enabled", False)),
                "auto_renewal": bool(payload.get("auto_renewal", False)),
                "allow_top_up": bool(payload.get("allow_top_up", True)),
                "allow_partial_withdrawal": bool(payload.get("allow_partial_withdrawal", False)),
                "minimum_balance": minimum_balance,
                "note": payload.get("note", ""),
                "is_active": bool(payload.get("is_active", True)),
            },
        )

    def _parse_profile_date(self, value, *, field_name: str, allow_blank: bool = False) -> date | None:
        if value in (None, ""):
            return None if allow_blank else None
        if isinstance(value, date):
            return value

        parsed_value = parse_date(str(value))
        if parsed_value is None:
            raise serializers.ValidationError(
                {"deposit_profile": f"{field_name} must be a valid ISO date."}
            )
        return parsed_value

    def _upsert_tax_profile(self, *, account: Account, payload):
        if not isinstance(payload, dict):
            raise serializers.ValidationError({"tax_profile": "Tax profile payload must be an object."})

        tax_rate_value = payload.get("tax_rate")
        if tax_rate_value in (None, ""):
            raise serializers.ValidationError({"tax_profile": "tax_rate is required for business accounts."})

        calculation_source = payload.get(
            "calculation_source",
            AccountTaxProfile.CalculationSource.TRANSACTIONS,
        )
        manual_tax_base = payload.get("manual_tax_base")
        manual_tax_amount = payload.get("manual_tax_amount")
        manual_social_fund_amount = payload.get("manual_social_fund_amount")

        entity_type = (
            AccountTaxProfile.EntityType.ENTREPRENEUR
            if account.kind == Account.AccountKind.ENTREPRENEUR
            else AccountTaxProfile.EntityType.COMPANY
        )
        default_template = (
            AccountTaxProfile.TemplateCode.KG_IP_SIMPLIFIED_4
            if entity_type == AccountTaxProfile.EntityType.ENTREPRENEUR
            else AccountTaxProfile.TemplateCode.CUSTOM
        )

        if calculation_source == AccountTaxProfile.CalculationSource.MANUAL and not manual_tax_base and not manual_tax_amount:
            raise serializers.ValidationError({"tax_profile": "Manual mode requires tax base or tax amount."})

        AccountTaxProfile.objects.update_or_create(
            account=account,
            defaults={
                "entity_type": entity_type,
                "template_code": payload.get("template_code", default_template),
                "calculation_source": calculation_source,
                "reporting_period": AccountTaxProfile.ReportingPeriod.QUARTERLY,
                "due_day": 20,
                "tax_rate": Decimal(str(tax_rate_value)),
                "social_fund_rate": Decimal(str(payload.get("social_fund_rate", "0") or "0")),
                "manual_tax_base": Decimal(str(manual_tax_base)) if manual_tax_base not in (None, "") else None,
                "manual_tax_amount": Decimal(str(manual_tax_amount)) if manual_tax_amount not in (None, "") else None,
                "manual_social_fund_amount": (
                    Decimal(str(manual_social_fund_amount))
                    if manual_social_fund_amount not in (None, "")
                    else None
                ),
                "note": payload.get("note", ""),
                "is_active": bool(payload.get("is_active", True)),
            },
        )


class AccountTaxProfileSerializer(serializers.ModelSerializer):
    account_name = serializers.CharField(source="account.name", read_only=True)
    currency = serializers.CharField(source="account.currency_id", read_only=True)

    class Meta:
        model = AccountTaxProfile
        fields = (
            "id",
            "account",
            "account_name",
            "currency",
            "entity_type",
            "template_code",
            "calculation_source",
            "reporting_period",
            "due_day",
            "tax_rate",
            "social_fund_rate",
            "manual_tax_base",
            "manual_tax_amount",
            "manual_social_fund_amount",
            "note",
            "is_active",
            "created_at",
            "updated_at",
        )

    def validate_account(self, value):
        if value.owner_id != self.context["request"].user.id:
            raise serializers.ValidationError("Account is not available for this user.")
        return value

    def validate(self, attrs):
        account = attrs.get("account", getattr(self.instance, "account", None))
        entity_type = attrs.get("entity_type", getattr(self.instance, "entity_type", None))
        calculation_source = attrs.get(
            "calculation_source",
            getattr(self.instance, "calculation_source", None),
        )

        if account and entity_type == AccountTaxProfile.EntityType.ENTREPRENEUR and account.kind != Account.AccountKind.ENTREPRENEUR:
            raise serializers.ValidationError({"account": "Tax profile for IP requires an entrepreneur account."})

        if account and entity_type == AccountTaxProfile.EntityType.COMPANY and account.kind != Account.AccountKind.COMPANY:
            raise serializers.ValidationError({"account": "Tax profile for OsOO requires a company account."})

        if calculation_source == AccountTaxProfile.CalculationSource.MANUAL and not attrs.get(
            "manual_tax_base",
            getattr(self.instance, "manual_tax_base", None),
        ) and not attrs.get(
            "manual_tax_amount",
            getattr(self.instance, "manual_tax_amount", None),
        ):
            raise serializers.ValidationError(
                {"manual_tax_base": "Manual mode requires tax base or tax amount."}
            )
        return attrs


class CryptoNetworkSerializer(serializers.ModelSerializer):
    is_editable = serializers.SerializerMethodField()

    class Meta:
        model = CryptoNetwork
        fields = (
            "id",
            "name",
            "code",
            "chain_id",
            "protocol",
            "native_symbol",
            "icon",
            "color",
            "explorer_url",
            "is_evm",
            "is_system",
            "is_active",
            "is_editable",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("is_system",)

    def get_is_editable(self, obj):
        return not obj.is_system

    def validate_code(self, value):
        return value.strip().lower()

    def create(self, validated_data):
        return CryptoNetwork.objects.create(owner=self.context["request"].user, **validated_data)

    def update(self, instance, validated_data):
        if instance.is_system:
            raise serializers.ValidationError("System crypto networks cannot be modified.")
        return super().update(instance, validated_data)


class CryptoAssetSerializer(serializers.ModelSerializer):
    is_editable = serializers.SerializerMethodField()

    class Meta:
        model = CryptoAsset
        fields = (
            "id",
            "symbol",
            "name",
            "slug",
            "asset_type",
            "decimals",
            "icon",
            "color",
            "coingecko_id",
            "cmc_slug",
            "description",
            "is_system",
            "is_active",
            "is_editable",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("is_system",)

    def get_is_editable(self, obj):
        return not obj.is_system

    def validate_symbol(self, value):
        return value.strip().upper()

    def validate_slug(self, value):
        return value.strip().lower()

    def validate(self, attrs):
        request = self.context["request"]
        symbol = attrs.get("symbol", getattr(self.instance, "symbol", None))
        slug = attrs.get("slug", getattr(self.instance, "slug", None))

        if symbol:
            qs = CryptoAsset.objects.filter(owner=request.user, symbol=symbol)
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError({"symbol": "Crypto asset symbol must be unique for the user."})

        if slug:
            qs = CryptoAsset.objects.filter(owner=request.user, slug=slug)
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError({"slug": "Crypto asset slug must be unique for the user."})
        return attrs

    def create(self, validated_data):
        return CryptoAsset.objects.create(owner=self.context["request"].user, **validated_data)

    def update(self, instance, validated_data):
        if instance.is_system:
            raise serializers.ValidationError("System crypto assets cannot be modified.")
        return super().update(instance, validated_data)


class CryptoAssetNetworkSerializer(serializers.ModelSerializer):
    asset_symbol = serializers.CharField(source="asset.symbol", read_only=True)
    network_code = serializers.CharField(source="network.code", read_only=True)

    class Meta:
        model = CryptoAssetNetwork
        fields = (
            "id",
            "asset",
            "asset_symbol",
            "network",
            "network_code",
            "contract_address",
            "token_standard",
            "decimals_override",
            "is_native",
            "deposit_enabled",
            "withdrawal_enabled",
            "sort_order",
            "is_active",
            "created_at",
            "updated_at",
        )

    def validate(self, attrs):
        request = self.context["request"]
        asset = attrs.get("asset", getattr(self.instance, "asset", None))
        network = attrs.get("network", getattr(self.instance, "network", None))

        if asset and not asset.is_system and asset.owner_id != request.user.id:
            raise serializers.ValidationError({"asset": "Crypto asset is not available for this user."})
        if network and not network.is_system and network.owner_id != request.user.id:
            raise serializers.ValidationError({"network": "Crypto network is not available for this user."})
        return attrs


class CryptoWalletSerializer(serializers.ModelSerializer):
    network_name = serializers.CharField(source="network.name", read_only=True)

    class Meta:
        model = CryptoWallet
        fields = (
            "id",
            "network",
            "network_name",
            "name",
            "wallet_type",
            "provider",
            "address",
            "address_label",
            "xpub",
            "note",
            "color",
            "is_active",
            "is_watch_only",
            "last_synced_at",
            "sync_status",
            "last_sync_error",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("last_synced_at", "sync_status", "last_sync_error")

    def validate_network(self, value):
        request = self.context["request"]
        if not value.is_system and value.owner_id != request.user.id:
            raise serializers.ValidationError("Crypto network is not available for this user.")
        return value

    def create(self, validated_data):
        return CryptoWallet.objects.create(owner=self.context["request"].user, **validated_data)


class CryptoHoldingSerializer(serializers.ModelSerializer):
    wallet_name = serializers.CharField(source="wallet.name", read_only=True)
    asset_symbol = serializers.CharField(source="asset.symbol", read_only=True)
    network_code = serializers.SerializerMethodField()
    price_currency = serializers.SlugRelatedField(
        slug_field="code",
        queryset=Currency.objects.filter(is_active=True),
        allow_null=True,
        required=False,
    )

    class Meta:
        model = CryptoHolding
        fields = (
            "id",
            "wallet",
            "wallet_name",
            "asset",
            "asset_symbol",
            "asset_network",
            "network_code",
            "wallet_address",
            "balance",
            "available_balance",
            "locked_balance",
            "average_cost",
            "cost_basis",
            "last_price",
            "price_currency",
            "last_synced_at",
            "is_tracked",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("last_synced_at",)

    def get_network_code(self, obj):
        if obj.asset_network_id:
            return obj.asset_network.network.code
        return obj.wallet.network.code

    def validate(self, attrs):
        request = self.context["request"]
        wallet = attrs.get("wallet", getattr(self.instance, "wallet", None))
        asset = attrs.get("asset", getattr(self.instance, "asset", None))
        asset_network = attrs.get("asset_network", getattr(self.instance, "asset_network", None))

        if wallet and wallet.owner_id != request.user.id:
            raise serializers.ValidationError({"wallet": "Crypto wallet is not available for this user."})
        if asset and not asset.is_system and asset.owner_id != request.user.id:
            raise serializers.ValidationError({"asset": "Crypto asset is not available for this user."})
        if asset_network:
            if asset and asset_network.asset_id != asset.id:
                raise serializers.ValidationError({"asset_network": "Asset network must belong to the selected asset."})
            if wallet and asset_network.network_id != wallet.network_id:
                raise serializers.ValidationError({"asset_network": "Asset network must match wallet network."})
        return attrs


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
    account_name = serializers.CharField(source="account.name", read_only=True)
    destination_account_name = serializers.CharField(source="destination_account.name", read_only=True)
    category_name = serializers.SerializerMethodField()

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
            "account_name",
            "destination_account_name",
            "category_name",
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

    def get_category_name(self, obj):
        if not obj.category:
            return None
        return obj.category.get_localized_name(get_request_locale(self.context.get("request")))

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

        self._validate_deposit_constraints(
            account=account,
            destination_account=destination_account,
            transaction_type=transaction_type,
            amount=amount or Decimal("0.00"),
            destination_amount=destination_amount,
        )

        return attrs

    def create(self, validated_data):
        return create_transaction(user=self.context["request"].user, validated_data=validated_data)

    def update(self, instance, validated_data):
        return update_transaction(transaction_obj=instance, validated_data=validated_data)

    def _validate_deposit_constraints(
        self,
        *,
        account: Account,
        destination_account: Account | None,
        transaction_type: str | None,
        amount: Decimal,
        destination_amount: Decimal | None,
    ) -> None:
        source_deposit = getattr(account, "deposit_profile", None)
        destination_deposit = getattr(destination_account, "deposit_profile", None) if destination_account else None

        if destination_deposit and transaction_type == Transaction.TransactionType.TRANSFER and not destination_deposit.allow_top_up:
            raise serializers.ValidationError(
                {"destination_account": "This deposit account does not allow top-ups."}
            )

        if source_deposit and transaction_type in {
            Transaction.TransactionType.EXPENSE,
            Transaction.TransactionType.TRANSFER,
        }:
            if not source_deposit.allow_partial_withdrawal:
                raise serializers.ValidationError(
                    {"account": "This deposit account does not allow withdrawals before maturity."}
                )

            outgoing_amount = amount
            remaining_balance = account.current_balance - outgoing_amount
            if remaining_balance < source_deposit.minimum_balance:
                raise serializers.ValidationError(
                    {"amount": "Withdrawal would violate the deposit minimum balance."}
                )

        if destination_deposit and transaction_type == Transaction.TransactionType.INCOME and not destination_deposit.allow_top_up:
            raise serializers.ValidationError(
                {"account": "This deposit account does not allow top-ups."}
            )


class BudgetSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.none())
    currency = serializers.SlugRelatedField(slug_field="code", queryset=Currency.objects.filter(is_active=True))
    category_name = serializers.SerializerMethodField()
    currency_name = serializers.CharField(source="currency.name", read_only=True)
    utilization_percent = serializers.SerializerMethodField()

    class Meta:
        model = Budget
        fields = (
            "id",
            "category",
            "category_name",
            "currency",
            "currency_name",
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

    def get_category_name(self, obj):
        return obj.category.get_localized_name(get_request_locale(self.context.get("request")))

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
