from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal, InvalidOperation
import logging
from typing import Any

import requests
from django.conf import settings
from django.db import transaction
from django.utils import timezone
from django.utils.dateparse import parse_datetime

from .models import Currency, ExchangeRate


logger = logging.getLogger(__name__)

FX_KG_SOURCE = "fx_kg_central"
FX_KG_CURRENCY_SYMBOLS = {
    "AED": "AED",
    "AMD": "AMD",
    "AUD": "A$",
    "AZN": "AZN",
    "BGN": "BGN",
    "BRL": "R$",
    "BYN": "Br",
    "CAD": "C$",
    "CHF": "CHF",
    "CNY": "CNY",
    "CZK": "CZK",
    "DKK": "DKK",
    "EUR": "EUR",
    "GBP": "GBP",
    "GEL": "GEL",
    "HUF": "HUF",
    "INR": "INR",
    "IRR": "IRR",
    "JPY": "JPY",
    "KGS": "сом",
    "KRW": "KRW",
    "KWD": "KWD",
    "KZT": "₸",
    "MDL": "MDL",
    "MNT": "₮",
    "MYR": "MYR",
    "NOK": "NOK",
    "NZD": "NZ$",
    "PKR": "PKR",
    "PLN": "PLN",
    "RUB": "₽",
    "SAR": "SAR",
    "SEK": "SEK",
    "SGD": "S$",
    "TJS": "TJS",
    "TMT": "TMT",
    "TRY": "₺",
    "TWD": "NT$",
    "UAH": "₴",
    "USD": "$",
    "UZS": "UZS",
    "XDR": "XDR",
}
FX_KG_META_FIELDS = {"CREATED_AT", "UPDATED_AT", "IS_CURRENT"}


class CurrencySyncError(Exception):
    pass


@dataclass(frozen=True)
class CurrencySyncResult:
    currencies_synced: int
    rates_synced: int
    effective_date: str


def _get_api_token() -> str:
    token = settings.FX_KG_API_TOKEN.strip()
    if not token:
        raise CurrencySyncError("FX.kg API token is not configured.")
    return token


def _fetch_json(path: str) -> Any:
    response = requests.get(
        f"{settings.FX_KG_API_BASE_URL.rstrip('/')}/{path.lstrip('/')}",
        headers={
            "Accept": "application/json",
            "Authorization": f"Bearer {_get_api_token()}",
        },
        timeout=settings.FX_KG_API_TIMEOUT,
    )
    try:
        response.raise_for_status()
    except requests.HTTPError as exc:
        raise CurrencySyncError(f"FX.kg request failed for '{path}': {exc}") from exc
    return response.json()


def _parse_rate_date(payload: dict[str, Any]):
    for key in ("updated_at", "created_at"):
        raw_value = payload.get(key)
        if not raw_value:
            continue
        parsed = parse_datetime(raw_value)
        if parsed is not None:
            return parsed.date()
    return timezone.localdate()


def _sync_currencies(currency_payload: list[dict[str, Any]]) -> dict[str, Currency]:
    synced_codes: list[str] = []

    for item in currency_payload:
        code = str(item.get("code", "")).upper().strip()
        if not code:
            continue

        title = str(item.get("title", "")).strip() or code
        currency, created = Currency.objects.get_or_create(
            code=code,
            defaults={
                "name": title,
                "symbol": FX_KG_CURRENCY_SYMBOLS.get(code, ""),
                "is_active": True,
            },
        )

        changed_fields: list[str] = []
        if currency.name != title:
            currency.name = title
            changed_fields.append("name")
        if not currency.symbol and FX_KG_CURRENCY_SYMBOLS.get(code):
            currency.symbol = FX_KG_CURRENCY_SYMBOLS[code]
            changed_fields.append("symbol")
        if not currency.is_active:
            currency.is_active = True
            changed_fields.append("is_active")

        if changed_fields:
            currency.save(update_fields=changed_fields + ["updated_at"])

        synced_codes.append(code)
        if created:
            logger.info("Created currency %s from FX.kg.", code)

    return {
        currency.code: currency
        for currency in Currency.objects.filter(code__in=synced_codes)
    }


def _sync_rates(rate_payload: dict[str, Any], currencies_by_code: dict[str, Currency]) -> int:
    quote_currency = currencies_by_code.get("KGS") or Currency.objects.get(code="KGS")
    rate_date = _parse_rate_date(rate_payload)
    synced_count = 0

    ExchangeRate.objects.filter(source=FX_KG_SOURCE, is_active=True).update(is_active=False)

    for code, raw_rate in rate_payload.items():
        normalized_code = str(code).strip().upper()
        if normalized_code in FX_KG_META_FIELDS:
            continue

        if raw_rate in (None, ""):
            continue

        try:
            rate = Decimal(str(raw_rate))
        except (InvalidOperation, TypeError) as exc:
            raise CurrencySyncError(f"Invalid FX.kg rate for {normalized_code}.") from exc

        if normalized_code == quote_currency.code:
            continue

        base_currency = currencies_by_code.get(normalized_code)
        if base_currency is None:
            base_currency = Currency.objects.filter(code=normalized_code).first()
        if base_currency is None:
            base_currency = Currency.objects.create(
                code=normalized_code,
                name=normalized_code,
                symbol=FX_KG_CURRENCY_SYMBOLS.get(normalized_code, ""),
            )

        ExchangeRate.objects.update_or_create(
            base_currency=base_currency,
            quote_currency=quote_currency,
            rate_date=rate_date,
            source=FX_KG_SOURCE,
            defaults={
                "rate": rate,
                "is_active": True,
            },
        )
        synced_count += 1

    return synced_count


@transaction.atomic
def sync_fx_kg_reference_data() -> CurrencySyncResult:
    logger.info("Starting FX.kg currency sync.")
    currency_payload = _fetch_json("currencies")
    rate_payload = _fetch_json("central")

    if not isinstance(currency_payload, list):
        raise CurrencySyncError("FX.kg currencies response has unexpected format.")
    if not isinstance(rate_payload, dict):
        raise CurrencySyncError("FX.kg central rates response has unexpected format.")

    currencies_by_code = _sync_currencies(currency_payload)
    if "KGS" not in currencies_by_code:
        kgs, _ = Currency.objects.get_or_create(
            code="KGS",
            defaults={"name": "Кыргызский сом", "symbol": "сом", "is_active": True},
        )
        currencies_by_code["KGS"] = kgs

    synced_rate_count = _sync_rates(rate_payload, currencies_by_code)
    effective_date = _parse_rate_date(rate_payload).isoformat()

    logger.info(
        "Completed FX.kg sync: %s currencies, %s rates, effective date %s.",
        len(currencies_by_code),
        synced_rate_count,
        effective_date,
    )
    return CurrencySyncResult(
        currencies_synced=len(currencies_by_code),
        rates_synced=synced_rate_count,
        effective_date=effective_date,
    )
