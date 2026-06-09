from urllib.parse import urlencode

from django.conf import settings
from django.contrib import admin
from django.db.models import Count
from django.utils.html import format_html

from .models import ContactMessage, PublicContactDetails, SiteVisit, TrafficSourceLink


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "source", "locale", "user", "created_at")
    list_filter = ("locale", "source", "created_at")
    search_fields = ("name", "email", "phone", "message", "user__email")
    autocomplete_fields = ("user",)
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at", "ip_address", "user_agent")


@admin.register(PublicContactDetails)
class PublicContactDetailsAdmin(admin.ModelAdmin):
    list_display = ("locale", "phone_primary", "email", "telegram_url", "youtube_url", "updated_at")
    search_fields = ("locale", "phone_primary", "phone_secondary", "email", "address")
    ordering = ("locale",)


@admin.register(TrafficSourceLink)
class TrafficSourceLinkAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "target_path", "locale", "is_active", "visits_count", "updated_at")
    list_filter = ("is_active", "locale", "utm_source", "utm_medium", "updated_at")
    search_fields = ("name", "code", "target_path", "utm_source", "utm_campaign", "notes")
    ordering = ("name", "code")
    readonly_fields = ("created_at", "updated_at", "generated_url")

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "name",
                    "code",
                    "is_active",
                    "target_path",
                    "locale",
                    "generated_url",
                    "notes",
                )
            },
        ),
        (
            "UTM",
            {
                "fields": (
                    "utm_source",
                    "utm_medium",
                    "utm_campaign",
                    "utm_content",
                    "utm_term",
                )
            },
        ),
        ("Meta", {"fields": ("created_at", "updated_at")}),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(_visits_count=Count("visits"))

    @admin.display(description="Visits")
    def visits_count(self, obj):
        return getattr(obj, "_visits_count", 0)

    @admin.display(description="Generated URL")
    def generated_url(self, obj):
        if not obj.pk:
            return "Save the link to generate a tracked URL."

        base_url = settings.MARKETING_SITE_URL.rstrip("/")
        params = {"trk": obj.code}
        if obj.utm_source:
            params["utm_source"] = obj.utm_source
        if obj.utm_medium:
            params["utm_medium"] = obj.utm_medium
        if obj.utm_campaign:
            params["utm_campaign"] = obj.utm_campaign
        if obj.utm_content:
            params["utm_content"] = obj.utm_content
        if obj.utm_term:
            params["utm_term"] = obj.utm_term

        locale_prefix = f"/{obj.locale}" if obj.locale else ""
        tracked_url = f"{base_url}{locale_prefix}{obj.target_path}?{urlencode(params)}"
        return format_html('<a href="{0}" target="_blank" rel="noopener noreferrer">{0}</a>', tracked_url)


@admin.register(SiteVisit)
class SiteVisitAdmin(admin.ModelAdmin):
    list_display = (
        "created_at",
        "tracking_code",
        "source_link",
        "referrer_host",
        "path",
        "locale",
        "utm_source",
        "utm_campaign",
    )
    list_filter = ("locale", "utm_source", "utm_medium", "created_at")
    search_fields = ("tracking_code", "path", "referrer_host", "referrer_url", "landing_url", "utm_campaign")
    autocomplete_fields = ("source_link",)
    ordering = ("-created_at",)
    readonly_fields = (
        "created_at",
        "updated_at",
        "source_link",
        "tracking_code",
        "locale",
        "path",
        "landing_url",
        "referrer_url",
        "referrer_host",
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
        "ip_address",
        "user_agent",
    )
