from __future__ import annotations

import json
from dataclasses import dataclass
from decimal import Decimal, InvalidOperation
from typing import Any

import requests
from django.conf import settings
from django.utils import timezone


CRYPTO_MARKET_PROVIDER_BINANCE = "binance"
CRYPTO_MARKET_PROVIDER_OKX = "okx"
CRYPTO_MARKET_PROVIDER_BYBIT = "bybit"
CRYPTO_MARKET_PROVIDER_KRAKEN = "kraken"
CRYPTO_MARKET_PROVIDERS = {
    CRYPTO_MARKET_PROVIDER_BINANCE,
    CRYPTO_MARKET_PROVIDER_OKX,
    CRYPTO_MARKET_PROVIDER_BYBIT,
    CRYPTO_MARKET_PROVIDER_KRAKEN,
}

CRYPTO_MARKET_ASSETS = (
    {"symbol": "BTC", "name": "Bitcoin", "icon": "bitcoin", "color": "amber", "asset_type": "coin", "rank": 10},
    {"symbol": "ETH", "name": "Ethereum", "icon": "ethereum", "color": "indigo", "asset_type": "coin", "rank": 20},
    {"symbol": "BNB", "name": "BNB", "icon": "bnb", "color": "yellow", "asset_type": "coin", "rank": 30},
    {"symbol": "SOL", "name": "Solana", "icon": "solana", "color": "violet", "asset_type": "coin", "rank": 40},
    {"symbol": "XRP", "name": "XRP", "icon": "xrp", "color": "sky", "asset_type": "coin", "rank": 50},
    {"symbol": "DOGE", "name": "Dogecoin", "icon": "dogecoin", "color": "amber", "asset_type": "coin", "rank": 60},
    {"symbol": "TON", "name": "Toncoin", "icon": "ton", "color": "sky", "asset_type": "coin", "rank": 70},
    {"symbol": "ADA", "name": "Cardano", "icon": "cardano", "color": "blue", "asset_type": "coin", "rank": 80},
    {"symbol": "AVAX", "name": "Avalanche", "icon": "avalanche", "color": "red", "asset_type": "coin", "rank": 90},
    {"symbol": "DOT", "name": "Polkadot", "icon": "polkadot", "color": "fuchsia", "asset_type": "coin", "rank": 100},
    {"symbol": "LINK", "name": "Chainlink", "icon": "chainlink", "color": "blue", "asset_type": "token", "rank": 110},
    {"symbol": "TRX", "name": "TRON", "icon": "tron", "color": "red", "asset_type": "coin", "rank": 120},
    {"symbol": "USDT", "name": "Tether", "icon": "tether", "color": "emerald", "asset_type": "stablecoin", "rank": 130},
    {"symbol": "USDC", "name": "USD Coin", "icon": "usd-coin", "color": "blue", "asset_type": "stablecoin", "rank": 140},
    {"symbol": "LTC", "name": "Litecoin", "icon": "litecoin", "color": "slate", "asset_type": "coin", "rank": 150},
    {"symbol": "BCH", "name": "Bitcoin Cash", "icon": "bitcoin-cash", "color": "emerald", "asset_type": "coin", "rank": 160},
    {"symbol": "XLM", "name": "Stellar", "icon": "stellar", "color": "slate", "asset_type": "coin", "rank": 170},
    {"symbol": "ATOM", "name": "Cosmos", "icon": "cosmos", "color": "indigo", "asset_type": "coin", "rank": 180},
    {"symbol": "UNI", "name": "Uniswap", "icon": "uniswap", "color": "pink", "asset_type": "token", "rank": 190},
    {"symbol": "AAVE", "name": "Aave", "icon": "aave", "color": "violet", "asset_type": "token", "rank": 200},
    {"symbol": "NEAR", "name": "NEAR Protocol", "icon": "near", "color": "slate", "asset_type": "coin", "rank": 210},
    {"symbol": "ETC", "name": "Ethereum Classic", "icon": "etc", "color": "emerald", "asset_type": "coin", "rank": 220},
    {"symbol": "ICP", "name": "Internet Computer", "icon": "icp", "color": "fuchsia", "asset_type": "coin", "rank": 230},
    {"symbol": "ARB", "name": "Arbitrum", "icon": "arbitrum", "color": "cyan", "asset_type": "token", "rank": 240},
    {"symbol": "OP", "name": "Optimism", "icon": "optimism", "color": "rose", "asset_type": "token", "rank": 250},
    {"symbol": "POL", "name": "Polygon", "icon": "polygon", "color": "fuchsia", "asset_type": "coin", "rank": 260},
    {"symbol": "SUI", "name": "Sui", "icon": "sui", "color": "sky", "asset_type": "coin", "rank": 270},
    {"symbol": "APT", "name": "Aptos", "icon": "aptos", "color": "slate", "asset_type": "coin", "rank": 280},
    {"symbol": "HBAR", "name": "Hedera", "icon": "hedera", "color": "slate", "asset_type": "coin", "rank": 290},
    {"symbol": "FIL", "name": "Filecoin", "icon": "filecoin", "color": "cyan", "asset_type": "coin", "rank": 300},
    {"symbol": "INJ", "name": "Injective", "icon": "injective", "color": "blue", "asset_type": "coin", "rank": 310},
    {"symbol": "VET", "name": "VeChain", "icon": "vechain", "color": "slate", "asset_type": "coin", "rank": 320},
    {"symbol": "ALGO", "name": "Algorand", "icon": "algorand", "color": "slate", "asset_type": "coin", "rank": 330},
    {"symbol": "XTZ", "name": "Tezos", "icon": "tezos", "color": "blue", "asset_type": "coin", "rank": 340},
    {"symbol": "EGLD", "name": "MultiversX", "icon": "multiversx", "color": "slate", "asset_type": "coin", "rank": 350},
    {"symbol": "THETA", "name": "Theta Network", "icon": "theta", "color": "emerald", "asset_type": "coin", "rank": 360},
    {"symbol": "SAND", "name": "The Sandbox", "icon": "sand", "color": "cyan", "asset_type": "token", "rank": 370},
    {"symbol": "MANA", "name": "Decentraland", "icon": "mana", "color": "orange", "asset_type": "token", "rank": 380},
    {"symbol": "GRT", "name": "The Graph", "icon": "graph", "color": "violet", "asset_type": "token", "rank": 390},
    {"symbol": "RUNE", "name": "THORChain", "icon": "thorchain", "color": "amber", "asset_type": "coin", "rank": 400},
    {"symbol": "MKR", "name": "Maker", "icon": "maker", "color": "emerald", "asset_type": "token", "rank": 410},
    {"symbol": "PEPE", "name": "Pepe", "icon": "pepe", "color": "lime", "asset_type": "token", "rank": 420},
    {"symbol": "SHIB", "name": "Shiba Inu", "icon": "shib", "color": "orange", "asset_type": "token", "rank": 430},
    {"symbol": "DAI", "name": "Dai", "icon": "dai", "color": "amber", "asset_type": "stablecoin", "rank": 440},
    {"symbol": "TUSD", "name": "TrueUSD", "icon": "trueusd", "color": "blue", "asset_type": "stablecoin", "rank": 450},
    {"symbol": "FDUSD", "name": "First Digital USD", "icon": "fdusd", "color": "blue", "asset_type": "stablecoin", "rank": 460},
    {"symbol": "WETH", "name": "Wrapped Ether", "icon": "weth", "color": "indigo", "asset_type": "wrapped", "rank": 470},
    {"symbol": "WBTC", "name": "Wrapped Bitcoin", "icon": "wbtc", "color": "amber", "asset_type": "wrapped", "rank": 480},
    {"symbol": "BUSD", "name": "Binance USD", "icon": "busd", "color": "yellow", "asset_type": "stablecoin", "rank": 490},
    {"symbol": "CRO", "name": "Cronos", "icon": "cronos", "color": "blue", "asset_type": "coin", "rank": 500},
    {"symbol": "KAS", "name": "Kaspa", "icon": "kaspa", "color": "cyan", "asset_type": "coin", "rank": 510},
    {"symbol": "SEI", "name": "Sei", "icon": "sei", "color": "rose", "asset_type": "coin", "rank": 520},
    {"symbol": "TIA", "name": "Celestia", "icon": "celestia", "color": "violet", "asset_type": "coin", "rank": 530},
    {"symbol": "JUP", "name": "Jupiter", "icon": "jupiter", "color": "amber", "asset_type": "token", "rank": 540},
)


