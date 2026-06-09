"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  RiExchangeFundsLine,
  RiLineChartLine,
  RiShieldCheckLine,
  RiStackLine,
} from "react-icons/ri";

import { WorkspaceSelect } from "@/components/workspace/finance-workspace-ui";
import { CryptoAssetIcon } from "@/components/workspace/crypto-asset-icon";
import { CurrencyFlag } from "@/components/workspace/currency-flag";
import type { Locale } from "@/lib/i18n/config";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type WorkspaceMarketsSectionProps = {
  locale: Locale;
  defaultFiatQuote: string;
  cryptoProvider: "binance" | "okx" | "bybit" | "kraken";
  onCryptoProviderChange: (value: "binance" | "okx" | "bybit" | "kraken") => void;
};

type BinanceTickerRecord = {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  weightedAvgPrice: string;
  closeTime: number;
};

type CryptoProvider = "binance" | "okx" | "bybit" | "kraken";

type CryptoTickerRecord = {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  weightedAvgPrice: string;
  closeTime: number;
};

type CryptoSeriesPoint = {
  label: string;
  close: number;
  high: number;
  low: number;
  volume: number;
};

type FiatRateRow = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};

type FrankfurterLatestResponse = {
  date?: string;
  base?: string;
  rates?: Record<string, number>;
};

type FrankfurterSeriesResponse = {
  rates?: Record<string, Record<string, number> | number>;
};

const BINANCE_API_BASE = "https://api.binance.com";
const OKX_API_BASE = "https://www.okx.com";
const BYBIT_API_BASE = "https://api.bybit.com";
const FRANKFURTER_API_BASE = "https://api.frankfurter.dev/v2";
const CRYPTO_SYMBOL_OPTIONS = [
  { value: "BTCUSDT", label: "BTC / USDT", base: "BTC", icon: "bitcoin", color: "amber", providerSymbols: { binance: "BTCUSDT", okx: "BTC-USDT", bybit: "BTCUSDT" } },
  { value: "ETHUSDT", label: "ETH / USDT", base: "ETH", icon: "ethereum", color: "indigo", providerSymbols: { binance: "ETHUSDT", okx: "ETH-USDT", bybit: "ETHUSDT" } },
  { value: "SOLUSDT", label: "SOL / USDT", base: "SOL", icon: "solana", color: "violet", providerSymbols: { binance: "SOLUSDT", okx: "SOL-USDT", bybit: "SOLUSDT" } },
  { value: "BNBUSDT", label: "BNB / USDT", base: "BNB", icon: "bnb", color: "yellow", providerSymbols: { binance: "BNBUSDT", okx: "BNB-USDT", bybit: "BNBUSDT" } },
  { value: "XRPUSDT", label: "XRP / USDT", base: "XRP", icon: "xrp", color: "slate", providerSymbols: { binance: "XRPUSDT", okx: "XRP-USDT", bybit: "XRPUSDT" } },
  { value: "ADAUSDT", label: "ADA / USDT", base: "ADA", icon: "cardano", color: "blue", providerSymbols: { binance: "ADAUSDT", okx: "ADA-USDT", bybit: "ADAUSDT" } },
  { value: "DOGEUSDT", label: "DOGE / USDT", base: "DOGE", icon: "dogecoin", color: "amber", providerSymbols: { binance: "DOGEUSDT", okx: "DOGE-USDT", bybit: "DOGEUSDT" } },
  { value: "LINKUSDT", label: "LINK / USDT", base: "LINK", icon: "chainlink", color: "blue", providerSymbols: { binance: "LINKUSDT", okx: "LINK-USDT", bybit: "LINKUSDT" } },
  { value: "TONUSDT", label: "TON / USDT", base: "TON", icon: "ton", color: "sky", providerSymbols: { binance: "TONUSDT", okx: "TON-USDT", bybit: "TONUSDT" } },
  { value: "TRXUSDT", label: "TRX / USDT", base: "TRX", icon: "tron", color: "red", providerSymbols: { binance: "TRXUSDT", okx: "TRX-USDT", bybit: "TRXUSDT" } },
  { value: "DOTUSDT", label: "DOT / USDT", base: "DOT", icon: "polkadot", color: "fuchsia", providerSymbols: { binance: "DOTUSDT", okx: "DOT-USDT", bybit: "DOTUSDT" } },
  { value: "LTCUSDT", label: "LTC / USDT", base: "LTC", icon: "litecoin", color: "slate", providerSymbols: { binance: "LTCUSDT", okx: "LTC-USDT", bybit: "LTCUSDT" } },
  { value: "BCHUSDT", label: "BCH / USDT", base: "BCH", icon: "bitcoin-cash", color: "emerald", providerSymbols: { binance: "BCHUSDT", okx: "BCH-USDT", bybit: "BCHUSDT" } },
  { value: "AVAXUSDT", label: "AVAX / USDT", base: "AVAX", icon: "avalanche", color: "rose", providerSymbols: { binance: "AVAXUSDT", okx: "AVAX-USDT", bybit: "AVAXUSDT" } },
  { value: "UNIUSDT", label: "UNI / USDT", base: "UNI", icon: "uniswap", color: "pink", providerSymbols: { binance: "UNIUSDT", okx: "UNI-USDT", bybit: "UNIUSDT" } },
  { value: "NEARUSDT", label: "NEAR / USDT", base: "NEAR", icon: "near", color: "slate", providerSymbols: { binance: "NEARUSDT", okx: "NEAR-USDT", bybit: "NEARUSDT" } },
  { value: "APTUSDT", label: "APT / USDT", base: "APT", icon: "aptos", color: "slate", providerSymbols: { binance: "APTUSDT", okx: "APT-USDT", bybit: "APTUSDT" } },
  { value: "ARBUSDT", label: "ARB / USDT", base: "ARB", icon: "arbitrum", color: "sky", providerSymbols: { binance: "ARBUSDT", okx: "ARB-USDT", bybit: "ARBUSDT" } },
  { value: "OPUSDT", label: "OP / USDT", base: "OP", icon: "optimism", color: "red", providerSymbols: { binance: "OPUSDT", okx: "OP-USDT", bybit: "OPUSDT" } },
  { value: "SUIUSDT", label: "SUI / USDT", base: "SUI", icon: "sui", color: "cyan", providerSymbols: { binance: "SUIUSDT", okx: "SUI-USDT", bybit: "SUIUSDT" } },
  { value: "ATOMUSDT", label: "ATOM / USDT", base: "ATOM", icon: "cosmos", color: "indigo", providerSymbols: { binance: "ATOMUSDT", okx: "ATOM-USDT", bybit: "ATOMUSDT" } },
  { value: "USDCUSDT", label: "USDC / USDT", base: "USDC", icon: "usd-coin", color: "blue", providerSymbols: { binance: "USDCUSDT", okx: "USDC-USDT", bybit: "USDCUSDT" } },
  { value: "SHIBUSDT", label: "SHIB / USDT", base: "SHIB", icon: "shiba-inu", color: "orange", providerSymbols: { binance: "SHIBUSDT", okx: "SHIB-USDT", bybit: "SHIBUSDT" } },
] as const;
const FIAT_BASE_OPTIONS = ["USD", "EUR", "GBP", "CHF", "JPY"] as const;
const FIAT_QUOTE_OPTIONS = ["USD", "EUR", "KGS", "KZT", "RUB", "CNY", "GBP", "AED", "TRY", "CHF", "JPY", "CAD", "AUD", "SGD", "UZS"] as const;
const CRYPTO_PROVIDER_OPTIONS = [
  { value: "binance", label: "Binance" },
  { value: "okx", label: "OKX" },
  { value: "bybit", label: "Bybit" },
] as const;
const RANGE_OPTIONS = [
  { value: "7d", label: "7D", fiatDays: 7, crypto: { binanceInterval: "4h", okxBar: "4H", bybitInterval: "240", limit: 42 } },
  { value: "14d", label: "14D", fiatDays: 14, crypto: { binanceInterval: "1d", okxBar: "1Dutc", bybitInterval: "D", limit: 14 } },
  { value: "30d", label: "30D", fiatDays: 30, crypto: { binanceInterval: "1d", okxBar: "1Dutc", bybitInterval: "D", limit: 30 } },
  { value: "90d", label: "90D", fiatDays: 90, crypto: { binanceInterval: "1d", okxBar: "1Dutc", bybitInterval: "D", limit: 90 } },
] as const;

