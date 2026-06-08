import type {
  AccountRecord,
  CryptoMarketAssetRecord,
  CreateAccountPayload,
  CurrencyRecord,
  ExchangeRateRecord,
  NotificationRecord,
  TransactionRecord,
} from "@/lib/api/finance";
import type { Locale } from "@/lib/i18n/config";

import type {
  CashFlowRange,
  CashFlowTrajectoryPoint,
  SummaryDetailKind,
  UiCopy,
} from "@/components/workspace/finance-workspace.types";

export function formatMoney(value: string, currency = "USD") {
  const numberValue = Number(value || 0);
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(numberValue);
}

export function formatDate(value: string) {
  if (!value) {
    return "—";
  }
  return new Date(value).toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(value: string) {
  if (!value) {
    return "—";
  }
  return new Date(value).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function matchesExchangeRateSearch(rate: ExchangeRateRecord, query: string) {
  if (!query.trim()) {
    return true;
  }

  const normalizedQuery = query.trim().toLowerCase();
  return [
    rate.base_currency.code,
    rate.base_currency.name,
    rate.quote_currency.code,
    rate.quote_currency.name,
  ].some((value) => value.toLowerCase().includes(normalizedQuery));
}

export function matchesCryptoAssetSearch(asset: CryptoMarketAssetRecord, query: string) {
  if (!query.trim()) {
    return true;
  }

  const normalizedQuery = query.trim().toLowerCase();
  return [asset.symbol, asset.name, asset.quote_currency, asset.provider].some((value) =>
    value.toLowerCase().includes(normalizedQuery),
  );
}

export function formatMonthLabel(value: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "kg" ? "ky-KG" : locale === "en" ? "en-US" : "ru-RU", {
    month: "long",
    year: "numeric",
  }).format(value);
}

export function formatShortMonthLabel(value: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "kg" ? "ky-KG" : locale === "en" ? "en-US" : "ru-RU", {
    month: "short",
  }).format(value);
}

export function formatLocalizedDate(value: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "kg" ? "ky-KG" : locale === "en" ? "en-US" : "ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value);
}

export function formatRate(value: string) {
  return Number(value || 0).toFixed(2);
}

export function notificationScopeLabel(scope: NotificationRecord["scope"], ui: UiCopy) {
  return scope === "personal" ? ui.notificationScopePersonal : ui.notificationScopeBroadcast;
}

export function notificationLevelLabel(level: NotificationRecord["level"], ui: UiCopy) {
  const labels: Record<NotificationRecord["level"], string> = {
    info: ui.notificationLevelInfo,
    success: ui.notificationLevelSuccess,
    warning: ui.notificationLevelWarning,
    error: ui.notificationLevelError,
  };
  return labels[level];
}

export function notificationLevelTone(level: NotificationRecord["level"]) {
  if (level === "success") {
    return "border-emerald-300/20 bg-emerald-300/10 text-emerald-100";
  }
  if (level === "warning") {
    return "border-amber-300/20 bg-amber-300/10 text-amber-100";
  }
  if (level === "error") {
    return "border-rose-300/20 bg-rose-300/10 text-rose-100";
  }
  return "border-sky-300/20 bg-sky-300/10 text-sky-100";
}

export function transactionDisplayTitle(transaction: TransactionRecord, ui: UiCopy) {
  return transaction.title?.trim() || transaction.category_name || ui.untitledTransaction;
}

function startOfWeek(value: Date) {
  const result = new Date(value);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

function startOfDay(value: Date) {
  const result = new Date(value);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfDay(value: Date) {
  const result = new Date(value);
  result.setHours(23, 59, 59, 999);
  return result;
}

function startOfMonth(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), 1);
}

function endOfMonth(value: Date) {
  return new Date(value.getFullYear(), value.getMonth() + 1, 0, 23, 59, 59, 999);
}

function startOfQuarter(value: Date) {
  const quarterMonth = Math.floor(value.getMonth() / 3) * 3;
  return new Date(value.getFullYear(), quarterMonth, 1);
}

function endOfQuarter(value: Date) {
  const quarterStart = startOfQuarter(value);
  return new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0, 23, 59, 59, 999);
}

