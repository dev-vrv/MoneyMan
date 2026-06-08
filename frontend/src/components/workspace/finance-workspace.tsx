"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  RiAddLine,
  RiArrowRightUpLine,
  RiBankCardLine,
  RiBarChartBoxLine,
  RiBookletLine,
  RiCoinsLine,
  RiDashboardLine,
  RiDeleteBin6Line,
  RiExchangeDollarLine,
  RiNotification3Line,
  RiGlobalLine,
  RiSettings3Line,
  RiSafe2Line,
  RiWallet3Line,
} from "react-icons/ri";

import { useAuth } from "@/components/providers/auth-provider";
import { AccountAppearancePicker } from "@/components/workspace/account-appearance-picker";
import { AccountDetailsDialog } from "@/components/workspace/account-details-dialog";
import { CategoryAppearancePicker, resolveCategoryAppearance, resolveCategoryIcon } from "@/components/workspace/category-appearance-picker";
import { CurrencyFlag, CurrencyOptionLabel } from "@/components/workspace/currency-flag";
import { PremiumUpgradeDialog } from "@/components/workspace/premium-upgrade-dialog";
import { WorkspaceAccountsSection } from "@/components/workspace/sections/workspace-accounts-section";
import { WorkspaceAnalyticsSection } from "@/components/workspace/sections/workspace-analytics-section";
import { WorkspaceBudgetsSection } from "@/components/workspace/sections/workspace-budgets-section";
import { WorkspaceNavigation } from "@/components/workspace/sections/workspace-navigation";
import { WorkspaceOverviewSection } from "@/components/workspace/sections/workspace-overview-section";
import { WorkspaceRatesSection } from "@/components/workspace/sections/workspace-rates-section";
import { WorkspaceSettingsSection } from "@/components/workspace/sections/workspace-settings-section";
import { WorkspaceTransactionsSection } from "@/components/workspace/sections/workspace-transactions-section";
import { WorkspaceDialogShell } from "@/components/workspace/workspace-dialog-shell";
import type {
  CashFlowChartMode,
  CashFlowRange,
  FinanceWorkspaceProps,
  SummaryDetailKind,
  UiCopy,
} from "@/components/workspace/finance-workspace.types";
import {
  AccountCard,
  EMPTY_SELECT_VALUE,
  EmptyState,
  MetricCard,
  PriorityPill,
  QuickActionRow,
  TransactionDialogFields,
  WorkspaceSelect,
} from "@/components/workspace/finance-workspace-ui";
import {
  buildCashFlowSeries,
  buildCashFlowTrajectory,
  buildCurrencyBreakdownForTransactions,
  buildMonthlyCurrencyBreakdown,
  cashFlowRangeDescription,
  createAccountFormFromRecord,
  createDefaultAccountForm,
  createDefaultDepositProfile,
  createDefaultTaxProfile,
  createProfileForm,
  convertAmountBetweenCurrencies,
  formatDate,
  formatMoney,
  formatMonthLabel,
  formatRate,
  getCrossRate,
  getMonthEnd,
  getToday,
  matchesCryptoAssetSearch,
  matchesExchangeRateSearch,
  notificationLevelLabel,
  notificationLevelTone,
  notificationScopeLabel,
  normalizeCashFlowDateRange,
  resolveDefaultCurrency,
  slugify,
  transactionDisplayTitle,
  transactionSignedValue,
} from "@/components/workspace/finance-workspace.utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DateInput } from "@/components/ui/date-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  createAccount,
  createBudget,
  createCategory,
  createTaxObligationTransactions,
  createTransaction,
  createTransactionTemplate,
  deleteAccount,
  deleteBudget,
  deleteCategory,
  deleteTransaction,
  deleteTransactionTemplate,
  extractApiErrorMessage,
  fetchAccounts,
  fetchBudgets,
  fetchCategories,
  fetchCryptoHoldings,
  fetchCurrencies,
  fetchExchangeRates,
  fetchMarketSnapshot,
  fetchNotifications,
  fetchSubscriptionPlans,
  fetchTransactionTemplates,
  fetchTransactions,
  fetchWorkspaceOverview,
  markAllNotificationsRead,
  markNotificationRead,
  updateCategory,
  updateAccount,
  updateBudget,
  updateTransaction,
  updateTransactionTemplate,
  type AccountRecord,
  type BudgetRecord,
  type CategoryRecord,
  type CreateAccountPayload,
  type CreateBudgetPayload,
  type CreateCategoryPayload,
  type CreateTaxObligationTransactionsPayload,
  type CreateTransactionPayload,
  type CreateTransactionTemplatePayload,
  type CurrencyRecord,
  type TransactionRecord,
  type TransactionTemplateRecord,
} from "@/lib/api/finance";
import { useLocalePreference } from "@/lib/i18n/client";
import { getLocalizedPath, replacePathLocale, type Locale } from "@/lib/i18n/config";
import { buildAccountBalanceSnapshot } from "@/lib/finance/account-balance-summary";

const workspacePreferenceStorageKey = "fin-man-workspace-preferences";
const ratesComparisonCurrencySessionStorageKey = "fin-man-rates-comparison-currency";
const NO_TRANSACTION_TEMPLATE_VALUE = "__no_transaction_template__";
const premiumCtaClassName =
  "relative overflow-hidden rounded-2xl border border-cyan-300/28 bg-[linear-gradient(135deg,rgba(34,211,238,0.2)_0%,rgba(56,189,248,0.14)_35%,rgba(129,140,248,0.18)_100%)] text-cyan-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_0_1px_rgba(56,189,248,0.08),0_10px_30px_rgba(14,165,233,0.18),0_0_36px_rgba(59,130,246,0.12)] transition-all duration-300 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_left_center,rgba(255,255,255,0.2),transparent_42%)] before:opacity-70 before:content-[''] hover:border-cyan-200/44 hover:text-cyan-50 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_0_1px_rgba(103,232,249,0.14),0_16px_42px_rgba(14,165,233,0.24),0_0_52px_rgba(99,102,241,0.18)]";

function isSubscriptionCategory(category: { slug?: string; parent_name?: string | null; name: string } | null) {
  if (!category) {
    return false;
  }

  const normalizedName = category.name.toLowerCase();
  const normalizedParentName = category.parent_name?.toLowerCase() ?? "";
  return (
    category.slug === "subscriptions"
    || normalizedParentName.includes("подпис")
    || normalizedName.includes("подпис")
    || normalizedName.includes("subscription")
  );
}

type StoredWorkspacePreferences = {
  cash_flow_chart_default?: CashFlowChartMode;
  default_currency?: string;
  crypto_market_provider?: "binance" | "okx" | "bybit" | "kraken";
  subscription_tier?: "free" | "premium";
  subscription_cycle?: "monthly" | "yearly";
  selected_premium_plan_code?: string;
};

type FormFieldErrors = Record<string, string>;

function resolveWorkspacePreferences(
  preferences: StoredWorkspacePreferences,
): Required<StoredWorkspacePreferences> {
  return {
    cash_flow_chart_default: preferences.cash_flow_chart_default ?? "bars",
    default_currency: preferences.default_currency ?? "USD",
    crypto_market_provider: preferences.crypto_market_provider ?? "binance",
    subscription_tier: preferences.subscription_tier ?? "free",
    subscription_cycle: preferences.subscription_cycle ?? "yearly",
    selected_premium_plan_code: preferences.selected_premium_plan_code ?? "",
  };
}

function readStoredWorkspacePreferences(): StoredWorkspacePreferences {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const rawValue = window.localStorage.getItem(workspacePreferenceStorageKey);
    if (!rawValue) {
      return {};
    }

    const parsed = JSON.parse(rawValue) as StoredWorkspacePreferences;
    return {
      cash_flow_chart_default: parsed.cash_flow_chart_default,
      default_currency: parsed.default_currency,
      crypto_market_provider: parsed.crypto_market_provider,
      subscription_tier: parsed.subscription_tier,
      subscription_cycle: parsed.subscription_cycle,
      selected_premium_plan_code: parsed.selected_premium_plan_code,
    };
  } catch {
    return {};
  }
}

function persistWorkspacePreferences(preferences: StoredWorkspacePreferences) {
  if (typeof window === "undefined") {
    return;
  }

  const current = readStoredWorkspacePreferences();
  window.localStorage.setItem(
    workspacePreferenceStorageKey,
    JSON.stringify({
      ...current,
      ...preferences,
    }),
  );
}

function readRatesComparisonCurrencyFromSession() {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    return window.sessionStorage.getItem(ratesComparisonCurrencySessionStorageKey)?.toUpperCase() ?? "";
  } catch {
    return "";
  }
}

function persistRatesComparisonCurrencyToSession(currencyCode: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(ratesComparisonCurrencySessionStorageKey, currencyCode.toUpperCase());
  } catch {
    // Ignore storage access failures and keep the value in memory only.
  }
}

function buildProfileFormWithPreferences(
  user: Parameters<typeof createProfileForm>[0],
  storedPreferences: StoredWorkspacePreferences,
) {
  const resolvedPreferences = resolveWorkspacePreferences(storedPreferences);
  return createProfileForm({
    ...user,
    cash_flow_chart_default: resolvedPreferences.cash_flow_chart_default,
    default_currency: resolvedPreferences.default_currency,
    crypto_market_provider: resolvedPreferences.crypto_market_provider,
  });
}

function extractFieldErrors(error: unknown): FormFieldErrors {
  if (!error || typeof error !== "object" || !("response" in error)) {
    return {};
  }

  const payload = (error as { response?: { data?: unknown } }).response?.data;
  if (!payload || typeof payload !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(payload).flatMap(([field, value]) => {
      if (Array.isArray(value) && value[0]) {
        return [[field, String(value[0])]];
      }
      if (typeof value === "string" && value) {
        return [[field, value]];
      }
      return [];
    }),
  );
}

function createDefaultTransactionTemplateForm(): CreateTransactionTemplatePayload {
  return {
    name: "",
    account: 0,
    destination_account: null,
    category: null,
    type: "expense",
    status: "cleared",
    amount: "",
    destination_amount: null,
    exchange_rate: null,
    title: "",
    merchant: "",
    description: "",
    icon: "tag",
    color: "slate",
    sort_order: 0,
    is_active: true,
  };
}

function createBlankTransactionTemplateForm(): CreateTransactionTemplatePayload {
  return {
    name: "",
    account: 0,
    destination_account: null,
    category: null,
    type: "expense",
    status: "cleared",
    amount: "",
    destination_amount: null,
    exchange_rate: null,
    title: "",
    merchant: "",
    description: "",
    icon: "tag",
    color: "slate",
    sort_order: 0,
    is_active: true,
  };
}

function validateAccountForm(values: CreateAccountPayload): FormFieldErrors {
  const errors: FormFieldErrors = {};

  if (!values.name.trim()) {
    errors.name = "Укажите название счета."
  }
  if (!values.currency.trim()) {
    errors.currency = "Выберите валюту."
  }
  if (!values.kind.trim()) {
    errors.kind = "Выберите тип счета."
  }
  if (!values.status.trim()) {
    errors.status = "Выберите статус."
  }
  if (values.kind === "deposit" && !values.deposit_profile?.term_start_date) {
    errors.deposit_profile = "Для депозита укажите параметры вклада."
  }
  if ((values.kind === "entrepreneur" || values.kind === "company") && !values.tax_profile?.tax_rate) {
    errors.tax_profile = "Для бизнес-счета укажите налоговый профиль."
  }

  return errors;
}

function validateTransactionForm(values: CreateTransactionPayload): FormFieldErrors {
  const errors: FormFieldErrors = {};

  if (!values.account) {
    errors.account = "Выберите счет."
  }
  if (!values.type.trim()) {
    errors.type = "Выберите тип транзакции."
  }
  if (!values.status.trim()) {
    errors.status = "Выберите статус."
  }
  if (!values.amount.trim()) {
    errors.amount = "Укажите сумму."
  }
  if (!values.occurred_on.trim()) {
    errors.occurred_on = "Укажите дату."
  }
  if (values.type === "transfer") {
    if (!values.destination_account) {
      errors.destination_account = "Выберите счет назначения."
    }
  } else if (!values.category) {
    errors.category = "Выберите категорию."
  }

  return errors;
}