class CryptoMarketDataError(Exception):
    pass


@dataclass(frozen=True)
class CryptoMarketSnapshot:
    provider: str
    assets: list[dict[str, Any]]
    fetched_at: str


@dataclass(frozen=True)
class CryptoMarketChart:
    provider: str
    symbol: str
    quote_currency: str
    range_key: str
    points: list[dict[str, Any]]
    fetched_at: str


def _market_timeout() -> int | float:
    return getattr(settings, "CRYPTO_MARKET_API_TIMEOUT", 6)


def normalize_crypto_market_provider(provider: str | None) -> str:
    normalized = (provider or "").strip().lower()
    if normalized in CRYPTO_MARKET_PROVIDERS:
        return normalized
    return CRYPTO_MARKET_PROVIDER_BINANCE


CRYPTO_MARKET_CHART_RANGE_24H = "24h"
CRYPTO_MARKET_CHART_RANGE_7D = "7d"
CRYPTO_MARKET_CHART_RANGE_30D = "30d"
CRYPTO_MARKET_CHART_RANGE_90D = "90d"
CRYPTO_MARKET_CHART_RANGES = {
    CRYPTO_MARKET_CHART_RANGE_24H,
    CRYPTO_MARKET_CHART_RANGE_7D,
    CRYPTO_MARKET_CHART_RANGE_30D,
    CRYPTO_MARKET_CHART_RANGE_90D,
}
CRYPTO_MARKET_SYMBOLS = {str(asset["symbol"]).upper() for asset in CRYPTO_MARKET_ASSETS}


