from __future__ import annotations

from .models import PublicContactDetails

LOCALE_PRIORITY = ("en", "ru", "kg")
DEFAULT_PUBLIC_CONTACT_FIELDS = {
    "phone_primary": "+996 550 337683",
    "phone_secondary": "",
    "email": "dev.vrv@gmail.com",
    "address": "",
    "working_hours": "",
    "telegram_url": "",
    "whatsapp_url": "",
    "instagram_url": "",
    "youtube_url": "",
    "facebook_url": "",
    "linkedin_url": "",
    "tiktok_url": "",
}
CONTACT_FIELDS = (
    "phone_primary",
    "phone_secondary",
    "email",
    "address",
    "working_hours",
    "telegram_url",
    "whatsapp_url",
    "instagram_url",
    "youtube_url",
    "facebook_url",
    "linkedin_url",
    "tiktok_url",
)


def build_locale_candidates(locale: str | None) -> list[str]:
    normalized = (locale or "").strip().lower()
    if normalized not in LOCALE_PRIORITY:
        return list(LOCALE_PRIORITY)

    index = LOCALE_PRIORITY.index(normalized)
    return [
        normalized,
        *reversed(LOCALE_PRIORITY[:index]),
        *LOCALE_PRIORITY[index + 1 :],
    ]


def build_public_contact_details(locale: str | None) -> dict:
    entries = {
        entry.locale: entry
        for entry in PublicContactDetails.objects.all()
    }
    locale_candidates = build_locale_candidates(locale)
    resolved_fields: dict[str, str] = {}
    resolved_sources: dict[str, str] = {}

    for field_name in CONTACT_FIELDS:
        resolved_value = DEFAULT_PUBLIC_CONTACT_FIELDS.get(field_name, "")
        resolved_locale = "default" if resolved_value else ""

        for candidate in locale_candidates:
            entry = entries.get(candidate)
            if not entry:
                continue

            value = getattr(entry, field_name, "") or ""
            if value:
                resolved_value = value
                resolved_locale = candidate
                break

        resolved_fields[field_name] = resolved_value
        resolved_sources[field_name] = resolved_locale

    return {
        "requested_locale": (locale or "").strip().lower(),
        "resolved_sources": resolved_sources,
        **resolved_fields,
    }
