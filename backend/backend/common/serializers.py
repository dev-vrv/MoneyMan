from django.contrib.auth import authenticate, get_user_model, password_validation
from django.core.exceptions import ObjectDoesNotExist
from django.db import DatabaseError
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .services import create_user_with_workspace, normalize_email

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    phone = serializers.SerializerMethodField()
    display_name = serializers.SerializerMethodField()
    cash_flow_chart_default = serializers.SerializerMethodField()
    default_currency = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "phone",
            "two_factor_enabled",
            "display_name",
            "cash_flow_chart_default",
            "default_currency",
        )

    def get_display_name(self, obj):
        return obj.get_full_name() or obj.first_name or obj.email

    def get_phone(self, obj):
        if obj.phone:
            return obj.phone

        try:
            return obj.profile.phone
        except (ObjectDoesNotExist, DatabaseError):
            return ""

    def get_cash_flow_chart_default(self, obj):
        try:
            return obj.profile.cash_flow_chart_default
        except (ObjectDoesNotExist, DatabaseError):
            return "bars"

    def get_default_currency(self, obj):
        try:
            return obj.profile.default_currency
        except (ObjectDoesNotExist, DatabaseError):
            return "USD"


class UserUpdateSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(max_length=32, required=False, allow_blank=True)
    cash_flow_chart_default = serializers.ChoiceField(
        choices=("bars", "line", "tradingview", "candles", "structure"),
        required=False,
    )
    default_currency = serializers.CharField(
        max_length=8,
        required=False,
    )

    class Meta:
        model = User
        fields = ("email", "first_name", "last_name", "phone", "two_factor_enabled", "cash_flow_chart_default", "default_currency")

    def validate_email(self, value):
        normalized_email = normalize_email(value)
        queryset = User.objects.filter(email=normalized_email).exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return normalized_email

    def validate_phone(self, value):
        return value.strip()

    def validate_default_currency(self, value):
        return value.strip().upper()

    def update(self, instance, validated_data):
        phone = validated_data.pop("phone", instance.phone)
        cash_flow_chart_default = validated_data.pop("cash_flow_chart_default", None)
        default_currency = validated_data.pop("default_currency", None)

        for field, value in validated_data.items():
            setattr(instance, field, value)

        instance.phone = phone
        instance.username = instance.email
        instance.save(update_fields=["email", "first_name", "last_name", "phone", "two_factor_enabled", "username"])

        try:
            profile = instance.profile
        except (ObjectDoesNotExist, DatabaseError):
            profile = None

        if profile:
            update_fields = []
            if profile.phone != instance.phone:
                profile.phone = instance.phone
                update_fields.append("phone")
            if (
                cash_flow_chart_default is not None
                and profile.cash_flow_chart_default != cash_flow_chart_default
            ):
                profile.cash_flow_chart_default = cash_flow_chart_default
                update_fields.append("cash_flow_chart_default")
            if default_currency is not None and profile.default_currency != default_currency:
                profile.default_currency = default_currency
                update_fields.append("default_currency")
            if update_fields:
                profile.save(update_fields=update_fields)

        return instance


class AuthResponseSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = UserSerializer()


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=32, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)
    password_confirmation = serializers.CharField(
        write_only=True,
        min_length=8,
        trim_whitespace=False,
    )

    def validate_email(self, value):
        normalized_email = normalize_email(value)
        if User.objects.filter(email=normalized_email).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return normalized_email

    def validate_phone(self, value):
        return value.strip()

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirmation"]:
            raise serializers.ValidationError(
                {"password_confirmation": "Passwords do not match."}
            )
        password_validation.validate_password(attrs["password"])
        return attrs

    def create(self, validated_data):
        return create_user_with_workspace(
            email=validated_data["email"],
            phone=validated_data.get("phone", ""),
            password=validated_data["password"],
        )


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        email = normalize_email(attrs["email"])
        password = attrs["password"]
        user = authenticate(
            request=self.context.get("request"),
            email=email,
            password=password,
        )
        if not user:
            raise serializers.ValidationError(
                {"non_field_errors": ["Invalid email or password."]}
            )
        attrs["user"] = user
        return attrs


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def save(self, **kwargs):
        token = RefreshToken(self.validated_data["refresh"])
        token.blacklist()