def normalize_crypto_market_symbol(symbol: str | None) -> str:
    normalized = (symbol or "").strip().upper()
    if normalized in CRYPTO_MARKET_SYMBOLS:
        return normalized
    return "BTC"


def normalize_crypto_market_chart_range(range_key: str | None) -> str:
    normalized = (range_key or "").strip().lower()
    if normalized in CRYPTO_MARKET_CHART_RANGES:
        return normalized
    return CRYPTO_MARKET_CHART_RANGE_7D


def _decimal_to_string(value: Decimal, precision: str) -> str:
    return f"{value.quantize(Decimal(precision))}"


def _parse_decimal(value: Any, *, field_name: str) -> Decimal:
    try:
        return Decimal(str(value))
    except (InvalidOperation, TypeError) as exc:
        raise CryptoMarketDataError(f"Invalid market field '{field_name}'.") from exc


def _calculate_change_percent(last_price: Decimal, open_price: Decimal) -> Decimal:
    if open_price == 0:
        return Decimal("0")
    return ((last_price - open_price) / open_price) * Decimal("100")


def _build_chart_point(
    *,
    timestamp_ms: int,
    open_price: Any,
    high_price: Any,
    low_price: Any,
    close_price: Any,
    volume: Any,
) -> dict[str, Any]:
    return {
        "timestamp": timestamp_ms,
        "open": _decimal_to_string(_parse_decimal(open_price, field_name="open"), "0.00000001"),
        "high": _decimal_to_string(_parse_decimal(high_price, field_name="high"), "0.00000001"),
        "low": _decimal_to_string(_parse_decimal(low_price, field_name="low"), "0.00000001"),
        "close": _decimal_to_string(_parse_decimal(close_price, field_name="close"), "0.00000001"),
        "volume": _decimal_to_string(_parse_decimal(volume, field_name="volume"), "0.00000001"),
    }