function startOfYear(value: Date) {
  return new Date(value.getFullYear(), 0, 1);
}

function endOfYear(value: Date) {
  return new Date(value.getFullYear(), 11, 31, 23, 59, 59, 999);
}

export function normalizeCashFlowDateRange(startDate: string, endDate: string) {
  if (!startDate || !endDate) {
    return { startDate, endDate };
  }

  return startDate <= endDate
    ? { startDate, endDate }
    : { startDate: endDate, endDate: startDate };
}

export function resolveCashFlowDateRange(
  range: CashFlowRange,
  anchorDate?: string,
  customRange?: { startDate: string; endDate: string },
) {
  if (range === "custom") {
    return normalizeCashFlowDateRange(customRange?.startDate ?? "", customRange?.endDate ?? "");
  }

  const anchor = anchorDate ? new Date(anchorDate) : new Date(getToday());
  const normalizedAnchor = Number.isNaN(anchor.getTime()) ? new Date(getToday()) : anchor;

  if (range === "day") {
    const end = endOfDay(normalizedAnchor);
    const start = startOfDay(new Date(end.getFullYear(), end.getMonth(), end.getDate() - 7));
    return normalizeCashFlowDateRange(start.toISOString().slice(0, 10), end.toISOString().slice(0, 10));
  }

  if (range === "week") {
    const currentWeekStart = startOfWeek(normalizedAnchor);
    const start = startOfWeek(new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), currentWeekStart.getDate() - 7 * 7));
    const end = endOfDay(new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), currentWeekStart.getDate() + 6));
    return normalizeCashFlowDateRange(start.toISOString().slice(0, 10), end.toISOString().slice(0, 10));
  }

  if (range === "month") {
    const start = startOfMonth(new Date(normalizedAnchor.getFullYear(), normalizedAnchor.getMonth() - 7, 1));
    const end = endOfMonth(normalizedAnchor);
    return normalizeCashFlowDateRange(start.toISOString().slice(0, 10), end.toISOString().slice(0, 10));
  }

  if (range === "quarter") {
    const currentQuarterStart = startOfQuarter(normalizedAnchor);
    const start = startOfQuarter(new Date(currentQuarterStart.getFullYear(), currentQuarterStart.getMonth() - 21, 1));
    const end = endOfQuarter(normalizedAnchor);
    return normalizeCashFlowDateRange(start.toISOString().slice(0, 10), end.toISOString().slice(0, 10));
  }

  const start = startOfYear(new Date(normalizedAnchor.getFullYear() - 7, 0, 1));
  const end = endOfYear(normalizedAnchor);
  return normalizeCashFlowDateRange(start.toISOString().slice(0, 10), end.toISOString().slice(0, 10));
}