const chartConfig = {
  close: { label: "Close", color: "var(--color-chart-1)" },
  rate: { label: "Rate", color: "var(--color-chart-2)" },
  volume: { label: "Volume", color: "var(--color-chart-3)" },
} satisfies ChartConfig;

const copyByLocale = {
  ru: {
    title: "Рынки и биржевые данные",
    description:
      "Отдельный рыночный экран для крипты и валют. Источник крипты: Binance Spot Public API. Источник FX: Frankfurter с провайдером ECB.",
    cryptoTitle: "Крипторынок",
    cryptoDescription: "24h-статистика и дневной график по публичным market-data endpoint Binance.",
    fiatTitle: "Валютный рынок",
    fiatDescription: "Справочные валютные курсы и динамика пары на базе Frankfurter с фиксацией на ECB.",
    providersTitle: "Провайдеры",
    providersDescription: "Только публичные endpoint без ключей и приватных credentials.",
    cryptoProviderLabel: "Крипто-провайдер",
    fiatProviderLabel: "FX-провайдер",
    rangeLabel: "Период",
    chartTypeLabel: "График",
    chartArea: "Area",
    chartLine: "Line",
    chartBars: "Bars",
    cryptoPairLabel: "Криптопара",
    fiatBaseLabel: "Базовая валюта",
    fiatQuoteLabel: "Валюта котировки",
    updatedLabel: "Обновлено",
    lastPriceLabel: "Последняя цена",
    change24hLabel: "Изменение 24ч",
    dayRangeLabel: "Диапазон дня",
    rangeChangeLabel: "Изменение за период",
    rangeSpreadLabel: "Диапазон периода",
    quoteVolumeLabel: "Объем котировки",
    avgPriceLabel: "Средняя цена",
    fxRateLabel: "Текущий курс",
    fxSeriesLabel: "14 дней",
    quoteAssetVolumeLabel: "Оборот",
    providerPublic: "Публичный API",
    providerVerified: "Документированный источник",
    providerPinned: "Провайдер закреплен",
    loading: "Загружаем рыночные данные...",
    unavailable: "Данные временно недоступны.",
    cryptoTableTitle: "Топ-крипто пары",
    fiatTableTitle: "Ключевые валюты",
    symbolLabel: "Символ",
    pairLabel: "Пара",
    rateLabel: "Курс",
    volumeLabel: "Объем",
    sourceLabel: "Источник",
  },
  en: {
    title: "Markets and exchange data",
    description:
      "Dedicated market screen for crypto and FX. Crypto source: Binance Spot Public API. FX source: Frankfurter pinned to the ECB provider.",
    cryptoTitle: "Crypto market",
    cryptoDescription: "24h statistics and daily chart from Binance public market-data endpoints.",
    fiatTitle: "FX market",
    fiatDescription: "Reference exchange rates and pair history from Frankfurter with the provider pinned to ECB.",
    providersTitle: "Providers",
    providersDescription: "Only public endpoints, no keys and no private credentials.",
    cryptoProviderLabel: "Crypto provider",
    fiatProviderLabel: "FX provider",
    rangeLabel: "Range",
    chartTypeLabel: "Chart",
    chartArea: "Area",
    chartLine: "Line",
    chartBars: "Bars",
    cryptoPairLabel: "Crypto pair",
    fiatBaseLabel: "Base currency",
    fiatQuoteLabel: "Quote currency",
    updatedLabel: "Updated",
    lastPriceLabel: "Last price",
    change24hLabel: "24h change",
    dayRangeLabel: "Day range",
    rangeChangeLabel: "Range change",
    rangeSpreadLabel: "Range span",
    quoteVolumeLabel: "Quote volume",
    avgPriceLabel: "Weighted avg",
    fxRateLabel: "Current rate",
    fxSeriesLabel: "14 days",
    quoteAssetVolumeLabel: "Turnover",
    providerPublic: "Public API",
    providerVerified: "Documented source",
    providerPinned: "Provider pinned",
    loading: "Loading market data...",
    unavailable: "Market data is temporarily unavailable.",
    cryptoTableTitle: "Top crypto pairs",
    fiatTableTitle: "Key currencies",
    symbolLabel: "Symbol",
    pairLabel: "Pair",
    rateLabel: "Rate",
    volumeLabel: "Volume",
    sourceLabel: "Source",
  },
  kg: {
    title: "Рынок жана биржа маалыматтары",
    description:
      "Крипто жана валюта үчүн өзүнчө рынок экраны. Крипто булагы: Binance Spot Public API. FX булагы: ECB провайдерине бекитилген Frankfurter.",
    cryptoTitle: "Крипто рынок",
    cryptoDescription: "Binance'тын ачык market-data endpoint'теринен 24 сааттык статистика жана күндүк график.",
    fiatTitle: "Валюта рынок",
    fiatDescription: "Frankfurter жана ECB булагы аркылуу валюта курстары жана жуп тарыхы.",
    providersTitle: "Провайдерлер",
    providersDescription: "Ачық endpoint'тер гана, ачкычсыз жана жеке credential'сыз.",
    cryptoProviderLabel: "Крипто-провайдер",
    fiatProviderLabel: "FX-провайдер",
    rangeLabel: "Мезгил",
    chartTypeLabel: "График",
    chartArea: "Area",
    chartLine: "Line",
    chartBars: "Bars",
    cryptoPairLabel: "Крипто жуп",
    fiatBaseLabel: "Базалык валюта",
    fiatQuoteLabel: "Котировка валютасы",
    updatedLabel: "Жаңыртылган",
    lastPriceLabel: "Акыркы баа",
    change24hLabel: "24 саат өзгөрүү",
    dayRangeLabel: "Күн диапазону",
    rangeChangeLabel: "Мезгил өзгөрүүсү",
    rangeSpreadLabel: "Мезгил диапазону",
    quoteVolumeLabel: "Котировка көлөмү",
    avgPriceLabel: "Орточо баа",
    fxRateLabel: "Учурдагы курс",
    fxSeriesLabel: "14 күн",
    quoteAssetVolumeLabel: "Жүгүртүү",
    providerPublic: "Ачык API",
    providerVerified: "Документацияланган булак",
    providerPinned: "Провайдер бекитилген",
    loading: "Рынок маалыматтары жүктөлүп жатат...",
    unavailable: "Рынок маалыматтары убактылуу жеткиликсиз.",
    cryptoTableTitle: "Негизги крипто жуптар",
    fiatTableTitle: "Негизги валюталар",
    symbolLabel: "Символ",
    pairLabel: "Жуп",
    rateLabel: "Курс",
    volumeLabel: "Көлөм",
    sourceLabel: "Булак",
  },
} as const;