function getUiCopy(locale: Locale): UiCopy {
  if (locale === "ru") {
    return {
      overview: "Обзор",
      accounts: "Счета",
      transactions: "Транзакции",
      budgets: "Бюджеты",
      categories: "Категории",
      settings: "Настройки",
      operationsCenter: "Центр управления",
      operationsDescription: "Разделы, быстрые действия и ключевые финансовые сущности.",
      totalAccounts: "Всего счетов",
      activeBudgets: "Активные бюджеты",
      pendingItems: "Требуют внимания",
      createAccount: "Новый счет",
      createBudget: "Новый бюджет",
      createCategory: "Новая категория",
      manageAccounts: "Управляйте балансами, статусами и структурой ваших кошельков, карт и накоплений.",
      accountDetailsTitle: "Детализация счета",
      accountDetailsDescription: "Реальное движение средств по счету с фильтрами, периодами и историей операций.",
      manageTransactions: "Фиксируйте доходы, расходы и переводы. Удаляйте ошибочные операции без перехода в админку.",
      manageTransactionTemplates: "Создавайте заготовки для повторяющихся операций и запускайте их прямо из формы новой транзакции.",
      manageBudgets: "Планируйте лимиты по категориям и быстро отключайте неактуальные периоды.",
      manageCategories: "Добавляйте свои категории поверх системного набора.",
      emptyAccounts: "Счета пока не созданы.",
      emptyTransactions: "Транзакций пока нет.",
      emptyBudgets: "Бюджеты пока не созданы.",
      emptyCategories: "Категории пока не найдены.",
      deleteAccountTitle: "Удалить счет?",
      deleteAccountBody: "Счет будет удален вместе с привязанными данными, если это допускает система.",
      deleteTransactionTitle: "Удалить транзакцию?",
      deleteTransactionBody: "Баланс связанного счета будет пересчитан автоматически.",
      deleteTransactionTemplateTitle: "Удалить шаблон транзакции?",
      deleteTransactionTemplateBody: "Шаблон будет удален, но уже созданные по нему транзакции останутся.",
      deleteBudgetTitle: "Удалить бюджет?",
      deleteBudgetBody: "Бюджетный период будет удален без возможности восстановления.",
      deleteCategoryTitle: "Удалить категорию?",
      deleteCategoryBody: "Удалять можно только пользовательские категории без системной защиты.",
      cancel: "Отмена",
      create: "Создать",
      save: "Сохранить",
      deactivate: "Деактивировать",
      activate: "Активировать",
      freeze: "Заморозить",
      archive: "В архив",
      balance: "Баланс",
      status: "Статус",
      period: "Период",
      type: "Тип",
      notes: "Комментарий",
      tools: "Инструменты",
      destinationAccount: "Счет назначения",
      merchant: "Контрагент",
      category: "Категория",
      amount: "Сумма",
      date: "Дата",
      currency: "Валюта",
      accountName: "Название счета",
      accountKind: "Тип счета",
      institution: "Организация",
      openingBalance: "Стартовый баланс",
      creditLimit: "Кредитный лимит",
      budgetAmount: "Лимит бюджета",
      budgetKind: "Тип бюджета",
      budgetKindExpense: "Расходный",
      budgetKindSaving: "Накопление",
      budgetKindGoal: "Финансовая цель",
      budgetName: "Название",
      budgetTargetAmount: "Целевая сумма",
      budgetTargetAccount: "Целевой счет",
      threshold: "Порог предупреждения, %",
      thresholdDescription: "Когда процент использования дойдет до этого значения, бюджет попадет в зону внимания. 0 отключает предупреждение.",
      allLabel: "Все",
      categoryName: "Название категории",
      slug: "Слаг",
      accountCreated: "Счет создан.",
      transactionCreated: "Транзакция создана.",
      transactionTemplateCreated: "Шаблон транзакции создан.",
      budgetCreated: "Бюджет создан.",
      categoryCreated: "Категория создана.",
      categoryUpdated: "Категория обновлена.",
      accountDeleted: "Счет удален.",
      budgetDeleted: "Бюджет удален.",
      transactionDeleted: "Транзакция удалена.",
      transactionTemplateDeleted: "Шаблон транзакции удален.",
      transactionUpdated: "Транзакция обновлена.",
      transactionTemplateUpdated: "Шаблон транзакции обновлен.",
      categoryDeleted: "Категория удалена.",
      accountUpdated: "Счет обновлен.",
      budgetUpdated: "Бюджет обновлен.",
      editBudget: "Редактировать бюджет",
      saveAsTemplate: "Сохранить как шаблон",
      createTemplate: "Новый шаблон",
      editTemplate: "Редактировать шаблон",
      applyTemplate: "Применить шаблон",
      transactionTemplate: "Шаблон транзакции",
      transactionTemplateName: "Название шаблона",
      selectTransactionTemplate: "Выберите шаблон",
      noTransactionTemplate: "Без шаблона",
      templateAppearanceTitle: "Вид шаблона",
      templateAppearanceDescription: "Выберите иконку и цвет, чтобы быстро узнавать заготовку в списке.",
      editLabel: "Редактировать",
      firstName: "Имя",
      lastName: "Фамилия",
      email: "Email",
      phone: "Телефон",
      twoFactorAuth: "Двухфакторная аутентификация",
      twoFactorAuthDescription: "Требовать дополнительное подтверждение при входе в аккаунт.",
      enabledLabel: "Включено",
      disabledLabel: "Выключено",
      saveProfile: "Сохранить профиль",
      profileUpdated: "Профиль обновлен.",
      localeControl: "Локализация",
      localeDescription: "Переключение языка интерфейса и сохранение пользовательского выбора.",
      settingsDescription: "Отдельный раздел для категорий, локализации и конфигурации рабочего пространства.",
      settingsSectionTitle: "Настройки рабочего пространства",
      settingsSectionBody: "Здесь собраны категории, локализация, профиль пользователя и персональные параметры.",
      categorySettingsTitle: "Категории операций",
      categorySettingsBody: "Управляйте своими категориями доходов и расходов отдельно от ежедневных операций.",
      categorySearchPlaceholder: "Поиск по названию или slug",
      categorySourceFilter: "Источник категорий",
      categoryTypeFilter: "Тип категорий",
      categoryAllFilter: "Все",
      categorySystemFilter: "Общие",
      categoryCustomFilter: "Личные",
      totalCategoriesValue: "{count} всего",
      systemCategoriesValue: "{count} общих",
      customCategoriesValue: "{count} личных",
      showMoreCategories: "Показать еще {count}",
      showLessCategories: "Свернуть список",
      interfaceSettingsTitle: "Профиль и настройки интерфейса",
      interfaceSettingsBody: "Управляйте личными данными, безопасностью, языком интерфейса и рабочими параметрами пространства.",
      languageUpdated: "Язык интерфейса обновлен.",
      interfaceLanguage: "Язык интерфейса",
      defaultCurrency: "Валюта по умолчанию",
      defaultCurrencyDescription: "Эта валюта будет автоматически подставляться в новые формы, где требуется выбор валюты.",
      cryptoMarketProvider: "Источник котировок крипты",
      cryptoMarketProviderDescription: "Провайдер live-котировок для блока крипторынка. Выбор хранится локально в браузере.",
      cryptoProviderBinance: "Binance",
      cryptoProviderOkx: "OKX",
      cryptoProviderBybit: "Bybit",
      cryptoProviderKraken: "Kraken",
      accountKindCash: "Наличные",
      accountKindBank: "Банк",
      accountKindSavings: "Сбережения",
      accountKindDeposit: "Депозит",
      accountKindCreditCard: "Кредитная карта",
      accountKindInvestment: "Инвестиции",
      accountKindEntrepreneur: "Счет ИП",
      accountKindCompany: "Счет ОсОО",
      accountKindWallet: "Электронный кошелек",
      accountKindLoan: "Займ",
      accountKindOther: "Другое",
      txTypeIncome: "Доход",
      txTypeExpense: "Расход",
      txTypeTransfer: "Перевод",
      netLabel: "Чистый поток",
      cashFlowLabel: "Денежный поток",
      txStatusCleared: "Проведена",
      txStatusPending: "В ожидании",
      txStatusDraft: "Черновик",
      txStatusCanceled: "Отменена",
      selectCategory: "Выберите категорию",
      selectDestination: "Выберите счет назначения",
      destinationAmount: "Сумма назначения",
      exchangeRate: "Курс обмена",
      titleLabel: "Название",
      untitledTransaction: "Без названия",
      optional: "Необязательно",
      monthly: "Ежемесячно",
      weekly: "Еженедельно",
      daily: "День",
      quarterly: "Ежеквартально",
      yearly: "Ежегодно",
      customPeriod: "Произвольный",
      startDate: "Дата начала",
      endDate: "Дата окончания",
      colorToken: "Цвет акцента",
      accountIcon: "Иконка счета",
      appearanceHint: "Выберите иконку и акцентный цвет для карточки счета.",
      clearSelection: "Сбросить",
      systemLabel: "Системная",
      customLabel: "Пользовательская",
      activeLabel: "Активно",
      inactiveLabel: "Неактивно",
      noDescription: "Описание не указано.",
      deleteLabel: "Удалить",
      transferLabel: "Перевод",
      notAvailable: "Нет данных",
      balancesByCurrency: "Балансы по валютам",
      balanceOverview: "Обзор балансов",
      primaryAccountLabel: "Основной счет",
      totalByRates: "Общий баланс по курсам",
      allAccountsLabel: "Все счета",
      openAccountsSnapshot: "Все счета",
      totalApproximate: "Оценка",
      ratesMissing: "Нет курсов для: {currencies}",
      marketRates: "Курсы валют и криптовалют",
      marketRatesDescription: "Актуальные курсы валют из FX.kg и котировки криптовалют с выбранной биржи.",
      ratesComparisonCurrency: "Валюта сравнения",
      fiatRatesTitle: "Валюты",
      fiatRatesDescription: "Актуальные курсы основных валют.",
      fiatRatesDescriptionWithCurrency: "Актуальные курсы основных валют в {currency}.",
      cryptoRatesTitle: "Криптовалюты",
      cryptoRatesDescription: "Текущие цены и изменение за 24 часа по основным криптоактивам.",
      cryptoQuoteLabel: "Валюта котировки",
      priceChange24hLabel: "За 24 ч",
      priceInLabel: "В {currency}",
      priceInUsdtLabel: "В USDT",
      providerUnavailable: "Провайдер временно недоступен",
      latestRateSnapshot: "Обновлено",
      ratesLoading: "Загружаем курсы...",
      noRatesAvailable: "Курсы еще не загружены.",
      primaryRatesLabel: "Основные пары",
      allRatesAction: "Показать все",
      allRatesDescription: "Полный список всех загруженных валютных пар.",
      searchRatesPlaceholder: "Поиск по коду или названию валюты",
      noRatesMatch: "По вашему запросу курсы не найдены.",
      notificationsTitle: "Уведомления",
      notificationsDescription: "Личные уведомления и общие рассылки из админки.",
      notificationMarkRead: "Прочитать",
      notificationMarkAllRead: "Прочитать все",
      noNotifications: "Новых уведомлений пока нет.",
      notificationScopePersonal: "Личное",
      notificationScopeBroadcast: "Рассылка",
      notificationLevelInfo: "Инфо",
      notificationLevelSuccess: "Успех",
      notificationLevelWarning: "Внимание",
      notificationLevelError: "Ошибка",
      cashControlTitle: "Контроль счетов",
      cashControlDescription: "Балансы, резерв и структура счетов по всему вашему финансовому стеку.",
      activeAccountsValue: "{count} активных счетов",
      budgetPressureTitle: "Давление по бюджетам",
      budgetPressureDescription: "Следите за риском перерасхода и реагируйте до исчерпания месячных лимитов.",
      categoriesToWatchValue: "{count} категорий под контролем",
      attentionQueueTitle: "Очередь внимания",
      noPendingItems: "Сейчас нет элементов, требующих внимания.",
      attentionItemsValue: "{count} элементов",
      quickExpenseTitle: "Новая транзакция",
      quickExpenseBody: "Добавляйте доходы, расходы и переводы прямо в рабочем пространстве без лишней навигации.",
      quickExpenseMeta: "{count} расходов за 7 дней",
      addExpense: "Добавить транзакцию",
      budgetWorkflowTitle: "Бюджеты периода",
      budgetWorkflowBody: "Проверьте активные лимиты и категории, которые уже близки к порогу перерасхода.",
      budgetWorkflowMeta: "{active} активных, {alerts} под риском",
      openBudgets: "Открыть бюджеты",
      categoryWorkflowTitle: "Категории и правила",
      categoryWorkflowBody: "Поддерживайте чистую структуру категорий, чтобы ввод и аналитика были предсказуемыми.",
      categoryWorkflowMeta: "{count} пользовательских категорий",
      openSettings: "Открыть настройки",
      workflowSectionDescription: "Ключевые рабочие сценарии, которые можно запускать прямо с этой поверхности.",
      analyticsWorkflowTitle: "Аналитика",
      analyticsWorkflowBody: "Переключайте режим графика, сравнивайте периоды и проваливайтесь в валютный слой без лишней навигации.",
      analyticsWorkflowMeta: "{range} · {mode}",
      openTransactionsSection: "Открыть транзакции",
      comparePeriods: "Сравнить периоды",
      openRates: "Открыть курсы",
      premiumBadge: "Premium",
      premiumPlanTitle: "Подписка и хранение истории",
      premiumPlanBody: "Free хранит историю до 12 месяцев. Premium открывает AI-помощника, сильную аналитику и полный архив операций.",
      premiumPlanStatusFree: "Free",
      premiumPlanStatusPremium: "Premium",
      premiumHistoryRetention: "Хранение истории",
      premiumHistoryFree: "Текущий план включает аналитику до 12 месяцев",
      premiumHistoryPremium: "Бессрочно на Premium",
      premiumUpgrade: "Перейти на Premium",
      premiumManage: "Управление подпиской",
      premiumMonthly: "Помесячно",
      premiumYearly: "За год",
      premiumPriceMonthly: "299 сом / мес",
      premiumPriceYearly: "2 990 сом / год",
      premiumSaveBadge: "2 месяца в подарок",
      premiumAnalyticsUpsell: "Диапазоны длиннее 12 месяцев доступны в Premium.",
      premiumRatesUpsell: "Premium откроет расширенные рыночные сценарии и будущие alert-потоки.",
      premiumDialogTitle: "Оформление Premium",
      premiumDialogBody: "Выберите цикл подписки и посмотрите, какие возможности откроет Premium.",
      premiumFeatureUnlimitedHistory: "Бессрочное хранение истории операций и аналитики.",
      premiumFeatureAdvancedAnalytics: "Расширенные аналитические сценарии, глубокие диапазоны и будущие сравнения периодов.",
      premiumFeaturePriorityRates: "Приоритетные рыночные блоки, расширенные котировки и будущие уведомления по курсам.",
      premiumFeatureFreedomPay: "AI-сценарии, глубокая аналитика и ранний доступ к новым функциям.",
      premiumCheckoutAction: "Продолжить оформление",
      premiumCheckoutNote: "Оплата и активация подписки появятся в следующих релизах.",
      taxCalendar: "Налоговый календарь",
      taxCalendarDescription: "Обязательства по бизнес-счетам с расчетом по обороту или ручной базе.",
      taxDueBy: "Оплатить до {date}",
      taxBaseLabel: "База",
      taxLabel: "Налог",
      socialFundLabel: "Соцфонд",
      socialFundModeLabel: "Режим соцфонда",
      socialFundModePercent: "Процент",
      socialFundModeFixed: "Фиксированная сумма",
      socialFundFixedAmountLabel: "Сумма в месяц",
      taxSettingsTitle: "Налоговые параметры счета",
      taxSettingsBody: "Для счетов ИП и ОсОО налог считается автоматически со всех поступлений за квартал.",
      taxRateLabel: "Ставка налога, %",
      taxQuarterlyAutoHint: "Квартальный расчет по поступлениям, дедлайн оплаты до 20 числа следующего квартала.",
      taxTemplateLabel: "Шаблон",
      taxCalculationSourceLabel: "Источник расчета",
      taxCalculationSourceTransactions: "По транзакциям",
      taxCalculationSourceManual: "Вручную",
      dueDayLabel: "День уплаты",
      currentTaxPeriodLabel: "Текущий период",
      nextDueDateLabel: "Ближайший дедлайн",
      noTaxProfiles: "Добавьте налоговый профиль к счету ИП или ОсОО, чтобы видеть обязательства здесь.",
      createTaxPayment: "Создать списание",
      createTaxPaymentDescription: "Создайте расход по налогу, соцфонду или обе связанные транзакции с одного счета списания.",
      createTaxPaymentSuccess: "Налоговые транзакции созданы.",
      taxObligationSettled: "Проведено",
      taxObligationPartial: "Частично оформлено",
      taxObligationOpen: "Ожидает списания",
      taxPaymentModeLabel: "Что создать",
      taxPaymentModeTax: "Только налог",
      taxPaymentModeSocialFund: "Только соцфонд",
      taxPaymentModeBoth: "Налог и соцфонд",
      sourceAccountLabel: "Счет списания",
      taxCategoryLabel: "Категория налога",
      socialFundCategoryLabel: "Категория соцфонда",
      taxTitleLabel: "Название транзакции по налогу",
      socialFundTitleLabel: "Название транзакции по соцфонду",
      taxMerchantLabel: "Получатель налога",
      socialFundMerchantLabel: "Получатель соцфонда",
      createLinkedTransactionsLabel: "Связанные транзакции будут объединены в одну группу обязательства.",
      selectSourceAccount: "Выберите счет списания",
      fillTaxPaymentFields: "Заполните обязательные поля для налогового списания.",
      entrepreneurLabel: "ИП",
      companyLabel: "ОсОО",
      depositSettingsTitle: "Параметры депозита",
      depositSettingsBody: "Ставка, срок, капитализация и ограничения пополнения или снятия.",
      annualInterestRate: "Годовая ставка, %",
      interestPayoutFrequency: "Выплата процентов",
      dayCountConvention: "База расчета дней",
      maturityDate: "Дата окончания",
      capitalizationEnabled: "Капитализация",
      autoRenewal: "Автопродление",
      allowTopUp: "Разрешить пополнение",
      allowPartialWithdrawal: "Разрешить частичное снятие",
      recurringContributionAmount: "Автопополнение",
      recurringContributionFrequency: "Частота автопополнения",
      recurringContributionDay: "День пополнения",
      recurringFrequencyNone: "Без автопополнения",
      minimumBalance: "Минимальный остаток",
      payoutAtMaturity: "В конце срока",
      actual365: "Actual / 365",
      actual366: "Actual / 366",
      actualActual: "Actual / Actual",
      thirty360: "30 / 360",
      yesLabel: "Да",
      noLabel: "Нет",
      accruedInterest: "Начисленные проценты",
      projectedBalance: "Прогнозный баланс",
      annualYield: "Доход за год",
      depositTerm: "Срок депозита",
      depositDetails: "Детали депозита",
      principalBalance: "Тело депозита",
      currenciesMore: "Еще {count} валют",
      currencyBreakdown: "Разбивка по валютам",
      openDetails: "Подробнее",
      accountTransactionSearchPlaceholder: "Поиск по названию, категории, контрагенту или описанию",
      transferInLabel: "Переводы входящие",
      transferOutLabel: "Переводы исходящие",
      operationsCountLabel: "Операций",
      relatedAccountLabel: "Связанный счет",
      sourceAccountLabelShort: "Счет-источник",
      filterStatusLabel: "Статус",
      filterTypeLabel: "Тип операции",
      chartBarsView: "Столбцы",
      chartLineView: "Кривая",
      chartTradingView: "Площадь",
      chartCandlesView: "Свечи",
      chartStructureView: "Круговая",
      receivedLabel: "Получено",
      spentLabel: "Потрачено",
      periodResultLabel: "Итог периода",
      defaultCashFlowView: "Вид денежного потока по умолчанию",
      defaultCashFlowViewDescription: "Этот режим открывается первым в обзоре и остается базовым для новых сессий.",
      capitalCalculatorTitle: "Калькулятор капитала",
      capitalCalculatorDescription: "Соберите капитал из счетов, крипты или вручную заданной суммы и пересчитайте его в нужную валюту.",
      capitalCalculatorPortfolio: "Портфель",
      capitalCalculatorManual: "Сумма",
      capitalCalculatorHybrid: "Гибрид",
      capitalCalculatorTargetCurrency: "Целевая валюта",
      capitalCalculatorManualCurrency: "Валюта суммы",
      capitalCalculatorSelectAll: "Выбрать все",
      capitalCalculatorAccounts: "Счета",
      capitalCalculatorCrypto: "Крипта",
      capitalCalculatorResult: "Итог",
      capitalCalculatorGrossAssets: "Активы",
      capitalCalculatorLiabilities: "Вычеты",
      capitalCalculatorAdjustments: "Корректировки",
      capitalCalculatorNetResult: "Чистый итог",
      capitalCalculatorScenarioSettings: "Настройки сценария",
      capitalCalculatorFixedAdjustment: "Фикс. корректировка",
      capitalCalculatorPercentAdjustment: "Корректировка, %",
      capitalCalculatorIncludeProjectedSubscriptions: "Учитывать прогноз подписок",
      capitalCalculatorIncludePeriodResult: "Учитывать итог периода",
      capitalCalculatorNoSources: "Нет доступных источников для расчета.",
      projectedSubscriptions: "Прогноз подписок",
      projectedSubscriptionsDescription: "Ожидаемый расход по активным подпискам и recurring-списаниям.",
      projectedSubscriptionsTemplates: "{count} шаблонов",
      analyticsSummaryDetails: "Детализация сводки",
      analyticsSubscriptionsDetails: "Подробности подписок",
    };
  }

  if (locale === "kg") {
    return {
      overview: "Обзор",
      accounts: "Эсептер",
      transactions: "Транзакциялар",
      budgets: "Бюджеттер",
      categories: "Категориялар",
      settings: "Жөндөөлөр",
      operationsCenter: "Башкаруу борбору",
      operationsDescription: "Каржы доменинин реалдуу объекттери, тез аракеттер жана иш бөлүмдөрү.",
      totalAccounts: "Эсептердин саны",
      activeBudgets: "Активдүү бюджеттер",
      pendingItems: "Көңүл талап кылат",
      createAccount: "Жаңы эсеп",
      createBudget: "Жаңы бюджет",
      createCategory: "Жаңы категория",
      manageAccounts: "Капчыктарды, карталарды жана резервдерди статустары менен башкарыңыз.",
      accountDetailsTitle: "Эсептин деталдары",
      accountDetailsDescription: "Чыныгы акча кыймылы, фильтрлер, мезгилдер жана операция тарыхы.",
      manageTransactions: "Киреше, чыгаша жана которууларды ушул жерде жүргүзүңүз.",
      manageTransactionTemplates: "Кайталануучу операциялар үчүн шаблондорду түзүп, аларды жаңы транзакция формасынан бат колдонуңуз.",
      manageBudgets: "Категориялык лимиттерди пландап, мөөнөттөрдү башкарыңыз.",
      manageCategories: "Системалык категориялардын үстүнөн өзүңүздүн структураны түзүңүз.",
      emptyAccounts: "Азырынча эсептер жок.",
      emptyTransactions: "Азырынча транзакциялар жок.",
      emptyBudgets: "Азырынча бюджеттер жок.",
      emptyCategories: "Азырынча категориялар жок.",
      deleteAccountTitle: "Эсеп өчүрүлсүнбү?",
      deleteAccountBody: "Эгер система уруксат берсе, эсеп тиешелүү маалыматтары менен кошо өчүрүлөт.",
      deleteTransactionTitle: "Транзакция өчүрүлсүнбү?",
      deleteTransactionBody: "Тиешелүү эсептин балансы автоматтык түрдө кайра эсептелет.",
      deleteTransactionTemplateTitle: "Транзакция шаблону өчүрүлсүнбү?",
      deleteTransactionTemplateBody: "Шаблон өчүрүлөт, бирок анын негизинде түзүлгөн транзакциялар сакталат.",
      deleteBudgetTitle: "Бюджет өчүрүлсүнбү?",
      deleteBudgetBody: "Бул бюджет мезгили кайра калыбына келтирүүсүз өчүрүлөт.",
      deleteCategoryTitle: "Категория өчүрүлсүнбү?",
      deleteCategoryBody: "Системалык коргоосу жок колдонуучу категориялары гана өчүрүлөт.",
      cancel: "Жокко чыгаруу",
      create: "Түзүү",
      save: "Сактоо",
      deactivate: "Өчүрүү",
      activate: "Иштетүү",
      freeze: "Тоңдуруу",
      archive: "Архивге",
      balance: "Баланс",
      status: "Статус",
      period: "Мезгил",
      type: "Түрү",
      notes: "Эскертүү",
      tools: "Куралдар",
      destinationAccount: "Кабыл алуучу эсеп",
      merchant: "Контрагент",
      category: "Категория",
      amount: "Сумма",
      date: "Дата",
      currency: "Валюта",
      accountName: "Эсептин аталышы",
      accountKind: "Эсептин түрү",
      institution: "Уюм",
      openingBalance: "Баштапкы баланс",
      creditLimit: "Кредиттик лимит",
      budgetAmount: "Бюджет лимити",
      budgetKind: "Бюджет түрү",
      budgetKindExpense: "Чыгаша",
      budgetKindSaving: "Топтоо",
      budgetKindGoal: "Каржылык максат",
      budgetName: "Аталышы",
      budgetTargetAmount: "Максат сумма",
      budgetTargetAccount: "Максат эсеп",
      threshold: "Эскертүү босогосу, %",
      thresholdDescription: "Колдонуу ушул пайызга жеткенде бюджет көңүл буруу тизмесине түшөт. 0 болсо эскертүү өчүрүлөт.",
      allLabel: "Баары",
      categoryName: "Категориянын аталышы",
      slug: "Slug",
      accountCreated: "Эсеп түзүлдү.",
      transactionCreated: "Транзакция түзүлдү.",
      transactionTemplateCreated: "Транзакция шаблону түзүлдү.",
      budgetCreated: "Бюджет түзүлдү.",
      categoryCreated: "Категория түзүлдү.",
      categoryUpdated: "Категория жаңыртылды.",
      accountDeleted: "Эсеп өчүрүлдү.",
      budgetDeleted: "Бюджет өчүрүлдү.",
      transactionDeleted: "Транзакция өчүрүлдү.",
      transactionTemplateDeleted: "Транзакция шаблону өчүрүлдү.",
      transactionUpdated: "Транзакция жаңыртылды.",
      transactionTemplateUpdated: "Транзакция шаблону жаңыртылды.",
      categoryDeleted: "Категория өчүрүлдү.",
      accountUpdated: "Эсеп жаңыртылды.",
      budgetUpdated: "Бюджет жаңыртылды.",
      editBudget: "Бюджетти түзөтүү",
      saveAsTemplate: "Шаблон катары сактоо",
      createTemplate: "Жаңы шаблон",
      editTemplate: "Шаблонду түзөтүү",
      applyTemplate: "Шаблонду колдонуу",
      transactionTemplate: "Транзакция шаблону",
      transactionTemplateName: "Шаблондун аталышы",
      selectTransactionTemplate: "Шаблон тандаңыз",
      noTransactionTemplate: "Шаблон жок",
      templateAppearanceTitle: "Шаблондун көрүнүшү",
      templateAppearanceDescription: "Тизмеде бат таануу үчүн иконка жана түс тандаңыз.",
      editLabel: "Түзөтүү",
      firstName: "Аты",
      lastName: "Фамилиясы",
      email: "Email",
      phone: "Телефон",
      twoFactorAuth: "Эки факторлуу аутентификация",
      twoFactorAuthDescription: "Аккаунтка киргенде кошумча ырастоону талап кылуу.",
      enabledLabel: "Күйгүзүлгөн",
      disabledLabel: "Өчүрүлгөн",
      saveProfile: "Профилди сактоо",
      profileUpdated: "Профиль жаңыртылды.",
      localeControl: "Локалдаштыруу",
      localeDescription: "Интерфейс тилин алмаштырып, тандоону сактоо.",
      settingsDescription: "Категориялар, локалдаштыруу жана жумуш мейкиндигинин конфигурациясы үчүн өзүнчө бөлүм.",
      settingsSectionTitle: "Жумуш мейкиндигинин жөндөөлөрү",
      settingsSectionBody: "Бул жерде категориялар, локалдаштыруу, колдонуучу профили жана жеке параметрлер топтолгон.",
      categorySettingsTitle: "Операция категориялары",
      categorySettingsBody: "Колдонуучунун киреше жана чыгаша таксономиясын күнүмдүк операциялардан бөлүп жөндөңүз.",
      categorySearchPlaceholder: "Аталышы же slug боюнча издөө",
      categorySourceFilter: "Категория булагы",
      categoryTypeFilter: "Категория түрү",
      categoryAllFilter: "Баары",
      categorySystemFilter: "Жалпы",
      categoryCustomFilter: "Жеке",
      totalCategoriesValue: "{count} жалпы",
      systemCategoriesValue: "{count} жалпы",
      customCategoriesValue: "{count} жеке",
      showMoreCategories: "Дагы {count} көрсөтүү",
      showLessCategories: "Тизмени жыйноо",
      interfaceSettingsTitle: "Профиль жана интерфейс жөндөөлөрү",
      interfaceSettingsBody: "Жеке маалыматтарды, коопсуздукту, интерфейс тилин жана жумуш мейкиндигинин параметрлерин башкарыңыз.",
      languageUpdated: "Интерфейс тили жаңыртылды.",
      interfaceLanguage: "Интерфейс тили",
      defaultCurrency: "Демейки валюта",
      defaultCurrencyDescription: "Бул валюта жаңы формаларда автоматтык түрдө алдын ала тандалат.",
      cryptoMarketProvider: "Крипто котировкаларынын булагы",
      cryptoMarketProviderDescription: "Крипто блок үчүн live-котировка булагы. Тандоо браузерде жергиликтүү сакталат.",
      cryptoProviderBinance: "Binance",
      cryptoProviderOkx: "OKX",
      cryptoProviderBybit: "Bybit",
      cryptoProviderKraken: "Kraken",
      accountKindCash: "Накталай",
      accountKindBank: "Банк",
      accountKindSavings: "Жыйнак",
      accountKindDeposit: "Депозит",
      accountKindCreditCard: "Кредиттик карта",
      accountKindInvestment: "Инвестиция",
      accountKindEntrepreneur: "ИП эсеби",
      accountKindCompany: "ОсОО эсеби",
      accountKindWallet: "Электрондук капчык",
      accountKindLoan: "Карыз",
      accountKindOther: "Башка",
      txTypeIncome: "Киреше",
      txTypeExpense: "Чыгаша",
      txTypeTransfer: "Которуу",
      netLabel: "Таза агым",
      cashFlowLabel: "Акча агымы",
      txStatusCleared: "Ырасталды",
      txStatusPending: "Күтүүдө",
      txStatusDraft: "Черновик",
      txStatusCanceled: "Жокко чыгарылды",
      selectCategory: "Категорияны тандаңыз",
      selectDestination: "Кабыл алуучу эсепти тандаңыз",
      destinationAmount: "Кабыл алуучу сумма",
      exchangeRate: "Алмашуу курсу",
      titleLabel: "Аталышы",
      untitledTransaction: "Аталышы жок",
      optional: "Милдеттүү эмес",
      monthly: "Айлык",
      weekly: "Апталык",
      daily: "Күн",
      quarterly: "Чейрек сайын",
      yearly: "Жылдык",
      customPeriod: "Ыңгайлаштырылган",
      startDate: "Башталыш датасы",
      endDate: "Аяктоо датасы",
      colorToken: "Акцент түсү",
      accountIcon: "Эсеп сүрөтчөсү",
      appearanceHint: "Эсеп карточкасы үчүн сүрөтчө менен акцент түсүн тандаңыз.",
      clearSelection: "Тазалоо",
      systemLabel: "Системалык",
      customLabel: "Колдонуучу",
      activeLabel: "Активдүү",
      inactiveLabel: "Активдүү эмес",
      noDescription: "Сүрөттөмө көрсөтүлгөн эмес.",
      deleteLabel: "Өчүрүү",
      transferLabel: "Которуу",
      notAvailable: "Маалымат жок",
      balancesByCurrency: "Валюта боюнча баланс",
      balanceOverview: "Баланс обзору",
      primaryAccountLabel: "Негизги эсеп",
      totalByRates: "Курс боюнча жалпы баланс",
      allAccountsLabel: "Бардык эсептер",
      openAccountsSnapshot: "Бардык эсептер",
      totalApproximate: "Баа",
      ratesMissing: "Бул валюталар үчүн курс жок: {currencies}",
      marketRates: "Валюта жана криптовалюта курстары",
      marketRatesDescription: "FX.kg'ден актуалдуу валюта курстары жана тандалган биржадан криптовалюта котировкалары.",
      ratesComparisonCurrency: "Салыштыруу валютасы",
      fiatRatesTitle: "Валюталар",
      fiatRatesDescription: "Негизги валюталардын актуалдуу курстары.",
      fiatRatesDescriptionWithCurrency: "{currency} боюнча негизги валюталардын актуалдуу курстары.",
      cryptoRatesTitle: "Криптовалюталар",
      cryptoRatesDescription: "Негизги криптоактивдердин учурдагы баасы жана 24 сааттагы өзгөрүүсү.",
      cryptoQuoteLabel: "Котировка валютасы",
      priceChange24hLabel: "24 сааттагы өзгөрүү",
      priceInLabel: "{currency} менен",
      priceInUsdtLabel: "USDT менен",
      providerUnavailable: "Провайдер убактылуу жеткиликсиз",
      latestRateSnapshot: "Жаңыртылган",
      ratesLoading: "Курстар жүктөлүп жатат...",
      noRatesAvailable: "Курстар азырынча жүктөлө элек.",
      primaryRatesLabel: "Негизги жуптар",
      allRatesAction: "Баарын көрүү",
      allRatesDescription: "Жүктөлгөн бардык валюта жуптарынын толук тизмеси.",
      searchRatesPlaceholder: "Код же валюта аты боюнча издөө",
      noRatesMatch: "Бул суроо боюнча курс табылган жок.",
      notificationsTitle: "Билдирмелер",
      notificationsDescription: "Жеке билдирмелер жана админкадан жалпы жөнөтүүлөр.",
      notificationMarkRead: "Окулду",
      notificationMarkAllRead: "Баарын окуу",
      noNotifications: "Азырынча жаңы билдирмелер жок.",
      notificationScopePersonal: "Жеке",
      notificationScopeBroadcast: "Жөнөтүү",
      notificationLevelInfo: "Маалымат",
      notificationLevelSuccess: "Ийгилик",
      notificationLevelWarning: "Эскертүү",
      notificationLevelError: "Ката",
      cashControlTitle: "Эсеп көзөмөлү",
      cashControlDescription: "Баланс, резерв жана эсептердин түзүмү жалпы каржы стек боюнча.",
      activeAccountsValue: "{count} активдүү эсеп",
      budgetPressureTitle: "Бюджет басымы",
      budgetPressureDescription: "Ашыкча чыгым коркунучун көзөмөлдөп, айлык лимиттер түгөнгөнгө чейин аракет кылыңыз.",
      categoriesToWatchValue: "{count} категория көзөмөлдө",
      attentionQueueTitle: "Көңүл буруу кезеги",
      noPendingItems: "Азыр көңүл бурууну талап кылган элементтер жок.",
      attentionItemsValue: "{count} элемент",
      quickExpenseTitle: "Жаңы транзакция",
      quickExpenseBody: "Киреше, чыгаша жана которууларды түз эле иш мейкиндигинен кошуңуз.",
      quickExpenseMeta: "Акыркы 7 күндө {count} чыгым",
      addExpense: "Транзакция кошуу",
      budgetWorkflowTitle: "Мезгил бюджеттери",
      budgetWorkflowBody: "Активдүү лимиттерди жана ашып кетүү чегине жакындаган категорияларды текшериңиз.",
      budgetWorkflowMeta: "{active} активдүү, {alerts} коркунучта",
      openBudgets: "Бюджеттерди ачуу",
      categoryWorkflowTitle: "Категориялар жана эрежелер",
      categoryWorkflowBody: "Киргизүү менен аналитика туруктуу болушу үчүн категория структурасын таза кармаңыз.",
      categoryWorkflowMeta: "{count} колдонуучу категориясы",
      openSettings: "Жөндөөлөрдү ачуу",
      workflowSectionDescription: "Ушул беттен түз ишке киргизе турган негизги workflow сценарийлери.",
      analyticsWorkflowTitle: "Аналитика",
      analyticsWorkflowBody: "График режимин алмаштырыңыз, мезгилдерди салыштырыңыз жана валюта катмарына ашыкча навигациясыз өтүңүз.",
      analyticsWorkflowMeta: "{range} · {mode}",
      openTransactionsSection: "Транзакцияларды ачуу",
      comparePeriods: "Мезгилдерди салыштыруу",
      openRates: "Курстарды ачуу",
      premiumBadge: "Premium",
      premiumPlanTitle: "Жазылуу жана тарыхты сактоо",
      premiumPlanBody: "Free планда тарых 12 айга чейин сакталат. Premium AI жардамчыны, күчтүү аналитиканы жана толук архивди ачат.",
      premiumPlanStatusFree: "Free",
      premiumPlanStatusPremium: "Premium",
      premiumHistoryRetention: "Тарыхты сактоо",
      premiumHistoryFree: "Учурдагы планда 12 айга чейинки аналитика камтылган",
      premiumHistoryPremium: "Premium'да мөөнөтсүз",
      premiumUpgrade: "Premium'га өтүү",
      premiumManage: "Жазылууну башкаруу",
      premiumMonthly: "Ай сайын",
      premiumYearly: "Жылдык",
      premiumPriceMonthly: "299 сом / ай",
      premiumPriceYearly: "2 990 сом / жыл",
      premiumSaveBadge: "2 ай белек",
      premiumAnalyticsUpsell: "12 айдан узун диапазондор Premium'да жеткиликтүү.",
      premiumRatesUpsell: "Premium кеңейтилген рынок сценарийлерин жана келечектеги курс alert'терин ачат.",
      premiumDialogTitle: "Premium жазылуусун жол-жоболоштуруу",
      premiumDialogBody: "Жазылуу циклин тандап, Premium кайсы мүмкүнчүлүктөрдү ачаарын көрүңүз.",
      premiumFeatureUnlimitedHistory: "Операциялар менен аналитиканын тарыхын мөөнөтсүз сактоо.",
      premiumFeatureAdvancedAnalytics: "Кеңейтилген аналитика, терең диапазондор жана келечектеги мезгил салыштыруулары.",
      premiumFeaturePriorityRates: "Приоритеттүү рынок блоктору, кеңейтилген котировкалар жана келечектеги курс билдирмелери.",
      premiumFeatureFreedomPay: "AI сценарийлери, терең аналитика жана жаңы функцияларга эрте жеткиликтүүлүк.",
      premiumCheckoutAction: "Жол-жоболоштурууну улантуу",
      premiumCheckoutNote: "Төлөм жана жазылууну активдештирүү кийинки релиздерде кошулат.",
      taxCalendar: "Салык календары",
      taxCalendarDescription: "Ишкер эсептер боюнча жүгүртүү же кол менен киргизилген база аркылуу эсептелген милдеттенмелер.",
      taxDueBy: "{date} чейин төлөө",
      taxBaseLabel: "База",
      taxLabel: "Салык",
      socialFundLabel: "Соцфонд",
      socialFundModeLabel: "Соцфонд режими",
      socialFundModePercent: "Пайыз",
      socialFundModeFixed: "Туруктуу сумма",
      socialFundFixedAmountLabel: "Айлык сумма",
      taxSettingsTitle: "Эсептин салык жөндөөлөрү",
      taxSettingsBody: "ИП жана ОсОО эсептеринде салык кварталдагы бардык түшүүлөрдөн автоматтык эсептелет.",
      taxRateLabel: "Салык ставкасы, %",
      taxQuarterlyAutoHint: "Кварталдык эсептөө түшүүлөр боюнча, төлөө мөөнөтү кийинки кварталдын 20сына чейин.",
      taxTemplateLabel: "Шаблон",
      taxCalculationSourceLabel: "Эсептөө булагы",
      taxCalculationSourceTransactions: "Транзакциялар боюнча",
      taxCalculationSourceManual: "Кол менен",
      dueDayLabel: "Төлөө күнү",
      currentTaxPeriodLabel: "Учурдагы мезгил",
      nextDueDateLabel: "Жакынкы мөөнөт",
      noTaxProfiles: "Милдеттенмелерди бул жерден көрүү үчүн ИП же ОсОО эсебине салык профилин кошуңуз.",
      createTaxPayment: "Чыгаша түзүү",
      createTaxPaymentDescription: "Салык, соцфонд же экөөнө тең бир эсептен байланышкан чыгаша транзакцияларын түзүңүз.",
      createTaxPaymentSuccess: "Салык транзакциялары түзүлдү.",
      taxObligationSettled: "Өткөрүлдү",
      taxObligationPartial: "Жарым-жартылай түзүлгөн",
      taxObligationOpen: "Төлөм күтүлүүдө",
      taxPaymentModeLabel: "Эмне түзүлөт",
      taxPaymentModeTax: "Салык гана",
      taxPaymentModeSocialFund: "Соцфонд гана",
      taxPaymentModeBoth: "Салык жана соцфонд",
      sourceAccountLabel: "Чыгаруучу эсеп",
      taxCategoryLabel: "Салык категориясы",
      socialFundCategoryLabel: "Соцфонд категориясы",
      taxTitleLabel: "Салык транзакциясынын аталышы",
      socialFundTitleLabel: "Соцфонд транзакциясынын аталышы",
      taxMerchantLabel: "Салык алуучу",
      socialFundMerchantLabel: "Соцфонд алуучу",
      createLinkedTransactionsLabel: "Байланышкан транзакциялар бир милдеттенме тобуна бириктирилет.",
      selectSourceAccount: "Чыгаруучу эсепти тандаңыз",
      fillTaxPaymentFields: "Салык чыгашасы үчүн милдеттүү талааларды толтуруңуз.",
      entrepreneurLabel: "ИП",
      companyLabel: "ОсОО",
      depositSettingsTitle: "Депозит параметрлери",
      depositSettingsBody: "Чен, мөөнөт, капитализация жана толуктоо же алуу чектөөлөрү.",
      annualInterestRate: "Жылдык чен, %",
      interestPayoutFrequency: "Пайыз төлөө режими",
      dayCountConvention: "Күн эсептөө базасы",
      maturityDate: "Аяктоо датасы",
      capitalizationEnabled: "Капитализация",
      autoRenewal: "Авто узартуу",
      allowTopUp: "Толуктоого уруксат",
      allowPartialWithdrawal: "Жарым-жартылай алууга уруксат",
      recurringContributionAmount: "Авто толуктоо",
      recurringContributionFrequency: "Авто толуктоо жыштыгы",
      recurringContributionDay: "Толуктоо күнү",
      recurringFrequencyNone: "Авто толуктоо жок",
      minimumBalance: "Минималдуу калдык",
      payoutAtMaturity: "Мөөнөт аягында",
      actual365: "Actual / 365",
      actual366: "Actual / 366",
      actualActual: "Actual / Actual",
      thirty360: "30 / 360",
      yesLabel: "Ооба",
      noLabel: "Жок",
      accruedInterest: "Эсептелген пайыз",
      projectedBalance: "Болжолдуу баланс",
      annualYield: "Жылдык киреше",
      depositTerm: "Депозит мөөнөтү",
      depositDetails: "Депозит деталдары",
      principalBalance: "Негизги сумма",
      currenciesMore: "Дагы {count} валюта",
      currencyBreakdown: "Валюта боюнча бөлүштүрүү",
      openDetails: "Толугураак",
      accountTransactionSearchPlaceholder: "Аталыш, категория, контрагент же сүрөттөмө боюнча издөө",
      transferInLabel: "Кирген которуулар",
      transferOutLabel: "Чыккан которуулар",
      operationsCountLabel: "Операциялар",
      relatedAccountLabel: "Байланышкан эсеп",
      sourceAccountLabelShort: "Булак эсеп",
      filterStatusLabel: "Статус",
      filterTypeLabel: "Операция түрү",
      chartBarsView: "Тилкелер",
      chartLineView: "Өсүү сызыгы",
      chartTradingView: "Аянт",
      chartCandlesView: "Шамдар",
      chartStructureView: "Айланма",
      receivedLabel: "Түшкөн",
      spentLabel: "Сарпталган",
      periodResultLabel: "Мезгил жыйынтыгы",
      defaultCashFlowView: "Акча агымынын демейки көрүнүшү",
      defaultCashFlowViewDescription: "Бул режим обзор ачылганда биринчи болуп көрсөтүлөт жана жаңы сессияларда сакталат.",
      capitalCalculatorTitle: "Капитал калькулятору",
      capitalCalculatorDescription: "Капиталды эсептерден, криптадан же кол менен киргизилген суммадан чогултуп, керектүү валютага кайра эсептеңиз.",
      capitalCalculatorPortfolio: "Портфель",
      capitalCalculatorManual: "Сумма",
      capitalCalculatorHybrid: "Гибрид",
      capitalCalculatorTargetCurrency: "Максат валюта",
      capitalCalculatorManualCurrency: "Сумманын валютасы",
      capitalCalculatorSelectAll: "Баарын тандоо",
      capitalCalculatorAccounts: "Эсептер",
      capitalCalculatorCrypto: "Крипта",
      capitalCalculatorResult: "Жыйынтык",
      capitalCalculatorGrossAssets: "Активдер",
      capitalCalculatorLiabilities: "Чегерүүлөр",
      capitalCalculatorAdjustments: "Түзөтүүлөр",
      capitalCalculatorNetResult: "Таза жыйынтык",
      capitalCalculatorScenarioSettings: "Сценарий жөндөөлөрү",
      capitalCalculatorFixedAdjustment: "Туруктуу түзөтүү",
      capitalCalculatorPercentAdjustment: "Түзөтүү, %",
      capitalCalculatorIncludeProjectedSubscriptions: "Жазылуу божомолун кошуу",
      capitalCalculatorIncludePeriodResult: "Мезгил жыйынтыгын кошуу",
      capitalCalculatorNoSources: "Эсептөө үчүн жеткиликтүү булактар жок.",
      projectedSubscriptions: "Жазылуулар болжолу",
      projectedSubscriptionsDescription: "Активдүү жазылуулар жана recurring-чыгымдар боюнча күтүлгөн чыгаша.",
      projectedSubscriptionsTemplates: "{count} шаблон",
      analyticsSummaryDetails: "Жыйынтык деталдары",
      analyticsSubscriptionsDetails: "Жазылуулар деталдары",
    };
  }

  return {
    overview: "Overview",
    accounts: "Accounts",
    transactions: "Transactions",
    budgets: "Budgets",
    categories: "Categories",
    settings: "Settings",
    operationsCenter: "Operations center",
    operationsDescription: "Real finance entities, clear sections and direct action flows.",
    totalAccounts: "Total accounts",
    activeBudgets: "Active budgets",
    pendingItems: "Needs attention",
    createAccount: "New account",
    createBudget: "New budget",
    createCategory: "New category",
    manageAccounts: "Manage balances, statuses and the structure of your wallets, cards and savings buckets.",
    accountDetailsTitle: "Account details",
    accountDetailsDescription: "Real account cash movement with filters, date ranges and full operation history.",
    manageTransactions: "Record income, expenses and transfers. Remove incorrect entries without leaving the workspace.",
    manageTransactionTemplates: "Create presets for recurring operations and launch them directly from the new transaction form.",
    manageBudgets: "Plan category limits and disable outdated budget cycles quickly.",
    manageCategories: "Build your own taxonomy of income and expense categories on top of system defaults.",
    emptyAccounts: "No accounts created yet.",
    emptyTransactions: "No transactions yet.",
    emptyBudgets: "No budgets created yet.",
    emptyCategories: "No categories found yet.",
    deleteAccountTitle: "Delete account?",
    deleteAccountBody: "The account will be removed together with linked data if the system allows it.",
    deleteTransactionTitle: "Delete transaction?",
    deleteTransactionBody: "The linked account balance will be recalculated automatically.",
    deleteTransactionTemplateTitle: "Delete transaction template?",
    deleteTransactionTemplateBody: "The template will be removed, but transactions already created from it will stay intact.",
    deleteBudgetTitle: "Delete budget?",
    deleteBudgetBody: "This budget period will be removed and cannot be restored.",
    deleteCategoryTitle: "Delete category?",
    deleteCategoryBody: "Only user-owned categories without system protection can be removed.",
    cancel: "Cancel",
    create: "Create",
    save: "Save",
    deactivate: "Deactivate",
    activate: "Activate",
    freeze: "Freeze",
    archive: "Archive",
    balance: "Balance",
    status: "Status",
    period: "Period",
    type: "Type",
    notes: "Notes",
    tools: "Tools",
    destinationAccount: "Destination account",
    merchant: "Merchant",
    category: "Category",
    amount: "Amount",
    date: "Date",
    currency: "Currency",
    accountName: "Account name",
    accountKind: "Account kind",
    institution: "Institution",
    openingBalance: "Opening balance",
    creditLimit: "Credit limit",
    budgetAmount: "Budget amount",
    budgetKind: "Budget type",
    budgetKindExpense: "Expense",
    budgetKindSaving: "Saving",
    budgetKindGoal: "Financial goal",
    budgetName: "Name",
    budgetTargetAmount: "Target amount",
    budgetTargetAccount: "Target account",
    threshold: "Warning threshold, %",
    thresholdDescription: "When utilization reaches this value, the budget enters the attention queue. Set 0 to disable the warning.",
    allLabel: "All",
    categoryName: "Category name",
    slug: "Slug",
    accountCreated: "Account created.",
    transactionCreated: "Transaction created.",
    transactionTemplateCreated: "Transaction template created.",
    budgetCreated: "Budget created.",
    categoryCreated: "Category created.",
    categoryUpdated: "Category updated.",
    accountDeleted: "Account deleted.",
    budgetDeleted: "Budget deleted.",
    transactionDeleted: "Transaction deleted.",
    transactionTemplateDeleted: "Transaction template deleted.",
    transactionUpdated: "Transaction updated.",
    transactionTemplateUpdated: "Transaction template updated.",
    categoryDeleted: "Category deleted.",
    accountUpdated: "Account updated.",
    budgetUpdated: "Budget updated.",
    editBudget: "Edit budget",
    saveAsTemplate: "Save as template",
    createTemplate: "New template",
    editTemplate: "Edit template",
    applyTemplate: "Apply template",
    transactionTemplate: "Transaction template",
    transactionTemplateName: "Template name",
    selectTransactionTemplate: "Select template",
    noTransactionTemplate: "No template",
    templateAppearanceTitle: "Template appearance",
    templateAppearanceDescription: "Choose an icon and color so the preset is easy to spot in the list.",
    editLabel: "Edit",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    phone: "Phone",
    twoFactorAuth: "Two-factor authentication",
    twoFactorAuthDescription: "Require an extra verification step when signing in to the account.",
    enabledLabel: "Enabled",
    disabledLabel: "Disabled",
    saveProfile: "Save profile",
    profileUpdated: "Profile updated.",
    localeControl: "Localization",
    localeDescription: "Switch interface language and persist the user preference.",
    settingsDescription: "A dedicated area for categories, localization and workspace configuration.",
    settingsSectionTitle: "Workspace settings",
    settingsSectionBody: "Categories, localization, user profile and personal preferences live here.",
    categorySettingsTitle: "Transaction categories",
    categorySettingsBody: "Manage your custom income and expense taxonomy away from the day-to-day operations screens.",
    categorySearchPlaceholder: "Search by name or slug",
    categorySourceFilter: "Category source",
    categoryTypeFilter: "Category type",
    categoryAllFilter: "All",
    categorySystemFilter: "Shared",
    categoryCustomFilter: "Personal",
    totalCategoriesValue: "{count} total",
    systemCategoriesValue: "{count} shared",
    customCategoriesValue: "{count} personal",
    showMoreCategories: "Show {count} more",
    showLessCategories: "Collapse list",
    interfaceSettingsTitle: "Profile and interface settings",
    interfaceSettingsBody: "Manage personal details, security, interface language and workspace-level preferences.",
    languageUpdated: "Interface language updated.",
    interfaceLanguage: "Interface language",
    defaultCurrency: "Default currency",
    defaultCurrencyDescription: "This currency is preselected automatically in new forms that require a currency choice.",
    cryptoMarketProvider: "Crypto market source",
    cryptoMarketProviderDescription: "Live quote provider for the crypto market block. The choice is stored locally in the browser.",
    cryptoProviderBinance: "Binance",
    cryptoProviderOkx: "OKX",
    cryptoProviderBybit: "Bybit",
    cryptoProviderKraken: "Kraken",
    accountKindCash: "Cash",
    accountKindBank: "Bank",
    accountKindSavings: "Savings",
    accountKindDeposit: "Deposit",
    accountKindCreditCard: "Credit card",
    accountKindInvestment: "Investment",
    accountKindEntrepreneur: "Entrepreneur account",
    accountKindCompany: "Company account",
    accountKindWallet: "E-wallet",
    accountKindLoan: "Loan",
    accountKindOther: "Other",
    txTypeIncome: "Income",
    txTypeExpense: "Expense",
    txTypeTransfer: "Transfer",
    netLabel: "Net",
    cashFlowLabel: "Cash Flow",
    txStatusCleared: "Cleared",
    txStatusPending: "Pending",
    txStatusDraft: "Draft",
    txStatusCanceled: "Canceled",
    selectCategory: "Select category",
    selectDestination: "Select destination account",
    destinationAmount: "Destination amount",
    exchangeRate: "Exchange rate",
    titleLabel: "Title",
    untitledTransaction: "Untitled",
    optional: "Optional",
    monthly: "Monthly",
    weekly: "Weekly",
    daily: "Day",
    quarterly: "Quarterly",
    yearly: "Yearly",
    customPeriod: "Custom",
    startDate: "Start date",
    endDate: "End date",
    colorToken: "Accent color",
    accountIcon: "Account icon",
    appearanceHint: "Choose an icon and accent color for the account card.",
    clearSelection: "Clear",
    systemLabel: "System",
    customLabel: "Custom",
    activeLabel: "Active",
    inactiveLabel: "Inactive",
    noDescription: "No description provided.",
    deleteLabel: "Delete",
    transferLabel: "Transfer",
    notAvailable: "N/A",
    balancesByCurrency: "Balances by currency",
    balanceOverview: "Balance overview",
    primaryAccountLabel: "Primary account",
    totalByRates: "Total by FX rates",
    allAccountsLabel: "All accounts",
    openAccountsSnapshot: "All accounts",
    totalApproximate: "Estimate",
    ratesMissing: "No FX rates for: {currencies}",
    marketRates: "Currency and crypto rates",
    marketRatesDescription: "Current fiat exchange rates from FX.kg and crypto quotes from the selected exchange.",
    ratesComparisonCurrency: "Comparison currency",
    fiatRatesTitle: "Currencies",
    fiatRatesDescription: "Current major currency rates.",
    fiatRatesDescriptionWithCurrency: "Current major currency rates in {currency}.",
    cryptoRatesTitle: "Cryptocurrencies",
    cryptoRatesDescription: "Current prices and 24-hour change for major crypto assets.",
    cryptoQuoteLabel: "Quote currency",
    priceChange24hLabel: "24h change",
    priceInLabel: "In {currency}",
    priceInUsdtLabel: "In USDT",
    providerUnavailable: "Provider is temporarily unavailable",
    latestRateSnapshot: "Updated",
    ratesLoading: "Loading rates...",
    noRatesAvailable: "Rates have not been synced yet.",
    primaryRatesLabel: "Primary pairs",
    allRatesAction: "Show all",
    allRatesDescription: "Full list of all synced currency pairs.",
    searchRatesPlaceholder: "Search by code or currency name",
    noRatesMatch: "No exchange rates match your search.",
    notificationsTitle: "Notifications",
    notificationsDescription: "Personal alerts and broadcast messages from admin.",
    notificationMarkRead: "Mark read",
    notificationMarkAllRead: "Mark all read",
    noNotifications: "No notifications yet.",
    notificationScopePersonal: "Personal",
    notificationScopeBroadcast: "Broadcast",
    notificationLevelInfo: "Info",
    notificationLevelSuccess: "Success",
    notificationLevelWarning: "Warning",
    notificationLevelError: "Error",
    cashControlTitle: "Cash control",
    cashControlDescription: "Balances, reserve coverage and account structure across your finance stack.",
    activeAccountsValue: "{count} active accounts",
    budgetPressureTitle: "Budget pressure",
    budgetPressureDescription: "Track overspend risk and react before monthly limits are exhausted.",
    categoriesToWatchValue: "{count} categories to watch",
    attentionQueueTitle: "Attention queue",
    noPendingItems: "No pending items right now.",
    attentionItemsValue: "{count} items",
    quickExpenseTitle: "New transaction",
    quickExpenseBody: "Add income, expenses and transfers directly from the workspace without extra navigation.",
    quickExpenseMeta: "{count} expenses in 7 days",
    addExpense: "Add transaction",
    budgetWorkflowTitle: "Budget cycle",
    budgetWorkflowBody: "Review active limits and the categories already approaching overspend thresholds.",
    budgetWorkflowMeta: "{active} active, {alerts} at risk",
    openBudgets: "Open budgets",
    categoryWorkflowTitle: "Categories and rules",
    categoryWorkflowBody: "Keep the category structure clean so entry flows and analytics stay consistent.",
    categoryWorkflowMeta: "{count} custom categories",
    openSettings: "Open settings",
    workflowSectionDescription: "Core workflows that can be launched directly from this surface.",
    analyticsWorkflowTitle: "Analytics",
    analyticsWorkflowBody: "Switch chart modes, compare periods and move into the FX layer without extra navigation.",
    analyticsWorkflowMeta: "{range} · {mode}",
    openTransactionsSection: "Open transactions",
    comparePeriods: "Compare periods",
    openRates: "Open rates",
    premiumBadge: "Premium",
    premiumPlanTitle: "Subscription and history retention",
    premiumPlanBody: "Free keeps up to 12 months of history. Premium unlocks an AI assistant, deeper analytics and a full operations archive.",
    premiumPlanStatusFree: "Free",
    premiumPlanStatusPremium: "Premium",
    premiumHistoryRetention: "History retention",
    premiumHistoryFree: "Your current plan includes up to 12 months of analytics",
    premiumHistoryPremium: "Unlimited on Premium",
    premiumUpgrade: "Upgrade to Premium",
    premiumManage: "Manage subscription",
    premiumMonthly: "Monthly",
    premiumYearly: "Yearly",
    premiumPriceMonthly: "299 KGS / mo",
    premiumPriceYearly: "2,990 KGS / yr",
    premiumSaveBadge: "2 months free",
    premiumAnalyticsUpsell: "Ranges longer than 12 months are available on Premium.",
    premiumRatesUpsell: "Premium unlocks extended market flows and future rate alerts.",
    premiumDialogTitle: "Premium checkout",
    premiumDialogBody: "Choose the billing cycle and review what Premium unlocks.",
    premiumFeatureUnlimitedHistory: "Unlimited retention for transaction and analytics history.",
    premiumFeatureAdvancedAnalytics: "Advanced analytics flows, deeper ranges and future period comparisons.",
    premiumFeaturePriorityRates: "Priority market surfaces, extended quotes and future rate notifications.",
    premiumFeatureFreedomPay: "AI workflows, deeper analytics and early access to new capabilities.",
    premiumCheckoutAction: "Continue setup",
    premiumCheckoutNote: "Subscription payment and activation will be added in upcoming releases.",
    taxCalendar: "Tax calendar",
    taxCalendarDescription: "Obligations for business accounts calculated from turnover or a manual base.",
    taxDueBy: "Pay by {date}",
    taxBaseLabel: "Base",
    taxLabel: "Tax",
    socialFundLabel: "Social fund",
    socialFundModeLabel: "Social fund mode",
    socialFundModePercent: "Percent",
    socialFundModeFixed: "Fixed amount",
    socialFundFixedAmountLabel: "Monthly amount",
    taxSettingsTitle: "Account tax settings",
    taxSettingsBody: "For entrepreneur and company accounts, tax is calculated automatically from all quarterly inflows.",
    taxRateLabel: "Tax rate, %",
    taxQuarterlyAutoHint: "Quarterly calculation from inflows, payment deadline on the 20th of the next quarter.",
    taxTemplateLabel: "Template",
    taxCalculationSourceLabel: "Calculation source",
    taxCalculationSourceTransactions: "From transactions",
    taxCalculationSourceManual: "Manual",
    dueDayLabel: "Due day",
    currentTaxPeriodLabel: "Current period",
    nextDueDateLabel: "Next due date",
    noTaxProfiles: "Add a tax profile to an entrepreneur or company account to see obligations here.",
    createTaxPayment: "Create payout",
    createTaxPaymentDescription: "Create expense transactions for tax, social fund, or both from a selected funding account.",
    createTaxPaymentSuccess: "Tax transactions created.",
    taxObligationSettled: "Settled",
    taxObligationPartial: "Partially created",
    taxObligationOpen: "Awaiting payment",
    taxPaymentModeLabel: "Create",
    taxPaymentModeTax: "Tax only",
    taxPaymentModeSocialFund: "Social fund only",
    taxPaymentModeBoth: "Tax and social fund",
    sourceAccountLabel: "Funding account",
    taxCategoryLabel: "Tax category",
    socialFundCategoryLabel: "Social fund category",
    taxTitleLabel: "Tax transaction title",
    socialFundTitleLabel: "Social fund transaction title",
    taxMerchantLabel: "Tax payee",
    socialFundMerchantLabel: "Social fund payee",
    createLinkedTransactionsLabel: "Created transactions will be linked under the same obligation group.",
    selectSourceAccount: "Select funding account",
    fillTaxPaymentFields: "Fill the required tax payment fields.",
    entrepreneurLabel: "Entrepreneur",
    companyLabel: "Company",
    depositSettingsTitle: "Deposit settings",
    depositSettingsBody: "Rate, term, capitalization, plus top-up and withdrawal rules.",
    annualInterestRate: "Annual rate, %",
    interestPayoutFrequency: "Interest payout",
    dayCountConvention: "Day count basis",
    maturityDate: "Maturity date",
    capitalizationEnabled: "Capitalization",
    autoRenewal: "Auto renewal",
    allowTopUp: "Allow top-ups",
    allowPartialWithdrawal: "Allow partial withdrawal",
    recurringContributionAmount: "Auto contribution",
    recurringContributionFrequency: "Contribution frequency",
    recurringContributionDay: "Contribution day",
    recurringFrequencyNone: "No auto contribution",
    minimumBalance: "Minimum balance",
    payoutAtMaturity: "At maturity",
    actual365: "Actual / 365",
    actual366: "Actual / 366",
    actualActual: "Actual / Actual",
    thirty360: "30 / 360",
    yesLabel: "Yes",
    noLabel: "No",
    accruedInterest: "Accrued interest",
    projectedBalance: "Projected balance",
    annualYield: "Annual yield",
    depositTerm: "Deposit term",
    depositDetails: "Deposit details",
    principalBalance: "Principal balance",
    currenciesMore: "{count} more currencies",
    currencyBreakdown: "Breakdown by currency",
    openDetails: "Open details",
    accountTransactionSearchPlaceholder: "Search by title, category, merchant or description",
    transferInLabel: "Incoming transfers",
    transferOutLabel: "Outgoing transfers",
    operationsCountLabel: "Operations",
    relatedAccountLabel: "Related account",
    sourceAccountLabelShort: "Source account",
    filterStatusLabel: "Status",
    filterTypeLabel: "Operation type",
    chartBarsView: "Bars",
    chartLineView: "Growth",
    chartTradingView: "Area",
    chartCandlesView: "Candles",
    chartStructureView: "Donut",
    receivedLabel: "Received",
    spentLabel: "Spent",
    periodResultLabel: "Period result",
    defaultCashFlowView: "Default cash flow view",
    defaultCashFlowViewDescription: "This mode opens first in overview and stays the default for future sessions.",
    capitalCalculatorTitle: "Capital calculator",
    capitalCalculatorDescription: "Build capital from accounts, crypto holdings or a manual amount and convert it into the target currency.",
    capitalCalculatorPortfolio: "Portfolio",
    capitalCalculatorManual: "Amount",
    capitalCalculatorHybrid: "Hybrid",
    capitalCalculatorTargetCurrency: "Target currency",
    capitalCalculatorManualCurrency: "Amount currency",
    capitalCalculatorSelectAll: "Select all",
    capitalCalculatorAccounts: "Accounts",
    capitalCalculatorCrypto: "Crypto",
    capitalCalculatorResult: "Result",
    capitalCalculatorGrossAssets: "Assets",
    capitalCalculatorLiabilities: "Deductions",
    capitalCalculatorAdjustments: "Adjustments",
    capitalCalculatorNetResult: "Net result",
    capitalCalculatorScenarioSettings: "Scenario settings",
    capitalCalculatorFixedAdjustment: "Fixed adjustment",
    capitalCalculatorPercentAdjustment: "Adjustment, %",
    capitalCalculatorIncludeProjectedSubscriptions: "Include projected subscriptions",
    capitalCalculatorIncludePeriodResult: "Include period result",
    capitalCalculatorNoSources: "No sources available for calculation.",
    projectedSubscriptions: "Projected subscriptions",
    projectedSubscriptionsDescription: "Expected expense from active subscriptions and recurring payouts.",
    projectedSubscriptionsTemplates: "{count} templates",
    analyticsSummaryDetails: "Summary details",
    analyticsSubscriptionsDetails: "Subscription details",
  };
}