export function buildCashFlowSeries(
  transactions: TransactionRecord[],
  range: CashFlowRange,
  locale: Locale,
  customRange?: { startDate: string; endDate: string },
  anchorDate?: string,
  exchangeRates: ExchangeRateRecord[] = [],
  targetCurrency?: string,
) {
  const grouped = new Map<
    string,
    { income: number; expense: number; label: string; tooltipLabel: string; sortValue: number }
  >();
  const normalizedCustomRange =
    range === "custom" && customRange
      ? normalizeCashFlowDateRange(customRange.startDate, customRange.endDate)
      : null;
  const anchor = anchorDate ? new Date(anchorDate) : new Date(getToday());
  const normalizedAnchor = Number.isNaN(anchor.getTime()) ? new Date(getToday()) : anchor;
  const boundedRange =
    range === "custom"
      ? null
      : (() => {
          if (range === "day") {
            const end = endOfDay(normalizedAnchor);
            const start = startOfDay(new Date(end.getFullYear(), end.getMonth(), end.getDate() - 7));
            return { start, end };
          }
          if (range === "week") {
            const currentWeekStart = startOfWeek(normalizedAnchor);
            const start = new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), currentWeekStart.getDate() - 7 * 7);
            const end = endOfDay(new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), currentWeekStart.getDate() + 6));
            return { start: startOfWeek(start), end };
          }
          if (range === "month") {
            return {
              start: startOfMonth(new Date(normalizedAnchor.getFullYear(), normalizedAnchor.getMonth() - 7, 1)),
              end: endOfMonth(normalizedAnchor),
            };
          }
          if (range === "quarter") {
            const currentQuarterStart = startOfQuarter(normalizedAnchor);
            return {
              start: startOfQuarter(new Date(currentQuarterStart.getFullYear(), currentQuarterStart.getMonth() - 21, 1)),
              end: endOfQuarter(normalizedAnchor),
            };
          }
          return {
            start: startOfYear(new Date(normalizedAnchor.getFullYear() - 7, 0, 1)),
            end: endOfYear(normalizedAnchor),
          };
        })();

  for (const item of transactions) {
    const occurredOn = new Date(item.occurred_on);
    if (Number.isNaN(occurredOn.getTime())) {
      continue;
    }
    if (
      normalizedCustomRange
      && (item.occurred_on < normalizedCustomRange.startDate || item.occurred_on > normalizedCustomRange.endDate)
    ) {
      continue;
    }
    if (
      boundedRange
      && (occurredOn.getTime() < boundedRange.start.getTime() || occurredOn.getTime() > boundedRange.end.getTime())
    ) {
      continue;
    }

    let bucketKey = item.occurred_on;
    let label = String(occurredOn.getDate());
    let tooltipLabel = formatLocalizedDate(occurredOn, locale);
    let sortValue = occurredOn.getTime();

    if (range === "week") {
      const weekStart = startOfWeek(occurredOn);
      bucketKey = weekStart.toISOString().slice(0, 10);
      label = `${weekStart.getDate()}.${String(weekStart.getMonth() + 1).padStart(2, "0")}`;
      tooltipLabel =
        locale === "ru"
          ? `Неделя с ${formatLocalizedDate(weekStart, locale)}`
          : locale === "kg"
            ? `${formatLocalizedDate(weekStart, locale)} башталган жума`
            : `Week of ${formatLocalizedDate(weekStart, locale)}`;
      sortValue = weekStart.getTime();
    }

    if (range === "month") {
      bucketKey = `${occurredOn.getFullYear()}-${String(occurredOn.getMonth() + 1).padStart(2, "0")}`;
      label = formatShortMonthLabel(occurredOn, locale);
      tooltipLabel = formatMonthLabel(occurredOn, locale);
      sortValue = new Date(occurredOn.getFullYear(), occurredOn.getMonth(), 1).getTime();
    }

    if (range === "quarter") {
      const quarter = Math.floor(occurredOn.getMonth() / 3) + 1;
      const quarterStart = startOfQuarter(occurredOn);
      bucketKey = `${occurredOn.getFullYear()}-Q${quarter}`;
      label = `Q${quarter}`;
      tooltipLabel =
        locale === "ru"
          ? `${quarter} квартал ${occurredOn.getFullYear()}`
          : locale === "kg"
            ? `${occurredOn.getFullYear()}-ж. ${quarter}-чейрек`
            : `Q${quarter} ${occurredOn.getFullYear()}`;
      sortValue = quarterStart.getTime();
    }

    if (range === "year") {
      bucketKey = String(occurredOn.getFullYear());
      label = String(occurredOn.getFullYear());
      tooltipLabel = String(occurredOn.getFullYear());
      sortValue = new Date(occurredOn.getFullYear(), 0, 1).getTime();
    }

    const current = grouped.get(bucketKey) ?? { income: 0, expense: 0, label, tooltipLabel, sortValue };

    const amount = Number(item.amount);
    const convertedAmount = targetCurrency
      ? convertAmountBetweenCurrencies(amount, item.currency, targetCurrency, exchangeRates)
      : amount;
    const normalizedAmount = convertedAmount ?? 0;

    if (item.type === "income" && item.status === "cleared") {
      current.income += normalizedAmount;
    }

    if (item.type === "expense" && item.status !== "canceled") {
      current.expense += normalizedAmount;
    }

    grouped.set(bucketKey, current);
  }

  const ordered = [...grouped.entries()]
    .sort(([, left], [, right]) => left.sortValue - right.sortValue)
    .slice(range === "custom" ? 0 : -8)
    .map(([bucket, values]) => ({
      day: bucket,
      label: values.label,
      tooltipLabel: values.tooltipLabel,
      income: values.income,
      expense: values.expense,
      net: values.income - values.expense,
      total: values.income + values.expense,
    }));

  const maxMagnitude =
    ordered.reduce((current, item) => Math.max(current, Math.abs(item.income), Math.abs(item.expense), Math.abs(item.net)), 0) || 1;
  const maxCombined =
    ordered.reduce((current, item) => Math.max(current, item.total), 0) || 1;

  return { items: ordered, maxMagnitude, maxCombined };
}

