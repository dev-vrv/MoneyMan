"use client";

import type { Dispatch, SetStateAction } from "react";

import type { CashFlowChartMode, CashFlowRange, UiCopy } from "@/components/workspace/finance-workspace.types";
import { EmptyState, PriorityPill } from "@/components/workspace/finance-workspace-ui";
import { buildSvgLinePath, formatMoney, normalizeCashFlowDateRange } from "@/components/workspace/finance-workspace.utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateInput } from "@/components/ui/date-input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
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

type WorkspaceAnalyticsSectionProps = {
  ui: UiCopy;
  content: Dictionary["workspace"];
  cashFlowRangeLabel: string;
  cashFlowRange: CashFlowRange;
  setCashFlowRange: Dispatch<SetStateAction<CashFlowRange>>;
  cashFlowCustomRange: { startDate: string; endDate: string };
  setCashFlowCustomRange: Dispatch<SetStateAction<{ startDate: string; endDate: string }>>;
  effectiveCashFlowChartMode: CashFlowChartMode;
  setCashFlowChartMode: Dispatch<SetStateAction<CashFlowChartMode | null>>;
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
  cashFlowRangeLabel,
  cashFlowRange,
  setCashFlowRange,
  cashFlowCustomRange,
  setCashFlowCustomRange,
  effectiveCashFlowChartMode,
  setCashFlowChartMode,
  cashFlowVisibleTotals,
  workspaceSummaryCurrency,
  cashFlowTrajectory,
  cashFlowSeries,
}: WorkspaceAnalyticsSectionProps) {
  return (
    <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
      <CardHeader className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <CardTitle className="text-white">{ui.cashFlowLabel}</CardTitle>
            <CardDescription className="text-zinc-400">{cashFlowRangeLabel}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "day" as const, label: ui.daily },
              { value: "week" as const, label: ui.weekly },
              { value: "month" as const, label: ui.monthly },
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
        </div>
        {cashFlowRange === "custom" ? (
          <div className="grid gap-3 md:grid-cols-2">
            <Field>
              <FieldLabel>{ui.startDate}</FieldLabel>
              <DateInput
                value={cashFlowCustomRange.startDate}
                onChange={(nextValue) => setCashFlowCustomRange((current) => normalizeCashFlowDateRange(nextValue, current.endDate))}
                placeholder={ui.startDate}
              />
            </Field>
            <Field>
              <FieldLabel>{ui.endDate}</FieldLabel>
              <DateInput
                value={cashFlowCustomRange.endDate}
                onChange={(nextValue) => setCashFlowCustomRange((current) => normalizeCashFlowDateRange(current.startDate, nextValue))}
                placeholder={ui.endDate}
              />
            </Field>
          </div>
        ) : null}
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
      </CardHeader>
      <CardContent className="grid gap-5 p-6 pt-0 xl:grid-cols-[260px_minmax(0,1fr)]">
        <div className="space-y-3">
          <p className="text-4xl font-semibold text-white">{formatMoney(String(cashFlowVisibleTotals.net), workspaceSummaryCurrency)}</p>
          <p className="text-sm leading-6 text-zinc-400">{content.sections.widgetsDescription}</p>
          <div className="grid gap-3">
            <PriorityPill label={ui.receivedLabel} value={formatMoney(String(cashFlowVisibleTotals.income), workspaceSummaryCurrency)} />
            <PriorityPill label={ui.spentLabel} value={formatMoney(String(cashFlowVisibleTotals.expense), workspaceSummaryCurrency)} />
            <PriorityPill label={ui.periodResultLabel} value={formatMoney(String(cashFlowVisibleTotals.net), workspaceSummaryCurrency)} />
            {effectiveCashFlowChartMode === "line" || effectiveCashFlowChartMode === "tradingview" ? (
              <PriorityPill label={ui.totalByRates} value={formatMoney(String(cashFlowTrajectory.finalBalance), workspaceSummaryCurrency)} />
            ) : null}
          </div>
        </div>
        <div className="rounded-[1.6rem] border border-white/8 bg-[linear-gradient(180deg,rgba(9,19,15,0.88)_0%,rgba(6,13,10,0.94)_100%)] p-4">
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
              ) : (
                <>
                  <div className="flex h-[300px] items-end gap-3">
                    {cashFlowSeries.items.map((item, index) => {
                      const trajectoryPoint = cashFlowTrajectory.items[index];
                      const incomeHeight = Math.max((Math.abs(item.income) / cashFlowSeries.maxMagnitude) * 118, item.income > 0 ? 10 : 2);
                      const expenseHeight = Math.max((Math.abs(item.expense) / cashFlowSeries.maxMagnitude) * 118, item.expense > 0 ? 10 : 2);
                      const linePoints = cashFlowTrajectory.items.map((point, pointIndex) => ({
                        x: cashFlowTrajectory.items.length === 1 ? 118 : (pointIndex / (cashFlowTrajectory.items.length - 1)) * 236,
                        y: 18 + ((cashFlowTrajectory.max - point.close) / cashFlowTrajectory.range) * 204,
                      }));
                      const linePath = buildSvgLinePath(linePoints);
                      const areaPath =
                        linePoints.length > 1
                          ? `${linePath} L ${linePoints[linePoints.length - 1]?.x ?? 236} 238 L ${linePoints[0]?.x ?? 0} 238 Z`
                          : "";
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
                                {effectiveCashFlowChartMode !== "bars" && effectiveCashFlowChartMode !== "structure" ? (
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="text-zinc-500">{ui.totalByRates}</span>
                                    <span className={trajectoryPoint.close >= 0 ? "text-emerald-200" : "text-rose-200"}>
                                      {formatMoney(String(trajectoryPoint.close), workspaceSummaryCurrency)}
                                    </span>
                                  </div>
                                ) : null}
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
                                <svg viewBox="0 0 236 250" className="absolute inset-0 h-full w-full">
                                  <path d={areaPath} fill="rgba(52,211,153,0.10)" />
                                  <path d={linePath} fill="none" stroke="rgba(52,211,153,0.9)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                  <circle
                                    cx={linePoints[index]?.x ?? 0}
                                    cy={linePoints[index]?.y ?? 0}
                                    r="5"
                                    fill={trajectoryPoint.close >= 0 ? "rgba(52,211,153,1)" : "rgba(251,113,133,1)"}
                                    stroke="rgba(255,255,255,0.85)"
                                    strokeWidth="1.5"
                                  />
                                </svg>
                              ) : null}
                              {effectiveCashFlowChartMode === "tradingview" ? (
                                <svg viewBox="0 0 236 250" className="absolute inset-0 h-full w-full">
                                  <defs>
                                    <linearGradient id={`tv-area-${item.day}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                      <stop offset="0%" stopColor="rgba(96,165,250,0.32)" />
                                      <stop offset="60%" stopColor="rgba(56,189,248,0.12)" />
                                      <stop offset="100%" stopColor="rgba(15,23,42,0.01)" />
                                    </linearGradient>
                                    <linearGradient id={`tv-line-${item.day}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                      <stop offset="0%" stopColor="rgba(125,211,252,0.96)" />
                                      <stop offset="100%" stopColor="rgba(99,102,241,0.9)" />
                                    </linearGradient>
                                  </defs>
                                  <path d={areaPath} fill={`url(#tv-area-${item.day})`} />
                                  <path d={linePath} fill="none" stroke={`url(#tv-line-${item.day})`} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                                  <circle
                                    cx={linePoints[index]?.x ?? 0}
                                    cy={linePoints[index]?.y ?? 0}
                                    r="4.5"
                                    fill="rgba(224,231,255,0.96)"
                                    stroke="rgba(99,102,241,0.95)"
                                    strokeWidth="2"
                                  />
                                </svg>
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
                  <div className="mt-4 flex flex-wrap gap-5 text-xs text-zinc-500">
                    <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-300" />{ui.txTypeIncome}</span>
                    <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-rose-400" />{ui.txTypeExpense}</span>
                    <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-white" />{effectiveCashFlowChartMode === "line" || effectiveCashFlowChartMode === "tradingview" ? ui.totalByRates : ui.netLabel}</span>
                  </div>
                </>
              )}
            </>
          ) : (
            <EmptyState text={ui.emptyTransactions} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
