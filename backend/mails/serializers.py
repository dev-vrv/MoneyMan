from rest_framework import serializers
from urllib.parse import urlparse
from django.utils.text import slugify

from app.serializers import get_request_locale

from .models import ContactMessage, PublicContactDetails, SiteVisit, TrafficSourceLink
from .services import build_public_contact_details


class ContactMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = (
            "id",
            "name",
            "email",
            "phone",
            "message",
            "created_at",
        )
        read_only_fields = ("id", "created_at")

    def validate_name(self, value: str) -> str:
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("Name is too short.")
        return value

    def validate_message(self, value: str) -> str:
        value = value.strip()
        if len(value) < 10:
            raise serializers.ValidationError("Message is too short.")
        return value

    def create(self, validated_data):
        request = self.context.get("request")
        meta = getattr(request, "META", {})
        forwarded_for = meta.get("HTTP_X_FORWARDED_FOR", "")
        ip_address = forwarded_for.split(",")[0].strip() if forwarded_for else meta.get("REMOTE_ADDR")

        return ContactMessage.objects.create(
            **validated_data,
            locale=get_request_locale(request),
            ip_address=ip_address or None,
            user_agent=(meta.get("HTTP_USER_AGENT") or "")[:512],
            user=request.user if request and getattr(request.user, "is_authenticated", False) else None,
        )


class PublicContactDetailsSerializer(serializers.Serializer):
    requested_locale = serializers.CharField()
    resolved_sources = serializers.DictField(child=serializers.CharField())
    phone_primary = serializers.CharField()
    phone_secondary = serializers.CharField()
    email = serializers.CharField()
    address = serializers.CharField()
    working_hours = serializers.CharField()
    telegram_url = serializers.CharField()
    whatsapp_url = serializers.CharField()
    instagram_url = serializers.CharField()
    youtube_url = serializers.CharField()
    facebook_url = serializers.CharField()
    linkedin_url = serializers.CharField()
    tiktok_url = serializers.CharField()

    @classmethod
    def from_request(cls, request):
        payload = build_public_contact_details(get_request_locale(request))
        return cls(payload)


class SiteVisitCreateSerializer(serializers.ModelSerializer):
    tracking_code = serializers.CharField(required=False, allow_blank=True, max_length=64)
    path = serializers.CharField(required=False, allow_blank=True, max_length=255)
    landing_url = serializers.URLField(required=False, allow_blank=True, max_length=600)
    referrer_url = serializers.URLField(required=False, allow_blank=True, max_length=600)
    utm_source = serializers.CharField(required=False, allow_blank=True, max_length=120)
    utm_medium = serializers.CharField(required=False, allow_blank=True, max_length=120)
    utm_campaign = serializers.CharField(required=False, allow_blank=True, max_length=160)
    utm_content = serializers.CharField(required=False, allow_blank=True, max_length=160)
    utm_term = serializers.CharField(required=False, allow_blank=True, max_length=160)

    class Meta:
        model = SiteVisit
        fields = (
            "id",
            "tracking_code",
            "path",
            "landing_url",
            "referrer_url",
            "utm_source",
            "utm_medium",
            "utm_campaign",
            "utm_content",
            "utm_term",
            "created_at",
        )
        read_only_fields = ("id", "created_at")

    def create(self, validated_data):
        request = self.context.get("request")
        meta = getattr(request, "META", {})
        forwarded_for = meta.get("HTTP_X_FORWARDED_FOR", "")
        ip_address = forwarded_for.split(",")[0].strip() if forwarded_for else meta.get("REMOTE_ADDR")
        tracking_code = slugify(validated_data.get("tracking_code") or "")
        referrer_url = (validated_data.get("referrer_url") or "").strip()
        referrer_host = ""

        if referrer_url:
            referrer_host = urlparse(referrer_url).netloc.lower()

        source_link = None
        if tracking_code:
            source_link = TrafficSourceLink.objects.filter(code=tracking_code, is_active=True).first()

        return SiteVisit.objects.create(
            **validated_data,
            tracking_code=tracking_code,
            locale=get_request_locale(request),
            referrer_host=referrer_host,
            source_link=source_link,
            ip_address=ip_address or None,
            user_agent=(meta.get("HTTP_USER_AGENT") or "")[:512],
        )