def _chart_range_config(provider: str, range_key: str) -> dict[str, Any]:
    configs: dict[str, dict[str, dict[str, Any]]] = {
        CRYPTO_MARKET_PROVIDER_BINANCE: {
            CRYPTO_MARKET_CHART_RANGE_24H: {"interval": "1h", "limit": 24, "quote_currency": "USDT"},
            CRYPTO_MARKET_CHART_RANGE_7D: {"interval": "4h", "limit": 42, "quote_currency": "USDT"},
            CRYPTO_MARKET_CHART_RANGE_30D: {"interval": "1d", "limit": 30, "quote_currency": "USDT"},
            CRYPTO_MARKET_CHART_RANGE_90D: {"interval": "1d", "limit": 90, "quote_currency": "USDT"},
        },
        CRYPTO_MARKET_PROVIDER_OKX: {
            CRYPTO_MARKET_CHART_RANGE_24H: {"bar": "1H", "limit": 24, "quote_currency": "USDT"},
            CRYPTO_MARKET_CHART_RANGE_7D: {"bar": "4H", "limit": 42, "quote_currency": "USDT"},
            CRYPTO_MARKET_CHART_RANGE_30D: {"bar": "1D", "limit": 30, "quote_currency": "USDT"},
            CRYPTO_MARKET_CHART_RANGE_90D: {"bar": "1D", "limit": 90, "quote_currency": "USDT"},
        },
        CRYPTO_MARKET_PROVIDER_BYBIT: {
            CRYPTO_MARKET_CHART_RANGE_24H: {"interval": "60", "limit": 24, "quote_currency": "USDT"},
            CRYPTO_MARKET_CHART_RANGE_7D: {"interval": "240", "limit": 42, "quote_currency": "USDT"},
            CRYPTO_MARKET_CHART_RANGE_30D: {"interval": "D", "limit": 30, "quote_currency": "USDT"},
            CRYPTO_MARKET_CHART_RANGE_90D: {"interval": "D", "limit": 90, "quote_currency": "USDT"},
        },
        CRYPTO_MARKET_PROVIDER_KRAKEN: {
            CRYPTO_MARKET_CHART_RANGE_24H: {"interval": 60, "quote_currency": "USD"},
            CRYPTO_MARKET_CHART_RANGE_7D: {"interval": 240, "quote_currency": "USD"},
            CRYPTO_MARKET_CHART_RANGE_30D: {"interval": 1440, "quote_currency": "USD"},
            CRYPTO_MARKET_CHART_RANGE_90D: {"interval": 1440, "quote_currency": "USD"},
        },
    }
    return configs[provider][range_key]


def _binance_chart_symbol(symbol: str) -> str:
    return f"{symbol}USDT"


def _okx_chart_symbol(symbol: str) -> str:
    return f"{symbol}-USDT"


def _bybit_chart_symbol(symbol: str) -> str:
    return f"{symbol}USDT"


def _kraken_chart_symbol(symbol: str) -> str:
    replacements = {
        "BTC": "XBT",
        "DOGE": "XDG",
    }
    return f"{replacements.get(symbol, symbol)}USD"


