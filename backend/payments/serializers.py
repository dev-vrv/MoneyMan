from rest_framework import serializers

from subscribes.models import SubscriptionPlan

from .models import PaymentOrder, PaymentTransaction


class PaymentOrderSerializer(serializers.ModelSerializer):
    plan_code = serializers.CharField(source="plan.code", read_only=True)
    plan_name = serializers.CharField(source="plan.name", read_only=True)

    class Meta:
        model = PaymentOrder
        fields = (
            "id",
            "provider",
            "status",
            "amount",
            "currency",
            "description",
            "plan",
            "plan_code",
            "plan_name",
            "external_order_id",
            "provider_payment_id",
            "provider_session_id",
            "success_url",
            "fail_url",
            "provider_payload",
            "paid_at",
            "expires_at",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "provider",
            "status",
            "amount",
            "currency",
            "external_order_id",
            "provider_payment_id",
            "provider_session_id",
            "provider_payload",
            "paid_at",
            "created_at",
            "updated_at",
        )


class PaymentOrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentOrder
        fields = (
            "plan",
            "success_url",
            "fail_url",
        )

    def validate_plan(self, value: SubscriptionPlan) -> SubscriptionPlan:
        if not value.is_active or not value.is_public:
            raise serializers.ValidationError("Plan is not available for checkout.")
        return value

    def create(self, validated_data):
        request = self.context["request"]
        plan = validated_data["plan"]

        return PaymentOrder.objects.create(
            user=request.user,
            plan=plan,
            amount=plan.price_usd,
            currency=plan.price_currency,
            description=f"{plan.name} subscription checkout",
            success_url=validated_data.get("success_url", ""),
            fail_url=validated_data.get("fail_url", ""),
            provider_payload={
                "provider": PaymentOrder.Provider.FREEDOMPAY,
                "plan_code": plan.code,
                "billing_mode": plan.billing_mode,
            },
        )


class PaymentTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentTransaction
        fields = (
            "id",
            "order",
            "kind",
            "status",
            "amount",
            "currency",
            "provider_transaction_id",
            "provider_status",
            "processed_at",
            "created_at",
        )