function getLocaleCopy(locale: Locale) {
  if (locale === "kg") {
    return copyByLocale.kg;
  }
  if (locale === "en") {
    return copyByLocale.en;
  }
  return copyByLocale.ru;
}

async function fetchBinanceTickers(symbols: string[]) {
  const url = `${BINANCE_API_BASE}/api/v3/ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(symbols))}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Binance ${response.status}`);
  }
  return response.json() as Promise<BinanceTickerRecord[]>;
}

async function fetchCryptoTickers(provider: CryptoProvider, symbols: typeof CRYPTO_SYMBOL_OPTIONS) {
  const normalizedProvider = provider === "kraken" ? "binance" : provider;
  if (normalizedProvider === "binance") {
    const payload = await fetchBinanceTickers(symbols.map((item) => item.providerSymbols.binance));
    return payload.map((item) => ({ ...item, symbol: item.symbol })) as CryptoTickerRecord[];
  }

  if (normalizedProvider === "okx") {
    const response = await fetch(`${OKX_API_BASE}/api/v5/market/tickers?instType=SPOT`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`OKX ${response.status}`);
    }
    const payload = (await response.json()) as { data?: Array<Record<string, string>> };
    const rows = payload.data ?? [];
    return symbols
      .map((option) => {
        const row = rows.find((item) => item.instId === option.providerSymbols.okx);
        if (!row) {
          return null;
        }
        return {
          symbol: option.value,
          lastPrice: row.last ?? "0",
          priceChangePercent: row.open24h && Number(row.open24h) !== 0
            ? String(((Number(row.last) - Number(row.open24h)) / Number(row.open24h)) * 100)
            : "0",
          highPrice: row.high24h ?? row.last ?? "0",
          lowPrice: row.low24h ?? row.last ?? "0",
          volume: row.vol24h ?? "0",
          quoteVolume: row.volCcy24h ?? "0",
          weightedAvgPrice: row.last ?? "0",
          closeTime: Number(row.ts ?? Date.now()),
        } satisfies CryptoTickerRecord;
      })
      .filter((item): item is CryptoTickerRecord => item !== null);
  }

  const response = await fetch(`${BYBIT_API_BASE}/v5/market/tickers?category=spot`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Bybit ${response.status}`);
  }
  const payload = (await response.json()) as { result?: { list?: Array<Record<string, string>> } };
  const rows = payload.result?.list ?? [];
  return symbols
    .map((option) => {
      const row = rows.find((item) => item.symbol === option.providerSymbols.bybit);
      if (!row) {
        return null;
      }
      return {
        symbol: option.value,
        lastPrice: row.lastPrice ?? "0",
        priceChangePercent: String(Number(row.price24hPcnt ?? "0") * 100),
        highPrice: row.highPrice24h ?? row.lastPrice ?? "0",
        lowPrice: row.lowPrice24h ?? row.lastPrice ?? "0",
        volume: row.volume24h ?? "0",
        quoteVolume: row.turnover24h ?? "0",
        weightedAvgPrice: row.lastPrice ?? "0",
        closeTime: Date.now(),
      } satisfies CryptoTickerRecord;
    })
    .filter((item): item is CryptoTickerRecord => item !== null);
}

async function fetchCryptoSeries(
  provider: CryptoProvider,
  symbol: typeof CRYPTO_SYMBOL_OPTIONS[number],
  range: typeof RANGE_OPTIONS[number],
) {
  const normalizedProvider = provider === "kraken" ? "binance" : provider;
  if (normalizedProvider === "binance") {
    return fetchBinanceSeries(symbol.providerSymbols.binance, range.crypto.binanceInterval, range.crypto.limit);
  }
  if (normalizedProvider === "okx") {
    const response = await fetch(
      `${OKX_API_BASE}/api/v5/market/candles?instId=${symbol.providerSymbols.okx}&bar=${range.crypto.okxBar}&limit=${range.crypto.limit}`,
      { cache: "no-store" },
    );
    if (!response.ok) {
      throw new Error(`OKX ${response.status}`);
    }
    const payload = (await response.json()) as { data?: Array<[string, string, string, string, string, string, string, string, string]> };
    return (payload.data ?? [])
      .slice()
      .reverse()
      .map((entry) => ({
        label: new Date(Number(entry[0])).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
        close: Number(entry[4]),
        high: Number(entry[2]),
        low: Number(entry[3]),
        volume: Number(entry[5]),
      }));
  }

  const response = await fetch(
    `${BYBIT_API_BASE}/v5/market/kline?category=spot&symbol=${symbol.providerSymbols.bybit}&interval=${range.crypto.bybitInterval}&limit=${range.crypto.limit}`,
    { cache: "no-store" },
  );
  if (!response.ok) {
    throw new Error(`Bybit ${response.status}`);
  }
  const payload = (await response.json()) as { result?: { list?: Array<[string, string, string, string, string, string, string]> } };
  return (payload.result?.list ?? [])
    .slice()
    .reverse()
    .map((entry) => ({
      label: new Date(Number(entry[0])).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      close: Number(entry[4]),
      high: Number(entry[2]),
      low: Number(entry[3]),
      volume: Number(entry[5]),
    }));
}

async function fetchBinanceSeries(symbol: string, interval: string, limit: number) {
  const url = `${BINANCE_API_BASE}/api/v3/uiKlines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Binance ${response.status}`);
  }

  const payload = (await response.json()) as Array<[number, string, string, string, string, string]>;
  return payload.map((entry) => ({
    label: new Date(entry[0]).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    close: Number(entry[4]),
    high: Number(entry[2]),
    low: Number(entry[3]),
    volume: Number(entry[5]),
  }));
}

async function fetchFrankfurterRates(base: string, quotes: string[]) {
  const url = `${FRANKFURTER_API_BASE}/rates?base=${base}&quotes=${quotes.join(",")}&providers=ECB`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Frankfurter ${response.status}`);
  }

  const payload = (await response.json()) as FiatRateRow[] | FrankfurterLatestResponse;
  if (Array.isArray(payload)) {
    return payload;
  }

  const rates = payload.rates;
  if (!rates || typeof rates !== "object") {
    return [];
  }

  const date = typeof payload.date === "string" ? payload.date : new Date().toISOString().slice(0, 10);
  const normalizedBase = typeof payload.base === "string" ? payload.base : base;

  return Object.entries(rates)
    .filter(([, rate]) => typeof rate === "number" && Number.isFinite(rate))
    .map(([quote, rate]) => ({
      date,
      base: normalizedBase,
      quote,
      rate,
    }));
}

