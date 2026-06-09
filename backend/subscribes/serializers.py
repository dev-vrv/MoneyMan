from rest_framework import serializers

from app.serializers import get_request_locale

from .models import SubscriptionPlan, UserSubscription


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    duration_label = serializers.SerializerMethodField()
    currency = serializers.SerializerMethodField()
    features = serializers.SerializerMethodField()

    class Meta:
        model = SubscriptionPlan
        fields = (
            "id",
            "code",
            "name",
            "description",
            "duration_value",
            "duration_unit",
            "duration_label",
            "billing_mode",
            "price_usd",
            "currency",
            "trial_days",
            "grace_period_days",
            "is_highlighted",
            "features",
        )

    def get_currency(self, obj):
        return "USD"

    def get_features(self, obj):
        return [feature.title for feature in obj.features.all() if feature.is_active]

    def get_duration_label(self, obj):
        locale = get_request_locale(self.context.get("request"))
        unit_map = {
            "ru": {
                "day": ("день", "дня", "дней"),
                "month": ("месяц", "месяца", "месяцев"),
                "year": ("год", "года", "лет"),
            },
            "kg": {
                "day": ("күн", "күн", "күн"),
                "month": ("ай", "ай", "ай"),
                "year": ("жыл", "жыл", "жыл"),
            },
            "en": {
                "day": ("day", "days", "days"),
                "month": ("month", "months", "months"),
                "year": ("year", "years", "years"),
            },
        }
        variants = unit_map.get(locale, unit_map["en"]).get(obj.duration_unit, unit_map["en"]["month"])
        value = obj.duration_value

        if locale == "ru":
            mod10 = value % 10
            mod100 = value % 100
            if mod10 == 1 and mod100 != 11:
                unit = variants[0]
            elif 2 <= mod10 <= 4 and not 12 <= mod100 <= 14:
                unit = variants[1]
            else:
                unit = variants[2]
        elif locale == "en":
            unit = variants[0] if value == 1 else variants[1]
        else:
            unit = variants[0]

        return f"{value} {unit}"


class UserSubscriptionSerializer(serializers.ModelSerializer):
    plan = SubscriptionPlanSerializer(read_only=True)

    class Meta:
        model = UserSubscription
        fields = (
            "id",
            "plan",
            "status",
            "started_at",
            "expires_at",
            "trial_ends_at",
            "next_billing_at",
            "last_payment_at",
            "canceled_at",
            "cancel_at_period_end",
            "auto_renew",
            "created_at",
            "updated_at",
        )