def _fetch_binance_chart(symbol: str, range_key: str) -> CryptoMarketChart:
    config = _chart_range_config(CRYPTO_MARKET_PROVIDER_BINANCE, range_key)
    response = requests.get(
        "https://api.binance.com/api/v3/uiKlines",
        params={
            "symbol": _binance_chart_symbol(symbol),
            "interval": config["interval"],
            "limit": config["limit"],
        },
        headers={"Accept": "application/json"},
        timeout=_market_timeout(),
    )
    try:
        response.raise_for_status()
    except requests.HTTPError as exc:
        raise CryptoMarketDataError(f"Binance chart request failed: {exc}") from exc

    payload = response.json()
    if not isinstance(payload, list):
        raise CryptoMarketDataError("Binance chart response has unexpected format.")

    points = [
        _build_chart_point(
            timestamp_ms=int(item[0]),
            open_price=item[1],
            high_price=item[2],
            low_price=item[3],
            close_price=item[4],
            volume=item[5],
        )
        for item in payload
        if isinstance(item, list) and len(item) >= 6
    ]
    fetched_at = timezone.now().isoformat()
    return CryptoMarketChart(
        provider=CRYPTO_MARKET_PROVIDER_BINANCE,
        symbol=symbol,
        quote_currency=config["quote_currency"],
        range_key=range_key,
        points=points,
        fetched_at=fetched_at,
    )


def _fetch_okx_chart(symbol: str, range_key: str) -> CryptoMarketChart:
    config = _chart_range_config(CRYPTO_MARKET_PROVIDER_OKX, range_key)
    response = requests.get(
        "https://www.okx.com/api/v5/market/candles",
        params={
            "instId": _okx_chart_symbol(symbol),
            "bar": config["bar"],
            "limit": config["limit"],
        },
        headers={"Accept": "application/json"},
        timeout=_market_timeout(),
    )
    try:
        response.raise_for_status()
    except requests.HTTPError as exc:
        raise CryptoMarketDataError(f"OKX chart request failed: {exc}") from exc

    payload = response.json()
    rows = payload.get("data") if isinstance(payload, dict) else None
    if not isinstance(rows, list):
        raise CryptoMarketDataError("OKX chart response has unexpected format.")

    points = [
        _build_chart_point(
            timestamp_ms=int(item[0]),
            open_price=item[1],
            high_price=item[2],
            low_price=item[3],
            close_price=item[4],
            volume=item[5],
        )
        for item in rows
        if isinstance(item, list) and len(item) >= 6
    ]
    points.sort(key=lambda item: item["timestamp"])
    fetched_at = timezone.now().isoformat()
    return CryptoMarketChart(
        provider=CRYPTO_MARKET_PROVIDER_OKX,
        symbol=symbol,
        quote_currency=config["quote_currency"],
        range_key=range_key,
        points=points,
        fetched_at=fetched_at,
    )


def _fetch_bybit_chart(symbol: str, range_key: str) -> CryptoMarketChart:
    config = _chart_range_config(CRYPTO_MARKET_PROVIDER_BYBIT, range_key)
    response = requests.get(
        "https://api.bybit.com/v5/market/kline",
        params={
            "category": "spot",
            "symbol": _bybit_chart_symbol(symbol),
            "interval": config["interval"],
            "limit": config["limit"],
        },
        headers={"Accept": "application/json"},
        timeout=_market_timeout(),
    )
    try:
        response.raise_for_status()
    except requests.HTTPError as exc:
        raise CryptoMarketDataError(f"Bybit chart request failed: {exc}") from exc

    payload = response.json()
    if not isinstance(payload, dict) or payload.get("retCode") != 0:
        raise CryptoMarketDataError("Bybit chart response has unexpected format.")

    result = payload.get("result")
    rows = result.get("list") if isinstance(result, dict) else None
    if not isinstance(rows, list):
        raise CryptoMarketDataError("Bybit chart response has unexpected format.")

    points = [
        _build_chart_point(
            timestamp_ms=int(item[0]),
            open_price=item[1],
            high_price=item[2],
            low_price=item[3],
            close_price=item[4],
            volume=item[5],
        )
        for item in rows
        if isinstance(item, list) and len(item) >= 6
    ]
    points.sort(key=lambda item: item["timestamp"])
    fetched_at = timezone.now().isoformat()
    return CryptoMarketChart(
        provider=CRYPTO_MARKET_PROVIDER_BYBIT,
        symbol=symbol,
        quote_currency=config["quote_currency"],
        range_key=range_key,
        points=points,
        fetched_at=fetched_at,
    )


