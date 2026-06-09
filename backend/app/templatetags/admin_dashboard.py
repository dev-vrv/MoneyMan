from __future__ import annotations

from datetime import timedelta

from django import template
from django.db.models import Count
from django.db.models.functions import TruncDate
from django.utils import timezone

from app.models import Transaction
from mails.models import SiteVisit
from payments.models import PaymentOrder
from subscribes.models import UserSubscription


register = template.Library()


def _build_line_geometry(values: list[int], *, width: int = 360, height: int = 140, padding: int = 14) -> dict:
    if not values:
        values = [0]

    max_value = max(values) or 1
    inner_width = width - padding * 2
    inner_height = height - padding * 2
    step_x = inner_width / max(len(values) - 1, 1)

    points: list[dict[str, float | int]] = []
    for index, value in enumerate(values):
        x = padding + step_x * index
        y = height - padding - ((value / max_value) * inner_height)
        points.append({"x": round(x, 2), "y": round(y, 2), "value": value})

    path = " ".join(
        f"{'M' if index == 0 else 'L'} {point['x']} {point['y']}"
        for index, point in enumerate(points)
    )
    area_path = (
        f"{path} L {points[-1]['x']} {height - padding} "
        f"L {points[0]['x']} {height - padding} Z"
    )

    return {
        "width": width,
        "height": height,
        "padding": padding,
        "path": path,
        "area_path": area_path,
        "points": points,
        "max_value": max_value,
    }


def _build_status_rows(rows: list[tuple[str, int]], palette: tuple[str, ...]) -> list[dict[str, str | int]]:
    total = sum(value for _, value in rows) or 1
    items: list[dict[str, str | int]] = []

    for index, (label, value) in enumerate(rows):
        items.append(
            {
                "label": label,
                "value": value,
                "percent": round((value / total) * 100),
                "tone": palette[index % len(palette)],
            }
        )

    return items


def _build_top_rows(rows: list[tuple[str, int]], palette: tuple[str, ...]) -> list[dict[str, str | int]]:
    normalized_rows = [(label or "direct", value) for label, value in rows]
    return _build_status_rows(normalized_rows or [("no_data", 0)], palette)


@register.inclusion_tag("admin/includes/dashboard_charts.html")
def render_admin_dashboard_charts():
    today = timezone.localdate()
    start_date = today - timedelta(days=6)
    timeline = [start_date + timedelta(days=offset) for offset in range(7)]

    transaction_rows = (
        Transaction.objects.filter(occurred_on__gte=start_date, occurred_on__lte=today)
        .values("occurred_on")
        .annotate(total=Count("id"))
    )
    transaction_map = {row["occurred_on"]: row["total"] for row in transaction_rows}
    transaction_values = [transaction_map.get(point, 0) for point in timeline]
    transaction_geometry = _build_line_geometry(transaction_values)
    transaction_series = [
        {
            "label": point.strftime("%d.%m"),
            "value": transaction_map.get(point, 0),
            "x": transaction_geometry["points"][index]["x"],
            "y": transaction_geometry["points"][index]["y"],
        }
        for index, point in enumerate(timeline)
    ]

    payment_rows = list(
        PaymentOrder.objects.values("status")
        .annotate(total=Count("id"))
        .order_by("-total", "status")
    )
    subscription_rows = list(
        UserSubscription.objects.values("status")
        .annotate(total=Count("id"))
        .order_by("-total", "status")
    )

    payment_statuses = _build_status_rows(
        [(row["status"], row["total"]) for row in payment_rows] or [("no_data", 0)],
        ("cyan", "violet", "emerald", "amber", "rose"),
    )
    subscription_statuses = _build_status_rows(
        [(row["status"], row["total"]) for row in subscription_rows] or [("no_data", 0)],
        ("emerald", "cyan", "violet", "amber", "rose"),
    )

    visit_rows = (
        SiteVisit.objects.filter(created_at__date__gte=start_date, created_at__date__lte=today)
        .annotate(visit_day=TruncDate("created_at"))
        .values("visit_day")
        .annotate(total=Count("id"))
    )
    visit_map = {row["visit_day"]: row["total"] for row in visit_rows}
    visit_values = [visit_map.get(point, 0) for point in timeline]
    visit_geometry = _build_line_geometry(visit_values)
    visit_series = [
        {
            "label": point.strftime("%d.%m"),
            "value": visit_map.get(point, 0),
            "x": visit_geometry["points"][index]["x"],
            "y": visit_geometry["points"][index]["y"],
        }
        for index, point in enumerate(timeline)
    ]

    source_rows = list(
        SiteVisit.objects.values("source_link__name", "tracking_code")
        .annotate(total=Count("id"))
        .order_by("-total", "source_link__name", "tracking_code")[:6]
    )
    referrer_rows = list(
        SiteVisit.objects.values("referrer_host")
        .annotate(total=Count("id"))
        .order_by("-total", "referrer_host")[:6]
    )
    traffic_sources = _build_top_rows(
        [
            (row["source_link__name"] or row["tracking_code"], row["total"])
            for row in source_rows
        ],
        ("cyan", "violet", "emerald", "amber", "rose"),
    )
    referrers = _build_top_rows(
        [(row["referrer_host"], row["total"]) for row in referrer_rows],
        ("violet", "cyan", "amber", "emerald", "rose"),
    )

    return {
        "transactions": {
            "title": "Транзакции за 7 дней",
            "subtitle": "Срез активности по последним датам",
            "total": sum(transaction_values),
            "series": transaction_series,
            **transaction_geometry,
        },
        "payments": {
            "title": "Статусы платежей",
            "subtitle": "Текущее распределение payment orders",
            "total": sum(item["value"] for item in payment_statuses),
            "items": payment_statuses,
        },
        "subscriptions": {
            "title": "Статусы подписок",
            "subtitle": "Сколько подписок в каждом рабочем состоянии",
            "total": sum(item["value"] for item in subscription_statuses),
            "items": subscription_statuses,
        },
        "traffic": {
            "title": "Переходы на сайт за 7 дней",
            "subtitle": "Первичные визиты по лендингам и рекламным ссылкам",
            "total": sum(visit_values),
            "series": visit_series,
            **visit_geometry,
        },
        "traffic_sources": {
            "title": "Переходы по ссылкам",
            "subtitle": "Какие tracking codes приводят больше всего трафика",
            "total": sum(item["value"] for item in traffic_sources),
            "items": traffic_sources,
        },
        "referrers": {
            "title": "Откуда пришли",
            "subtitle": "Top referrer hosts и direct traffic",
            "total": sum(item["value"] for item in referrers),
            "items": referrers,
        },
    }
