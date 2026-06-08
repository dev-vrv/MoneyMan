"use client";

import { useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { RiFlashlightLine } from "react-icons/ri";

import type { CashFlowChartMode, CashFlowRange, UiCopy } from "@/components/workspace/finance-workspace.types";
import { CryptoAssetIcon } from "@/components/workspace/crypto-asset-icon";
import { CurrencyOptionLabel } from "@/components/workspace/currency-flag";
import { EmptyState, PriorityPill } from "@/components/workspace/finance-workspace-ui";
import {
  buildSmoothSvgLinePath,
  convertAmountBetweenCurrencies,
  formatMoney,
  normalizeCashFlowDateRange,
  resolveCashFlowDateRange,
} from "@/components/workspace/finance-workspace.utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateInput } from "@/components/ui/date-input";
import { Badge } from "@/components/ui/badge";
import { WorkspaceSelect } from "@/components/workspace/finance-workspace-ui";
import type { CryptoHoldingRecord, CurrencyRecord, ExchangeRateRecord, CryptoMarketAssetRecord } from "@/lib/api/finance";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type CashFlowSeriesItem = {
  day: string;
  label: string;
  tooltipLabel: string;
  income: number;
  expense: number;
  net: number;
  total: number;
};

type CashFlowTrajectoryItem = {
  open: number;
  high: number;
  low: number;
  close: number;
};

const premiumCtaClassName =
  "relative overflow-hidden rounded-2xl border border-cyan-300/28 bg-[linear-gradient(135deg,rgba(34,211,238,0.2)_0%,rgba(56,189,248,0.14)_35%,rgba(129,140,248,0.18)_100%)] text-cyan-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_0_1px_rgba(56,189,248,0.08),0_10px_30px_rgba(14,165,233,0.18),0_0_36px_rgba(59,130,246,0.12)] transition-all duration-300 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_left_center,rgba(255,255,255,0.2),transparent_42%)] before:opacity-70 before:content-[''] hover:border-cyan-200/44 hover:text-cyan-50 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_0_1px_rgba(103,232,249,0.14),0_16px_42px_rgba(14,165,233,0.24),0_0_52px_rgba(99,102,241,0.18)]";
const capitalCalculatorModeStorageKey = "fin-man-capital-calculator-mode";

type WorkspaceAnalyticsSectionProps = {
  ui: UiCopy;
  content: Dictionary["workspace"];
  isPremium: boolean;
  onOpenPremiumDialog: () => void;
  currencies: CurrencyRecord[];
  exchangeRates: ExchangeRateRecord[];
  accounts: Array<{ id: number; name: string; currency: string; amount: number }>;
  cryptoHoldings: CryptoHoldingRecord[];
  cryptoAssets: CryptoMarketAssetRecord[];
  projectedSubscriptionsTotal: number;
  projectedSubscriptionsCount: number;
  cashFlowRangeLabel: string;
  cashFlowRange: CashFlowRange;
  setCashFlowRange: Dispatch<SetStateAction<CashFlowRange>>;
  cashFlowAnchorDate: string;
  setCashFlowAnchorDate: Dispatch<SetStateAction<string>>;
  cashFlowCustomRange: { startDate: string; endDate: string };
  setCashFlowCustomRange: Dispatch<SetStateAction<{ startDate: string; endDate: string }>>;
  effectiveCashFlowChartMode: CashFlowChartMode;
  setCashFlowChartMode: (value: CashFlowChartMode) => void;
  cashFlowVisibleTotals: { income: number; expense: number; net: number };
  workspaceSummaryCurrency: string;
  cashFlowTrajectory: {
    items: CashFlowTrajectoryItem[];
    finalBalance: number;
    max: number;
    range: number;
  };
  cashFlowSeries: {
    items: CashFlowSeriesItem[];
    maxMagnitude: number;
  };
};

export function WorkspaceAnalyticsSection({
  ui,
  content,
  isPremium,
  onOpenPremiumDialog,
  currencies,
  exchangeRates,
  accounts,
  cryptoHoldings,
  cryptoAssets,
  projectedSubscriptionsTotal,
  projectedSubscriptionsCount,
  cashFlowRangeLabel,
  cashFlowRange,
  setCashFlowRange,
  cashFlowAnchorDate,
  setCashFlowAnchorDate,
  cashFlowCustomRange,
  setCashFlowCustomRange,
  effectiveCashFlowChartMode,
  setCashFlowChartMode,
  cashFlowVisibleTotals,
  workspaceSummaryCurrency,
  cashFlowTrajectory,
  cashFlowSeries,
}: WorkspaceAnalyticsSectionProps) {
  const chartWidth = 1000;
  const chartHeight = 250;
  const displayedDateRange = resolveCashFlowDateRange(cashFlowRange, cashFlowAnchorDate, cashFlowCustomRange);
  const [capitalCalculatorMode, setCapitalCalculatorMode] = useState<"portfolio" | "manual" | "hybrid">(() => {
    if (typeof window === "undefined") {
      return "portfolio";
    }

    const storedMode = window.localStorage.getItem(capitalCalculatorModeStorageKey);
    if (storedMode === "portfolio" || storedMode === "manual" || storedMode === "hybrid") {
      return storedMode;
    }

    return "portfolio";
  });
  const [capitalTargetCurrency, setCapitalTargetCurrency] = useState(() => workspaceSummaryCurrency);
  const [manualAmount, setManualAmount] = useState("");
  const [manualCurrency, setManualCurrency] = useState(() => workspaceSummaryCurrency);
  const [fixedAdjustment, setFixedAdjustment] = useState("");
  const [percentAdjustment, setPercentAdjustment] = useState("0");
  const [includeProjectedSubscriptions, setIncludeProjectedSubscriptions] = useState(true);
  const [includePeriodResult, setIncludePeriodResult] = useState(false);
  const [selectedAccountIds, setSelectedAccountIds] = useState<number[]>(() => accounts.map((account) => account.id));
  const [selectedHoldingIds, setSelectedHoldingIds] = useState<number[]>(() => cryptoHoldings.map((holding) => holding.id));
  const effectiveCapitalTargetCurrency = currencies.some((currency) => currency.code === capitalTargetCurrency)
    ? capitalTargetCurrency
    : workspaceSummaryCurrency;
  const effectiveManualCurrency = currencies.some((currency) => currency.code === manualCurrency)
    ? manualCurrency
    : workspaceSummaryCurrency;
  const effectiveSelectedAccountIds = useMemo(() => {
    const validIds = selectedAccountIds.filter((id) => accounts.some((account) => account.id === id));
    if (validIds.length > 0 || accounts.length === 0) {
      return validIds;
    }
    return accounts.map((account) => account.id);
  }, [accounts, selectedAccountIds]);
  const effectiveSelectedHoldingIds = useMemo(() => {
    const validIds = selectedHoldingIds.filter((id) => cryptoHoldings.some((holding) => holding.id === id));
    if (validIds.length > 0 || cryptoHoldings.length === 0) {
      return validIds;
    }
    return cryptoHoldings.map((holding) => holding.id);
  }, [cryptoHoldings, selectedHoldingIds]);

  const cryptoAssetsBySymbol = useMemo(
    () => new Map(cryptoAssets.map((asset) => [asset.symbol.toUpperCase(), asset])),
    [cryptoAssets],
  );
  const selectedAccountsTotal = useMemo(
    () =>
      accounts.reduce((sum, account) => {
        if (!effectiveSelectedAccountIds.includes(account.id)) {
          return sum;
        }
        return sum + (convertAmountBetweenCurrencies(account.amount, account.currency, effectiveCapitalTargetCurrency, exchangeRates) ?? 0);
      }, 0),
    [accounts, effectiveCapitalTargetCurrency, effectiveSelectedAccountIds, exchangeRates],
  );
  const selectedCryptoTotal = useMemo(
    () =>
      cryptoHoldings.reduce((sum, holding) => {
        if (!effectiveSelectedHoldingIds.includes(holding.id)) {
          return sum;
        }
        const asset = cryptoAssetsBySymbol.get(holding.asset_symbol.toUpperCase());
        if (!asset) {
          return sum;
        }
        const holdingValue =
          (convertAmountBetweenCurrencies(Number(asset.price || 0), asset.quote_currency, effectiveCapitalTargetCurrency, exchangeRates) ?? 0)
          * Number(holding.balance || 0);
        return sum + holdingValue;
      }, 0),
    [cryptoAssetsBySymbol, cryptoHoldings, effectiveCapitalTargetCurrency, effectiveSelectedHoldingIds, exchangeRates],
  );
  const manualAmountConverted = useMemo(
    () => convertAmountBetweenCurrencies(Number(manualAmount || 0), effectiveManualCurrency, effectiveCapitalTargetCurrency, exchangeRates) ?? 0,
    [effectiveCapitalTargetCurrency, effectiveManualCurrency, exchangeRates, manualAmount],
  );
  const portfolioAssetsTotal = selectedAccountsTotal + selectedCryptoTotal;
  const grossAssetsTotal = useMemo(() => {
    if (capitalCalculatorMode === "manual") {
      return manualAmountConverted;
    }
    if (capitalCalculatorMode === "hybrid") {
      return portfolioAssetsTotal + manualAmountConverted;
    }
    return portfolioAssetsTotal;
  }, [capitalCalculatorMode, manualAmountConverted, portfolioAssetsTotal]);
  const projectedSubscriptionsConverted = useMemo(
    () =>
      convertAmountBetweenCurrencies(
        projectedSubscriptionsTotal,
        workspaceSummaryCurrency,
        effectiveCapitalTargetCurrency,
        exchangeRates,
      ) ?? 0,
    [effectiveCapitalTargetCurrency, exchangeRates, projectedSubscriptionsTotal, workspaceSummaryCurrency],
  );
  const periodResultConverted = useMemo(
    () =>
      convertAmountBetweenCurrencies(
        cashFlowVisibleTotals.net,
        workspaceSummaryCurrency,
        effectiveCapitalTargetCurrency,
        exchangeRates,
      ) ?? 0,
    [cashFlowVisibleTotals.net, effectiveCapitalTargetCurrency, exchangeRates, workspaceSummaryCurrency],
  );
  const fixedAdjustmentConverted = useMemo(
    () => convertAmountBetweenCurrencies(Number(fixedAdjustment || 0), effectiveManualCurrency, effectiveCapitalTargetCurrency, exchangeRates) ?? 0,
    [effectiveCapitalTargetCurrency, effectiveManualCurrency, exchangeRates, fixedAdjustment],
  );
  const percentAdjustmentAmount = useMemo(
    () => grossAssetsTotal * (Number(percentAdjustment || 0) / 100),
    [grossAssetsTotal, percentAdjustment],
  );
  const scenarioAdjustmentsTotal = useMemo(
    () => fixedAdjustmentConverted + percentAdjustmentAmount + (includePeriodResult ? periodResultConverted : 0),
    [fixedAdjustmentConverted, includePeriodResult, percentAdjustmentAmount, periodResultConverted],
  );
  const scenarioLiabilitiesTotal = includeProjectedSubscriptions ? projectedSubscriptionsConverted : 0;
  const capitalCalculatorResult = grossAssetsTotal + scenarioAdjustmentsTotal - scenarioLiabilitiesTotal;
  const chartLinePoints = cashFlowTrajectory.items.map((point, pointIndex) => ({
    x:
      cashFlowTrajectory.items.length === 1
        ? chartWidth / 2
        : (pointIndex / (cashFlowTrajectory.items.length - 1)) * chartWidth,
    y: 18 + ((cashFlowTrajectory.max - point.close) / cashFlowTrajectory.range) * 204,
  }));
  const smoothLinePath = buildSmoothSvgLinePath(chartLinePoints);
  const areaPath =
    chartLinePoints.length > 1
      ? `${smoothLinePath} L ${chartLinePoints[chartLinePoints.length - 1]?.x ?? chartWidth} 238 L ${chartLinePoints[0]?.x ?? 0} 238 Z`
      : "";

  useEffect(() => {
    window.localStorage.setItem(capitalCalculatorModeStorageKey, capitalCalculatorMode);
  }, [capitalCalculatorMode]);

  return (
    <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
      <CardHeader className="flex flex-col gap-5 p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <CardTitle className="text-white">{ui.cashFlowLabel}</CardTitle>
              <CardDescription className="mt-2 text-sm leading-6 text-zinc-400">{cashFlowRangeLabel}</CardDescription>
            </div>
            <div className="rounded-[1.3rem] border border-white/8 bg-black/18 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.periodResultLabel}</p>
              <p className={`mt-2 text-xl font-semibold ${cashFlowVisibleTotals.net >= 0 ? "text-emerald-100" : "text-rose-100"}`}>
                {formatMoney(String(cashFlowVisibleTotals.net), workspaceSummaryCurrency)}
              </p>
            </div>
          </div>
          {!isPremium ? (
            <div className="flex flex-col gap-3 rounded-[1.4rem] border border-amber-300/14 bg-amber-300/[0.06] p-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium text-amber-100">{ui.premiumAnalyticsUpsell}</p>
                <p className="mt-1 text-sm text-amber-100/70">{ui.premiumHistoryFree}</p>
              </div>
              <Button type="button" size="sm" onClick={onOpenPremiumDialog} className={premiumCtaClassName}>
                <RiFlashlightLine className="relative z-10 size-3.5" />
                <span className="relative z-10">{ui.premiumUpgrade}</span>
              </Button>
            </div>
          ) : null}
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-wrap gap-2">
              {[
                { value: "day" as const, label: ui.daily },
                { value: "week" as const, label: ui.weekly },
                { value: "month" as const, label: ui.monthly },
                { value: "quarter" as const, label: ui.quarterly },
                { value: "year" as const, label: ui.yearly },
                { value: "custom" as const, label: ui.customPeriod },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setCashFlowRange(item.value)}
                  className={`inline-flex h-9 items-center rounded-2xl border px-3 text-xs transition ${
                    cashFlowRange === item.value
                      ? "border-emerald-300/20 bg-emerald-300/12 text-emerald-100"
                      : "border-white/8 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 sm:min-w-[26rem]">
              <DateInput
                value={displayedDateRange.startDate}
                onChange={(nextValue) => {
                  setCashFlowRange("custom");
                  setCashFlowCustomRange((current) =>
                    normalizeCashFlowDateRange(nextValue, cashFlowRange === "custom" ? current.endDate : displayedDateRange.endDate),
                  );
                }}
                placeholder={ui.startDate}
                className="h-9 min-h-9 rounded-2xl px-3 text-xs"
              />
              <DateInput
                value={displayedDateRange.endDate}
                onChange={(nextValue) => {
                  setCashFlowRange("custom");
                  setCashFlowAnchorDate(nextValue);
                  setCashFlowCustomRange((current) =>
                    normalizeCashFlowDateRange(cashFlowRange === "custom" ? current.startDate : displayedDateRange.startDate, nextValue),
                  );
                }}
                placeholder={ui.endDate}
                className="h-9 min-h-9 rounded-2xl px-3 text-xs"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-5 p-6 pt-0">
        <div className="order-2 rounded-[1.7rem] border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.1),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.035)_0%,rgba(255,255,255,0.018)_100%)] p-5 sm:p-6">
          <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-white">{ui.capitalCalculatorTitle}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{ui.capitalCalculatorDescription}</p>
              </div>
              <div className="rounded-[1.3rem] border border-emerald-300/12 bg-emerald-300/[0.06] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/70">{ui.capitalCalculatorResult}</p>
                <p className="mt-2 text-2xl font-semibold text-emerald-50">
                  {formatMoney(String(capitalCalculatorResult), effectiveCapitalTargetCurrency)}
                </p>
              </div>
              <div className="grid gap-3">
                <PriorityPill label={ui.capitalCalculatorGrossAssets} value={formatMoney(String(grossAssetsTotal), effectiveCapitalTargetCurrency)} />
                <PriorityPill label={ui.capitalCalculatorAdjustments} value={formatMoney(String(scenarioAdjustmentsTotal), effectiveCapitalTargetCurrency)} />
                <PriorityPill label={ui.capitalCalculatorLiabilities} value={formatMoney(String(scenarioLiabilitiesTotal), effectiveCapitalTargetCurrency)} />
                <PriorityPill label={ui.capitalCalculatorNetResult} value={formatMoney(String(capitalCalculatorResult), effectiveCapitalTargetCurrency)} />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "portfolio" as const, label: ui.capitalCalculatorPortfolio },
                  { value: "hybrid" as const, label: ui.capitalCalculatorHybrid },
                  { value: "manual" as const, label: ui.capitalCalculatorManual },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setCapitalCalculatorMode(item.value)}
                    className={`inline-flex h-9 items-center rounded-2xl border px-3 text-xs transition ${
                      capitalCalculatorMode === item.value
                        ? "border-emerald-300/20 bg-emerald-300/12 text-emerald-100"
                        : "border-white/8 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="grid gap-4">
                  {capitalCalculatorMode !== "manual" ? (
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div>
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.capitalCalculatorAccounts}</p>
                          <button
                            type="button"
                            onClick={() => setSelectedAccountIds(accounts.map((account) => account.id))}
                            className="text-xs text-zinc-400 transition hover:text-zinc-200"
                          >
                            {ui.capitalCalculatorSelectAll}
                          </button>
                        </div>
                        <div className="grid gap-2">
                          {accounts.length > 0 ? accounts.map((account) => (
                            <label key={account.id} className="flex items-center gap-3 rounded-[1rem] border border-white/8 bg-white/[0.03] px-3 py-2.5">
                              <Checkbox
                                checked={effectiveSelectedAccountIds.includes(account.id)}
                                onCheckedChange={(checked) =>
                                  setSelectedAccountIds((current) =>
                                    checked ? [...current, account.id] : current.filter((id) => id !== account.id),
                                  )
                                }
                                className="size-4.5 rounded-md border-white/16 bg-white/5 data-checked:border-emerald-300 data-checked:bg-emerald-300 data-checked:text-slate-950"
                              />
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm text-zinc-100">{account.name}</span>
                                <span className="block text-xs text-zinc-500">{formatMoney(String(account.amount), account.currency)}</span>
                              </span>
                            </label>
                          )) : <EmptyState text={ui.capitalCalculatorNoSources} />}
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.capitalCalculatorCrypto}</p>
                          <button
                            type="button"
                            onClick={() => setSelectedHoldingIds(cryptoHoldings.map((holding) => holding.id))}
                            className="text-xs text-zinc-400 transition hover:text-zinc-200"
                          >
                            {ui.capitalCalculatorSelectAll}
                          </button>
                        </div>
                        <div className="grid gap-2">
                          {cryptoHoldings.length > 0 ? cryptoHoldings.map((holding) => {
                            const asset = cryptoAssetsBySymbol.get(holding.asset_symbol.toUpperCase());

                            return (
                              <label key={holding.id} className="flex items-center gap-3 rounded-[1rem] border border-white/8 bg-white/[0.03] px-3 py-2.5">
                                <Checkbox
                                  checked={effectiveSelectedHoldingIds.includes(holding.id)}
                                  onCheckedChange={(checked) =>
                                    setSelectedHoldingIds((current) =>
                                      checked ? [...current, holding.id] : current.filter((id) => id !== holding.id),
                                    )
                                  }
                                  className="size-4.5 rounded-md border-white/16 bg-white/5 data-checked:border-emerald-300 data-checked:bg-emerald-300 data-checked:text-slate-950"
                                />
                                {asset ? <CryptoAssetIcon icon={asset.icon} symbol={asset.symbol} color={asset.color} /> : null}
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-sm text-zinc-100">{holding.asset_symbol} · {holding.wallet_name}</span>
                                  <span className="block text-xs text-zinc-500">{Number(holding.balance || 0)} {holding.asset_symbol}</span>
                                </span>
                              </label>
                            );
                          }) : <EmptyState text={ui.capitalCalculatorNoSources} />}
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {capitalCalculatorMode === "manual" || capitalCalculatorMode === "hybrid" ? (
                    <div className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] p-4">
                      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.capitalCalculatorManual}</p>
                      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_16rem]">
                        <Input
                          value={manualAmount}
                          onChange={(event) => setManualAmount(event.target.value)}
                          placeholder="0.00"
                          className="rounded-2xl border-white/10 bg-white/5 text-zinc-100"
                        />
                        <div>
                          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.capitalCalculatorManualCurrency}</p>
                          <WorkspaceSelect
                            value={effectiveManualCurrency}
                            onValueChange={setManualCurrency}
                            options={currencies.map((currency) => ({
                              value: currency.code,
                              label: <CurrencyOptionLabel currencyCode={currency.code} text={`${currency.code} · ${currency.name}`} />,
                            }))}
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="grid gap-4">
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.capitalCalculatorTargetCurrency}</p>
                    <WorkspaceSelect
                      value={effectiveCapitalTargetCurrency}
                      onValueChange={setCapitalTargetCurrency}
                      options={currencies.map((currency) => ({
                        value: currency.code,
                        label: <CurrencyOptionLabel currencyCode={currency.code} text={`${currency.code} · ${currency.name}`} />,
                      }))}
                    />
                  </div>
                  <div className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] p-4">
                    <p className="mb-3 text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.capitalCalculatorScenarioSettings}</p>
                    <div className="grid gap-3">
                      <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.capitalCalculatorFixedAdjustment}</p>
                        <Input
                          value={fixedAdjustment}
                          onChange={(event) => setFixedAdjustment(event.target.value)}
                          placeholder="0.00"
                          className="rounded-2xl border-white/10 bg-white/5 text-zinc-100"
                        />
                      </div>
                      <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.capitalCalculatorPercentAdjustment}</p>
                        <Input
                          value={percentAdjustment}
                          onChange={(event) => setPercentAdjustment(event.target.value)}
                          placeholder="0"
                          className="rounded-2xl border-white/10 bg-white/5 text-zinc-100"
                        />
                      </div>
                      <div className="grid gap-3">
                        <label className="flex items-start gap-3 rounded-[1rem] border border-white/8 bg-black/18 px-3 py-3">
                          <Checkbox
                            checked={includeProjectedSubscriptions}
                            onCheckedChange={(checked) => setIncludeProjectedSubscriptions(Boolean(checked))}
                            className="mt-0.5 size-4.5 rounded-md border-white/16 bg-white/5 data-checked:border-emerald-300 data-checked:bg-emerald-300 data-checked:text-slate-950"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm text-zinc-100">{ui.capitalCalculatorIncludeProjectedSubscriptions}</span>
                            <span className="mt-1 block text-xs text-zinc-500">{formatMoney(String(projectedSubscriptionsConverted), effectiveCapitalTargetCurrency)}</span>
                          </span>
                        </label>
                        <label className="flex items-start gap-3 rounded-[1rem] border border-white/8 bg-black/18 px-3 py-3">
                          <Checkbox
                            checked={includePeriodResult}
                            onCheckedChange={(checked) => setIncludePeriodResult(Boolean(checked))}
                            className="mt-0.5 size-4.5 rounded-md border-white/16 bg-white/5 data-checked:border-emerald-300 data-checked:bg-emerald-300 data-checked:text-slate-950"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm text-zinc-100">{ui.capitalCalculatorIncludePeriodResult}</span>
                            <span className="mt-1 block text-xs text-zinc-500">{formatMoney(String(periodResultConverted), effectiveCapitalTargetCurrency)}</span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_320px]">
          <div className="order-2 space-y-3 xl:order-2">
            <p className="text-sm leading-6 text-zinc-400">{content.sections.widgetsDescription}</p>
            <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-1">
              <PriorityPill label={ui.receivedLabel} value={formatMoney(String(cashFlowVisibleTotals.income), workspaceSummaryCurrency)} />
              <PriorityPill label={ui.spentLabel} value={formatMoney(String(cashFlowVisibleTotals.expense), workspaceSummaryCurrency)} />
              <PriorityPill label={ui.periodResultLabel} value={formatMoney(String(cashFlowVisibleTotals.net), workspaceSummaryCurrency)} />
            </div>
            <Accordion type="multiple" className="rounded-[1.5rem] border border-white/8 bg-black/18 px-4">
              <AccordionItem value="summary-details" className="border-b border-white/8">
                <AccordionTrigger className="rounded-2xl px-3 py-4 text-left text-sm font-medium text-white no-underline hover:bg-white/[0.04] hover:text-zinc-100 hover:no-underline">
                  {ui.analyticsSummaryDetails}
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="grid gap-3">
                    <PriorityPill label={ui.totalByRates} value={formatMoney(String(cashFlowTrajectory.finalBalance), workspaceSummaryCurrency)} />
                    <PriorityPill
                      label={ui.projectedSubscriptions}
                      value={formatMoney(String(projectedSubscriptionsTotal), workspaceSummaryCurrency)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="subscription-forecast" className="border-none">
                <AccordionTrigger className="rounded-2xl px-3 py-4 text-left text-sm font-medium text-white no-underline hover:bg-white/[0.04] hover:text-zinc-100 hover:no-underline">
                  {ui.analyticsSubscriptionsDetails}
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-white">{ui.projectedSubscriptions}</p>
                        <p className="mt-1 text-xs leading-5 text-zinc-500">{ui.projectedSubscriptionsDescription}</p>
                      </div>
                      <Badge variant="outline" className="rounded-full border-white/10 bg-white/5 text-zinc-200">
                        {ui.projectedSubscriptionsTemplates.replace("{count}", String(projectedSubscriptionsCount))}
                      </Badge>
                    </div>
                    <p className="mt-4 text-xl font-semibold text-white">
                      {formatMoney(String(projectedSubscriptionsTotal), workspaceSummaryCurrency)}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="order-1 rounded-[1.6rem] border border-white/8 bg-[linear-gradient(180deg,rgba(9,19,15,0.88)_0%,rgba(6,13,10,0.94)_100%)] p-4 xl:order-1">
          <div className="mb-4 flex flex-col gap-3 border-b border-white/8 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white">{ui.cashFlowLabel}</p>
              <p className="mt-1 text-xs text-zinc-500">{content.sections.widgetsDescription}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "bars" as const, label: ui.chartBarsView },
                { value: "line" as const, label: ui.chartLineView },
                { value: "tradingview" as const, label: ui.chartTradingView },
                { value: "candles" as const, label: ui.chartCandlesView },
                { value: "structure" as const, label: ui.chartStructureView },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setCashFlowChartMode(item.value)}
                  className={`inline-flex h-10 items-center rounded-2xl border px-3.5 text-xs transition ${
                    effectiveCashFlowChartMode === item.value
                      ? "border-emerald-300/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.18)_0%,rgba(52,211,153,0.08)_100%)] text-emerald-100 shadow-[0_0_24px_rgba(16,185,129,0.14)]"
                      : "border-white/8 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          {cashFlowSeries.items.length > 0 ? (
            <>
              {effectiveCashFlowChartMode === "structure" ? (
                <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
                  <div className="relative overflow-hidden rounded-[1.8rem] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.08),transparent_30%),linear-gradient(180deg,rgba(9,15,16,0.98)_0%,rgba(7,11,12,1)_100%)] p-6">
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:44px_44px] opacity-10" />
                    {(() => {
                      const total = Math.max(cashFlowVisibleTotals.income + cashFlowVisibleTotals.expense, 1);
                      const incomeShare = Math.max(0, Math.min(100, (cashFlowVisibleTotals.income / total) * 100));
                      const expenseShare = Math.max(0, 100 - incomeShare);
                      const circumference = 2 * Math.PI * 46;
                      const incomeLength = (incomeShare / 100) * circumference;
                      const expenseLength = Math.max(circumference - incomeLength, 0);

                      return (
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="relative flex size-[248px] items-center justify-center">
                            <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,rgba(8,18,14,0)_68%)] blur-xl" />
                            <svg viewBox="0 0 120 120" className="size-full -rotate-90">
                              <defs>
                                <linearGradient id="cashflow-income-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="rgba(179,244,215,0.92)" />
                                  <stop offset="100%" stopColor="rgba(110,231,183,0.74)" />
                                </linearGradient>
                                <linearGradient id="cashflow-expense-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="rgba(253,224,146,0.78)" />
                                  <stop offset="100%" stopColor="rgba(251,146,60,0.62)" />
                                </linearGradient>
                              </defs>
                              <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth="6" />
                              <circle cx="60" cy="60" r="38" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                              <circle
                                cx="60"
                                cy="60"
                                r="46"
                                fill="none"
                                stroke="url(#cashflow-income-ring)"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeDasharray={`${incomeLength} ${Math.max(circumference - incomeLength, 0)}`}
                                className="drop-shadow-[0_0_6px_rgba(110,231,183,0.14)]"
                              />
                              <circle
                                cx="60"
                                cy="60"
                                r="46"
                                fill="none"
                                stroke="url(#cashflow-expense-ring)"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeDasharray={`${expenseLength} ${Math.max(circumference - expenseLength, 0)}`}
                                strokeDashoffset={-incomeLength}
                                className="drop-shadow-[0_0_6px_rgba(251,191,36,0.1)]"
                              />
                            </svg>
                            <div className="absolute flex size-[132px] flex-col items-center justify-center rounded-full border border-white/6 bg-[linear-gradient(180deg,rgba(20,28,31,0.96)_0%,rgba(10,16,18,0.98)_100%)] px-6 py-6 text-center shadow-[0_12px_28px_rgba(0,0,0,0.18)]">
                              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{ui.periodResultLabel}</p>
                              <p className="mt-2 text-base font-semibold leading-snug text-zinc-50">
                                {formatMoney(String(cashFlowVisibleTotals.net), workspaceSummaryCurrency)}
                              </p>
                              <p className="mt-1.5 text-[11px] leading-snug text-zinc-500">
                                {Math.round(incomeShare)}% / {Math.round(expenseShare)}%
                              </p>
                            </div>
                          </div>
                          <div className="mt-6 grid w-full gap-2.5">
                            <div className="flex items-center justify-between rounded-[1.3rem] border border-emerald-200/10 bg-emerald-200/[0.05] px-4 py-3.5">
                              <span className="flex items-center gap-2 text-sm text-emerald-50">
                                <span className="size-2 rounded-full bg-emerald-300" />
                                {ui.receivedLabel}
                              </span>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-emerald-50">
                                  {formatMoney(String(cashFlowVisibleTotals.income), workspaceSummaryCurrency)}
                                </p>
                                <p className="text-[11px] text-emerald-100/55">{Math.round(incomeShare)}%</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between rounded-[1.3rem] border border-amber-200/10 bg-amber-200/[0.05] px-4 py-3.5">
                              <span className="flex items-center gap-2 text-sm text-amber-50">
                                <span className="size-2 rounded-full bg-amber-300" />
                                {ui.spentLabel}
                              </span>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-amber-50">
                                  {formatMoney(String(cashFlowVisibleTotals.expense), workspaceSummaryCurrency)}
                                </p>
                                <p className="text-[11px] text-amber-100/55">{Math.round(expenseShare)}%</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="grid gap-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-[1.4rem] border border-emerald-300/10 bg-emerald-300/[0.06] p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-emerald-200/80">{ui.receivedLabel}</p>
                        <p className="mt-2 text-xl font-semibold text-emerald-100">
                          {formatMoney(String(cashFlowVisibleTotals.income), workspaceSummaryCurrency)}
                        </p>
                      </div>
                      <div className="rounded-[1.4rem] border border-rose-300/10 bg-rose-300/[0.06] p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-rose-200/80">{ui.spentLabel}</p>
                        <p className="mt-2 text-xl font-semibold text-rose-100">
                          {formatMoney(String(cashFlowVisibleTotals.expense), workspaceSummaryCurrency)}
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      {cashFlowSeries.items.map((item) => {
                        const totalShare = cashFlowVisibleTotals.income + cashFlowVisibleTotals.expense;
                        const share = totalShare > 0 ? Math.round((item.total / totalShare) * 100) : 0;

                        return (
                          <div key={item.day} className="rounded-[1.2rem] border border-white/8 bg-black/18 p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-medium text-white">{item.tooltipLabel}</p>
                                <p className="mt-1 text-xs text-zinc-500">{share}%</p>
                              </div>
                              <Badge variant="outline" className="rounded-full border-white/10 bg-white/5 text-zinc-200">
                                {formatMoney(String(item.net), workspaceSummaryCurrency)}
                              </Badge>
                            </div>
                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                              <div
                                className="h-full rounded-full bg-[linear-gradient(90deg,rgba(52,211,153,0.9)_0%,rgba(251,146,60,0.86)_100%)]"
                                style={{ width: `${Math.max(6, share)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : effectiveCashFlowChartMode === "line" || effectiveCashFlowChartMode === "tradingview" ? (
                <>
                  <div className="rounded-[1.6rem] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.08),transparent_30%),linear-gradient(180deg,rgba(9,15,16,0.98)_0%,rgba(7,11,12,1)_100%)] p-4">
                    <div className="relative h-[320px] overflow-hidden rounded-[1.3rem] border border-white/8 bg-black/20 p-4">
                      <div
                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] opacity-30"
                        style={{
                          backgroundSize: `${100 / Math.max(chartLinePoints.length, 1)}% 64px`,
                        }}
                      />
                      <div className="pointer-events-none absolute inset-x-4 top-1/2 border-t border-dashed border-white/10" />
                      <svg
                        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                        preserveAspectRatio="none"
                        className="absolute inset-x-4 top-4 h-[250px] w-auto"
                      >
                        {effectiveCashFlowChartMode === "tradingview" ? (
                          <defs>
                            <linearGradient id="cashflow-area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="rgba(96,165,250,0.36)" />
                              <stop offset="60%" stopColor="rgba(56,189,248,0.14)" />
                              <stop offset="100%" stopColor="rgba(15,23,42,0.01)" />
                            </linearGradient>
                            <linearGradient id="cashflow-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="rgba(125,211,252,1)" />
                              <stop offset="100%" stopColor="rgba(99,102,241,0.92)" />
                            </linearGradient>
                          </defs>
                        ) : null}
                        {effectiveCashFlowChartMode === "tradingview" ? (
                          <path d={areaPath} fill="url(#cashflow-area-gradient)" />
                        ) : null}
                        <path
                          d={smoothLinePath}
                          fill="none"
                          stroke={
                            effectiveCashFlowChartMode === "line"
                              ? "rgba(52,211,153,0.96)"
                              : "url(#cashflow-line-gradient)"
                          }
                          strokeWidth={effectiveCashFlowChartMode === "line" ? "3.5" : "4"}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="drop-shadow-[0_0_10px_rgba(52,211,153,0.18)]"
                        />
                        {chartLinePoints.map((point, index) => (
                          <circle
                            key={`${cashFlowTrajectory.items[index]?.day ?? index}-point`}
                            cx={point.x}
                            cy={point.y}
                            r={effectiveCashFlowChartMode === "line" ? "4.5" : "4"}
                            fill={
                              effectiveCashFlowChartMode === "line"
                                ? cashFlowTrajectory.items[index]?.close >= 0
                                  ? "rgba(52,211,153,1)"
                                  : "rgba(251,113,133,1)"
                                : "rgba(224,231,255,0.98)"
                            }
                            stroke={
                              effectiveCashFlowChartMode === "line"
                                ? "rgba(255,255,255,0.85)"
                                : "rgba(99,102,241,0.95)"
                            }
                            strokeWidth="2"
                          />
                        ))}
                      </svg>
                      <div
                        className="absolute inset-x-4 bottom-4 grid gap-2"
                        style={{
                          gridTemplateColumns: `repeat(${Math.max(cashFlowSeries.items.length, 1)}, minmax(0, 1fr))`,
                        }}
                      >
                        {cashFlowSeries.items.map((item, index) => (
                          <div key={item.day} className="min-w-0 rounded-xl border border-white/8 bg-black/20 px-2 py-2 text-center">
                            <p className="truncate text-[11px] text-zinc-500">{item.label}</p>
                            <p className={`mt-1 truncate text-xs font-medium ${cashFlowTrajectory.items[index]?.close >= 0 ? "text-emerald-200" : "text-rose-200"}`}>
                              {formatMoney(String(cashFlowTrajectory.items[index]?.close ?? 0), workspaceSummaryCurrency)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div
                    className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4"
                  >
                    {cashFlowSeries.items.map((item, index) => (
                      <div key={item.day} className="rounded-[1.2rem] border border-white/8 bg-black/18 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">{item.tooltipLabel}</p>
                            <p className="mt-1 text-xs text-zinc-500">{item.label}</p>
                          </div>
                          <Badge variant="outline" className="rounded-full border-white/10 bg-white/5 text-zinc-200">
                            {formatMoney(String(cashFlowTrajectory.items[index]?.close ?? 0), workspaceSummaryCurrency)}
                          </Badge>
                        </div>
                        <div className="mt-3 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between text-zinc-400">
                            <span>{ui.receivedLabel}</span>
                            <span className="text-emerald-200">{formatMoney(String(item.income), workspaceSummaryCurrency)}</span>
                          </div>
                          <div className="flex items-center justify-between text-zinc-400">
                            <span>{ui.spentLabel}</span>
                            <span className="text-rose-200">{formatMoney(String(item.expense), workspaceSummaryCurrency)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-5 text-xs text-zinc-500">
                    <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-300" />{ui.txTypeIncome}</span>
                    <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-rose-400" />{ui.txTypeExpense}</span>
                    <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-white" />{ui.totalByRates}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative h-[300px]">
                    <div className="flex h-[300px] items-end gap-3">
                    {cashFlowSeries.items.map((item, index) => {
                      const trajectoryPoint = cashFlowTrajectory.items[index];
                      const incomeHeight = Math.max((Math.abs(item.income) / cashFlowSeries.maxMagnitude) * 118, item.income > 0 ? 10 : 2);
                      const expenseHeight = Math.max((Math.abs(item.expense) / cashFlowSeries.maxMagnitude) * 118, item.expense > 0 ? 10 : 2);
                      const candleTop = 18 + ((cashFlowTrajectory.max - trajectoryPoint.high) / cashFlowTrajectory.range) * 204;
                      const candleBottom = 18 + ((cashFlowTrajectory.max - trajectoryPoint.low) / cashFlowTrajectory.range) * 204;
                      const candleOpenY = 18 + ((cashFlowTrajectory.max - trajectoryPoint.open) / cashFlowTrajectory.range) * 204;
                      const candleCloseY = 18 + ((cashFlowTrajectory.max - trajectoryPoint.close) / cashFlowTrajectory.range) * 204;

                      return (
                        <div key={item.day} className="group flex min-w-0 flex-1 flex-col items-center gap-3">
                          <div className="relative flex h-[250px] w-full items-end justify-center">
                            <div className="pointer-events-none absolute left-1/2 top-2 z-20 hidden w-[190px] -translate-x-1/2 rounded-2xl border border-white/10 bg-[rgba(5,12,9,0.96)] p-3 text-left shadow-[0_18px_48px_rgba(0,0,0,0.45)] group-hover:block group-focus-within:block">
                              <p className="text-xs font-medium text-white">{item.tooltipLabel}</p>
                              <div className="mt-3 space-y-2 text-xs text-zinc-300">
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-zinc-500">{ui.receivedLabel}</span>
                                  <span className="text-emerald-200">{formatMoney(String(item.income), workspaceSummaryCurrency)}</span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-zinc-500">{ui.spentLabel}</span>
                                  <span className="text-rose-200">{formatMoney(String(item.expense), workspaceSummaryCurrency)}</span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-zinc-500">{ui.totalByRates}</span>
                                  <span className={trajectoryPoint.close >= 0 ? "text-emerald-200" : "text-rose-200"}>
                                    {formatMoney(String(trajectoryPoint.close), workspaceSummaryCurrency)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between gap-3 border-t border-white/8 pt-2">
                                  <span className="text-zinc-500">{ui.periodResultLabel}</span>
                                  <span className={item.net >= 0 ? "text-emerald-200" : "text-rose-200"}>
                                    {formatMoney(String(item.net), workspaceSummaryCurrency)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="relative flex h-[250px] w-full items-end justify-center overflow-hidden rounded-[1.2rem] border border-white/6 bg-black/16 px-1 pb-4 pt-5 outline-none transition hover:border-emerald-300/14 focus-visible:border-emerald-300/18"
                              aria-label={item.tooltipLabel}
                            >
                              <div className="absolute inset-x-3 top-1/2 border-t border-dashed border-white/8" />
                              {effectiveCashFlowChartMode === "bars" ? (
                                <div className="flex w-full items-end justify-center gap-2">
                                  <div className="w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.38)]" style={{ height: `${incomeHeight}px` }} />
                                  <div className="w-2.5 rounded-full bg-rose-400 shadow-[0_0_18px_rgba(251,113,133,0.28)]" style={{ height: `${expenseHeight}px` }} />
                                </div>
                              ) : null}
                              {effectiveCashFlowChartMode === "line" ? (
                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(52,211,153,0.06)_0%,rgba(52,211,153,0.01)_45%,rgba(0,0,0,0)_100%)]" />
                              ) : null}
                              {effectiveCashFlowChartMode === "tradingview" ? (
                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(96,165,250,0.07)_0%,rgba(56,189,248,0.02)_45%,rgba(0,0,0,0)_100%)]" />
                              ) : null}
                              {effectiveCashFlowChartMode === "candles" ? (
                                <div className="relative h-full w-full">
                                  <div
                                    className="absolute left-1/2 w-px -translate-x-1/2 bg-white/45"
                                    style={{ top: `${candleTop}px`, height: `${Math.max(candleBottom - candleTop, 10)}px` }}
                                  />
                                  <div
                                    className={`absolute left-1/2 w-7 -translate-x-1/2 rounded-md ${
                                      trajectoryPoint.close >= trajectoryPoint.open
                                        ? "bg-[linear-gradient(180deg,rgba(16,185,129,0.96)_0%,rgba(52,211,153,0.58)_100%)]"
                                        : "bg-[linear-gradient(180deg,rgba(251,113,133,0.58)_0%,rgba(244,63,94,0.96)_100%)]"
                                    }`}
                                    style={{
                                      top: `${Math.min(candleOpenY, candleCloseY)}px`,
                                      height: `${Math.max(Math.abs(candleCloseY - candleOpenY), 16)}px`,
                                    }}
                                  />
                                </div>
                              ) : null}
                            </button>
                          </div>
                          <p className="text-xs text-zinc-500">{item.label}</p>
                        </div>
                      );
                    })}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-5 text-xs text-zinc-500">
                    <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-300" />{ui.txTypeIncome}</span>
                    <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-rose-400" />{ui.txTypeExpense}</span>
                    <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-white" />{ui.totalByRates}</span>
                  </div>
                </>
              )}
            </>
          ) : (
            <EmptyState text={ui.emptyTransactions} />
          )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
