from __future__ import annotations

from typing import Iterable

from django import template


register = template.Library()


SECTION_CONFIG = (
    {
        "title": "Пользователи и доступ",
        "description": "Управление пользователями, ролями, группами и разрешениями.",
        "app_labels": {"users", "auth"},
    },
    {
        "title": "Финансы",
        "description": "Счета, транзакции, бюджеты, категории, валюты и курсы.",
        "app_labels": {"app", "backend.common"},
    },
    {
        "title": "Платформа и сервисы",
        "description": "Служебные модули платформы и интеграционные подсистемы.",
        "app_labels": {"ai", "mails", "payments", "subscribes"},
    },
)


@register.simple_tag
def admin_grouped_app_list(app_list: Iterable[dict]) -> list[dict]:
    remaining_apps = list(app_list)
    sections: list[dict] = []

    for config in SECTION_CONFIG:
        grouped_apps = [app for app in remaining_apps if app.get("app_label") in config["app_labels"]]
        if not grouped_apps:
            continue

        sections.append(
            {
                "title": config["title"],
                "description": config["description"],
                "apps": grouped_apps,
            }
        )
        remaining_apps = [app for app in remaining_apps if app.get("app_label") not in config["app_labels"]]

    if remaining_apps:
        sections.append(
            {
                "title": "Остальные разделы",
                "description": "Дополнительные модули администрирования.",
                "apps": remaining_apps,
            }
        )

    return sections