export function FinanceWorkspace({
  locale,
  content,
  section = "overview",
}: FinanceWorkspaceProps) {
  const ui = getUiCopy(locale);
  const { status, user, updateUser } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const setLocalePreference = useLocalePreference();

  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountRecord | null>(null);
  const [activeAccount, setActiveAccount] = useState<AccountRecord | null>(null);
  const [accountsSnapshotOpen, setAccountsSnapshotOpen] = useState(false);
  const [allRatesOpen, setAllRatesOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [premiumDialogOpen, setPremiumDialogOpen] = useState(false);
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionRecord | null>(null);
  const [transactionTemplateDialogOpen, setTransactionTemplateDialogOpen] = useState(false);
  const [editingTransactionTemplate, setEditingTransactionTemplate] = useState<TransactionTemplateRecord | null>(null);
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetRecord | null>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);
  const [accountFormErrors, setAccountFormErrors] = useState<FormFieldErrors>({});
  const [transactionFormErrors, setTransactionFormErrors] = useState<FormFieldErrors>({});
  const [transactionTemplateFormErrors, setTransactionTemplateFormErrors] = useState<FormFieldErrors>({});
  const [accountToDelete, setAccountToDelete] = useState<AccountRecord | null>(null);
  const [budgetToDelete, setBudgetToDelete] = useState<BudgetRecord | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<TransactionRecord | null>(null);
  const [transactionTemplateToDelete, setTransactionTemplateToDelete] = useState<TransactionTemplateRecord | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryRecord | null>(null);
  const [summaryBreakdownModal, setSummaryBreakdownModal] = useState<{
    title: string;
    kind: SummaryDetailKind;
    startDate: string;
    endDate: string;
  } | null>(null);
  const [ratesSearchQuery, setRatesSearchQuery] = useState("");
  const [cashFlowRange, setCashFlowRange] = useState<CashFlowRange>("month");
  const [cashFlowAnchorDate, setCashFlowAnchorDate] = useState(() => getToday());
  const [cashFlowCustomRange, setCashFlowCustomRange] = useState(() =>
    normalizeCashFlowDateRange(getToday().slice(0, 8) + "01", getToday()),
  );
  const [storedWorkspacePreferences, setStoredWorkspacePreferences] = useState<Required<StoredWorkspacePreferences>>(() =>
    resolveWorkspacePreferences(readStoredWorkspacePreferences()),
  );
  const [cashFlowChartMode, setCashFlowChartMode] = useState<CashFlowChartMode | null>(
    () => resolveWorkspacePreferences(readStoredWorkspacePreferences()).cash_flow_chart_default,
  );
  const [profileFormDirty, setProfileFormDirty] = useState(false);
  const [profileForm, setProfileForm] = useState(() => createProfileForm(null));
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [categorySourceFilter, setCategorySourceFilter] = useState<"all" | "system" | "custom">("all");
  const [categoryKindFilter, setCategoryKindFilter] = useState<"all" | "income" | "expense" | "transfer">("all");

  const [accountForm, setAccountForm] = useState<CreateAccountPayload>(createDefaultAccountForm());
  const [transactionForm, setTransactionForm] = useState<CreateTransactionPayload>({
    account: 0,
    template_id: null,
    category: null,
    type: "expense",
    status: "cleared",
    amount: "",
    title: "",
    merchant: "",
    description: "",
    occurred_on: getToday(),
  });
  const [transactionTemplateForm, setTransactionTemplateForm] = useState<CreateTransactionTemplatePayload>(
    createDefaultTransactionTemplateForm(),
  );
  const [budgetForm, setBudgetForm] = useState<CreateBudgetPayload>({
    kind: "expense",
    name: "",
    category: 0,
    currency: "USD",
    period: "monthly",
    amount: "",
    target_amount: null,
    target_account: null,
    start_date: getToday().slice(0, 8) + "01",
    end_date: getMonthEnd(),
    alert_threshold: 0,
    rollover_enabled: false,
    is_active: true,
    note: "",
  });
  const [categoryForm, setCategoryForm] = useState<CreateCategoryPayload>({
    kind: "expense",
    name: "",
    slug: "",
    description: "",
    icon: "",
    color: "slate",
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(getLocalizedPath(locale, "/auth"));
    }
  }, [locale, router, status]);

  const overviewQuery = useQuery({
    queryKey: ["workspace-overview"],
    queryFn: fetchWorkspaceOverview,
    enabled: status === "authenticated",
  });
  const currenciesQuery = useQuery({
    queryKey: ["finance-currencies"],
    queryFn: fetchCurrencies,
    enabled: status === "authenticated",
  });
  const categoriesQuery = useQuery({
    queryKey: ["finance-categories"],
    queryFn: fetchCategories,
    enabled: status === "authenticated",
  });
  const accountsQuery = useQuery({
    queryKey: ["finance-accounts"],
    queryFn: fetchAccounts,
    enabled: status === "authenticated",
  });
  const budgetsQuery = useQuery({
    queryKey: ["finance-budgets"],
    queryFn: fetchBudgets,
    enabled: status === "authenticated",
  });
  const cryptoHoldingsQuery = useQuery({
    queryKey: ["finance-crypto-holdings"],
    queryFn: fetchCryptoHoldings,
    enabled: status === "authenticated",
  });
  const transactionsQuery = useQuery({
    queryKey: ["finance-transactions"],
    queryFn: fetchTransactions,
    enabled: status === "authenticated",
  });
  const transactionTemplatesQuery = useQuery({
    queryKey: ["finance-transaction-templates"],
    queryFn: fetchTransactionTemplates,
    enabled: status === "authenticated",
  });
  const exchangeRatesQuery = useQuery({
    queryKey: ["finance-exchange-rates", "KGS"],
    queryFn: () => fetchExchangeRates({ quote_currency: "KGS" }),
    enabled: status === "authenticated",
  });
  const marketSnapshotQuery = useQuery({
    queryKey: ["finance-market-snapshot", storedWorkspacePreferences.crypto_market_provider, "KGS"],
    queryFn: () =>
      fetchMarketSnapshot({
        provider: storedWorkspacePreferences.crypto_market_provider,
        quote_currency: "KGS",
      }),
    enabled: status === "authenticated",
  });
  const notificationsQuery = useQuery({
    queryKey: ["finance-notifications"],
    queryFn: fetchNotifications,
    enabled: status === "authenticated",
  });
  const subscriptionPlansQuery = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: fetchSubscriptionPlans,
    enabled: status === "authenticated",
  });

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    const sectionQueryKeys: Record<FinanceWorkspaceProps["section"], Array<readonly unknown[]>> = {
      overview: [
        ["workspace-overview"],
        ["finance-accounts"],
        ["finance-budgets"],
        ["finance-transactions"],
        ["finance-crypto-holdings"],
        ["finance-notifications"],
      ],
      analytics: [
        ["finance-accounts"],
        ["finance-transactions"],
        ["finance-transaction-templates"],
        ["finance-crypto-holdings"],
        ["finance-exchange-rates", "KGS"],
      ],
      accounts: [
        ["finance-accounts"],
        ["finance-transactions"],
        ["finance-categories"],
        ["workspace-overview"],
      ],
      transactions: [
        ["finance-transactions"],
        ["finance-transaction-templates"],
        ["finance-accounts"],
        ["finance-categories"],
      ],
      budgets: [
        ["finance-budgets"],
        ["finance-categories"],
        ["finance-accounts"],
        ["finance-transactions"],
      ],
      rates: [
        ["finance-exchange-rates", "KGS"],
        ["finance-market-snapshot", storedWorkspacePreferences.crypto_market_provider, "KGS"],
      ],
      settings: [
        ["finance-categories"],
        ["finance-currencies"],
        ["subscription-plans"],
      ],
    };

    void Promise.all(
      sectionQueryKeys[section].map((queryKey) =>
        queryClient.refetchQueries({ queryKey, exact: true }),
      ),
    );
  }, [queryClient, section, status, storedWorkspacePreferences.crypto_market_provider]);

  const currencies = useMemo(() => currenciesQuery.data ?? [], [currenciesQuery.data]);
  const categories = useMemo(() => categoriesQuery.data ?? [], [categoriesQuery.data]);
  const accounts = useMemo(() => accountsQuery.data ?? [], [accountsQuery.data]);
  const budgets = useMemo(() => budgetsQuery.data ?? [], [budgetsQuery.data]);
  const subscriptionPlans = useMemo(() => subscriptionPlansQuery.data ?? [], [subscriptionPlansQuery.data]);
  const cryptoHoldings = useMemo(() => cryptoHoldingsQuery.data ?? [], [cryptoHoldingsQuery.data]);
  const transactions = useMemo(() => transactionsQuery.data ?? [], [transactionsQuery.data]);
  const transactionTemplates = useMemo(() => transactionTemplatesQuery.data ?? [], [transactionTemplatesQuery.data]);
  const exchangeRates = useMemo(() => exchangeRatesQuery.data ?? [], [exchangeRatesQuery.data]);
  const marketSnapshot = marketSnapshotQuery.data;
  const cryptoMarketAssets = useMemo(() => marketSnapshot?.crypto_assets ?? [], [marketSnapshot?.crypto_assets]);
  const notifications = useMemo(() => notificationsQuery.data ?? [], [notificationsQuery.data]);
  const activeTransactionTemplates = useMemo(
    () => transactionTemplates.filter((item) => item.is_active),
    [transactionTemplates],
  );
  const overview = overviewQuery.data;
  const activeProfileForm = profileFormDirty
    ? profileForm
    : buildProfileFormWithPreferences(user, storedWorkspacePreferences);
  const preferredDisplayCurrency = useMemo(
    () => resolveDefaultCurrency(currencies, activeProfileForm.default_currency),
    [activeProfileForm.default_currency, currencies],
  );
  const [ratesComparisonCurrency, setRatesComparisonCurrency] = useState(() => readRatesComparisonCurrencyFromSession() || "USD");
  const effectiveRatesComparisonCurrency = useMemo(
    () => (currencies.some((currency) => currency.code === ratesComparisonCurrency) ? ratesComparisonCurrency : preferredDisplayCurrency),
    [currencies, preferredDisplayCurrency, ratesComparisonCurrency],
  );
  useEffect(() => {
    if (!effectiveRatesComparisonCurrency) {
      return;
    }

    persistRatesComparisonCurrencyToSession(effectiveRatesComparisonCurrency);
  }, [effectiveRatesComparisonCurrency]);
  const premiumPlansDisplay = useMemo(() => {
    return subscriptionPlans.map((plan) => {
      const convertedPrice = convertAmountBetweenCurrencies(
        Number(plan.price_usd || 0),
        plan.currency,
        preferredDisplayCurrency,
        exchangeRates,
      );
      const displayCurrency = convertedPrice === null ? plan.currency : preferredDisplayCurrency;
      const displayAmount = convertedPrice === null ? Number(plan.price_usd || 0) : Number(convertedPrice.toFixed(2));

      return {
        ...plan,
        display_currency: displayCurrency,
        display_amount: displayAmount,
        display_price_label: formatMoney(String(displayAmount), displayCurrency),
        usd_price_label: formatMoney(String(Number(plan.price_usd || 0)), plan.currency),
      };
    });
  }, [exchangeRates, preferredDisplayCurrency, subscriptionPlans]);
  const selectedPremiumPlan =
    premiumPlansDisplay.find((plan) => plan.code === storedWorkspacePreferences.selected_premium_plan_code)
    ?? premiumPlansDisplay.find((plan) => plan.is_highlighted)
    ?? premiumPlansDisplay[0]
    ?? null;
  const systemCategoriesCount = useMemo(
    () => categories.filter((item) => item.is_system).length,
    [categories],
  );
  const customCategoriesCount = useMemo(
    () => categories.filter((item) => !item.is_system).length,
    [categories],
  );
  const filteredCategories = useMemo(() => {
    const normalizedQuery = categorySearchQuery.trim().toLowerCase();

    return categories.filter((item) => {
      if (categorySourceFilter === "system" && !item.is_system) {
        return false;
      }
      if (categorySourceFilter === "custom" && item.is_system) {
        return false;
      }
      if (categoryKindFilter !== "all" && item.kind !== categoryKindFilter) {
        return false;
      }
      if (!normalizedQuery) {
        return true;
      }

      return [item.name, item.slug, item.description, item.parent_name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery));
    });
  }, [categories, categoryKindFilter, categorySearchQuery, categorySourceFilter]);

  const updateProfileFormState = (
    updater: (
      current: ReturnType<typeof createProfileForm>,
    ) => ReturnType<typeof createProfileForm>,
  ) => {
    setProfileFormDirty(true);
    setProfileForm((current) =>
      updater(
        profileFormDirty
          ? current
          : buildProfileFormWithPreferences(user, storedWorkspacePreferences),
      ),
    );
  };

  const updateStoredWorkspacePreferences = (
    nextPreferences: StoredWorkspacePreferences,
  ) => {
    persistWorkspacePreferences(nextPreferences);
    setStoredWorkspacePreferences((current) =>
      resolveWorkspacePreferences({
        ...current,
        ...nextPreferences,
      }),
    );
  };

  const clearAccountFormError = (fieldName: string) => {
    setAccountFormErrors((current) => {
      if (!current[fieldName]) {
        return current;
      }
      const next = { ...current };
      delete next[fieldName];
      return next;
    });
  };

  const clearTransactionFormError = (fieldName: string) => {
    setTransactionFormErrors((current) => {
      if (!current[fieldName]) {
        return current;
      }
      const next = { ...current };
      delete next[fieldName];
      return next;
    });
  };

  const clearTransactionTemplateFormError = (fieldName: string) => {
    setTransactionTemplateFormErrors((current) => {
      if (!current[fieldName]) {
        return current;
      }
      const next = { ...current };
      delete next[fieldName];
      return next;
    });
  };

  const handleDefaultCurrencyChange = (value: string) => {
    updateStoredWorkspacePreferences({ default_currency: value });
    updateProfileFormState((current) => ({ ...current, default_currency: value }));
  };

  const handleCashFlowChartModeChange = (value: CashFlowChartMode) => {
    setCashFlowChartMode(value);
    updateStoredWorkspacePreferences({ cash_flow_chart_default: value });
    updateProfileFormState((current) => ({
      ...current,
      cash_flow_chart_default: value,
    }));
  };

  const handleCryptoMarketProviderChange = (value: "binance" | "okx" | "bybit" | "kraken") => {
    updateStoredWorkspacePreferences({ crypto_market_provider: value });
    updateProfileFormState((current) => ({
      ...current,
      crypto_market_provider: value,
    }));
  };

  const isPremium = storedWorkspacePreferences.subscription_tier === "premium";

  const openPremiumDialog = () => {
    if (!storedWorkspacePreferences.selected_premium_plan_code && selectedPremiumPlan) {
      updateStoredWorkspacePreferences({ selected_premium_plan_code: selectedPremiumPlan.code });
    }
    setPremiumDialogOpen(true);
  };

  const invalidateFinance = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["workspace-overview"] }),
      queryClient.invalidateQueries({ queryKey: ["finance-accounts"] }),
      queryClient.invalidateQueries({ queryKey: ["finance-transactions"] }),
      queryClient.invalidateQueries({ queryKey: ["finance-transaction-templates"] }),
      queryClient.invalidateQueries({ queryKey: ["finance-budgets"] }),
      queryClient.invalidateQueries({ queryKey: ["finance-categories"] }),
    ]);
  };

  const createAccountMutation = useMutation({
    mutationFn: createAccount,
    onSuccess: async () => {
      setAccountFormErrors({});
      toast.success(ui.accountCreated);
      setAccountDialogOpen(false);
      setAccountForm(
        createDefaultAccountForm(
          resolveDefaultCurrency(currencies, activeProfileForm.default_currency),
        ),
      );
      await invalidateFinance();
    },
    onError: (error) => {
      setAccountFormErrors(extractFieldErrors(error));
      toast.error(extractApiErrorMessage(error));
    },
  });

  const createTransactionMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: async () => {
      setTransactionFormErrors({});
      toast.success(ui.transactionCreated);
      setTransactionDialogOpen(false);
      setEditingTransaction(null);
      setTransactionForm({
        account: accounts[0]?.id ?? 0,
        template_id: null,
        category: null,
        type: "expense",
        status: "cleared",
        amount: "",
        title: "",
        merchant: "",
        description: "",
        occurred_on: getToday(),
        destination_account: null,
        destination_amount: null,
        exchange_rate: null,
      });
      await invalidateFinance();
    },
    onError: (error) => {
      setTransactionFormErrors(extractFieldErrors(error));
      toast.error(extractApiErrorMessage(error));
    },
  });

  const createTransactionTemplateMutation = useMutation({
    mutationFn: createTransactionTemplate,
    onSuccess: async (createdTemplate) => {
      setTransactionTemplateFormErrors({});
      toast.success(ui.transactionTemplateCreated);
      setTransactionTemplateDialogOpen(false);
      setEditingTransactionTemplate(null);
      setTransactionTemplateForm(createDefaultTransactionTemplateForm());
      queryClient.setQueryData<TransactionTemplateRecord[]>(["finance-transaction-templates"], (current) => {
        const items = current ?? [];
        const nextItems = items.filter((item) => item.id !== createdTemplate.id);
        return [...nextItems, createdTemplate];
      });
      applyTransactionTemplate(createdTemplate);
      await queryClient.invalidateQueries({ queryKey: ["finance-transaction-templates"] });
    },
    onError: (error) => {
      setTransactionTemplateFormErrors(extractFieldErrors(error));
      toast.error(extractApiErrorMessage(error));
    },
  });

  const createTaxTransactionsMutation = useMutation({
    mutationFn: ({ accountId, payload }: { accountId: number; payload: CreateTaxObligationTransactionsPayload }) =>
      createTaxObligationTransactions(accountId, payload),
    onSuccess: async () => {
      toast.success(ui.createTaxPaymentSuccess);
      await invalidateFinance();
    },
    onError: (error) => {
      toast.error(extractApiErrorMessage(error));
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<CreateTransactionPayload> }) =>
      updateTransaction(id, payload),
    onSuccess: async () => {
      setTransactionFormErrors({});
      toast.success(ui.transactionUpdated);
      setTransactionDialogOpen(false);
      setEditingTransaction(null);
      await invalidateFinance();
    },
    onError: (error) => {
      setTransactionFormErrors(extractFieldErrors(error));
      toast.error(extractApiErrorMessage(error));
    },
  });

  const updateTransactionTemplateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<CreateTransactionTemplatePayload> }) =>
      updateTransactionTemplate(id, payload),
    onSuccess: async () => {
      setTransactionTemplateFormErrors({});
      toast.success(ui.transactionTemplateUpdated);
      setTransactionTemplateDialogOpen(false);
      setEditingTransactionTemplate(null);
      await queryClient.invalidateQueries({ queryKey: ["finance-transaction-templates"] });
    },
    onError: (error) => {
      setTransactionTemplateFormErrors(extractFieldErrors(error));
      toast.error(extractApiErrorMessage(error));
    },
  });

  const createBudgetMutation = useMutation({
    mutationFn: createBudget,
    onSuccess: async () => {
      toast.success(ui.budgetCreated);
      setBudgetDialogOpen(false);
      setEditingBudget(null);
      await invalidateFinance();
    },
    onError: (error) => toast.error(extractApiErrorMessage(error)),
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: async () => {
      toast.success(ui.categoryCreated);
      setCategoryDialogOpen(false);
      setEditingCategory(null);
      setCategoryForm({
        kind: "expense",
        name: "",
        slug: "",
        description: "",
        icon: "",
        color: "slate",
        sort_order: 0,
        is_active: true,
      });
      await invalidateFinance();
    },
    onError: (error) => toast.error(extractApiErrorMessage(error)),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<CreateCategoryPayload> }) =>
      updateCategory(id, payload),
    onSuccess: async () => {
      toast.success(ui.categoryUpdated);
      setCategoryDialogOpen(false);
      setEditingCategory(null);
      await invalidateFinance();
    },
    onError: (error) => toast.error(extractApiErrorMessage(error)),
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: async () => {
      toast.success(ui.accountDeleted);
      setAccountToDelete(null);
      setAccountDialogOpen(false);
      setEditingAccount(null);
      await invalidateFinance();
    },
    onError: (error) => toast.error(extractApiErrorMessage(error)),
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: async () => {
      toast.success(ui.transactionDeleted);
      setTransactionToDelete(null);
      setTransactionDialogOpen(false);
      setEditingTransaction(null);
      await invalidateFinance();
    },
    onError: (error) => toast.error(extractApiErrorMessage(error)),
  });

  const deleteTransactionTemplateMutation = useMutation({
    mutationFn: deleteTransactionTemplate,
    onSuccess: async () => {
      toast.success(ui.transactionTemplateDeleted);
      setTransactionTemplateToDelete(null);
      setTransactionTemplateDialogOpen(false);
      setEditingTransactionTemplate(null);
      await queryClient.invalidateQueries({ queryKey: ["finance-transaction-templates"] });
    },
    onError: (error) => toast.error(extractApiErrorMessage(error)),
  });

  const deleteBudgetMutation = useMutation({
    mutationFn: deleteBudget,
    onSuccess: async () => {
      toast.success(ui.budgetDeleted);
      setBudgetToDelete(null);
      setBudgetDialogOpen(false);
      setEditingBudget(null);
      await invalidateFinance();
    },
    onError: (error) => toast.error(extractApiErrorMessage(error)),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: async () => {
      toast.success(ui.categoryDeleted);
      setCategoryToDelete(null);
      setCategoryDialogOpen(false);
      setEditingCategory(null);
      await invalidateFinance();
    },
    onError: (error) => toast.error(extractApiErrorMessage(error)),
  });

  const updateAccountMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<CreateAccountPayload> }) =>
      updateAccount(id, payload),
    onSuccess: async () => {
      setAccountFormErrors({});
      toast.success(ui.accountUpdated);
      await invalidateFinance();
    },
    onError: (error) => {
      setAccountFormErrors(extractFieldErrors(error));
      toast.error(extractApiErrorMessage(error));
    },
  });

  const updateBudgetMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<CreateBudgetPayload> }) =>
      updateBudget(id, payload),
    onSuccess: async () => {
      toast.success(ui.budgetUpdated);
      if (budgetDialogOpen) {
        setBudgetDialogOpen(false);
        setEditingBudget(null);
      }
      await invalidateFinance();
    },
    onError: (error) => toast.error(extractApiErrorMessage(error)),
  });

  const markNotificationReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["finance-notifications"] });
    },
    onError: (error) => toast.error(extractApiErrorMessage(error)),
  });

  const markAllNotificationsReadMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["finance-notifications"] });
    },
    onError: (error) => toast.error(extractApiErrorMessage(error)),
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: async (nextUser) => {
      const persistedPreferences = resolveWorkspacePreferences(readStoredWorkspacePreferences());
      setStoredWorkspacePreferences(persistedPreferences);
      setCashFlowChartMode(persistedPreferences.cash_flow_chart_default);
      setProfileFormDirty(false);
      setProfileForm(buildProfileFormWithPreferences(nextUser, persistedPreferences));
      toast.success(ui.profileUpdated);
      await queryClient.invalidateQueries({ queryKey: ["workspace-overview"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Request failed."),
  });

  const navigation = [
    { id: "overview", href: getLocalizedPath(locale, "/workspace"), label: ui.overview, icon: RiDashboardLine },
    { id: "accounts", href: getLocalizedPath(locale, "/workspace/accounts"), label: ui.accounts, icon: RiWallet3Line },
    { id: "transactions", href: getLocalizedPath(locale, "/workspace/transactions"), label: ui.transactions, icon: RiExchangeDollarLine },
    { id: "budgets", href: getLocalizedPath(locale, "/workspace/budgets"), label: ui.budgets, icon: RiBarChartBoxLine },
    { id: "analytics", href: getLocalizedPath(locale, "/workspace/analytics"), label: ui.analyticsWorkflowTitle, icon: RiBarChartBoxLine },
    { id: "rates", href: getLocalizedPath(locale, "/workspace/rates"), label: ui.marketRates, icon: RiGlobalLine },
    { id: "settings", href: getLocalizedPath(locale, "/workspace/settings"), label: ui.settings, icon: RiSettings3Line },
  ] as const;

  const loading =
    status === "loading" ||
    status === "unauthenticated" ||
    overviewQuery.isLoading ||
    accountsQuery.isLoading ||
    categoriesQuery.isLoading ||
    budgetsQuery.isLoading ||
    cryptoHoldingsQuery.isLoading ||
    transactionsQuery.isLoading ||
    transactionTemplatesQuery.isLoading ||
    currenciesQuery.isLoading ||
    exchangeRatesQuery.isLoading;

  const accountBalanceSnapshot = useMemo(
    () => buildAccountBalanceSnapshot(accounts, exchangeRates, preferredDisplayCurrency),
    [accounts, exchangeRates, preferredDisplayCurrency],
  );
  const workspaceSummaryCurrency = preferredDisplayCurrency;
  const sourceAccount = accounts.find((account) => account.id === transactionForm.account);
  const destinationAccount = accounts.find((account) => account.id === transactionForm.destination_account);
  const selectedTransactionTemplate = transactionTemplates.find((item) => item.id === transactionForm.template_id) ?? null;
  const suggestedTransferRate = useMemo(
    () => getCrossRate(sourceAccount?.currency, destinationAccount?.currency, exchangeRates),
    [destinationAccount?.currency, exchangeRates, sourceAccount?.currency],
  );
  const displayExchangeRates = useMemo(() => {
    return exchangeRates
      .filter((item) => item.base_currency.code !== effectiveRatesComparisonCurrency)
      .map((item, index) => {
        const derivedRate = convertAmountBetweenCurrencies(
          1,
          item.base_currency.code,
          effectiveRatesComparisonCurrency,
          exchangeRates,
        );

        if (derivedRate === null) {
          return null;
        }

        return {
          ...item,
          id: item.id || -(index + 1),
          quote_currency: {
            ...item.quote_currency,
            code: effectiveRatesComparisonCurrency,
            name: effectiveRatesComparisonCurrency,
            symbol: effectiveRatesComparisonCurrency,
          },
          rate: String(derivedRate),
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [effectiveRatesComparisonCurrency, exchangeRates]);
  const featuredExchangeRates = useMemo(() => {
    const priorityCodes = ["USD", "EUR", "KGS", "RUB", "KZT", "UZS", "CNY", "GBP", "AED", "TRY"];
    const prioritizedRates = displayExchangeRates
      .filter((item) => priorityCodes.includes(item.base_currency.code))
      .sort(
        (left, right) =>
          priorityCodes.indexOf(left.base_currency.code) - priorityCodes.indexOf(right.base_currency.code),
      );
    return (prioritizedRates.length > 0 ? prioritizedRates : displayExchangeRates).slice(0, 6);
  }, [displayExchangeRates]);
  const filteredExchangeRates = useMemo(
    () => displayExchangeRates.filter((item) => matchesExchangeRateSearch(item, ratesSearchQuery)),
    [displayExchangeRates, ratesSearchQuery],
  );
  const featuredFilteredExchangeRates = useMemo(
    () => featuredExchangeRates.filter((item) => matchesExchangeRateSearch(item, ratesSearchQuery)),
    [featuredExchangeRates, ratesSearchQuery],
  );
  const displayCryptoMarketAssets = useMemo(
    () =>
      cryptoMarketAssets.map((item) => {
        const derivedPrice = convertAmountBetweenCurrencies(
          Number(item.price),
          item.quote_currency,
          effectiveRatesComparisonCurrency,
          exchangeRates,
        );

        return {
          ...item,
          quote_currency: derivedPrice === null ? item.quote_currency : effectiveRatesComparisonCurrency,
          price: String(derivedPrice ?? Number(item.price)),
          usdt_price_label:
            item.quote_currency.toUpperCase() === "USDT"
              ? Number(item.price).toFixed(2)
              : (
                  convertAmountBetweenCurrencies(Number(item.price), item.quote_currency, "USDT", exchangeRates)
                )?.toFixed(2) ?? null,
        };
      }),
    [cryptoMarketAssets, effectiveRatesComparisonCurrency, exchangeRates],
  );
  const featuredCryptoAssets = useMemo(() => displayCryptoMarketAssets.slice(0, 6), [displayCryptoMarketAssets]);
  const filteredCryptoAssets = useMemo(
    () => displayCryptoMarketAssets.filter((item) => matchesCryptoAssetSearch(item, ratesSearchQuery)),
    [displayCryptoMarketAssets, ratesSearchQuery],
  );
  const featuredFilteredCryptoAssets = useMemo(
    () => featuredCryptoAssets.filter((item) => matchesCryptoAssetSearch(item, ratesSearchQuery)),
    [featuredCryptoAssets, ratesSearchQuery],
  );
  const unreadNotificationsCount = useMemo(
    () => notifications.filter((item) => !item.is_read).length,
    [notifications],
  );
  const categoriesById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );
  const monthlyIncomeBreakdown = useMemo(
    () => buildMonthlyCurrencyBreakdown(transactions, "income"),
    [transactions],
  );
  const monthlyExpenseBreakdown = useMemo(
    () => buildMonthlyCurrencyBreakdown(transactions, "expense"),
    [transactions],
  );
  const monthlyNetBreakdown = useMemo(
    () => buildMonthlyCurrencyBreakdown(transactions, "net"),
    [transactions],
  );
  const projectedSubscriptionsTotal = useMemo(() => {
    const subscriptionTemplateTotal = transactionTemplates.reduce((sum, template) => {
      const category = template.category ? categoriesById.get(template.category) : null;
      const isSubscriptionTemplate =
        template.is_active
        && template.type === "expense"
        && isSubscriptionCategory(category);
      if (!isSubscriptionTemplate) {
        return sum;
      }

      return sum + (convertAmountBetweenCurrencies(Number(template.amount || 0), template.currency, workspaceSummaryCurrency, exchangeRates) ?? 0);
    }, 0);

    if (subscriptionTemplateTotal > 0) {
      return subscriptionTemplateTotal;
    }

    return transactions.reduce((sum, transaction) => {
      const category = transaction.category ? categoriesById.get(transaction.category) : null;
      const isSubscriptionTransaction =
        transaction.type === "expense"
        && transaction.status !== "canceled"
        && isSubscriptionCategory(category);
      if (!isSubscriptionTransaction) {
        return sum;
      }

      return sum + (convertAmountBetweenCurrencies(Number(transaction.amount || 0), transaction.currency, workspaceSummaryCurrency, exchangeRates) ?? 0);
    }, 0);
  }, [categoriesById, exchangeRates, transactionTemplates, transactions, workspaceSummaryCurrency]);
  const projectedSubscriptionsCount = useMemo(
    () => {
      const templateCount = transactionTemplates.filter((template) => {
        const category = template.category ? categoriesById.get(template.category) : null;
        return (
          template.is_active
          && template.type === "expense"
          && isSubscriptionCategory(category)
        );
      }).length;

      if (templateCount > 0) {
        return templateCount;
      }

      return transactions.filter((transaction) => {
        const category = transaction.category ? categoriesById.get(transaction.category) : null;
        return (
          transaction.type === "expense"
          && transaction.status !== "canceled"
          && isSubscriptionCategory(category)
        );
      }).length;
    },
    [categoriesById, transactionTemplates, transactions],
  );
  const monthlyIncomeTotal = useMemo(
    () =>
      monthlyIncomeBreakdown.reduce(
        (sum, entry) =>
          sum
          + (convertAmountBetweenCurrencies(entry.amount, entry.currency, workspaceSummaryCurrency, exchangeRates) ?? 0),
        0,
      ),
    [exchangeRates, monthlyIncomeBreakdown, workspaceSummaryCurrency],
  );
  const monthlyExpenseTotal = useMemo(
    () =>
      monthlyExpenseBreakdown.reduce(
        (sum, entry) =>
          sum
          + (convertAmountBetweenCurrencies(entry.amount, entry.currency, workspaceSummaryCurrency, exchangeRates) ?? 0),
        0,
      ),
    [exchangeRates, monthlyExpenseBreakdown, workspaceSummaryCurrency],
  );
  const monthlyNetTotal = useMemo(
    () =>
      monthlyNetBreakdown.reduce(
        (sum, entry) =>
          sum
          + (convertAmountBetweenCurrencies(entry.amount, entry.currency, workspaceSummaryCurrency, exchangeRates) ?? 0),
        0,
      ),
    [exchangeRates, monthlyNetBreakdown, workspaceSummaryCurrency],
  );
  const summaryDetailTransactions = useMemo(() => {
    if (!summaryBreakdownModal) {
      return [];
    }

    const { startDate, endDate, kind } = summaryBreakdownModal;
    return transactions
      .filter((item) => {
        if (item.occurred_on < startDate || item.occurred_on > endDate) {
          return false;
        }
        if (kind === "income") {
          return item.type === "income" && item.status === "cleared";
        }
        if (kind === "expense") {
          return item.type === "expense" && item.status !== "canceled";
        }
        return (
          (item.type === "income" && item.status === "cleared")
          || (item.type === "expense" && item.status !== "canceled")
        );
      })
      .slice()
      .sort((left, right) => right.occurred_on.localeCompare(left.occurred_on));
  }, [summaryBreakdownModal, transactions]);
  const summaryDetailBreakdown = useMemo(
    () =>
      summaryBreakdownModal
        ? buildCurrencyBreakdownForTransactions(summaryDetailTransactions, summaryBreakdownModal.kind)
        : [],
    [summaryBreakdownModal, summaryDetailTransactions],
  );
  const summaryDetailTotal = useMemo(() => {
    return summaryDetailTransactions.reduce((accumulator, item) => {
      const amount =
        convertAmountBetweenCurrencies(
          Number(item.amount || 0),
          item.currency,
          workspaceSummaryCurrency,
          exchangeRates,
        ) ?? 0;
      if (summaryBreakdownModal?.kind === "net") {
        return accumulator + (item.type === "income" ? amount : -amount);
      }
      return accumulator + amount;
    }, 0);
  }, [exchangeRates, summaryBreakdownModal, summaryDetailTransactions, workspaceSummaryCurrency]);
  const summaryDetailCategoryTotals = useMemo(() => {
    const totals = new Map<string, { name: string; amount: number; count: number }>();

    for (const item of summaryDetailTransactions) {
      const key = item.category_name || ui.transferLabel;
      const current = totals.get(key) ?? { name: key, amount: 0, count: 0 };
      const convertedAmount =
        convertAmountBetweenCurrencies(
          Number(item.amount || 0),
          item.currency,
          workspaceSummaryCurrency,
          exchangeRates,
        ) ?? 0;
      const signedAmount =
        summaryBreakdownModal?.kind === "net"
          ? (item.type === "income" ? convertedAmount : -convertedAmount)
          : convertedAmount;

      current.amount += signedAmount;
      current.count += 1;
      totals.set(key, current);
    }

    return [...totals.values()].sort((left, right) => Math.abs(right.amount) - Math.abs(left.amount));
  }, [exchangeRates, summaryBreakdownModal, summaryDetailTransactions, ui.transferLabel, workspaceSummaryCurrency]);
  const currentMonthLabel = useMemo(() => formatMonthLabel(new Date(), locale), [locale]);
  const cashFlowSeries = useMemo(
    () =>
      buildCashFlowSeries(
        transactions,
        cashFlowRange,
        locale,
        cashFlowCustomRange,
        cashFlowAnchorDate,
        exchangeRates,
        workspaceSummaryCurrency,
      ),
    [cashFlowAnchorDate, cashFlowCustomRange, cashFlowRange, exchangeRates, locale, transactions, workspaceSummaryCurrency],
  );
  const cashFlowVisibleTotals = useMemo(
    () =>
      cashFlowSeries.items.reduce(
        (accumulator, item) => ({
          income: accumulator.income + item.income,
          expense: accumulator.expense + item.expense,
          net: accumulator.net + item.net,
        }),
        { income: 0, expense: 0, net: 0 },
      ),
    [cashFlowSeries.items],
  );
  const cashFlowTrajectory = useMemo(
    () => buildCashFlowTrajectory(cashFlowSeries.items),
    [cashFlowSeries.items],
  );
  const cashFlowRangeLabel = useMemo(
    () => cashFlowRangeDescription(cashFlowRange, locale, ui, cashFlowAnchorDate, cashFlowCustomRange),
    [cashFlowAnchorDate, cashFlowCustomRange, cashFlowRange, locale, ui],
  );
  const effectiveCashFlowChartMode =
    cashFlowChartMode ??
    storedWorkspacePreferences.cash_flow_chart_default ??
    "bars";
  const recentExpensesBoundary = useMemo(() => {
    const boundary = new Date(getToday());
    boundary.setDate(boundary.getDate() - 6);
    boundary.setHours(0, 0, 0, 0);
    return boundary.getTime();
  }, []);
  const quickExpenseCount = useMemo(
    () =>
      transactions.filter((item) => {
        if (item.type !== "expense" || item.status === "canceled") {
          return false;
        }
        const occurredOn = new Date(item.occurred_on);
        if (Number.isNaN(occurredOn.getTime())) {
          return false;
        }
        return occurredOn.getTime() >= recentExpensesBoundary;
      }).length,
    [recentExpensesBoundary, transactions],
  );
  const monthlyCashFlow = monthlyNetTotal;
  const monthlyCashFlowTone: "emerald" | "rose" = monthlyCashFlow >= 0 ? "emerald" : "rose";
  const budgetAlertsCount = useMemo(
    () => budgets.filter((item) => item.utilization_percent >= item.alert_threshold).length,
    [budgets],
  );
  const displaySection = section;
  const activeNavigationItem = navigation.find((item) => item.id === section) ?? navigation[0];
  const ActiveSectionIcon = activeNavigationItem.icon;

  const openAccountDialog = () => {
    setEditingAccount(null);
    setAccountFormErrors({});
    const defaultCurrency = resolveDefaultCurrency(
      currencies,
      activeProfileForm.default_currency,
    );
    setAccountForm(createDefaultAccountForm(defaultCurrency));
    setAccountDialogOpen(true);
  };

  const openAccountEditDialog = (account: AccountRecord) => {
    setEditingAccount(account);
    setAccountFormErrors({});
    setAccountForm(createAccountFormFromRecord(account));
    setAccountDialogOpen(true);
  };

  const openTransactionDialog = () => {
    setEditingTransaction(null);
    setTransactionFormErrors({});
    setTransactionForm({
      account: accounts[0]?.id ?? 0,
      template_id: null,
      category: null,
      type: "expense",
      status: "cleared",
      amount: "",
      title: "",
      merchant: "",
      description: "",
      occurred_on: getToday(),
      destination_account: null,
      destination_amount: null,
      exchange_rate: null,
    });
    setTransactionDialogOpen(true);
  };

  const openQuickExpenseDialog = () => {
    const primaryAccount = accounts.find((account) => account.status === "active") ?? accounts[0];
    const expenseCategory = categories.find((item) => item.kind === "expense");

    setEditingTransaction(null);
    setTransactionForm({
      account: primaryAccount?.id ?? 0,
      template_id: null,
      category: expenseCategory?.id ?? null,
      type: "expense",
      status: "cleared",
      amount: "",
      title: "",
      merchant: "",
      description: "",
      occurred_on: getToday(),
      destination_account: null,
      destination_amount: null,
      exchange_rate: null,
    });
    setTransactionDialogOpen(true);
  };

  const applyTransactionTemplate = (template: TransactionTemplateRecord) => {
    setTransactionFormErrors({});
    setTransactionForm((current) => ({
      ...current,
      template_id: template.id,
      account: template.account,
      category: template.category,
      type: template.type,
      status: template.status,
      amount: template.amount,
      title: template.title,
      merchant: template.merchant,
      description: template.description,
      destination_account: template.destination_account,
      destination_amount: template.destination_amount,
      exchange_rate: template.exchange_rate,
      occurred_on: current.occurred_on || getToday(),
    }));
  };

  const openBlankTransactionTemplateDialog = () => {
    setEditingTransactionTemplate(null);
    setTransactionTemplateFormErrors({});
    setTransactionTemplateForm(createBlankTransactionTemplateForm());
    setTransactionTemplateDialogOpen(true);
  };

  const openTransactionTemplateDialog = () => {
    setEditingTransactionTemplate(null);
    setTransactionTemplateFormErrors({});
    setTransactionTemplateForm({
      name: "",
      account: transactionForm.account || accounts[0]?.id || 0,
      destination_account: transactionForm.type === "transfer" ? transactionForm.destination_account ?? null : null,
      category: transactionForm.type === "transfer" ? null : transactionForm.category ?? null,
      type: transactionForm.type,
      status: transactionForm.status,
      amount: transactionForm.amount,
      destination_amount: transactionForm.type === "transfer" ? transactionForm.destination_amount ?? null : null,
      exchange_rate: transactionForm.type === "transfer" ? transactionForm.exchange_rate ?? null : null,
      title: transactionForm.title,
      merchant: transactionForm.merchant,
      description: transactionForm.description,
      icon: "tag",
      color: "slate",
      sort_order: 0,
      is_active: true,
    });
    setTransactionTemplateDialogOpen(true);
  };

  const openTransactionTemplateEditDialog = (template: TransactionTemplateRecord) => {
    setEditingTransactionTemplate(template);
    setTransactionTemplateFormErrors({});
    setTransactionTemplateForm({
      name: template.name,
      account: template.account,
      destination_account: template.destination_account,
      category: template.category,
      type: template.type,
      status: template.status,
      amount: template.amount,
      destination_amount: template.destination_amount,
      exchange_rate: template.exchange_rate,
      title: template.title,
      merchant: template.merchant,
      description: template.description,
      icon: template.icon,
      color: template.color,
      sort_order: template.sort_order,
      is_active: template.is_active,
    });
    setTransactionTemplateDialogOpen(true);
  };

  const openTransactionEditDialog = (transaction: TransactionRecord) => {
    setEditingTransaction(transaction);
    setTransactionFormErrors({});
    setTransactionForm({
      account: transaction.account,
      template_id: null,
      category: transaction.category,
      type: transaction.type,
      status: transaction.status,
      amount: transaction.amount,
      title: transaction.title,
      merchant: transaction.merchant,
      description: transaction.description,
      occurred_on: transaction.occurred_on,
      destination_account: transaction.destination_account,
      destination_amount: transaction.destination_amount,
      exchange_rate: transaction.exchange_rate,
    });
    setTransactionDialogOpen(true);
  };

  const openBudgetDialog = () => {
    setEditingBudget(null);
    const expenseCategory = categories.find((item) => item.kind === "expense");
    const defaultCurrency = resolveDefaultCurrency(
      currencies,
      activeProfileForm.default_currency,
    );

    setBudgetForm({
      category: expenseCategory?.id ?? 0,
      currency: defaultCurrency,
      period: "monthly",
      amount: "",
      start_date: getToday().slice(0, 8) + "01",
      end_date: getMonthEnd(),
      alert_threshold: 0,
      rollover_enabled: false,
      is_active: true,
      note: "",
    });
    setBudgetDialogOpen(true);
  };

  const openBudgetEditDialog = (budget: BudgetRecord) => {
    setEditingBudget(budget);
    setBudgetForm({
      kind: budget.kind,
      name: budget.name,
      category: budget.category,
      currency: budget.currency,
      period: budget.period,
      amount: budget.amount,
      target_amount: budget.target_amount,
      target_account: budget.target_account,
      start_date: budget.start_date,
      end_date: budget.end_date,
      alert_threshold: budget.alert_threshold,
      rollover_enabled: budget.rollover_enabled,
      is_active: budget.is_active,
      note: budget.note,
    });
    setBudgetDialogOpen(true);
  };

  const openCategoryDialog = () => {
    setEditingCategory(null);
    setCategoryForm({
      kind: "expense",
      name: "",
      slug: "",
      description: "",
      icon: "",
      color: "slate",
      sort_order: 0,
      is_active: true,
    });
    setCategoryDialogOpen(true);
  };

  const openCategoryEditDialog = (category: CategoryRecord) => {
    setEditingCategory(category);
    setCategoryForm({
      parent: category.parent,
      kind: category.kind,
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      color: category.color,
      sort_order: category.sort_order,
      is_active: category.is_active,
    });
    setCategoryDialogOpen(true);
  };

  const handleLocaleChange = (nextLocale: Locale) => {
    setLocalePreference(nextLocale);
    toast.success(ui.languageUpdated);
    router.push(replacePathLocale(window.location.pathname, nextLocale));
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(110,231,183,0.18),_transparent_24%),linear-gradient(180deg,_#020504_0%,_#07110c_42%,_#040806_100%)] px-6">
        <div className="surface-panel flex w-full max-w-md items-center gap-4 rounded-[2rem] px-6 py-6">
          <Spinner className="size-5 text-emerald-200" />
          <div>
            <p className="text-sm font-medium text-white">{content.loading.title}</p>
            <p className="mt-1 text-sm text-zinc-400">{content.loading.description}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!overview) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(110,231,183,0.18),_transparent_24%),linear-gradient(180deg,_#020504_0%,_#07110c_42%,_#040806_100%)] px-6">
        <Card className="surface-panel w-full max-w-xl rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
          <CardHeader className="p-6">
            <CardTitle className="text-white">{content.error.title}</CardTitle>
            <CardDescription className="text-zinc-400">{content.error.description}</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(110,231,183,0.18),_transparent_24%),radial-gradient(circle_at_86%_10%,_rgba(56,189,248,0.12),_transparent_20%),linear-gradient(180deg,_#020504_0%,_#07110c_40%,_#040806_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:68px_68px] opacity-15" />

      <section className="relative z-10 mx-auto flex w-full max-w-[1680px] flex-col px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <header className="surface-panel rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(8,18,14,0.92)_0%,rgba(7,14,11,0.96)_100%)] px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-4">
                <span className="mt-1 inline-flex size-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-300/18 bg-emerald-300/10 text-emerald-100">
                  <ActiveSectionIcon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-500 lg:flex-nowrap">
                    <Badge className="shrink-0 rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-1 text-emerald-100" variant="outline">
                      {content.attention.replace("{count}", String(overview.summary.attention_count))}
                    </Badge>
                    <Link
                      href="/"
                      className="group inline-flex items-center rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-zinc-300 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300/18 hover:bg-emerald-300/10 hover:text-emerald-100 hover:shadow-[0_10px_24px_rgba(16,185,129,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/30"
                    >
                      FinMan
                      <RiArrowRightUpLine className="ml-1.5 size-3.5 transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                    <span className="rounded-full border border-white/8 bg-black/20 px-3 py-1 text-zinc-400">
                      {currentMonthLabel}
                    </span>
                  </div>
                  <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-[2.05rem]">
                    {activeNavigationItem.label}
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-stretch gap-3 xl:max-w-[30rem] xl:justify-end">
              <button
                type="button"
                onClick={() => setNotificationsOpen(true)}
                className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-black/20 text-zinc-300 transition hover:bg-white/[0.04] hover:text-white"
              >
                <RiNotification3Line className="size-4" />
                {unreadNotificationsCount > 0 ? (
                  <span className="absolute right-2 top-2 inline-flex min-w-5 items-center justify-center rounded-full border border-emerald-300/16 bg-emerald-300/12 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-emerald-100">
                    {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
                  </span>
                ) : null}
              </button>
              <div className="flex min-w-[210px] flex-1 items-center gap-3 rounded-2xl border border-white/8 bg-black/20 px-3 pr-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/8 bg-white/[0.05] text-sm font-semibold text-white">
                  {(user?.display_name ?? overview.user.display_name).slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{user?.display_name ?? overview.user.display_name}</p>
                  <p className="truncate text-xs text-zinc-500">{overview.user.email}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <QuickActionRow
              compact
              label={content.actions.addTransaction}
              icon={RiAddLine}
              onClick={openTransactionDialog}
            />
            <QuickActionRow
              compact
              label={ui.createAccount}
              icon={RiWallet3Line}
              onClick={openAccountDialog}
            />
            <QuickActionRow
              compact
              label={ui.createBudget}
              icon={RiBarChartBoxLine}
              onClick={openBudgetDialog}
            />
            <QuickActionRow
              compact
              label={ui.createCategory}
              icon={RiBookletLine}
              onClick={openCategoryDialog}
            />
          </div>
        </header>

        <div className="mt-6 grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1.35fr)_repeat(4,minmax(0,1fr))]">
          <Card
            className="group surface-panel h-full cursor-pointer rounded-[1.8rem] border-white/8 bg-[linear-gradient(180deg,rgba(8,18,24,0.9)_0%,rgba(7,12,19,0.98)_100%)] py-0 transition duration-200 hover:-translate-y-0.5 hover:border-sky-300/18 hover:shadow-[0_24px_60px_rgba(56,189,248,0.16)] md:col-span-2 xl:col-span-1"
            onClick={() => setAccountsSnapshotOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setAccountsSnapshotOpen(true);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <CardHeader className="flex h-full flex-1 flex-col p-5">
              <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-stretch sm:justify-between">
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="mb-3 inline-flex size-11 items-center justify-center rounded-2xl border border-sky-300/16 bg-sky-300/10 text-sky-100">
                    <RiSafe2Line className="size-5" />
                  </div>
                  <CardDescription className="text-zinc-400">{ui.totalByRates}</CardDescription>
                  <CardTitle className="mt-2 break-words text-[1.125rem] text-white sm:text-[1.35rem]">
                    {accountBalanceSnapshot.convertedTotal
                      ? formatMoney(
                          String(accountBalanceSnapshot.convertedTotal.amount),
                          accountBalanceSnapshot.convertedTotal.currency,
                        )
                      : formatMoney(overview.summary.net_worth, workspaceSummaryCurrency)}
                  </CardTitle>
                  <p className="mt-2 text-sm text-zinc-500">
                    {accountBalanceSnapshot.convertedTotal
                      ? `${ui.totalApproximate} · ${accountBalanceSnapshot.convertedTotal.currency}`
                      : workspaceSummaryCurrency}
                  </p>
                  <div className="mt-auto pt-4">
                    <div className="inline-flex max-w-full items-center overflow-hidden rounded-full border border-sky-300/18 bg-sky-300/10 px-3 py-1.5 text-xs font-medium text-sky-100 transition group-hover:bg-sky-300/14">
                      <span className="min-w-0 truncate">{ui.openDetails}</span>
                      <span className="ml-2 inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-sky-300/18 bg-black/20 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        <RiArrowRightUpLine className="size-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
          <MetricCard
            icon={RiArrowRightUpLine}
            label={content.summary.income}
            value={formatMoney(String(monthlyIncomeTotal), workspaceSummaryCurrency)}
            actionLabel={ui.openDetails}
            breakdown={monthlyIncomeBreakdown}
            breakdownLabel={ui.currencyBreakdown}
            moreLabel={ui.currenciesMore}
            collapseLabel={ui.showLessCategories}
            className="h-full"
            tone="emerald"
            onOpenBreakdown={() =>
              setSummaryBreakdownModal({
                title: content.summary.income,
                kind: "income",
                startDate: getToday().slice(0, 8) + "01",
                endDate: getToday(),
              })
            }
          />
          <MetricCard
            icon={RiBankCardLine}
            label={content.summary.expenses}
            value={formatMoney(String(monthlyExpenseTotal), workspaceSummaryCurrency)}
            actionLabel={ui.openDetails}
            breakdown={monthlyExpenseBreakdown}
            breakdownLabel={ui.currencyBreakdown}
            moreLabel={ui.currenciesMore}
            collapseLabel={ui.showLessCategories}
            className="h-full"
            tone="rose"
            onOpenBreakdown={() =>
              setSummaryBreakdownModal({
                title: content.summary.expenses,
                kind: "expense",
                startDate: getToday().slice(0, 8) + "01",
                endDate: getToday(),
              })
            }
          />
          <MetricCard
            icon={RiArrowRightUpLine}
            label={ui.cashFlowLabel}
            value={formatMoney(String(monthlyCashFlow), workspaceSummaryCurrency)}
            actionLabel={ui.openDetails}
            breakdown={monthlyNetBreakdown}
            breakdownLabel={ui.currencyBreakdown}
            moreLabel={ui.currenciesMore}
            collapseLabel={ui.showLessCategories}
            className="h-full"
            tone={monthlyCashFlowTone}
            onOpenBreakdown={() =>
              setSummaryBreakdownModal({
                title: ui.cashFlowLabel,
                kind: "net",
                startDate: getToday().slice(0, 8) + "01",
                endDate: getToday(),
              })
            }
          />
          <MetricCard
            icon={RiCoinsLine}
            label={content.summary.savingsRate}
            value={`${overview.summary.savings_rate}%`}
            progressValue={Math.max(0, Math.min(100, overview.summary.savings_rate))}
            className="h-full"
            tone="violet"
          />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[246px_minmax(0,1fr)]">
          <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <WorkspaceNavigation
              items={navigation}
              activeSection={displaySection}
              title={ui.operationsCenter}
              description={activeNavigationItem.label}
            />
          </aside>

          <div className="space-y-6">
            {displaySection === "overview" ? (
              <WorkspaceOverviewSection
                ui={ui}
                content={content}
                accounts={accounts}
                budgets={budgets}
                transactions={transactions}
                quickExpenseCount={quickExpenseCount}
                budgetAlertsCount={budgetAlertsCount}
                customCategoriesCount={customCategoriesCount}
                onOpenQuickExpenseDialog={openQuickExpenseDialog}
                onOpenBudgetDialog={openBudgetDialog}
                onOpenTransactionEditDialog={openTransactionEditDialog}
                onOpenTransactionsSection={() => router.push(getLocalizedPath(locale, "/workspace/transactions"))}
                onOpenBudgetsSection={() => router.push(getLocalizedPath(locale, "/workspace/budgets"))}
                onOpenSettingsSection={() => router.push(getLocalizedPath(locale, "/workspace/settings"))}
              />
            ) : null}

            {displaySection === "analytics" ? (
              <WorkspaceAnalyticsSection
                ui={ui}
                content={content}
                isPremium={isPremium}
                onOpenPremiumDialog={openPremiumDialog}
                currencies={currencies}
                exchangeRates={exchangeRates}
                accounts={accounts.map((account) => ({
                  id: account.id,
                  name: account.name,
                  currency: account.currency,
                  amount: Number(account.deposit_profile?.projected_balance ?? account.current_balance ?? 0),
                }))}
                cryptoHoldings={cryptoHoldings}
                cryptoAssets={cryptoMarketAssets}
                projectedSubscriptionsTotal={projectedSubscriptionsTotal}
                projectedSubscriptionsCount={projectedSubscriptionsCount}
                cashFlowRangeLabel={cashFlowRangeLabel}
                cashFlowRange={cashFlowRange}
                setCashFlowRange={setCashFlowRange}
                cashFlowAnchorDate={cashFlowAnchorDate}
                setCashFlowAnchorDate={setCashFlowAnchorDate}
                cashFlowCustomRange={cashFlowCustomRange}
                setCashFlowCustomRange={setCashFlowCustomRange}
                effectiveCashFlowChartMode={effectiveCashFlowChartMode}
                setCashFlowChartMode={handleCashFlowChartModeChange}
                cashFlowVisibleTotals={cashFlowVisibleTotals}
                workspaceSummaryCurrency={workspaceSummaryCurrency}
                cashFlowTrajectory={cashFlowTrajectory}
                cashFlowSeries={cashFlowSeries}
              />
            ) : null}

            {displaySection === "accounts" ? (
              <WorkspaceAccountsSection
                ui={ui}
                accounts={accounts}
                transactions={transactions}
                categories={categories}
                overview={overview}
                onOpenAccountDialog={openAccountDialog}
                onOpenAccountEditDialog={openAccountEditDialog}
                onCreateTaxTransactions={(accountId, payload) =>
                  createTaxTransactionsMutation.mutateAsync({ accountId, payload })
                }
                createTaxTransactionsPending={createTaxTransactionsMutation.isPending}
              />
            ) : null}

            {displaySection === "rates" ? (
              <WorkspaceRatesSection
                ui={ui}
                isPremium={isPremium}
                currencies={currencies}
                exchangeRates={displayExchangeRates}
                featuredFilteredExchangeRates={featuredFilteredExchangeRates}
                filteredExchangeRates={filteredExchangeRates}
                cryptoAssets={displayCryptoMarketAssets}
                featuredCryptoAssets={featuredFilteredCryptoAssets}
                filteredCryptoAssets={filteredCryptoAssets}
                exchangeRatesLoading={exchangeRatesQuery.isLoading}
                cryptoAssetsLoading={marketSnapshotQuery.isLoading}
                cryptoProvider={marketSnapshot?.provider ?? storedWorkspacePreferences.crypto_market_provider}
                cryptoProviderError={marketSnapshot?.provider_error ?? null}
                ratesComparisonCurrency={effectiveRatesComparisonCurrency}
                onRatesComparisonCurrencyChange={setRatesComparisonCurrency}
                ratesSearchQuery={ratesSearchQuery}
                onRatesSearchChange={setRatesSearchQuery}
                onOpenPremiumDialog={openPremiumDialog}
              />
            ) : null}

            {displaySection === "transactions" ? (
              <WorkspaceTransactionsSection
                ui={ui}
                content={content}
                transactions={transactions}
                onOpenTransactionDialog={openTransactionDialog}
                onOpenTransactionEditDialog={openTransactionEditDialog}
                onDeleteTransactionRequest={setTransactionToDelete}
              />
            ) : null}

            {displaySection === "budgets" ? (
              <WorkspaceBudgetsSection
                ui={ui}
                content={content}
                budgets={budgets}
                onOpenBudgetDialog={openBudgetDialog}
                onOpenBudgetEditDialog={openBudgetEditDialog}
                onToggleBudgetActive={(budget) =>
                  updateBudgetMutation.mutate({
                    id: budget.id,
                    payload: { is_active: !budget.is_active },
                  })
                }
              />
            ) : null}

            {displaySection === "settings" ? (
              <WorkspaceSettingsSection
                ui={ui}
                locale={locale}
                isPremium={isPremium}
                currencies={currencies}
                subscriptionPlans={premiumPlansDisplay}
                selectedSubscriptionPlan={selectedPremiumPlan}
                categories={categories}
                filteredCategories={filteredCategories}
                categorySearchQuery={categorySearchQuery}
                categorySourceFilter={categorySourceFilter}
                categoryKindFilter={categoryKindFilter}
                systemCategoriesCount={systemCategoriesCount}
                customCategoriesCount={customCategoriesCount}
                activeProfileForm={activeProfileForm}
                updateProfilePending={updateProfileMutation.isPending}
                onDefaultCurrencyChange={handleDefaultCurrencyChange}
                onCashFlowChartModeChange={handleCashFlowChartModeChange}
                onCryptoMarketProviderChange={handleCryptoMarketProviderChange}
                onOpenCategoryDialog={openCategoryDialog}
                onCategorySearchChange={setCategorySearchQuery}
                onCategorySourceFilterChange={setCategorySourceFilter}
                onCategoryKindFilterChange={setCategoryKindFilter}
                onOpenCategoryEditDialog={openCategoryEditDialog}
                onDeleteCategoryRequest={setCategoryToDelete}
                onLocaleChange={handleLocaleChange}
                onOpenPremiumDialog={openPremiumDialog}
                onUpdateProfileFormState={updateProfileFormState}
                onSaveProfile={() =>
                  updateProfileMutation.mutate({
                    first_name: activeProfileForm.first_name,
                    last_name: activeProfileForm.last_name,
                    email: activeProfileForm.email,
                    phone: activeProfileForm.phone,
                    two_factor_enabled: activeProfileForm.two_factor_enabled,
                  })
                }
              />
            ) : null}

          </div>
        </div>
      </section>

      <PremiumUpgradeDialog
        open={premiumDialogOpen}
        onOpenChange={setPremiumDialogOpen}
        ui={ui}
        plans={premiumPlansDisplay}
        selectedPlan={selectedPremiumPlan}
        ctaClassName={premiumCtaClassName}
        onSelectPlan={(planCode) => updateStoredWorkspacePreferences({ selected_premium_plan_code: planCode })}
        onCheckout={() => {
          toast.success(ui.premiumCheckoutAction);
        }}
      />

      <Dialog
        open={accountDialogOpen}
        onOpenChange={(open) => {
          setAccountDialogOpen(open);
          if (!open) {
            setEditingAccount(null);
            setAccountFormErrors({});
            if (!editingAccount) {
              setAccountForm(
                createDefaultAccountForm(
                  resolveDefaultCurrency(currencies, activeProfileForm.default_currency),
                ),
              );
            }
          }
        }}
      >
        <DialogContent className="flex h-[min(92vh,64rem)] w-[min(96vw,72rem)] max-w-none flex-col overflow-hidden rounded-[2rem] border-white/10 bg-[#07110c] p-0 text-zinc-100 sm:max-w-none">
          <DialogHeader className="shrink-0 p-8 pb-0">
            <DialogTitle>{editingAccount ? ui.editLabel : ui.createAccount}</DialogTitle>
            <DialogDescription>{ui.manageAccounts}</DialogDescription>
          </DialogHeader>
          <form
            className="flex min-h-0 flex-1 flex-col"
            onSubmit={(event) => {
              event.preventDefault();
              const payload: CreateAccountPayload = {
                ...accountForm,
                deposit_profile:
                  accountForm.kind === "deposit" && accountForm.deposit_profile
                    ? {
                        ...accountForm.deposit_profile,
                        maturity_date: accountForm.deposit_profile.maturity_date || null,
                      }
                    : undefined,
              };
              const validationErrors = validateAccountForm(payload);
              if (Object.keys(validationErrors).length > 0) {
                setAccountFormErrors(validationErrors);
                toast.error("Заполните обязательные поля счета.");
                return;
              }
              if (editingAccount) {
                updateAccountMutation.mutate({
                  id: editingAccount.id,
                  payload,
                });
                setAccountDialogOpen(false);
                setEditingAccount(null);
                return;
              }

              createAccountMutation.mutate(payload);
            }}
          >
            <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-6 pt-6">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field data-invalid={Boolean(accountFormErrors.name)}>
                    <FieldLabel>{ui.accountName}</FieldLabel>
                    <Input
                      aria-invalid={Boolean(accountFormErrors.name)}
                      value={accountForm.name}
                      onChange={(event) => {
                        clearAccountFormError("name");
                        setAccountForm((current) => ({ ...current, name: event.target.value }));
                      }}
                    />
                    <FieldError>{accountFormErrors.name}</FieldError>
                  </Field>
                  <Field data-invalid={Boolean(accountFormErrors.currency)}>
                    <FieldLabel>{ui.currency}</FieldLabel>
                    <WorkspaceSelect
                      value={accountForm.currency}
                      invalid={Boolean(accountFormErrors.currency)}
                      onValueChange={(value) => {
                        clearAccountFormError("currency");
                        setAccountForm((current) => ({ ...current, currency: value }));
                      }}
                      options={currencies.map((currency: CurrencyRecord) => ({
                        value: currency.code,
                        label: <CurrencyOptionLabel currencyCode={currency.code} text={`${currency.code} · ${currency.name}`} />,
                      }))}
                    />
                    <FieldError>{accountFormErrors.currency}</FieldError>
                  </Field>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field data-invalid={Boolean(accountFormErrors.kind)}>
                    <FieldLabel>{ui.accountKind}</FieldLabel>
                    <WorkspaceSelect
                      value={accountForm.kind}
                      invalid={Boolean(accountFormErrors.kind)}
                      onValueChange={(value) =>
                        {
                          clearAccountFormError("kind");
                          clearAccountFormError("tax_profile");
                          clearAccountFormError("deposit_profile");
                          setAccountForm((current) => ({
                            ...current,
                            kind: value,
                            tax_profile:
                              value === "entrepreneur" || value === "company"
                                ? current.tax_profile ?? createDefaultTaxProfile(value)
                                : undefined,
                            deposit_profile:
                              value === "deposit"
                                ? current.deposit_profile ?? createDefaultDepositProfile()
                                : current.deposit_profile,
                          }));
                        }
                      }
                      options={[
                        { value: "cash", label: ui.accountKindCash },
                        { value: "bank", label: ui.accountKindBank },
                        { value: "savings", label: ui.accountKindSavings },
                        { value: "deposit", label: ui.accountKindDeposit },
                        { value: "credit_card", label: ui.accountKindCreditCard },
                        { value: "investment", label: ui.accountKindInvestment },
                        { value: "entrepreneur", label: ui.accountKindEntrepreneur },
                        { value: "company", label: ui.accountKindCompany },
                        { value: "e_wallet", label: ui.accountKindWallet },
                      ]}
                    />
                    <FieldError>{accountFormErrors.kind}</FieldError>
                  </Field>
                  <Field data-invalid={Boolean(accountFormErrors.status)}>
                    <FieldLabel>{ui.status}</FieldLabel>
                    <WorkspaceSelect
                      value={accountForm.status}
                      invalid={Boolean(accountFormErrors.status)}
                      onValueChange={(value) => {
                        clearAccountFormError("status");
                        setAccountForm((current) => ({ ...current, status: value }));
                      }}
                      options={[
                        { value: "active", label: ui.activeLabel },
                        { value: "frozen", label: ui.freeze },
                        { value: "archived", label: ui.archive },
                        { value: "closed", label: ui.inactiveLabel },
                      ]}
                    />
                    <FieldError>{accountFormErrors.status}</FieldError>
                  </Field>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel>{ui.institution}</FieldLabel>
                    <Input value={accountForm.institution} onChange={(event) => setAccountForm((current) => ({ ...current, institution: event.target.value }))} />
                  </Field>
                  <Field>
                    <FieldLabel>{ui.openingBalance}</FieldLabel>
                    <Input value={accountForm.opening_balance} onChange={(event) => setAccountForm((current) => ({ ...current, opening_balance: event.target.value }))} />
                  </Field>
                </div>
                <AccountAppearancePicker
                  color={accountForm.color}
                  icon={accountForm.icon}
                  kind={accountForm.kind}
                  colorLabel={ui.colorToken}
                  iconLabel={ui.accountIcon}
                  helperText={ui.appearanceHint}
                  clearLabel={ui.clearSelection}
                  onColorChange={(value) => setAccountForm((current) => ({ ...current, color: value }))}
                  onIconChange={(value) => setAccountForm((current) => ({ ...current, icon: value }))}
                />
                <Field>
                  <FieldLabel>{ui.creditLimit}</FieldLabel>
                  <Input value={accountForm.credit_limit} onChange={(event) => setAccountForm((current) => ({ ...current, credit_limit: event.target.value }))} />
                </Field>
                {(accountForm.kind === "entrepreneur" || accountForm.kind === "company") && accountForm.tax_profile ? (
                  <div className="space-y-4 rounded-[1.6rem] border border-white/8 bg-black/18 p-5">
                    <div>
                      <p className="text-sm font-medium text-white">{ui.taxSettingsTitle}</p>
                      <p className="mt-1 text-sm text-zinc-400">{ui.taxSettingsBody}</p>
                    </div>
                    <FieldError>{accountFormErrors.tax_profile}</FieldError>
                    {(() => {
                      const socialFundMode =
                        accountForm.tax_profile?.manual_social_fund_amount !== null
                        && accountForm.tax_profile?.manual_social_fund_amount !== ""
                          ? "fixed"
                          : "percent";

                      return (
                        <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field>
                        <FieldLabel>{ui.taxRateLabel}</FieldLabel>
                        <Input
                          value={accountForm.tax_profile.tax_rate}
                          onChange={(event) =>
                            setAccountForm((current) => ({
                              ...current,
                              tax_profile: current.tax_profile
                                ? { ...current.tax_profile, tax_rate: event.target.value }
                                : current.tax_profile,
                            }))
                          }
                          placeholder="4.0000"
                        />
                      </Field>
                      <Field>
                        <FieldLabel>{ui.socialFundModeLabel}</FieldLabel>
                        <WorkspaceSelect
                          value={socialFundMode}
                          onValueChange={(value) =>
                            setAccountForm((current) => ({
                              ...current,
                              tax_profile: current.tax_profile
                                ? {
                                    ...current.tax_profile,
                                    social_fund_rate:
                                      value === "percent"
                                        ? current.tax_profile.social_fund_rate || "0.0000"
                                        : "0.0000",
                                    manual_social_fund_amount:
                                      value === "fixed"
                                        ? current.tax_profile.manual_social_fund_amount ?? "0.00"
                                        : null,
                                  }
                                : current.tax_profile,
                            }))
                          }
                          options={[
                            { value: "percent", label: ui.socialFundModePercent },
                            { value: "fixed", label: ui.socialFundModeFixed },
                          ]}
                        />
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel>
                        {socialFundMode === "percent"
                          ? `${ui.socialFundLabel}, %`
                          : `${ui.socialFundFixedAmountLabel}, ${accountForm.currency}`}
                      </FieldLabel>
                      <Input
                        value={
                          socialFundMode === "percent"
                            ? accountForm.tax_profile.social_fund_rate
                            : (accountForm.tax_profile.manual_social_fund_amount ?? "")
                        }
                        onChange={(event) =>
                          setAccountForm((current) => ({
                            ...current,
                            tax_profile: current.tax_profile
                              ? {
                                  ...current.tax_profile,
                                  social_fund_rate:
                                    socialFundMode === "percent"
                                      ? event.target.value
                                      : current.tax_profile.social_fund_rate,
                                  manual_social_fund_amount:
                                    socialFundMode === "fixed"
                                      ? event.target.value
                                      : current.tax_profile.manual_social_fund_amount,
                                }
                              : current.tax_profile,
                          }))
                        }
                        placeholder={socialFundMode === "percent" ? "0.0000" : "0.00"}
                      />
                    </Field>
                        </>
                      );
                    })()}
                    <div className="rounded-[1.2rem] border border-emerald-300/10 bg-emerald-300/[0.06] px-4 py-3 text-sm text-emerald-100">
                      {ui.taxQuarterlyAutoHint}
                    </div>
                    <Field>
                      <FieldLabel>{ui.notes}</FieldLabel>
                      <Textarea
                        value={accountForm.tax_profile.note}
                        onChange={(event) =>
                          setAccountForm((current) => ({
                            ...current,
                            tax_profile: current.tax_profile
                              ? { ...current.tax_profile, note: event.target.value }
                              : current.tax_profile,
                          }))
                        }
                      />
                    </Field>
                  </div>
                ) : null}
                {accountForm.kind === "deposit" && accountForm.deposit_profile ? (
                  <div className="space-y-4 rounded-[1.6rem] border border-white/8 bg-black/18 p-5">
                    <div>
                      <p className="text-sm font-medium text-white">{ui.depositSettingsTitle}</p>
                      <p className="mt-1 text-sm text-zinc-400">{ui.depositSettingsBody}</p>
                    </div>
                    <FieldError>{accountFormErrors.deposit_profile}</FieldError>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field>
                        <FieldLabel>{ui.annualInterestRate}</FieldLabel>
                        <Input
                          value={accountForm.deposit_profile.annual_interest_rate}
                          onChange={(event) =>
                            setAccountForm((current) => ({
                              ...current,
                              deposit_profile: current.deposit_profile
                                ? { ...current.deposit_profile, annual_interest_rate: event.target.value }
                                : createDefaultDepositProfile(),
                            }))
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel>{ui.minimumBalance}</FieldLabel>
                        <Input
                          value={accountForm.deposit_profile.minimum_balance}
                          onChange={(event) =>
                            setAccountForm((current) => ({
                              ...current,
                              deposit_profile: current.deposit_profile
                                ? { ...current.deposit_profile, minimum_balance: event.target.value }
                                : createDefaultDepositProfile(),
                            }))
                          }
                        />
                      </Field>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field>
                        <FieldLabel>{ui.interestPayoutFrequency}</FieldLabel>
                        <WorkspaceSelect
                          value={accountForm.deposit_profile.interest_payout_frequency}
                          onValueChange={(value) =>
                            setAccountForm((current) => ({
                              ...current,
                              deposit_profile: current.deposit_profile
                                ? {
                                    ...current.deposit_profile,
                                    interest_payout_frequency: value as "monthly" | "quarterly" | "yearly" | "at_maturity",
                                  }
                                : createDefaultDepositProfile(),
                            }))
                          }
                          options={[
                            { value: "monthly", label: ui.monthly },
                            { value: "quarterly", label: ui.quarterly },
                            { value: "yearly", label: ui.yearly },
                            { value: "at_maturity", label: ui.payoutAtMaturity },
                          ]}
                        />
                      </Field>
                      <Field>
                        <FieldLabel>{ui.dayCountConvention}</FieldLabel>
                        <WorkspaceSelect
                          value={accountForm.deposit_profile.day_count_convention}
                          onValueChange={(value) =>
                            setAccountForm((current) => ({
                              ...current,
                              deposit_profile: current.deposit_profile
                                ? {
                                    ...current.deposit_profile,
                                    day_count_convention: value as "actual_365" | "actual_366" | "actual_actual" | "thirty_360",
                                  }
                                : createDefaultDepositProfile(),
                            }))
                          }
                          options={[
                            { value: "actual_365", label: ui.actual365 },
                            { value: "actual_366", label: ui.actual366 },
                            { value: "actual_actual", label: ui.actualActual },
                            { value: "thirty_360", label: ui.thirty360 },
                          ]}
                        />
                      </Field>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field>
                        <FieldLabel>{ui.startDate}</FieldLabel>
                        <DateInput
                          value={accountForm.deposit_profile.term_start_date}
                          onChange={(nextValue) =>
                            setAccountForm((current) => ({
                              ...current,
                              deposit_profile: current.deposit_profile
                                ? { ...current.deposit_profile, term_start_date: nextValue }
                                : createDefaultDepositProfile(),
                            }))
                          }
                          placeholder={ui.startDate}
                        />
                      </Field>
                      <Field>
                        <FieldLabel>{ui.maturityDate}</FieldLabel>
                        <DateInput
                          value={accountForm.deposit_profile.maturity_date ?? ""}
                          onChange={(nextValue) =>
                            setAccountForm((current) => ({
                              ...current,
                              deposit_profile: current.deposit_profile
                                ? { ...current.deposit_profile, maturity_date: nextValue || null }
                                : createDefaultDepositProfile(),
                            }))
                          }
                          placeholder={ui.maturityDate}
                        />
                      </Field>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field>
                        <FieldLabel>{ui.capitalizationEnabled}</FieldLabel>
                        <WorkspaceSelect
                          value={accountForm.deposit_profile.capitalization_enabled ? "yes" : "no"}
                          onValueChange={(value) =>
                            setAccountForm((current) => ({
                              ...current,
                              deposit_profile: current.deposit_profile
                                ? { ...current.deposit_profile, capitalization_enabled: value === "yes" }
                                : createDefaultDepositProfile(),
                            }))
                          }
                          options={[
                            { value: "yes", label: ui.yesLabel },
                            { value: "no", label: ui.noLabel },
                          ]}
                        />
                      </Field>
                      <Field>
                        <FieldLabel>{ui.autoRenewal}</FieldLabel>
                        <WorkspaceSelect
                          value={accountForm.deposit_profile.auto_renewal ? "yes" : "no"}
                          onValueChange={(value) =>
                            setAccountForm((current) => ({
                              ...current,
                              deposit_profile: current.deposit_profile
                                ? { ...current.deposit_profile, auto_renewal: value === "yes" }
                                : createDefaultDepositProfile(),
                            }))
                          }
                          options={[
                            { value: "yes", label: ui.yesLabel },
                            { value: "no", label: ui.noLabel },
                          ]}
                        />
                      </Field>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field>
                        <FieldLabel>{ui.allowTopUp}</FieldLabel>
                        <WorkspaceSelect
                          value={accountForm.deposit_profile.allow_top_up ? "yes" : "no"}
                          onValueChange={(value) =>
                            setAccountForm((current) => ({
                              ...current,
                              deposit_profile: current.deposit_profile
                                ? { ...current.deposit_profile, allow_top_up: value === "yes" }
                                : createDefaultDepositProfile(),
                            }))
                          }
                          options={[
                            { value: "yes", label: ui.yesLabel },
                            { value: "no", label: ui.noLabel },
                          ]}
                        />
                      </Field>
                      <Field>
                        <FieldLabel>{ui.allowPartialWithdrawal}</FieldLabel>
                        <WorkspaceSelect
                          value={accountForm.deposit_profile.allow_partial_withdrawal ? "yes" : "no"}
                          onValueChange={(value) =>
                            setAccountForm((current) => ({
                              ...current,
                              deposit_profile: current.deposit_profile
                                ? { ...current.deposit_profile, allow_partial_withdrawal: value === "yes" }
                                : createDefaultDepositProfile(),
                            }))
                          }
                          options={[
                            { value: "yes", label: ui.yesLabel },
                            { value: "no", label: ui.noLabel },
                          ]}
                        />
                      </Field>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <Field>
                        <FieldLabel>{ui.recurringContributionAmount}</FieldLabel>
                        <Input
                          value={accountForm.deposit_profile.recurring_contribution_amount}
                          onChange={(event) =>
                            setAccountForm((current) => ({
                              ...current,
                              deposit_profile: current.deposit_profile
                                ? { ...current.deposit_profile, recurring_contribution_amount: event.target.value }
                                : createDefaultDepositProfile(),
                            }))
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel>{ui.recurringContributionFrequency}</FieldLabel>
                        <WorkspaceSelect
                          value={accountForm.deposit_profile.recurring_contribution_frequency}
                          onValueChange={(value) =>
                            setAccountForm((current) => ({
                              ...current,
                              deposit_profile: current.deposit_profile
                                ? {
                                    ...current.deposit_profile,
                                    recurring_contribution_frequency: value as "none" | "monthly" | "quarterly" | "yearly",
                                  }
                                : createDefaultDepositProfile(),
                            }))
                          }
                          options={[
                            { value: "none", label: ui.recurringFrequencyNone },
                            { value: "monthly", label: ui.monthly },
                            { value: "quarterly", label: ui.quarterly },
                            { value: "yearly", label: ui.yearly },
                          ]}
                        />
                      </Field>
                      <Field>
                        <FieldLabel>{ui.recurringContributionDay}</FieldLabel>
                        <Input
                          value={String(accountForm.deposit_profile.recurring_contribution_day)}
                          onChange={(event) =>
                            setAccountForm((current) => ({
                              ...current,
                              deposit_profile: current.deposit_profile
                                ? {
                                    ...current.deposit_profile,
                                    recurring_contribution_day: Number(event.target.value || 1),
                                  }
                                : createDefaultDepositProfile(),
                            }))
                          }
                        />
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel>{ui.depositDetails}</FieldLabel>
                      <Textarea
                        value={accountForm.deposit_profile.note}
                        onChange={(event) =>
                          setAccountForm((current) => ({
                            ...current,
                            deposit_profile: current.deposit_profile
                              ? { ...current.deposit_profile, note: event.target.value }
                              : createDefaultDepositProfile(),
                          }))
                        }
                      />
                    </Field>
                  </div>
                ) : null}
                <Field>
                  <FieldLabel>{ui.notes}</FieldLabel>
                  <Textarea value={accountForm.note} onChange={(event) => setAccountForm((current) => ({ ...current, note: event.target.value }))} />
                </Field>
              </div>
            </div>
            <DialogFooter className="border-white/8 bg-white/[0.03]">
              {editingAccount ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="mr-auto rounded-2xl text-rose-300 hover:text-rose-200"
                  onClick={() => setAccountToDelete(editingAccount)}
                >
                  <RiDeleteBin6Line className="size-4" />
                  {ui.deleteLabel}
                </Button>
              ) : null}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAccountDialogOpen(false);
                  setEditingAccount(null);
                }}
              >
                {ui.cancel}
              </Button>
              <Button
                type="submit"
                className="bg-emerald-300 text-slate-950"
                disabled={createAccountMutation.isPending || updateAccountMutation.isPending}
              >
                {editingAccount ? ui.save : ui.create}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={accountsSnapshotOpen} onOpenChange={setAccountsSnapshotOpen}>
        <DialogContent className="flex h-[min(88vh,56rem)] w-[min(96vw,64rem)] max-w-none flex-col overflow-hidden rounded-[2rem] border-white/10 bg-[#07110c] p-0 text-zinc-100 sm:max-w-none">
          <DialogHeader className="shrink-0 p-8 pb-0">
            <DialogTitle>{ui.allAccountsLabel}</DialogTitle>
            <DialogDescription>{ui.balancesByCurrency}</DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-8 pt-6">
            <div className="grid gap-4">
            {accountBalanceSnapshot.convertedTotal ? (
              <div className="rounded-[1.6rem] border border-white/8 bg-black/18 px-5 py-5">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.totalByRates}</p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {formatMoney(
                    String(accountBalanceSnapshot.convertedTotal.amount),
                    accountBalanceSnapshot.convertedTotal.currency,
                  )}
                </p>
                {!accountBalanceSnapshot.convertedTotal.hasAllRates ? (
                  <p className="mt-2 text-sm text-amber-200">
                    {ui.ratesMissing.replace(
                      "{currencies}",
                      accountBalanceSnapshot.convertedTotal.missingCurrencies.join(", "),
                    )}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="grid gap-3 md:grid-cols-2">
              {accounts.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  ui={ui}
                  onOpen={(nextAccount) => {
                    setAccountsSnapshotOpen(false);
                    setActiveAccount(nextAccount);
                  }}
                />
              ))}
            </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AccountDetailsDialog
        account={activeAccount}
        transactions={transactions}
        ui={ui}
        onClose={() => setActiveAccount(null)}
        onEdit={(account) => {
          setActiveAccount(null);
          setAccountsSnapshotOpen(false);
          handleOpenAccountEditDialog(account);
        }}
      />

      <Dialog
        open={transactionDialogOpen}
        onOpenChange={(open) => {
          setTransactionDialogOpen(open);
          if (!open) {
            setEditingTransaction(null);
            setTransactionFormErrors({});
          }
        }}
      >
        <DialogContent className="flex h-[min(88vh,56rem)] w-[min(96vw,60rem)] max-w-none flex-col overflow-hidden rounded-[2rem] border-white/10 bg-[#07110c] p-0 text-zinc-100 sm:max-w-none">
          <DialogHeader className="shrink-0 p-8 pb-0">
            <DialogTitle>{editingTransaction ? ui.editLabel : content.actions.addTransaction}</DialogTitle>
            <DialogDescription>{ui.manageTransactions}</DialogDescription>
          </DialogHeader>
          <form
            className="flex min-h-0 flex-1 flex-col"
            onSubmit={(event) => {
              event.preventDefault();
              const payload: CreateTransactionPayload = {
                ...transactionForm,
                category: transactionForm.type === "transfer" ? null : transactionForm.category,
                destination_account: transactionForm.type === "transfer" ? transactionForm.destination_account ?? null : null,
                destination_amount: transactionForm.type === "transfer" ? transactionForm.destination_amount ?? null : null,
                exchange_rate:
                  transactionForm.type === "transfer"
                    ? transactionForm.exchange_rate ?? suggestedTransferRate?.toFixed(6) ?? null
                    : null,
              };
              const validationErrors = validateTransactionForm(payload);
              if (Object.keys(validationErrors).length > 0) {
                setTransactionFormErrors(validationErrors);
                toast.error("Заполните обязательные поля транзакции.");
                return;
              }

              if (editingTransaction) {
                updateTransactionMutation.mutate({
                  id: editingTransaction.id,
                  payload,
                });
                return;
              }

              createTransactionMutation.mutate(payload);
            }}
          >
            <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-6 pt-6">
              <div className="mb-5 rounded-[1.6rem] border border-white/8 bg-black/18 p-4">
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_auto]">
                  <Field>
                    <FieldLabel>{ui.transactionTemplate}</FieldLabel>
                    <WorkspaceSelect
                      value={transactionForm.template_id ? String(transactionForm.template_id) : NO_TRANSACTION_TEMPLATE_VALUE}
                      onValueChange={(value) => {
                        if (value === NO_TRANSACTION_TEMPLATE_VALUE) {
                          setTransactionForm((current) => ({ ...current, template_id: null }));
                          return;
                        }
                        const template = activeTransactionTemplates.find((item) => item.id === Number(value));
                        if (template) {
                          applyTransactionTemplate(template);
                        }
                      }}
                      options={[
                        { value: NO_TRANSACTION_TEMPLATE_VALUE, label: ui.noTransactionTemplate },
                        ...activeTransactionTemplates.map((template) => {
                          const appearance = resolveCategoryAppearance(template.color, template.type);
                          const TemplateIcon = resolveCategoryIcon(template.icon, template.type).icon;

                          return {
                            value: String(template.id),
                            label: (
                              <span className="inline-flex min-w-0 items-center gap-2">
                                <span
                                  className="inline-flex size-7 shrink-0 items-center justify-center rounded-xl border bg-black/25"
                                  style={{
                                    borderColor: appearance.border,
                                    boxShadow: `0 0 0 1px ${appearance.glow}`,
                                  }}
                                >
                                  <TemplateIcon className="size-3.5" style={{ color: appearance.text }} />
                                </span>
                                <span className="truncate">{template.name}</span>
                              </span>
                            ),
                          };
                        }),
                      ]}
                    />
                  </Field>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 self-end rounded-2xl border-white/10 bg-white/5 px-4 text-zinc-100"
                    onClick={openBlankTransactionTemplateDialog}
                  >
                    {ui.createTemplate}
                  </Button>
                  {selectedTransactionTemplate ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 self-end rounded-2xl border-white/10 bg-white/5 px-4 text-zinc-100"
                      onClick={() => openTransactionTemplateEditDialog(selectedTransactionTemplate)}
                    >
                      {ui.editTemplate}
                    </Button>
                  ) : null}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl border-white/10 bg-white/5 text-zinc-100"
                    onClick={openTransactionTemplateDialog}
                  >
                    {ui.saveAsTemplate}
                  </Button>
                  {selectedTransactionTemplate ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-2xl border-white/10 bg-white/5 text-zinc-100"
                      onClick={() => applyTransactionTemplate(selectedTransactionTemplate)}
                    >
                      {ui.applyTemplate}
                    </Button>
                  ) : null}
                </div>
              </div>
              <TransactionDialogFields
                type={transactionForm.type}
                status={transactionForm.status}
                exchangeRatePlaceholder={
                  transactionForm.type === "transfer" && suggestedTransferRate
                    ? suggestedTransferRate.toFixed(6)
                    : ui.optional
                }
                onTypeChange={(value) =>
                  setTransactionForm((current) => ({
                    ...current,
                    type: value,
                    category: null,
                    destination_account: null,
                    destination_amount: null,
                    exchange_rate: null,
                  }))
                }
                onStatusChange={(value) => setTransactionForm((current) => ({ ...current, status: value }))}
                accounts={accounts}
                categories={categories}
                values={transactionForm}
                setValues={setTransactionForm}
                fieldErrors={transactionFormErrors}
                clearFieldError={clearTransactionFormError}
                ui={ui}
              />
            </div>
            <DialogFooter className="border-white/8 bg-white/[0.03]">
              {editingTransaction ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="mr-auto rounded-2xl text-rose-300 hover:text-rose-200"
                  onClick={() => setTransactionToDelete(editingTransaction)}
                >
                  <RiDeleteBin6Line className="size-4" />
                  {ui.deleteLabel}
                </Button>
              ) : null}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setTransactionDialogOpen(false);
                  setEditingTransaction(null);
                }}
              >
                {ui.cancel}
              </Button>
              <Button
                type="submit"
                className="bg-emerald-300 text-slate-950"
                disabled={createTransactionMutation.isPending || updateTransactionMutation.isPending}
              >
                {editingTransaction ? ui.save : ui.create}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={transactionTemplateDialogOpen}
        onOpenChange={(open) => {
          setTransactionTemplateDialogOpen(open);
          if (!open) {
            setEditingTransactionTemplate(null);
            setTransactionTemplateFormErrors({});
          }
        }}
      >
        <DialogContent className="flex h-[min(88vh,58rem)] w-[min(96vw,62rem)] max-w-none flex-col overflow-hidden rounded-[2rem] border-white/10 bg-[#07110c] p-0 text-zinc-100 sm:max-w-none">
          <DialogHeader className="shrink-0 p-8 pb-0">
            <DialogTitle>{editingTransactionTemplate ? ui.editTemplate : ui.createTemplate}</DialogTitle>
            <DialogDescription>{ui.manageTransactionTemplates}</DialogDescription>
          </DialogHeader>
          <form
            className="flex min-h-0 flex-1 flex-col"
            onSubmit={(event) => {
              event.preventDefault();
              const payload: CreateTransactionTemplatePayload = {
                ...transactionTemplateForm,
                title: transactionTemplateForm.name.trim(),
                category: transactionTemplateForm.type === "transfer" ? null : transactionTemplateForm.category,
                destination_account:
                  transactionTemplateForm.type === "transfer"
                    ? transactionTemplateForm.destination_account ?? null
                    : null,
                destination_amount:
                  transactionTemplateForm.type === "transfer"
                    ? transactionTemplateForm.destination_amount ?? null
                    : null,
                exchange_rate:
                  transactionTemplateForm.type === "transfer"
                    ? transactionTemplateForm.exchange_rate ?? null
                    : null,
              };

              if (editingTransactionTemplate) {
                updateTransactionTemplateMutation.mutate({
                  id: editingTransactionTemplate.id,
                  payload,
                });
                return;
              }

              createTransactionTemplateMutation.mutate(payload);
            }}
          >
            <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-6 pt-6">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field data-invalid={Boolean(transactionTemplateFormErrors.name)}>
                    <FieldLabel>{ui.transactionTemplateName}</FieldLabel>
                    <Input
                      aria-invalid={Boolean(transactionTemplateFormErrors.name)}
                      value={transactionTemplateForm.name}
                      onChange={(event) => {
                        clearTransactionTemplateFormError("name");
                        setTransactionTemplateForm((current) => ({
                          ...current,
                          name: event.target.value,
                          title: event.target.value,
                        }));
                      }}
                    />
                    <FieldError>{transactionTemplateFormErrors.name}</FieldError>
                  </Field>
                  <Field data-invalid={Boolean(transactionTemplateFormErrors.account)}>
                    <FieldLabel>{ui.accountName}</FieldLabel>
                    <WorkspaceSelect
                      value={String(transactionTemplateForm.account)}
                      invalid={Boolean(transactionTemplateFormErrors.account)}
                      onValueChange={(value) => {
                        clearTransactionTemplateFormError("account");
                        setTransactionTemplateForm((current) => ({ ...current, account: Number(value) }));
                      }}
                      options={accounts.map((account) => ({
                        value: String(account.id),
                        label: account.name,
                      }))}
                    />
                    <FieldError>{transactionTemplateFormErrors.account}</FieldError>
                  </Field>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field data-invalid={Boolean(transactionTemplateFormErrors.type)}>
                    <FieldLabel>{ui.type}</FieldLabel>
                    <WorkspaceSelect
                      value={transactionTemplateForm.type}
                      invalid={Boolean(transactionTemplateFormErrors.type)}
                      onValueChange={(value) => {
                        clearTransactionTemplateFormError("type");
                        clearTransactionTemplateFormError("category");
                        clearTransactionTemplateFormError("destination_account");
                        setTransactionTemplateForm((current) => ({
                          ...current,
                          type: value,
                          category: value === "transfer" ? null : current.category,
                          destination_account: value === "transfer" ? current.destination_account : null,
                          destination_amount: value === "transfer" ? current.destination_amount : null,
                          exchange_rate: value === "transfer" ? current.exchange_rate : null,
                        }));
                      }}
                      options={[
                        { value: "expense", label: ui.txTypeExpense },
                        { value: "income", label: ui.txTypeIncome },
                        { value: "transfer", label: ui.txTypeTransfer },
                      ]}
                    />
                    <FieldError>{transactionTemplateFormErrors.type}</FieldError>
                  </Field>
                  <Field data-invalid={Boolean(transactionTemplateFormErrors.status)}>
                    <FieldLabel>{ui.status}</FieldLabel>
                    <WorkspaceSelect
                      value={transactionTemplateForm.status}
                      invalid={Boolean(transactionTemplateFormErrors.status)}
                      onValueChange={(value) => {
                        clearTransactionTemplateFormError("status");
                        setTransactionTemplateForm((current) => ({ ...current, status: value }));
                      }}
                      options={[
                        { value: "cleared", label: ui.txStatusCleared },
                        { value: "pending", label: ui.txStatusPending },
                        { value: "draft", label: ui.txStatusDraft },
                        { value: "canceled", label: ui.txStatusCanceled },
                      ]}
                    />
                    <FieldError>{transactionTemplateFormErrors.status}</FieldError>
                  </Field>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {transactionTemplateForm.type === "transfer" ? (
                    <Field data-invalid={Boolean(transactionTemplateFormErrors.destination_account)}>
                      <FieldLabel>{ui.destinationAccount}</FieldLabel>
                      <WorkspaceSelect
                        value={transactionTemplateForm.destination_account ? String(transactionTemplateForm.destination_account) : EMPTY_SELECT_VALUE}
                        invalid={Boolean(transactionTemplateFormErrors.destination_account)}
                      onValueChange={(value) => {
                        clearTransactionTemplateFormError("destination_account");
                        setTransactionTemplateForm((current) => ({
                          ...current,
                          destination_account: value === EMPTY_SELECT_VALUE ? null : Number(value),
                        }));
                      }}
                        options={[
                          { value: EMPTY_SELECT_VALUE, label: ui.selectDestination },
                          ...accounts.map((account) => ({
                            value: String(account.id),
                            label: account.name,
                          })),
                        ]}
                      />
                      <FieldError>{transactionTemplateFormErrors.destination_account}</FieldError>
                    </Field>
                  ) : (
                    <Field data-invalid={Boolean(transactionTemplateFormErrors.category)}>
                      <FieldLabel>{ui.category}</FieldLabel>
                      <WorkspaceSelect
                        value={transactionTemplateForm.category ? String(transactionTemplateForm.category) : EMPTY_SELECT_VALUE}
                        invalid={Boolean(transactionTemplateFormErrors.category)}
                      onValueChange={(value) => {
                        clearTransactionTemplateFormError("category");
                        setTransactionTemplateForm((current) => ({
                          ...current,
                          category: value === EMPTY_SELECT_VALUE ? null : Number(value),
                        }));
                      }}
                        options={[
                          { value: EMPTY_SELECT_VALUE, label: ui.selectCategory },
                          ...categories
                            .filter((item) => item.kind === transactionTemplateForm.type)
                            .map((category) => ({
                              value: String(category.id),
                              label: category.name,
                            })),
                        ]}
                      />
                      <FieldError>{transactionTemplateFormErrors.category}</FieldError>
                    </Field>
                  )}
                  <Field data-invalid={Boolean(transactionTemplateFormErrors.amount)}>
                    <FieldLabel>{ui.amount}</FieldLabel>
                    <Input
                      aria-invalid={Boolean(transactionTemplateFormErrors.amount)}
                      value={transactionTemplateForm.amount}
                      onChange={(event) => {
                        clearTransactionTemplateFormError("amount");
                        setTransactionTemplateForm((current) => ({ ...current, amount: event.target.value }));
                      }}
                    />
                    <FieldError>{transactionTemplateFormErrors.amount}</FieldError>
                  </Field>
                </div>
                {transactionTemplateForm.type === "transfer" ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field data-invalid={Boolean(transactionTemplateFormErrors.destination_amount)}>
                      <FieldLabel>{ui.destinationAmount}</FieldLabel>
                      <Input
                        aria-invalid={Boolean(transactionTemplateFormErrors.destination_amount)}
                        value={transactionTemplateForm.destination_amount ?? ""}
                        onChange={(event) => {
                          clearTransactionTemplateFormError("destination_amount");
                          setTransactionTemplateForm((current) => ({
                            ...current,
                            destination_amount: event.target.value || null,
                          }));
                        }}
                      />
                      <FieldError>{transactionTemplateFormErrors.destination_amount}</FieldError>
                    </Field>
                    <Field data-invalid={Boolean(transactionTemplateFormErrors.exchange_rate)}>
                      <FieldLabel>{ui.exchangeRate}</FieldLabel>
                      <Input
                        aria-invalid={Boolean(transactionTemplateFormErrors.exchange_rate)}
                        value={transactionTemplateForm.exchange_rate ?? ""}
                        onChange={(event) => {
                          clearTransactionTemplateFormError("exchange_rate");
                          setTransactionTemplateForm((current) => ({
                            ...current,
                            exchange_rate: event.target.value || null,
                          }));
                        }}
                      />
                      <FieldError>{transactionTemplateFormErrors.exchange_rate}</FieldError>
                    </Field>
                  </div>
                ) : null}
                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel>{ui.merchant}</FieldLabel>
                    <Input
                      value={transactionTemplateForm.merchant}
                      onChange={(event) => setTransactionTemplateForm((current) => ({ ...current, merchant: event.target.value }))}
                    />
                  </Field>
                </div>
                <Field>
                  <FieldLabel>{ui.notes}</FieldLabel>
                  <Textarea
                    value={transactionTemplateForm.description}
                    onChange={(event) => setTransactionTemplateForm((current) => ({ ...current, description: event.target.value }))}
                  />
                </Field>
                <CategoryAppearancePicker
                  color={transactionTemplateForm.color}
                  icon={transactionTemplateForm.icon}
                  kind={transactionTemplateForm.type}
                  colorLabel={ui.templateAppearanceTitle}
                  iconLabel={ui.templateAppearanceTitle}
                  helperText={ui.templateAppearanceDescription}
                  clearLabel={ui.cancel}
                  onColorChange={(value) => {
                    clearTransactionTemplateFormError("color");
                    setTransactionTemplateForm((current) => ({ ...current, color: value }));
                  }}
                  onIconChange={(value) => {
                    clearTransactionTemplateFormError("icon");
                    setTransactionTemplateForm((current) => ({ ...current, icon: value }));
                  }}
                />
                {transactionTemplateFormErrors.icon ? <p className="text-sm text-rose-300">{transactionTemplateFormErrors.icon}</p> : null}
                {transactionTemplateFormErrors.color ? <p className="text-sm text-rose-300">{transactionTemplateFormErrors.color}</p> : null}
                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel>{ui.status}</FieldLabel>
                    <WorkspaceSelect
                      value={transactionTemplateForm.is_active ? "true" : "false"}
                      onValueChange={(value) => setTransactionTemplateForm((current) => ({ ...current, is_active: value === "true" }))}
                      options={[
                        { value: "true", label: ui.activeLabel },
                        { value: "false", label: ui.inactiveLabel },
                      ]}
                    />
                  </Field>
                </div>
              </div>
            </div>
            <DialogFooter className="border-white/8 bg-white/[0.03]">
              {editingTransactionTemplate ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="mr-auto rounded-2xl text-rose-300 hover:text-rose-200"
                  onClick={() => setTransactionTemplateToDelete(editingTransactionTemplate)}
                >
                  <RiDeleteBin6Line className="size-4" />
                  {ui.deleteLabel}
                </Button>
              ) : null}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setTransactionTemplateDialogOpen(false);
                  setEditingTransactionTemplate(null);
                }}
              >
                {ui.cancel}
              </Button>
              <Button
                type="submit"
                className="bg-emerald-300 text-slate-950"
                disabled={createTransactionTemplateMutation.isPending || updateTransactionTemplateMutation.isPending}
              >
                {editingTransactionTemplate ? ui.save : ui.create}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={budgetDialogOpen}
        onOpenChange={(open) => {
          setBudgetDialogOpen(open);
          if (!open) {
            setEditingBudget(null);
          }
        }}
      >
        <DialogContent className="flex h-[min(84vh,48rem)] w-[min(96vw,48rem)] max-w-none flex-col overflow-hidden rounded-[2rem] border-white/10 bg-[#07110c] p-0 text-zinc-100 sm:max-w-none">
          <DialogHeader className="shrink-0 p-8 pb-0">
            <DialogTitle>{editingBudget ? ui.editBudget : ui.createBudget}</DialogTitle>
            <DialogDescription>{ui.manageBudgets}</DialogDescription>
          </DialogHeader>
          <form
            className="flex min-h-0 flex-1 flex-col"
            onSubmit={(event) => {
              event.preventDefault();
              if (editingBudget) {
                updateBudgetMutation.mutate({
                  id: editingBudget.id,
                  payload: budgetForm,
                });
                return;
              }

              createBudgetMutation.mutate(budgetForm);
            }}
          >
            <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-6 pt-6">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel>{ui.budgetKind}</FieldLabel>
                    <WorkspaceSelect
                      value={budgetForm.kind}
                      onValueChange={(value) =>
                        setBudgetForm((current) => ({
                          ...current,
                          kind: value as "expense" | "saving" | "goal",
                          category: value === "expense" ? current.category ?? 0 : null,
                          target_account: value === "expense" ? null : current.target_account,
                          target_amount: value === "goal" ? current.target_amount : null,
                        }))
                      }
                      options={[
                        { value: "expense", label: ui.budgetKindExpense },
                        { value: "saving", label: ui.budgetKindSaving },
                        { value: "goal", label: ui.budgetKindGoal },
                      ]}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>{budgetForm.kind === "expense" ? ui.category : ui.budgetName}</FieldLabel>
                    {budgetForm.kind === "expense" ? (
                      <WorkspaceSelect
                        value={budgetForm.category ? String(budgetForm.category) : ""}
                        onValueChange={(value) => setBudgetForm((current) => ({ ...current, category: Number(value) }))}
                        options={categories
                          .filter((item) => item.kind === "expense")
                          .map((category) => ({
                            value: String(category.id),
                            label: category.name,
                          }))}
                      />
                    ) : (
                      <Input
                        value={budgetForm.name}
                        onChange={(event) => setBudgetForm((current) => ({ ...current, name: event.target.value }))}
                      />
                    )}
                  </Field>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel>{ui.currency}</FieldLabel>
                    <WorkspaceSelect
                      value={budgetForm.currency}
                      onValueChange={(value) => setBudgetForm((current) => ({ ...current, currency: value }))}
                      options={currencies.map((currency) => ({
                        value: currency.code,
                        label: <CurrencyOptionLabel currencyCode={currency.code} text={currency.code} />,
                      }))}
                    />
                  </Field>
                  {budgetForm.kind !== "expense" ? (
                    <Field>
                      <FieldLabel>{ui.budgetTargetAccount}</FieldLabel>
                      <WorkspaceSelect
                        value={budgetForm.target_account ? String(budgetForm.target_account) : ""}
                        onValueChange={(value) => setBudgetForm((current) => ({ ...current, target_account: Number(value) }))}
                        options={accounts
                          .filter((account) => account.currency === budgetForm.currency)
                          .map((account) => ({
                            value: String(account.id),
                            label: `${account.name} · ${account.currency}`,
                          }))}
                      />
                    </Field>
                  ) : null}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel>{ui.period}</FieldLabel>
                    <WorkspaceSelect
                      value={budgetForm.period}
                      onValueChange={(value) => setBudgetForm((current) => ({ ...current, period: value }))}
                      options={[
                        { value: "monthly", label: ui.monthly },
                        { value: "weekly", label: ui.weekly },
                        { value: "quarterly", label: ui.quarterly },
                        { value: "yearly", label: ui.yearly },
                        { value: "custom", label: ui.customPeriod },
                      ]}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>{ui.budgetAmount}</FieldLabel>
                    <Input value={budgetForm.amount} onChange={(event) => setBudgetForm((current) => ({ ...current, amount: event.target.value }))} />
                  </Field>
                </div>
                {budgetForm.kind === "goal" ? (
                  <Field>
                    <FieldLabel>{ui.budgetTargetAmount}</FieldLabel>
                    <Input
                      value={budgetForm.target_amount ?? ""}
                      onChange={(event) => setBudgetForm((current) => ({ ...current, target_amount: event.target.value || null }))}
                    />
                  </Field>
                ) : null}
                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel>{ui.startDate}</FieldLabel>
                    <DateInput
                      value={budgetForm.start_date}
                      onChange={(nextValue) => setBudgetForm((current) => ({ ...current, start_date: nextValue }))}
                      placeholder={ui.startDate}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>{ui.endDate}</FieldLabel>
                    <DateInput
                      value={budgetForm.end_date}
                      onChange={(nextValue) => setBudgetForm((current) => ({ ...current, end_date: nextValue }))}
                      placeholder={ui.endDate}
                    />
                  </Field>
                </div>
                <Field>
                  <FieldLabel>{ui.threshold}</FieldLabel>
                  <Input
                    value={String(budgetForm.alert_threshold)}
                    onChange={(event) => setBudgetForm((current) => ({ ...current, alert_threshold: Number(event.target.value) }))}
                  />
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{ui.thresholdDescription}</p>
                </Field>
                <Field>
                  <FieldLabel>{ui.notes}</FieldLabel>
                  <Textarea value={budgetForm.note} onChange={(event) => setBudgetForm((current) => ({ ...current, note: event.target.value }))} />
                </Field>
              </div>
            </div>
            <DialogFooter className="border-white/8 bg-white/[0.03]">
              {editingBudget ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="mr-auto rounded-2xl text-rose-300 hover:text-rose-200"
                  onClick={() => setBudgetToDelete(editingBudget)}
                >
                  <RiDeleteBin6Line className="size-4" />
                  {ui.deleteLabel}
                </Button>
              ) : null}
              <Button type="button" variant="outline" onClick={() => setBudgetDialogOpen(false)}>
                {ui.cancel}
              </Button>
              <Button
                type="submit"
                className="bg-emerald-300 text-slate-950"
                disabled={createBudgetMutation.isPending || updateBudgetMutation.isPending}
              >
                {editingBudget ? ui.save : ui.create}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={categoryDialogOpen}
        onOpenChange={(open) => {
          setCategoryDialogOpen(open);
          if (!open) {
            setEditingCategory(null);
          }
        }}
      >
        <DialogContent className="flex h-[min(78vh,40rem)] w-[min(96vw,46rem)] max-w-none flex-col overflow-hidden rounded-[2rem] border-white/10 bg-[#07110c] p-0 text-zinc-100 sm:max-w-none">
          <DialogHeader className="shrink-0 p-8 pb-0">
            <DialogTitle>{editingCategory ? ui.editLabel : ui.createCategory}</DialogTitle>
            <DialogDescription>{ui.manageCategories}</DialogDescription>
          </DialogHeader>
          <form
            className="flex min-h-0 flex-1 flex-col"
            onSubmit={(event) => {
              event.preventDefault();
              if (editingCategory) {
                updateCategoryMutation.mutate({
                  id: editingCategory.id,
                  payload: categoryForm,
                });
                return;
              }
              createCategoryMutation.mutate(categoryForm);
            }}
          >
            <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-6 pt-6">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel>{ui.type}</FieldLabel>
                    <WorkspaceSelect
                      value={categoryForm.kind}
                      onValueChange={(value) => setCategoryForm((current) => ({ ...current, kind: value }))}
                      options={[
                        { value: "expense", label: ui.txTypeExpense },
                        { value: "income", label: ui.txTypeIncome },
                        { value: "transfer", label: ui.txTypeTransfer },
                      ]}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>{ui.categoryName}</FieldLabel>
                    <Input
                      value={categoryForm.name}
                      onChange={(event) =>
                        setCategoryForm((current) => ({
                          ...current,
                          name: event.target.value,
                          slug: slugify(event.target.value),
                        }))
                      }
                    />
                  </Field>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel>{ui.slug}</FieldLabel>
                    <Input value={categoryForm.slug} onChange={(event) => setCategoryForm((current) => ({ ...current, slug: event.target.value }))} />
                  </Field>
                  <Field>
                    <FieldLabel>{ui.status}</FieldLabel>
                    <WorkspaceSelect
                      value={categoryForm.is_active ? "active" : "inactive"}
                      onValueChange={(value) => setCategoryForm((current) => ({ ...current, is_active: value === "active" }))}
                      options={[
                        { value: "active", label: ui.activeLabel },
                        { value: "inactive", label: ui.inactiveLabel },
                      ]}
                    />
                  </Field>
                </div>
                <CategoryAppearancePicker
                  color={categoryForm.color}
                  icon={categoryForm.icon}
                  kind={categoryForm.kind}
                  slug={categoryForm.slug}
                  colorLabel={ui.colorToken}
                  iconLabel={ui.accountIcon}
                  helperText={ui.appearanceHint}
                  clearLabel={ui.clearSelection}
                  onColorChange={(value) => setCategoryForm((current) => ({ ...current, color: value }))}
                  onIconChange={(value) => setCategoryForm((current) => ({ ...current, icon: value }))}
                />
                <Field>
                  <FieldLabel>{ui.notes}</FieldLabel>
                  <Textarea value={categoryForm.description} onChange={(event) => setCategoryForm((current) => ({ ...current, description: event.target.value }))} />
                </Field>
              </div>
            </div>
            <DialogFooter className="border-white/8 bg-white/[0.03]">
              {editingCategory && !editingCategory.is_system ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="mr-auto rounded-2xl text-rose-300 hover:text-rose-200"
                  onClick={() => setCategoryToDelete(editingCategory)}
                >
                  <RiDeleteBin6Line className="size-4" />
                  {ui.deleteLabel}
                </Button>
              ) : null}
              <Button type="button" variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                {ui.cancel}
              </Button>
              <Button
                type="submit"
                className="bg-emerald-300 text-slate-950"
                disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
              >
                {editingCategory ? ui.save : ui.create}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!transactionToDelete} onOpenChange={(open) => !open && setTransactionToDelete(null)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>{ui.deleteTransactionTitle}</AlertDialogTitle>
            <AlertDialogDescription>{ui.deleteTransactionBody}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{ui.cancel}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => transactionToDelete && deleteTransactionMutation.mutate(transactionToDelete.id)}
            >
              {ui.deleteLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!transactionTemplateToDelete} onOpenChange={(open) => !open && setTransactionTemplateToDelete(null)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>{ui.deleteTransactionTemplateTitle}</AlertDialogTitle>
            <AlertDialogDescription>{ui.deleteTransactionTemplateBody}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{ui.cancel}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => transactionTemplateToDelete && deleteTransactionTemplateMutation.mutate(transactionTemplateToDelete.id)}
            >
              {ui.deleteLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!accountToDelete} onOpenChange={(open) => !open && setAccountToDelete(null)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>{ui.deleteAccountTitle}</AlertDialogTitle>
            <AlertDialogDescription>{ui.deleteAccountBody}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{ui.cancel}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => accountToDelete && deleteAccountMutation.mutate(accountToDelete.id)}
            >
              {ui.deleteLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!budgetToDelete} onOpenChange={(open) => !open && setBudgetToDelete(null)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>{ui.deleteBudgetTitle}</AlertDialogTitle>
            <AlertDialogDescription>{ui.deleteBudgetBody}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{ui.cancel}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => budgetToDelete && deleteBudgetMutation.mutate(budgetToDelete.id)}
            >
              {ui.deleteLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>{ui.deleteCategoryTitle}</AlertDialogTitle>
            <AlertDialogDescription>{ui.deleteCategoryBody}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{ui.cancel}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => categoryToDelete && deleteCategoryMutation.mutate(categoryToDelete.id)}
            >
              {ui.deleteLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent className="flex h-[min(86vh,52rem)] w-[min(96vw,54rem)] max-w-none flex-col overflow-hidden rounded-[2rem] border-white/10 bg-[#07110c] p-0 text-zinc-100 sm:max-w-none">
          <DialogHeader className="shrink-0 p-8 pb-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <DialogTitle>{ui.notificationsTitle}</DialogTitle>
                <DialogDescription>{ui.notificationsDescription}</DialogDescription>
              </div>
              {unreadNotificationsCount > 0 ? (
                <Button
                  variant="outline"
                  className="rounded-2xl border-white/10 bg-white/5 text-zinc-100"
                  disabled={markAllNotificationsReadMutation.isPending}
                  onClick={() => markAllNotificationsReadMutation.mutate()}
                >
                  {ui.notificationMarkAllRead}
                </Button>
              ) : null}
            </div>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-8 pt-6">
            <div className="grid gap-3 pr-1">
            {notifications.length === 0 ? (
              <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-black/18 px-4 py-6 text-sm text-zinc-400">
                {ui.noNotifications}
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-[1.4rem] border px-4 py-4 ${
                    notification.is_read
                      ? "border-white/8 bg-black/14"
                      : "border-emerald-300/10 bg-[linear-gradient(180deg,rgba(8,18,14,0.84)_0%,rgba(7,14,11,0.92)_100%)]"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={`rounded-full ${notificationLevelTone(notification.level)}`}>
                          {notificationLevelLabel(notification.level, ui)}
                        </Badge>
                        <Badge variant="outline" className="rounded-full border-white/10 bg-white/5 text-zinc-200">
                          {notificationScopeLabel(notification.scope, ui)}
                        </Badge>
                      </div>
                      <p className="mt-3 text-base font-semibold text-white">{notification.title}</p>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">{notification.body}</p>
                      <p className="mt-3 text-xs uppercase tracking-[0.18em] text-zinc-500">
                        {formatDate(notification.published_at)}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      {!notification.is_read ? (
                        <Button
                          variant="outline"
                          className="rounded-2xl border-white/10 bg-white/5 text-zinc-100"
                          disabled={markNotificationReadMutation.isPending}
                          onClick={() => markNotificationReadMutation.mutate(notification.id)}
                        >
                          {ui.notificationMarkRead}
                        </Button>
                      ) : null}
                      {notification.action_url ? (
                        <Button
                          variant="outline"
                          className="rounded-2xl border-white/10 bg-white/5 text-zinc-100"
                          onClick={() => {
                            if (notification.action_url.startsWith("/")) {
                              const hasLocalePrefix = ["/ru/", "/en/", "/kg/"].some((prefix) =>
                                notification.action_url.startsWith(prefix),
                              );
                              const targetPath = hasLocalePrefix
                                ? notification.action_url
                                : getLocalizedPath(locale, notification.action_url);
                              router.push(targetPath);
                              setNotificationsOpen(false);
                              return;
                            }
                            window.open(notification.action_url, "_blank", "noopener,noreferrer");
                          }}
                        >
                          {notification.action_label || notification.action_url}
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))
            )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!summaryBreakdownModal} onOpenChange={(open) => !open && setSummaryBreakdownModal(null)}>
        <WorkspaceDialogShell
          title={summaryBreakdownModal?.title}
          description={ui.cashFlowLabel}
          contentClassName="h-[min(92vh,64rem)] w-[min(96vw,72rem)]"
          bodyClassName="px-8 pb-8 pt-6"
          className="grid gap-5"
        >
              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel>{ui.startDate}</FieldLabel>
                  <DateInput
                    value={summaryBreakdownModal?.startDate ?? getToday()}
                    onChange={(nextValue) =>
                      setSummaryBreakdownModal((current) =>
                        current
                          ? {
                              ...current,
                              startDate: nextValue,
                              endDate: nextValue > current.endDate ? nextValue : current.endDate,
                            }
                          : current,
                      )
                    }
                    placeholder={ui.startDate}
                  />
                </Field>
                <Field>
                  <FieldLabel>{ui.endDate}</FieldLabel>
                  <DateInput
                    value={summaryBreakdownModal?.endDate ?? getToday()}
                    onChange={(nextValue) =>
                      setSummaryBreakdownModal((current) =>
                        current
                          ? {
                              ...current,
                              endDate: nextValue,
                              startDate: nextValue < current.startDate ? nextValue : current.startDate,
                            }
                          : current,
                      )
                    }
                    placeholder={ui.endDate}
                  />
                </Field>
              </div>

              <div className="grid gap-4 lg:grid-cols-4">
                <PriorityPill
                  label={summaryBreakdownModal?.title ?? ui.cashFlowLabel}
                  value={formatMoney(String(summaryDetailTotal), workspaceSummaryCurrency)}
                />
                <PriorityPill
                  label={ui.currencyBreakdown}
                  value={String(summaryDetailBreakdown.length)}
                />
                <PriorityPill
                  label={ui.category}
                  value={String(summaryDetailCategoryTotals.length)}
                />
                <PriorityPill
                  label={ui.transactions}
                  value={String(summaryDetailTransactions.length)}
                />
              </div>

              <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.currencyBreakdown}</p>
                  {summaryDetailBreakdown.length > 0 ? (
                    summaryDetailBreakdown.map((entry) => (
                      <div
                        key={`${summaryBreakdownModal?.title}-${entry.currency}`}
                        className="flex items-center justify-between rounded-[1.2rem] border border-white/8 bg-black/18 px-4 py-4"
                      >
                        <span className="text-sm font-medium text-zinc-200">{entry.currency}</span>
                        <span className="text-base font-semibold text-white">
                          {formatMoney(String(entry.amount), entry.currency)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <EmptyState text={ui.emptyTransactions} />
                  )}
                </div>

                <div className="space-y-5">
                  <div>
                    <p className="mb-3 text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.categories}</p>
                    <div className="grid gap-3">
                      {summaryDetailCategoryTotals.length > 0 ? (
                        summaryDetailCategoryTotals.map((entry) => (
                          <div key={`${entry.name}-${entry.count}`} className="rounded-[1.2rem] border border-white/8 bg-black/18 px-4 py-4">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-sm font-medium text-white">{entry.name}</p>
                                <p className="mt-1 text-xs text-zinc-500">{entry.count}</p>
                              </div>
                              <p className="text-sm font-semibold text-zinc-100">
                                {formatMoney(String(entry.amount), workspaceSummaryCurrency)}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <EmptyState text={ui.emptyCategories} />
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.transactions}</p>
                    <div className="grid gap-3">
                      {summaryDetailTransactions.length > 0 ? (
                        summaryDetailTransactions.map((transaction) => {
                          const signedValue =
                            summaryBreakdownModal?.kind === "expense"
                              ? `-${transaction.amount}`
                              : summaryBreakdownModal?.kind === "net"
                                ? transactionSignedValue(transaction)
                                : transaction.amount;

                          return (
                            <div key={`summary-transaction-${transaction.id}`} className="rounded-[1.2rem] border border-white/8 bg-black/18 px-4 py-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium text-white">
                                    {transactionDisplayTitle(transaction, ui)}
                                  </p>
                                  <p className="mt-1 text-xs text-zinc-500">
                                    {formatDate(transaction.occurred_on)} · {transaction.category_name || ui.transferLabel} · {transaction.account_name}
                                  </p>
                                </div>
                                <p className={`text-sm font-semibold ${signedValue.startsWith("-") ? "text-rose-300" : "text-emerald-300"}`}>
                                  {formatMoney(signedValue, transaction.currency)}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <EmptyState text={ui.emptyTransactions} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
        </WorkspaceDialogShell>
      </Dialog>

      <Dialog open={allRatesOpen} onOpenChange={setAllRatesOpen}>
        <WorkspaceDialogShell
          title={ui.marketRates}
          description={ui.allRatesDescription}
          contentClassName="h-[min(88vh,920px)] w-[min(96vw,78rem)]"
          bodyClassName="px-6 pb-6 pt-5"
        >
            <div className="mb-5 max-w-md">
              <Input
                value={ratesSearchQuery}
                onChange={(event) => setRatesSearchQuery(event.target.value)}
                placeholder={ui.searchRatesPlaceholder}
                className="rounded-2xl border-white/10 bg-black/18 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>
            <div className="grid gap-3 pr-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredExchangeRates.length > 0 ? filteredExchangeRates.map((rate) => (
              <div key={`all-rate-${rate.id}`} className="rounded-[1.4rem] border border-white/8 bg-black/18 px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white">
                      <span className="inline-flex items-center gap-2">
                        <CurrencyFlag currencyCode={rate.base_currency.code} />
                        <span>{rate.base_currency.code}</span>
                        <span className="text-zinc-500">/</span>
                        <CurrencyFlag currencyCode={rate.quote_currency.code} />
                        <span>{rate.quote_currency.code}</span>
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                      <span className="inline-flex items-center gap-2">
                        <span>1</span>
                        <CurrencyFlag currencyCode={rate.base_currency.code} />
                        <span>{rate.base_currency.code}</span>
                      </span>
                    </p>
                  </div>
                  <Badge variant="outline" className="rounded-full border-white/10 text-zinc-200">
                    <span className="inline-flex items-center gap-2">
                      <CurrencyFlag currencyCode={rate.quote_currency.code} />
                      <span>{rate.quote_currency.code}</span>
                    </span>
                  </Badge>
                </div>
                <p className="mt-4 text-2xl font-semibold text-white">{formatRate(rate.rate)}</p>
                <p className="mt-2 text-sm text-zinc-500">
                  {ui.latestRateSnapshot}: {formatDate(rate.rate_date)}
                </p>
              </div>
            )) : (
              <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-black/18 px-4 py-6 text-sm text-zinc-400 md:col-span-2 xl:col-span-3 2xl:col-span-4">
                {exchangeRates.length > 0 ? ui.noRatesMatch : ui.noRatesAvailable}
              </div>
            )}
            </div>
        </WorkspaceDialogShell>
      </Dialog>
    </main>
  );
}