def _fetch_kraken_chart(symbol: str, range_key: str) -> CryptoMarketChart:
    config = _chart_range_config(CRYPTO_MARKET_PROVIDER_KRAKEN, range_key)
    response = requests.get(
        "https://api.kraken.com/0/public/OHLC",
        params={
            "pair": _kraken_chart_symbol(symbol),
            "interval": config["interval"],
        },
        headers={"Accept": "application/json"},
        timeout=_market_timeout(),
    )
    try:
        response.raise_for_status()
    except requests.HTTPError as exc:
        raise CryptoMarketDataError(f"Kraken chart request failed: {exc}") from exc

    payload = response.json()
    if not isinstance(payload, dict):
        raise CryptoMarketDataError("Kraken chart response has unexpected format.")
    errors = payload.get("error")
    if isinstance(errors, list) and errors:
        raise CryptoMarketDataError(f"Kraken chart request failed: {'; '.join(str(item) for item in errors)}")

    rows_by_pair = payload.get("result")
    if not isinstance(rows_by_pair, dict):
        raise CryptoMarketDataError("Kraken chart response has unexpected format.")

    rows = next(
        (
            value
            for key, value in rows_by_pair.items()
            if key != "last" and isinstance(value, list)
        ),
        None,
    )
    if not isinstance(rows, list):
        raise CryptoMarketDataError("Kraken chart response has unexpected format.")

    if range_key == CRYPTO_MARKET_CHART_RANGE_24H:
        rows = rows[-24:]
    elif range_key == CRYPTO_MARKET_CHART_RANGE_7D:
        rows = rows[-42:]
    elif range_key == CRYPTO_MARKET_CHART_RANGE_30D:
        rows = rows[-30:]
    else:
        rows = rows[-90:]

    points = [
        _build_chart_point(
            timestamp_ms=int(item[0]) * 1000,
            open_price=item[1],
            high_price=item[2],
            low_price=item[3],
            close_price=item[4],
            volume=item[6],
        )
        for item in rows
        if isinstance(item, list) and len(item) >= 7
    ]
    fetched_at = timezone.now().isoformat()
    return CryptoMarketChart(
        provider=CRYPTO_MARKET_PROVIDER_KRAKEN,
        symbol=symbol,
        quote_currency=config["quote_currency"],
        range_key=range_key,
        points=points,
        fetched_at=fetched_at,
    )


def _fetch_binance_snapshot() -> CryptoMarketSnapshot:
    symbol_map = {
        f"{asset['symbol']}USDT": asset
        for asset in CRYPTO_MARKET_ASSETS
    }
    symbols = list(symbol_map.keys())
    payload: list[dict[str, Any]] = []

    response = requests.get(
        "https://api.binance.com/api/v3/ticker/24hr",
        params={"symbols": json.dumps(symbols, separators=(",", ":"))},
        headers={"Accept": "application/json"},
        timeout=_market_timeout(),
    )
    try:
        response.raise_for_status()
        batch_payload = response.json()
        if not isinstance(batch_payload, list):
            raise CryptoMarketDataError("Binance response has unexpected format.")
        payload = batch_payload
    except requests.HTTPError as exc:
        if response.status_code != 400:
            raise CryptoMarketDataError(f"Binance request failed: {exc}") from exc

        for symbol in symbols:
            single_response = requests.get(
                "https://api.binance.com/api/v3/ticker/24hr",
                params={"symbol": symbol},
                headers={"Accept": "application/json"},
                timeout=_market_timeout(),
            )
            if single_response.status_code == 400:
                continue
            try:
                single_response.raise_for_status()
            except requests.HTTPError as single_exc:
                raise CryptoMarketDataError(f"Binance request failed: {single_exc}") from single_exc

            item = single_response.json()
            if isinstance(item, dict):
                payload.append(item)

    assets_by_symbol: dict[str, dict[str, Any]] = {}
    fetched_at = timezone.now().isoformat()
    for item in payload:
        if not isinstance(item, dict):
            continue
        pair_symbol = str(item.get("symbol", "")).upper()
        asset = symbol_map.get(pair_symbol)
        if asset is None:
            continue
        last_price = _parse_decimal(item.get("lastPrice"), field_name="lastPrice")
        change_percent = _parse_decimal(item.get("priceChangePercent"), field_name="priceChangePercent")
        assets_by_symbol[asset["symbol"]] = {
            **asset,
            "price": _decimal_to_string(last_price, "0.00000001"),
            "price_change_24h": _decimal_to_string(change_percent, "0.01"),
            "quote_currency": "USDT",
            "provider": CRYPTO_MARKET_PROVIDER_BINANCE,
            "last_updated": fetched_at,
        }

    ordered_assets = [
        assets_by_symbol[asset["symbol"]]
        for asset in CRYPTO_MARKET_ASSETS
        if asset["symbol"] in assets_by_symbol
    ]
    return CryptoMarketSnapshot(
        provider=CRYPTO_MARKET_PROVIDER_BINANCE,
        assets=ordered_assets,
        fetched_at=fetched_at,
    )