export function buildCashFlowTrajectory(
  items: Array<{
    day: string;
    label: string;
    tooltipLabel: string;
    income: number;
    expense: number;
    net: number;
    total: number;
  }>,
) {
  let runningBalance = 0;
  const trajectory: CashFlowTrajectoryPoint[] = items.map((item) => {
    const open = runningBalance;
    const high = open + item.income;
    const low = high - item.expense;
    const close = open + item.net;
    runningBalance = close;

    return {
      ...item,
      open,
      high: Math.max(open, high, close),
      low: Math.min(open, low, close),
      close,
    };
  });

  const bounds = trajectory.reduce(
    (current, item) => ({
      min: Math.min(current.min, item.low, item.open, item.close, 0),
      max: Math.max(current.max, item.high, item.open, item.close, 0),
    }),
    { min: 0, max: 0 },
  );

  return {
    items: trajectory,
    min: bounds.min,
    max: bounds.max,
    range: Math.max(bounds.max - bounds.min, 1),
    finalBalance: runningBalance,
  };
}

export function buildSvgLinePath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) {
    return "";
  }

  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

export function buildSmoothSvgLinePath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) {
    return "";
  }

  if (points.length === 1) {
    const point = points[0];
    return `M ${point.x} ${point.y}`;
  }

  let path = `M ${points[0]?.x ?? 0} ${points[0]?.y ?? 0}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const controlX = (current.x + next.x) / 2;
    path += ` Q ${controlX} ${current.y}, ${next.x} ${next.y}`;
  }

  return path;
}

export function cashFlowRangeDescription(
  range: CashFlowRange,
  locale: Locale,
  ui: UiCopy,
  anchorDate?: string,
  customRange?: { startDate: string; endDate: string },
) {
  if (range === "custom" && customRange?.startDate && customRange?.endDate) {
    return `${formatDate(customRange.startDate)} - ${formatDate(customRange.endDate)}`;
  }

  const anchor = anchorDate ? new Date(anchorDate) : new Date(getToday());
  const anchorValue = Number.isNaN(anchor.getTime()) ? getToday() : anchor.toISOString().slice(0, 10);
  const formattedAnchor = formatDate(anchorValue);

  if (range === "day") {
    return locale === "ru" ? `Последние 8 дней до ${formattedAnchor}` : locale === "kg" ? `${formattedAnchor} чейин акыркы 8 күн` : `Last 8 days to ${formattedAnchor}`;
  }
  if (range === "week") {
    return locale === "ru" ? `Последние 8 недель до ${formattedAnchor}` : locale === "kg" ? `${formattedAnchor} чейин акыркы 8 жума` : `Last 8 weeks to ${formattedAnchor}`;
  }
  if (range === "month") {
    return locale === "ru" ? `Последние 8 месяцев до ${formattedAnchor}` : locale === "kg" ? `${formattedAnchor} чейин акыркы 8 ай` : `Last 8 months to ${formattedAnchor}`;
  }
  if (range === "quarter") {
    return locale === "ru" ? `Последние 8 кварталов до ${formattedAnchor}` : locale === "kg" ? `${formattedAnchor} чейин акыркы 8 чейрек` : `Last 8 quarters to ${formattedAnchor}`;
  }
  if (range === "year") {
    return locale === "ru" ? `Последние 8 лет до ${formattedAnchor}` : locale === "kg" ? `${formattedAnchor} чейин акыркы 8 жыл` : `Last 8 years to ${formattedAnchor}`;
  }
  return ui.customPeriod;
}

export function buildMonthlyCurrencyBreakdown(
  transactions: TransactionRecord[],
  kind: "income" | "expense" | "net",
) {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const totals = new Map<string, number>();

  for (const item of transactions) {
    const occurredOn = new Date(item.occurred_on);
    if (Number.isNaN(occurredOn.getTime()) || occurredOn < monthStart) {
      continue;
    }

    const currency = item.currency;
    const current = totals.get(currency) ?? 0;
    const amount = Number(item.amount || 0);

    if (kind === "income" && item.type === "income" && item.status === "cleared") {
      totals.set(currency, current + amount);
    }

    if (kind === "expense" && item.type === "expense" && item.status !== "canceled") {
      totals.set(currency, current + amount);
    }

    if (kind === "net") {
      if (item.type === "income" && item.status === "cleared") {
        totals.set(currency, current + amount);
      } else if (item.type === "expense" && item.status !== "canceled") {
        totals.set(currency, current - amount);
      }
    }
  }

  return [...totals.entries()]
    .map(([currency, amount]) => ({ currency, amount }))
    .filter((entry) => Math.abs(entry.amount) > 0)
    .sort((left, right) => Math.abs(right.amount) - Math.abs(left.amount));
}

export function buildCurrencyBreakdownForTransactions(
  transactions: TransactionRecord[],
  kind: SummaryDetailKind,
) {
  const totals = new Map<string, number>();

  for (const item of transactions) {
    const current = totals.get(item.currency) ?? 0;
    const amount = Number(item.amount || 0);

    if (kind === "income" || kind === "expense") {
      totals.set(item.currency, current + amount);
      continue;
    }

    totals.set(item.currency, current + (item.type === "income" ? amount : -amount));
  }

  return [...totals.entries()]
    .map(([currency, amount]) => ({ currency, amount }))
    .filter((entry) => Math.abs(entry.amount) > 0)
    .sort((left, right) => Math.abs(right.amount) - Math.abs(left.amount));
}

export function getCrossRate(
  sourceCurrency: string | undefined,
  destinationCurrency: string | undefined,
  exchangeRates: ExchangeRateRecord[],
) {
  if (!sourceCurrency || !destinationCurrency) {
    return null;
  }

  const normalizeCurrency = (value: string) => {
    const normalized = value.toUpperCase();
    if (["USDT", "USDC", "BUSD", "FDUSD", "TUSD"].includes(normalized)) {
      return "USD";
    }
    return normalized;
  };

  const normalizedSource = normalizeCurrency(sourceCurrency);
  const normalizedDestination = normalizeCurrency(destinationCurrency);
  if (normalizedSource === normalizedDestination) {
    return 1;
  }
  const byBaseCurrency = new Map(exchangeRates.map((item) => [item.base_currency.code.toUpperCase(), Number(item.rate)]));

  if (normalizedDestination === "KGS") {
    return byBaseCurrency.get(normalizedSource) ?? null;
  }

  if (normalizedSource === "KGS") {
    const destinationRate = byBaseCurrency.get(normalizedDestination);
    return destinationRate ? 1 / destinationRate : null;
  }

  const sourceRate = byBaseCurrency.get(normalizedSource);
  const destinationRate = byBaseCurrency.get(normalizedDestination);
  if (!sourceRate || !destinationRate) {
    return null;
  }

  return sourceRate / destinationRate;
}

export function convertAmountBetweenCurrencies(
  amount: number,
  sourceCurrency: string | undefined,
  destinationCurrency: string | undefined,
  exchangeRates: ExchangeRateRecord[],
) {
  if (!Number.isFinite(amount)) {
    return 0;
  }

  if (!sourceCurrency || !destinationCurrency || sourceCurrency === destinationCurrency) {
    return amount;
  }

  const rate = getCrossRate(sourceCurrency, destinationCurrency, exchangeRates);
  if (rate === null) {
    return null;
  }

  return amount * rate;
}

export function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export function getMonthEnd() {
  const current = new Date();
  return new Date(current.getFullYear(), current.getMonth() + 1, 0).toISOString().slice(0, 10);
}

export function localeDisplayLabel(locale: Locale) {
  const labels: Record<Locale, string> = {
    ru: "Русский",
    en: "English",
    kg: "Кыргызча",
  };
  return labels[locale];
}

export function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

export function statusTone(status: string) {
  if (status === "cleared" || status === "active") {
    return "border-emerald-300/20 bg-emerald-300/10 text-emerald-100";
  }
  if (status === "pending" || status === "frozen") {
    return "border-amber-300/20 bg-amber-300/10 text-amber-100";
  }
  if (status === "archived" || status === "canceled" || status === "closed") {
    return "border-zinc-200/10 bg-zinc-200/10 text-zinc-300";
  }
  return "border-sky-300/20 bg-sky-300/10 text-sky-100";
}

export function accountKindLabel(value: string, ui: UiCopy) {
  const labels: Record<string, string> = {
    cash: ui.accountKindCash,
    bank: ui.accountKindBank,
    savings: ui.accountKindSavings,
    deposit: ui.accountKindDeposit,
    credit_card: ui.accountKindCreditCard,
    investment: ui.accountKindInvestment,
    entrepreneur: ui.accountKindEntrepreneur,
    company: ui.accountKindCompany,
    e_wallet: ui.accountKindWallet,
    loan: ui.accountKindLoan,
    other: ui.accountKindOther,
  };
  return labels[value] ?? value.replaceAll("_", " ");
}

export function transactionTypeLabel(value: string, ui: UiCopy) {
  const labels: Record<string, string> = {
    income: ui.txTypeIncome,
    expense: ui.txTypeExpense,
    transfer: ui.txTypeTransfer,
  };
  return labels[value] ?? value;
}

export function transactionStatusLabel(value: string, ui: UiCopy) {
  const labels: Record<string, string> = {
    cleared: ui.txStatusCleared,
    pending: ui.txStatusPending,
    draft: ui.txStatusDraft,
    canceled: ui.txStatusCanceled,
    active: ui.activeLabel,
    inactive: ui.inactiveLabel,
    frozen: ui.freeze,
    archived: ui.archive,
    closed: ui.inactiveLabel,
  };
  return labels[value] ?? value;
}

export function transactionSignedValue(item: TransactionRecord) {
  if (item.type === "expense") {
    return `-${item.amount}`;
  }
  return item.amount;
}

export function taxEntityLabel(value: "entrepreneur" | "company", ui: UiCopy) {
  return value === "company" ? ui.companyLabel : ui.entrepreneurLabel;
}

export function reportingPeriodLabel(value: string, ui: UiCopy) {
  const labels: Record<string, string> = {
    monthly: ui.monthly,
    weekly: ui.weekly,
    quarterly: ui.quarterly,
    yearly: ui.yearly,
    custom: ui.customPeriod,
  };
  return labels[value] ?? value;
}

export function createDefaultDepositProfile() {
  return {
    annual_interest_rate: "0.0000",
    interest_payout_frequency: "monthly" as const,
    day_count_convention: "actual_365" as const,
    term_start_date: getToday(),
    maturity_date: "",
    capitalization_enabled: false,
    auto_renewal: false,
    allow_top_up: true,
    allow_partial_withdrawal: false,
    recurring_contribution_amount: "0.00",
    recurring_contribution_frequency: "none" as const,
    recurring_contribution_day: 1,
    minimum_balance: "0.00",
    note: "",
    is_active: true,
  };
}

export function resolveDefaultCurrency(
  availableCurrencies: CurrencyRecord[],
  preferredCurrency?: string | null,
) {
  const normalizedPreferred = preferredCurrency?.trim().toUpperCase();
  if (normalizedPreferred && availableCurrencies.some((item) => item.code === normalizedPreferred)) {
    return normalizedPreferred;
  }
  return availableCurrencies.find((item) => item.code === "USD")?.code ?? availableCurrencies[0]?.code ?? "USD";
}

export function createDefaultTaxProfile(kind: string) {
  return {
    tax_rate: "",
    social_fund_rate: "0.0000",
    template_code: kind === "entrepreneur" ? "kg_ip_simplified_4" : "custom",
    calculation_source: "transactions" as const,
    manual_tax_base: null,
    manual_tax_amount: null,
    manual_social_fund_amount: null,
    note: "",
    is_active: true,
  };
}

export function createDefaultAccountForm(currency = "USD"): CreateAccountPayload {
  return {
    currency,
    name: "",
    kind: "cash",
    status: "active",
    institution: "",
    account_number_mask: "",
    iban: "",
    note: "",
    icon: "",
    color: "emerald",
    include_in_net_worth: true,
    opening_balance: "0.00",
    credit_limit: "0.00",
    tax_profile: undefined,
    deposit_profile: createDefaultDepositProfile(),
  };
}

export function createAccountFormFromRecord(account: AccountRecord): CreateAccountPayload {
  return {
    currency: account.currency,
    name: account.name,
    kind: account.kind,
    status: account.status,
    institution: account.institution,
    account_number_mask: account.account_number_mask,
    iban: account.iban,
    note: account.note,
    icon: account.icon,
    color: account.color,
    include_in_net_worth: account.include_in_net_worth,
    opening_balance: account.opening_balance,
    credit_limit: account.credit_limit,
    tax_profile:
      account.kind === "entrepreneur" || account.kind === "company"
        ? {
            tax_rate: account.tax_profile?.tax_rate ?? "",
            social_fund_rate: account.tax_profile?.social_fund_rate ?? "0.0000",
            template_code: account.tax_profile?.template_code ?? (account.kind === "entrepreneur" ? "kg_ip_simplified_4" : "custom"),
            calculation_source: account.tax_profile?.calculation_source ?? "transactions",
            manual_tax_base: account.tax_profile?.manual_tax_base ?? null,
            manual_tax_amount: account.tax_profile?.manual_tax_amount ?? null,
            manual_social_fund_amount: account.tax_profile?.manual_social_fund_amount ?? null,
            note: account.tax_profile?.note ?? "",
            is_active: account.tax_profile?.is_active ?? true,
          }
        : undefined,
    deposit_profile: account.deposit_profile
      ? {
          annual_interest_rate: account.deposit_profile.annual_interest_rate,
          interest_payout_frequency: account.deposit_profile.interest_payout_frequency,
          day_count_convention: account.deposit_profile.day_count_convention,
          term_start_date: account.deposit_profile.term_start_date,
          maturity_date: account.deposit_profile.maturity_date ?? "",
          capitalization_enabled: account.deposit_profile.capitalization_enabled,
          auto_renewal: account.deposit_profile.auto_renewal,
          allow_top_up: account.deposit_profile.allow_top_up,
          allow_partial_withdrawal: account.deposit_profile.allow_partial_withdrawal,
          recurring_contribution_amount: account.deposit_profile.recurring_contribution_amount,
          recurring_contribution_frequency: account.deposit_profile.recurring_contribution_frequency,
          recurring_contribution_day: account.deposit_profile.recurring_contribution_day,
          minimum_balance: account.deposit_profile.minimum_balance,
          note: account.deposit_profile.note,
          is_active: account.deposit_profile.is_active,
        }
      : createDefaultDepositProfile(),
  };
}

export function createProfileForm(user: {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  two_factor_enabled?: boolean;
  cash_flow_chart_default?: "bars" | "line" | "tradingview" | "candles" | "structure";
  default_currency?: string;
  crypto_market_provider?: "binance" | "okx" | "bybit" | "kraken";
} | null) {
  return {
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    two_factor_enabled: user?.two_factor_enabled ?? false,
    cash_flow_chart_default: user?.cash_flow_chart_default ?? "bars",
    default_currency: user?.default_currency ?? "USD",
    crypto_market_provider: user?.crypto_market_provider ?? "binance",
  };
}

export function getAccountDisplayBalance(account: AccountRecord) {
  return account.deposit_profile?.projected_balance ?? account.current_balance;
}
