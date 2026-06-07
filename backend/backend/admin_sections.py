from __future__ import annotations

from types import MethodType
from typing import Any

from django.contrib import admin


SectionDefinition = dict[str, Any]
ModelEntry = dict[str, Any]
AppEntry = dict[str, Any]


SECTION_DEFINITIONS: list[SectionDefinition] = [
    {
        "name": "Пользователи",
        "app_label": "users",
        "matches": {
            "users": {"User"},
            "auth": {"Group", "Permission"},
            "token_blacklist": {"OutstandingToken", "BlacklistedToken"},
            "common": {"UserProfile"},
            "app": {"Notification", "NotificationReceipt"},
        },
    },
    {
        "name": "Счета и операции",
        "app_label": "operations",
        "matches": {
            "app": {"Account", "Transaction"},
            "common": {"FinancialAccount", "Transaction"},
        },
    },
    {
        "name": "Категории и бюджеты",
        "app_label": "planning",
        "matches": {
            "app": {"Category", "Budget"},
            "common": {"TransactionCategory", "Budget"},
        },
    },
    {
        "name": "Налоги и депозиты",
        "app_label": "profiles",
        "matches": {
            "app": {"AccountTaxProfile", "AccountDepositProfile"},
        },
    },
    {
        "name": "Валюты и курсы",
        "app_label": "fx",
        "matches": {
            "app": {"Currency", "ExchangeRate"},
        },
    },
    {
        "name": "Крипта",
        "app_label": "crypto",
        "matches": {
            "app": {
                "CryptoNetwork",
                "CryptoAsset",
                "CryptoAssetNetwork",
                "CryptoWallet",
                "CryptoHolding",
            },
        },
    },
]


def _build_model_key(app_label: str, model_entry: ModelEntry) -> tuple[str, str, str]:
    return (
        app_label,
        str(model_entry.get("object_name", "")),
        str(model_entry.get("admin_url", "")),
    )


def _match_section(app_label: str, model_entry: ModelEntry) -> str | None:
    object_name = model_entry.get("object_name")
    if not object_name:
        return None

    for section in SECTION_DEFINITIONS:
        if object_name in section["matches"].get(app_label, set()):
            return section["app_label"]
    return None


def _rebuild_admin_sections(app_list: list[AppEntry]) -> list[AppEntry]:
    section_models: dict[str, list[ModelEntry]] = {
        section["app_label"]: [] for section in SECTION_DEFINITIONS
    }
    section_templates: dict[str, AppEntry] = {}
    remaining_apps: list[AppEntry] = []
    seen_models: set[tuple[str, str, str]] = set()

    for app_entry in app_list:
        app_label = str(app_entry.get("app_label", ""))
        remaining_models: list[ModelEntry] = []

        for model_entry in app_entry.get("models", []):
            section_label = _match_section(app_label, model_entry)
            if section_label is None:
                remaining_models.append(model_entry)
                continue

            model_key = _build_model_key(app_label, model_entry)
            if model_key in seen_models:
                continue

            seen_models.add(model_key)
            section_models[section_label].append(model_entry)
            section_templates.setdefault(section_label, app_entry)

        if remaining_models:
            remaining_apps.append({**app_entry, "models": remaining_models})

    rebuilt_sections: list[AppEntry] = []
    for section in SECTION_DEFINITIONS:
        models = section_models[section["app_label"]]
        if not models:
            continue

        template = section_templates.get(section["app_label"]) or {}
        rebuilt_sections.append(
            {
                **template,
                "name": section["name"],
                "app_label": section["app_label"],
                "app_url": "",
                "models": models,
            }
        )

    return [*rebuilt_sections, *remaining_apps]


def patch_admin_app_sections() -> None:
    if getattr(admin.site, "_finman_admin_sections_patched", False):
        return

    original_get_app_list = admin.site.get_app_list

    def custom_get_app_list(self, request, app_label=None):
        app_list = original_get_app_list(request, app_label)
        return _rebuild_admin_sections(app_list)

    admin.site.get_app_list = MethodType(custom_get_app_list, admin.site)
    admin.site._finman_admin_sections_patched = True