async function fetchFrankfurterSeries(base: string, quote: string, days: number) {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);
  const from = fromDate.toISOString().slice(0, 10);
  const url = `${FRANKFURTER_API_BASE}/rates?base=${base}&quotes=${quote}&from=${from}&providers=ECB`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Frankfurter ${response.status}`);
  }

  const payload = (await response.json()) as FiatRateRow[] | FrankfurterSeriesResponse;
  if (Array.isArray(payload)) {
    return payload.slice(-14).map((entry) => ({
      label: new Date(entry.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      rate: entry.rate,
    }));
  }

  const rates = payload.rates;
  if (!rates || typeof rates !== "object") {
    return [];
  }

  return Object.entries(rates)
    .map(([date, value]) => {
      const resolvedRate =
        typeof value === "number"
          ? value
          : typeof value === "object" && value !== null && typeof value[quote] === "number"
            ? value[quote]
            : null;

      if (resolvedRate === null) {
        return null;
      }

      return {
        label: new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
        rate: resolvedRate,
      };
    })
    .filter((entry): entry is { label: string; rate: number } => entry !== null)
    .slice(-14);
}

function formatCompactNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "ru-RU", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDecimal(value: number, locale: Locale, maximumFractionDigits = 4) {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "ru-RU", {
    maximumFractionDigits,
  }).format(value);
}

function formatPercent(value: number, locale: Locale) {
  return `${value > 0 ? "+" : ""}${formatDecimal(value, locale, 2)}%`;
}

function renderCurrencyOption(code: string) {
  return (
    <span className="inline-flex items-center gap-2">
      <CurrencyFlag currencyCode={code} />
      <span>{code}</span>
    </span>
  );
}

export function WorkspaceMarketsSection({
  locale,
  defaultFiatQuote,
  cryptoProvider,
  onCryptoProviderChange,
}: WorkspaceMarketsSectionProps) {
  const copy = getLocaleCopy(locale);
  const [selectedCryptoSymbol, setSelectedCryptoSymbol] = useState<string>("BTCUSDT");
  const [selectedFiatBase, setSelectedFiatBase] = useState<string>("USD");
  const [selectedFiatQuote, setSelectedFiatQuote] = useState<string>(
    FIAT_QUOTE_OPTIONS.includes(defaultFiatQuote as typeof FIAT_QUOTE_OPTIONS[number]) ? defaultFiatQuote : "KGS",
  );
  const [selectedRange, setSelectedRange] = useState<(typeof RANGE_OPTIONS)[number]["value"]>("30d");
  const [cryptoChartType, setCryptoChartType] = useState<"area" | "line" | "bars">("area");
  const [fiatChartType, setFiatChartType] = useState<"line" | "bars">("line");
  const effectiveCryptoProvider = CRYPTO_PROVIDER_OPTIONS.some((item) => item.value === cryptoProvider) ? cryptoProvider : "binance";
  const selectedRangeOption = RANGE_OPTIONS.find((item) => item.value === selectedRange) ?? RANGE_OPTIONS[2];
  const selectedCryptoOption = CRYPTO_SYMBOL_OPTIONS.find((item) => item.value === selectedCryptoSymbol) ?? CRYPTO_SYMBOL_OPTIONS[0];

  const cryptoOverviewQuery = useQuery({
    queryKey: ["workspace-markets-crypto-overview", effectiveCryptoProvider],
    queryFn: () => fetchCryptoTickers(effectiveCryptoProvider, CRYPTO_SYMBOL_OPTIONS),
    staleTime: 10_000,
    refetchInterval: 15_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    retry: 1,
  });
  const cryptoSeriesQuery = useQuery({
    queryKey: ["workspace-markets-crypto-series", effectiveCryptoProvider, selectedCryptoSymbol, selectedRange],
    queryFn: () => fetchCryptoSeries(effectiveCryptoProvider, selectedCryptoOption, selectedRangeOption),
    staleTime: 15_000,
    refetchInterval: 20_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    retry: 1,
  });
  const fiatQuotes = useMemo(
    () => FIAT_QUOTE_OPTIONS.filter((code) => code !== selectedFiatBase),
    [selectedFiatBase],
  );
  const fiatOverviewQuery = useQuery({
    queryKey: ["workspace-markets-fiat-overview", selectedFiatBase],
    queryFn: () => fetchFrankfurterRates(selectedFiatBase, fiatQuotes),
    staleTime: 60_000,
    retry: 1,
  });
  const fiatSeriesQuery = useQuery({
    queryKey: ["workspace-markets-fiat-series", selectedFiatBase, selectedFiatQuote, selectedRange],
    queryFn: () => fetchFrankfurterSeries(selectedFiatBase, selectedFiatQuote, selectedRangeOption.fiatDays),
    staleTime: 60_000,
    retry: 1,
  });

  const cryptoTickers = useMemo(
    () =>
      [...(cryptoOverviewQuery.data ?? [])].sort(
        (left, right) => Number(right.quoteVolume) - Number(left.quoteVolume),
      ),
    [cryptoOverviewQuery.data],
  );
  const selectedCryptoTicker = cryptoTickers.find((item) => item.symbol === selectedCryptoSymbol) ?? null;
  const fiatRates = fiatOverviewQuery.data ?? [];
  const selectedFiatRate = fiatRates.find((item) => item.quote === selectedFiatQuote) ?? null;
  const selectedProviderLabel = CRYPTO_PROVIDER_OPTIONS.find((item) => item.value === effectiveCryptoProvider)?.label ?? "Binance";
  const cryptoSeries = (cryptoSeriesQuery.data ?? []) as CryptoSeriesPoint[];
  const selectedCryptoRangeMetrics = useMemo(() => {
    if (cryptoSeries.length === 0) {
      return null;
    }

    const firstPoint = cryptoSeries[0];
    const lastPoint = cryptoSeries[cryptoSeries.length - 1];
    const closes = cryptoSeries.map((item) => item.close);
    const lows = cryptoSeries.map((item) => item.low);
    const highs = cryptoSeries.map((item) => item.high);
    const averageClose = closes.reduce((sum, value) => sum + value, 0) / closes.length;
    const changePercent = firstPoint.close !== 0 ? ((lastPoint.close - firstPoint.close) / firstPoint.close) * 100 : 0;

    return {
      lastPrice: lastPoint.close,
      changePercent,
      low: Math.min(...lows),
      high: Math.max(...highs),
      averageClose,
    };
  }, [cryptoSeries]);

  return (
    <div className="space-y-6">
      <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
        <CardHeader className="p-6">
          <CardTitle className="text-white">{copy.title}</CardTitle>
          <CardDescription className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
            {copy.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 p-6 pt-0 lg:grid-cols-3">
          <div className="rounded-[1.5rem] border border-cyan-300/16 bg-cyan-300/[0.06] p-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-cyan-300/18 bg-cyan-300/10 text-cyan-100">
                <RiStackLine className="size-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-white">{copy.cryptoProviderLabel}</p>
                <p className="text-xs text-zinc-400">{copy.providerPublic}</p>
              </div>
            </div>
            <div className="mt-4">
              <WorkspaceSelect
                value={effectiveCryptoProvider}
                onValueChange={(value) => onCryptoProviderChange(value as "binance" | "okx" | "bybit" | "kraken")}
                options={CRYPTO_PROVIDER_OPTIONS.map((item) => ({ value: item.value, label: item.label }))}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline" className="border-white/10 bg-white/5 text-zinc-200">{copy.providerVerified}</Badge>
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-emerald-300/16 bg-emerald-300/[0.06] p-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-emerald-300/18 bg-emerald-300/10 text-emerald-100">
                <RiExchangeFundsLine className="size-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-white">{copy.fiatProviderLabel}</p>
                <p className="text-xs text-zinc-400">{copy.providerPublic}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline" className="border-white/10 bg-white/5 text-zinc-200">Frankfurter</Badge>
              <Badge variant="outline" className="border-white/10 bg-white/5 text-zinc-200">{copy.providerPinned}</Badge>
              <Badge variant="outline" className="border-white/10 bg-white/5 text-zinc-200">ECB</Badge>
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-100">
                <RiShieldCheckLine className="size-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-white">{copy.providersTitle}</p>
                <p className="text-xs text-zinc-400">{copy.providersDescription}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-300">
              {copy.updatedLabel}:{" "}
              {selectedCryptoTicker
                ? new Date(selectedCryptoTicker.closeTime).toLocaleString(locale === "en" ? "en-US" : "ru-RU")
                : "—"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
        <Tabs defaultValue="crypto" className="gap-0">
          <CardHeader className="flex flex-col gap-5 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <CardTitle className="text-white">{copy.title}</CardTitle>
                <CardDescription className="mt-2 text-sm leading-6 text-zinc-400">
                  {copy.description}
                </CardDescription>
              </div>
              <TabsList className="grid w-full grid-cols-2 rounded-2xl border border-white/10 bg-black/18 p-1 lg:max-w-sm">
                <TabsTrigger className="rounded-[1rem] text-zinc-300 data-active:bg-white/10 data-active:text-white" value="crypto">
                  {copy.cryptoTitle}
                </TabsTrigger>
                <TabsTrigger className="rounded-[1rem] text-zinc-300 data-active:bg-white/10 data-active:text-white" value="fiat">
                  {copy.fiatTitle}
                </TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-0">
            <TabsContent value="crypto" className="space-y-6">
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_220px_1fr] xl:items-end">
                <div className="max-w-xl">
                  <h3 className="text-lg font-semibold text-white">{copy.cryptoTitle}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{copy.cryptoDescription}</p>
                </div>
                <div className="w-full">
                  <p className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-500">{copy.cryptoPairLabel}</p>
                  <WorkspaceSelect
                    value={selectedCryptoSymbol}
                    onValueChange={setSelectedCryptoSymbol}
                    options={CRYPTO_SYMBOL_OPTIONS.map((item) => ({
                      value: item.value,
                      label: (
                        <span className="inline-flex items-center gap-2">
                          <CryptoAssetIcon icon={item.icon} symbol={item.base} color={item.color} />
                          <span>{item.label}</span>
                        </span>
                      ),
                    }))}
                  />
                </div>
                <div className="w-full">
                  <p className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-500">{copy.chartTypeLabel}</p>
                  <WorkspaceSelect
                    value={cryptoChartType}
                    onValueChange={(value) => setCryptoChartType(value as "area" | "line" | "bars")}
                    options={[
                      { value: "area", label: copy.chartArea },
                      { value: "line", label: copy.chartLine },
                      { value: "bars", label: copy.chartBars },
                    ]}
                  />
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-500">{copy.rangeLabel}</p>
                  <div className="flex flex-wrap gap-2">
                    {RANGE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSelectedRange(option.value)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                          selectedRange === option.value
                            ? "border-emerald-300/18 bg-emerald-300/12 text-emerald-100"
                            : "border-white/8 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {cryptoOverviewQuery.isLoading || cryptoSeriesQuery.isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 rounded-[1.5rem] bg-white/8" />
                  <Skeleton className="h-72 rounded-[1.5rem] bg-white/8" />
                </div>
              ) : selectedCryptoTicker && selectedCryptoRangeMetrics ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-[1.4rem] border border-white/8 bg-black/18 p-4">
                      <p className="text-sm text-zinc-500">{copy.lastPriceLabel}</p>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        {formatDecimal(selectedCryptoRangeMetrics.lastPrice, locale, 2)}
                      </p>
                    </div>
                    <div className="rounded-[1.4rem] border border-white/8 bg-black/18 p-4">
                      <p className="text-sm text-zinc-500">{copy.rangeChangeLabel}</p>
                      <p className={`mt-2 text-2xl font-semibold ${selectedCryptoRangeMetrics.changePercent >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                        {formatPercent(selectedCryptoRangeMetrics.changePercent, locale)}
                      </p>
                    </div>
                    <div className="rounded-[1.4rem] border border-white/8 bg-black/18 p-4">
                      <p className="text-sm text-zinc-500">{copy.rangeSpreadLabel}</p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {formatDecimal(selectedCryptoRangeMetrics.low, locale, 2)} - {formatDecimal(selectedCryptoRangeMetrics.high, locale, 2)}
                      </p>
                    </div>
                    <div className="rounded-[1.4rem] border border-white/8 bg-black/18 p-4">
                      <p className="text-sm text-zinc-500">{copy.avgPriceLabel}</p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {formatDecimal(selectedCryptoRangeMetrics.averageClose, locale, 2)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[1.6rem] border border-white/8 bg-black/18 p-4">
                    <ChartContainer config={chartConfig} className="h-[18rem] w-full">
                      {cryptoChartType === "area" ? (
                        <AreaChart data={cryptoSeriesQuery.data ?? []} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="cryptoGradient" x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor="var(--color-close)" stopOpacity={0.45} />
                              <stop offset="100%" stopColor="var(--color-close)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
                          <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={24} />
                          <YAxis tickLine={false} axisLine={false} width={72} tickFormatter={(value: number) => formatCompactNumber(value, locale)} />
                          <ChartTooltip content={<ChartTooltipContent labelKey="label" formatter={(value) => formatDecimal(Number(value), locale, 2)} />} />
                          <Area type="monotone" dataKey="close" stroke="var(--color-close)" strokeWidth={2} fill="url(#cryptoGradient)" />
                        </AreaChart>
                      ) : cryptoChartType === "line" ? (
                        <LineChart data={cryptoSeriesQuery.data ?? []} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
                          <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={24} />
                          <YAxis tickLine={false} axisLine={false} width={72} tickFormatter={(value: number) => formatCompactNumber(value, locale)} />
                          <ChartTooltip content={<ChartTooltipContent labelKey="label" formatter={(value) => formatDecimal(Number(value), locale, 2)} />} />
                          <Line type="monotone" dataKey="close" stroke="var(--color-close)" strokeWidth={2.5} dot={false} />
                        </LineChart>
                      ) : (
                        <BarChart data={cryptoSeriesQuery.data ?? []} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
                          <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={24} />
                          <YAxis tickLine={false} axisLine={false} width={72} tickFormatter={(value: number) => formatCompactNumber(value, locale)} />
                          <ChartTooltip content={<ChartTooltipContent labelKey="label" formatter={(value) => formatDecimal(Number(value), locale, 2)} />} />
                          <Bar dataKey="close" fill="var(--color-close)" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      )}
                    </ChartContainer>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/8 bg-black/18 p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-medium text-white">{copy.cryptoTableTitle}</h3>
                      <Badge variant="outline" className="border-white/10 bg-white/5 text-zinc-200">{selectedProviderLabel}</Badge>
                    </div>
                    <div className="space-y-3">
                      {cryptoTickers.map((ticker) => (
                        <div key={ticker.symbol} className="grid gap-3 rounded-[1.2rem] border border-white/8 bg-white/[0.03] px-4 py-3 sm:grid-cols-[1.1fr_0.9fr_0.9fr]">
                          <div>
                            <p className="inline-flex items-center gap-2 text-sm font-medium text-white">
                              <CryptoAssetIcon
                                icon={(CRYPTO_SYMBOL_OPTIONS.find((item) => item.value === ticker.symbol) ?? CRYPTO_SYMBOL_OPTIONS[0]).icon}
                                symbol={(CRYPTO_SYMBOL_OPTIONS.find((item) => item.value === ticker.symbol) ?? CRYPTO_SYMBOL_OPTIONS[0]).base}
                                color={(CRYPTO_SYMBOL_OPTIONS.find((item) => item.value === ticker.symbol) ?? CRYPTO_SYMBOL_OPTIONS[0]).color}
                              />
                              {ticker.symbol.replace("USDT", " / USDT")}
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">{copy.symbolLabel}</p>
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${Number(ticker.priceChangePercent) >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                              {formatPercent(Number(ticker.priceChangePercent), locale)}
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">{copy.change24hLabel}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {formatCompactNumber(Number(ticker.quoteVolume), locale)}
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">{copy.quoteAssetVolumeLabel}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-black/18 px-4 py-8 text-sm text-zinc-400">
                  {copy.unavailable}
                </div>
              )}
            </TabsContent>

            <TabsContent value="fiat" className="space-y-6">
              <div className="grid gap-3 lg:grid-cols-2">
                <div className="max-w-xl">
                  <h3 className="text-lg font-semibold text-white">{copy.fiatTitle}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{copy.fiatDescription}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-500">{copy.fiatBaseLabel}</p>
                    <WorkspaceSelect
                      value={selectedFiatBase}
                      onValueChange={(value) => {
                        setSelectedFiatBase(value);
                        if (value === selectedFiatQuote) {
                          setSelectedFiatQuote(
                            FIAT_QUOTE_OPTIONS.find((item) => item !== value) ?? "EUR",
                          );
                        }
                      }}
                      options={FIAT_BASE_OPTIONS.map((item) => ({ value: item, label: renderCurrencyOption(item) }))}
                    />
                  </div>
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-500">{copy.fiatQuoteLabel}</p>
                    <WorkspaceSelect
                      value={selectedFiatQuote}
                      onValueChange={setSelectedFiatQuote}
                      options={fiatQuotes.map((item) => ({ value: item, label: renderCurrencyOption(item) }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                  {RANGE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSelectedRange(option.value)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        selectedRange === option.value
                          ? "border-emerald-300/18 bg-emerald-300/12 text-emerald-100"
                          : "border-white/8 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <div className="w-full lg:w-[13rem]">
                  <p className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-500">{copy.chartTypeLabel}</p>
                  <WorkspaceSelect
                    value={fiatChartType}
                    onValueChange={(value) => setFiatChartType(value as "line" | "bars")}
                    options={[
                      { value: "line", label: copy.chartLine },
                      { value: "bars", label: copy.chartBars },
                    ]}
                  />
                </div>
              </div>

              {fiatOverviewQuery.isLoading || fiatSeriesQuery.isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 rounded-[1.5rem] bg-white/8" />
                  <Skeleton className="h-72 rounded-[1.5rem] bg-white/8" />
                </div>
              ) : selectedFiatRate ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-[1.4rem] border border-white/8 bg-black/18 p-4">
                      <p className="text-sm text-zinc-500">{copy.pairLabel}</p>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        {selectedFiatBase}/{selectedFiatQuote}
                      </p>
                    </div>
                    <div className="rounded-[1.4rem] border border-white/8 bg-black/18 p-4">
                      <p className="text-sm text-zinc-500">{copy.fxRateLabel}</p>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        {formatDecimal(selectedFiatRate.rate, locale, 4)}
                      </p>
                    </div>
                    <div className="rounded-[1.4rem] border border-white/8 bg-black/18 p-4">
                      <p className="text-sm text-zinc-500">{copy.sourceLabel}</p>
                      <p className="mt-2 text-lg font-semibold text-white">Frankfurter / ECB</p>
                    </div>
                    <div className="rounded-[1.4rem] border border-white/8 bg-black/18 p-4">
                      <p className="text-sm text-zinc-500">{copy.fxSeriesLabel}</p>
                      <p className="mt-2 text-lg font-semibold text-white">{fiatSeriesQuery.data?.length ?? 0} pts</p>
                    </div>
                  </div>

                  <div className="rounded-[1.6rem] border border-white/8 bg-black/18 p-4">
                    <ChartContainer config={chartConfig} className="h-[18rem] w-full">
                      {fiatChartType === "line" ? (
                        <LineChart data={fiatSeriesQuery.data ?? []} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
                          <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={24} />
                          <YAxis tickLine={false} axisLine={false} width={72} tickFormatter={(value: number) => formatDecimal(value, locale, 2)} />
                          <ChartTooltip content={<ChartTooltipContent labelKey="label" formatter={(value) => formatDecimal(Number(value), locale, 4)} />} />
                          <Line type="monotone" dataKey="rate" stroke="var(--color-rate)" strokeWidth={2.5} dot={false} />
                        </LineChart>
                      ) : (
                        <BarChart data={fiatSeriesQuery.data ?? []} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
                          <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={24} />
                          <YAxis tickLine={false} axisLine={false} width={72} tickFormatter={(value: number) => formatDecimal(value, locale, 2)} />
                          <ChartTooltip content={<ChartTooltipContent labelKey="label" formatter={(value) => formatDecimal(Number(value), locale, 4)} />} />
                          <Bar dataKey="rate" fill="var(--color-rate)" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      )}
                    </ChartContainer>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/8 bg-black/18 p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-medium text-white">{copy.fiatTableTitle}</h3>
                      <Badge variant="outline" className="border-white/10 bg-white/5 text-zinc-200">ECB</Badge>
                    </div>
                    <div className="space-y-3">
                      {fiatRates.map((rate) => (
                        <div key={`${rate.base}-${rate.quote}`} className="grid gap-3 rounded-[1.2rem] border border-white/8 bg-white/[0.03] px-4 py-3 sm:grid-cols-[1.1fr_0.9fr_0.9fr]">
                          <div>
                            <p className="inline-flex items-center gap-2 text-sm font-medium text-white">
                              <CurrencyFlag currencyCode={rate.quote} />
                              {rate.base}/{rate.quote}
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">{copy.pairLabel}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{formatDecimal(rate.rate, locale, 4)}</p>
                            <p className="mt-1 text-xs text-zinc-500">{copy.rateLabel}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{rate.date}</p>
                            <p className="mt-1 text-xs text-zinc-500">{copy.updatedLabel}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-black/18 px-4 py-8 text-sm text-zinc-400">
                  {copy.unavailable}
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {(cryptoOverviewQuery.isError || cryptoSeriesQuery.isError || fiatOverviewQuery.isError || fiatSeriesQuery.isError) ? (
        <Card className="surface-panel rounded-[2rem] border-amber-300/18 bg-amber-300/[0.05] py-0">
          <CardContent className="flex items-center gap-3 p-5 text-sm text-amber-100">
            <RiLineChartLine className="size-4 shrink-0" />
            <span>{copy.unavailable}</span>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