def _fetch_okx_snapshot() -> CryptoMarketSnapshot:
    response = requests.get(
        "https://www.okx.com/api/v5/market/tickers",
        params={"instType": "SPOT"},
        headers={"Accept": "application/json"},
        timeout=_market_timeout(),
    )
    try:
        response.raise_for_status()
    except requests.HTTPError as exc:
        raise CryptoMarketDataError(f"OKX request failed: {exc}") from exc

    payload = response.json()
    rows = payload.get("data") if isinstance(payload, dict) else None
    if not isinstance(rows, list):
        raise CryptoMarketDataError("OKX response has unexpected format.")

    market_rows = {
        str(item.get("instId", "")).upper(): item
        for item in rows
        if isinstance(item, dict)
    }
    fetched_at = timezone.now().isoformat()
    assets: list[dict[str, Any]] = []

    for asset in CRYPTO_MARKET_ASSETS:
        instrument_id = f"{asset['symbol']}-USDT"
        row = market_rows.get(instrument_id)
        if row is None:
            continue
        last_price = _parse_decimal(row.get("last"), field_name="last")
        open_price = _parse_decimal(row.get("open24h"), field_name="open24h")
        change_percent = _calculate_change_percent(last_price, open_price)
        assets.append(
            {
                **asset,
                "price": _decimal_to_string(last_price, "0.00000001"),
                "price_change_24h": _decimal_to_string(change_percent, "0.01"),
                "quote_currency": "USDT",
                "provider": CRYPTO_MARKET_PROVIDER_OKX,
                "last_updated": fetched_at,
            }
        )

    return CryptoMarketSnapshot(
        provider=CRYPTO_MARKET_PROVIDER_OKX,
        assets=assets,
        fetched_at=fetched_at,
    )


def _fetch_bybit_snapshot() -> CryptoMarketSnapshot:
    response = requests.get(
        "https://api.bybit.com/v5/market/tickers",
        params={"category": "spot"},
        headers={"Accept": "application/json"},
        timeout=_market_timeout(),
    )
    try:
        response.raise_for_status()
    except requests.HTTPError as exc:
        raise CryptoMarketDataError(f"Bybit request failed: {exc}") from exc

    payload = response.json()
    if not isinstance(payload, dict) or payload.get("retCode") != 0:
        raise CryptoMarketDataError("Bybit response has unexpected format.")

    result = payload.get("result")
    rows = result.get("list") if isinstance(result, dict) else None
    if not isinstance(rows, list):
        raise CryptoMarketDataError("Bybit response has unexpected format.")

    market_rows = {
        str(item.get("symbol", "")).upper(): item
        for item in rows
        if isinstance(item, dict)
    }
    fetched_at = timezone.now().isoformat()
    assets: list[dict[str, Any]] = []

    for asset in CRYPTO_MARKET_ASSETS:
        pair_symbol = f"{asset['symbol']}USDT"
        row = market_rows.get(pair_symbol)
        if row is None:
            continue
        last_price = _parse_decimal(row.get("lastPrice"), field_name="lastPrice")
        prev_price = _parse_decimal(row.get("prevPrice24h"), field_name="prevPrice24h")
        change_percent = _calculate_change_percent(last_price, prev_price)
        assets.append(
            {
                **asset,
                "price": _decimal_to_string(last_price, "0.00000001"),
                "price_change_24h": _decimal_to_string(change_percent, "0.01"),
                "quote_currency": "USDT",
                "provider": CRYPTO_MARKET_PROVIDER_BYBIT,
                "last_updated": fetched_at,
            }
        )

    return CryptoMarketSnapshot(
        provider=CRYPTO_MARKET_PROVIDER_BYBIT,
        assets=assets,
        fetched_at=fetched_at,
    )


