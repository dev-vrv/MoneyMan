import type {
  AccountRecord,
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
  return Number(value || 0).toFixed(4);
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

export function normalizeCashFlowDateRange(startDate: string, endDate: string) {
  if (!startDate || !endDate) {
    return { startDate, endDate };
  }

  return startDate <= endDate
    ? { startDate, endDate }
    : { startDate: endDate, endDate: startDate };
}

export function buildCashFlowSeries(
  transactions: TransactionRecord[],
  range: CashFlowRange,
  locale: Locale,
  customRange?: { startDate: string; endDate: string },
) {
  const grouped = new Map<
    string,
    { income: number; expense: number; label: string; tooltipLabel: string; sortValue: number }
  >();
  const normalizedCustomRange =
    range === "custom" && customRange
      ? normalizeCashFlowDateRange(customRange.startDate, customRange.endDate)
      : null;

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

    const current = grouped.get(bucketKey) ?? { income: 0, expense: 0, label, tooltipLabel, sortValue };

    if (item.type === "income" && item.status === "cleared") {
      current.income += Number(item.amount);
    }

    if (item.type === "expense" && item.status !== "canceled") {
      current.expense += Number(item.amount);
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

export function cashFlowRangeDescription(range: CashFlowRange, locale: Locale, ui: UiCopy) {
  if (range === "day") {
    return locale === "ru" ? "Последние 8 дней" : locale === "kg" ? "Акыркы 8 күн" : "Last 8 days";
  }
  if (range === "week") {
    return locale === "ru" ? "Последние 8 недель" : locale === "kg" ? "Акыркы 8 жума" : "Last 8 weeks";
  }
  if (range === "custom") {
    return ui.customPeriod;
  }
  return formatMonthLabel(new Date(), locale) || ui.monthly;
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
  if (!sourceCurrency || !destinationCurrency || sourceCurrency === destinationCurrency) {
    return null;
  }

  const normalizedSource = sourceCurrency.toUpperCase();
  const normalizedDestination = destinationCurrency.toUpperCase();
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
  cash_flow_chart_default?: "bars" | "line" | "tradingview" | "candles" | "structure";
  default_currency?: string;
} | null) {
  return {
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    cash_flow_chart_default: user?.cash_flow_chart_default ?? "bars",
    default_currency: user?.default_currency ?? "USD",
  };
}

export function getAccountDisplayBalance(account: AccountRecord) {
  return account.deposit_profile?.projected_balance ?? account.current_balance;
}
