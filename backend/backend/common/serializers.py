from django.contrib.auth import authenticate, get_user_model, password_validation
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .services import create_user_with_workspace, normalize_email

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(source="profile.phone", read_only=True)
    display_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "phone", "display_name")

    def get_display_name(self, obj):
        return obj.get_full_name() or obj.first_name or obj.email


class AuthResponseSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = UserSerializer()


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
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
            username=email,
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