def _normalize_kraken_pair_key(value: str) -> str:
    normalized = value.upper().replace("/", "").replace("-", "").replace("_", "")
    replacements = {
        "XBT": "BTC",
        "XDG": "DOGE",
    }
    for source, target in replacements.items():
        normalized = normalized.replace(source, target)
    return normalized


def _fetch_kraken_snapshot() -> CryptoMarketSnapshot:
    response = requests.get(
        "https://api.kraken.com/0/public/Ticker",
        headers={"Accept": "application/json"},
        timeout=_market_timeout(),
    )
    try:
        response.raise_for_status()
    except requests.HTTPError as exc:
        raise CryptoMarketDataError(f"Kraken request failed: {exc}") from exc

    payload = response.json()
    if not isinstance(payload, dict):
        raise CryptoMarketDataError("Kraken response has unexpected format.")

    errors = payload.get("error")
    if isinstance(errors, list) and errors:
        raise CryptoMarketDataError(f"Kraken request failed: {'; '.join(str(item) for item in errors)}")

    rows = payload.get("result")
    if not isinstance(rows, dict):
        raise CryptoMarketDataError("Kraken response has unexpected format.")

    market_rows = {
        _normalize_kraken_pair_key(key): value
        for key, value in rows.items()
        if isinstance(key, str) and isinstance(value, dict)
    }
    fetched_at = timezone.now().isoformat()
    assets: list[dict[str, Any]] = []

    for asset in CRYPTO_MARKET_ASSETS:
        pair_symbol = _normalize_kraken_pair_key(f"{asset['symbol']}USDT")
        row = market_rows.get(pair_symbol)
        if row is None:
            continue
        last_trade = row.get("c")
        open_price_raw = row.get("o")
        if not isinstance(last_trade, list) or not last_trade:
            continue
        last_price = _parse_decimal(last_trade[0], field_name="c[0]")
        open_price = _parse_decimal(open_price_raw, field_name="o")
        change_percent = _calculate_change_percent(last_price, open_price)
        assets.append(
            {
                **asset,
                "price": _decimal_to_string(last_price, "0.00000001"),
                "price_change_24h": _decimal_to_string(change_percent, "0.01"),
                "quote_currency": "USDT",
                "provider": CRYPTO_MARKET_PROVIDER_KRAKEN,
                "last_updated": fetched_at,
            }
        )

    return CryptoMarketSnapshot(
        provider=CRYPTO_MARKET_PROVIDER_KRAKEN,
        assets=assets,
        fetched_at=fetched_at,
    )


def fetch_crypto_market_snapshot(provider: str | None) -> CryptoMarketSnapshot:
    normalized_provider = normalize_crypto_market_provider(provider)
    if normalized_provider == CRYPTO_MARKET_PROVIDER_OKX:
        return _fetch_okx_snapshot()
    if normalized_provider == CRYPTO_MARKET_PROVIDER_BYBIT:
        return _fetch_bybit_snapshot()
    if normalized_provider == CRYPTO_MARKET_PROVIDER_KRAKEN:
        return _fetch_kraken_snapshot()
    return _fetch_binance_snapshot()
