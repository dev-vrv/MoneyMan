import axios from "axios";

import { apiClient } from "@/lib/api/client";

export type WorkspaceOverview = {
  user: {
    email: string;
    phone: string;
    display_name: string;
  };
  summary: {
    net_worth: string;
    monthly_income: string;
    monthly_expenses: string;
    savings_rate: number;
    scheduled_outflow: string;
    attention_count: number;
  };
  accounts: Array<{
    id: number;
    name: string;
    kind: string;
    institution: string;
    currency: string;
    balance: string;
    color_token: string;
    status: string;
  }>;
  budgets: Array<{
    id: number;
    category: string;
    spent: string;
    limit: string;
    utilization_percent: number;
    remaining: string;
    alert_threshold: number;
  }>;
  transactions: Array<{
    id: number;
    title: string;
    merchant: string;
    amount: string;
    status: string;
    category: string;
    account: string;
    transaction_date: string;
    note: string;
  }>;
  tax_obligations: Array<{
    account_id: number;
    account_name: string;
    currency: string;
    entity_type: "entrepreneur" | "company";
    template_code: string;
    calculation_source: "transactions" | "manual";
    reporting_period: "monthly" | "quarterly" | "yearly";
    period_start: string;
    period_end: string;
    due_date: string;
    tax_base: string;
    tax_rate: string;
    tax_amount: string;
    social_fund_rate: string;
    social_fund_amount: string;
    total_amount: string;
    days_left: number;
    required_components: Array<"tax" | "social_fund">;
    settled_components: Array<"tax" | "social_fund">;
    payment_status: "open" | "partial" | "cleared";
    can_create_payment: boolean;
  }>;
  widgets: Array<{
    title: string;
    value: string;
    description: string;
  }>;
};

export type TaxObligationRecord = WorkspaceOverview["tax_obligations"][number];

export type CurrencyRecord = {
  code: string;
  name: string;
  symbol: string;
  flag_emoji: string;
  numeric_code: string;
  decimal_places: number;
  is_active: boolean;
  is_default: boolean;
};

export type CategoryRecord = {
  id: number;
  parent: number | null;
  parent_name: string | null;
  kind: "income" | "expense" | "transfer";
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
  is_system: boolean;
  is_active: boolean;
  is_editable: boolean;
  created_at: string;
  updated_at: string;
};

export type ExchangeRateRecord = {
  id: number;
  base_currency: CurrencyRecord;
  quote_currency: CurrencyRecord;
  rate: string;
  rate_date: string;
  source: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CryptoMarketAssetRecord = {
  symbol: string;
  name: string;
  icon: string;
  color: string;
  asset_type: "coin" | "token" | "stablecoin" | "wrapped" | "other";
  rank: number;
  price: string;
  price_change_24h: string;
  quote_currency: string;
  provider: "binance" | "okx" | "bybit" | "kraken";
  last_updated: string;
};

export type MarketSnapshotRecord = {
  provider: "binance" | "okx" | "bybit" | "kraken";
  provider_error: string | null;
  fiat_rates: ExchangeRateRecord[];
  crypto_assets: CryptoMarketAssetRecord[];
  crypto_updated_at: string | null;
};

export type NotificationRecord = {
  id: number;
  scope: "personal" | "broadcast";
  level: "info" | "success" | "warning" | "error";
  title: string;
  body: string;
  action_label: string;
  action_url: string;
  is_active: boolean;
  published_at: string;
  expires_at: string | null;
  is_read: boolean;
  created_at: string;
  updated_at: string;
};

export type SubscriptionPlanRecord = {
  id: number;
  code: string;
  name: string;
  description: string;
  duration_value: number;
  duration_unit: "day" | "month" | "year";
  duration_label: string;
  price_usd: string;
  currency: "USD";
  is_highlighted: boolean;
  features: string[];
};

export type AccountRecord = {
  id: number;
  currency: string;
  currency_name: string;
  name: string;
  kind: string;
  status: string;
  institution: string;
  account_number_mask: string;
  iban: string;
  note: string;
  icon: string;
  color: string;
  include_in_net_worth: boolean;
  opening_balance: string;
  current_balance: string;
  credit_limit: string;
  available_credit: string | null;
  deposit_profile: {
    id: number;
    annual_interest_rate: string;
    interest_payout_frequency: "monthly" | "quarterly" | "yearly" | "at_maturity";
    day_count_convention: "actual_365" | "actual_366" | "actual_actual" | "thirty_360";
    term_start_date: string;
    maturity_date: string | null;
    capitalization_enabled: boolean;
    auto_renewal: boolean;
    allow_top_up: boolean;
    allow_partial_withdrawal: boolean;
    recurring_contribution_amount: string;
    recurring_contribution_frequency: "none" | "monthly" | "quarterly" | "yearly";
    recurring_contribution_day: number;
    minimum_balance: string;
    note: string;
    is_active: boolean;
    principal_balance: string;
    accrued_interest: string;
    capitalized_interest: string;
    paid_out_interest: string;
    projected_balance: string;
    annual_yield_amount: string;
    effective_date: string;
    is_matured: boolean;
  } | null;
  tax_profile: {
    id: number;
    entity_type: "entrepreneur" | "company";
    template_code: string;
    calculation_source: "transactions" | "manual";
    reporting_period: "monthly" | "quarterly" | "yearly";
    due_day: number;
    tax_rate: string;
    social_fund_rate: string;
    manual_tax_base: string | null;
    manual_tax_amount: string | null;
    manual_social_fund_amount: string | null;
    period_start: string;
    period_end: string;
    due_date: string;
    tax_base: string;
    tax_amount: string;
    social_fund_amount: string;
    total_amount: string;
    note: string;
    is_active: boolean;
  } | null;
  created_at: string;
  updated_at: string;
};

export type CryptoNetworkRecord = {
  id: number;
  name: string;
  code: string;
  chain_id: string;
  protocol: string;
  native_symbol: string;
  icon: string;
  color: string;
  explorer_url: string;
  is_evm: boolean;
  is_system: boolean;
  is_active: boolean;
  is_editable: boolean;
  created_at: string;
  updated_at: string;
};

export type CryptoAssetRecord = {
  id: number;
  symbol: string;
  name: string;
  slug: string;
  asset_type: "coin" | "token" | "stablecoin" | "wrapped" | "other";
  decimals: number;
  icon: string;
  color: string;
  coingecko_id: string;
  cmc_slug: string;
  description: string;
  is_system: boolean;
  is_active: boolean;
  is_editable: boolean;
  created_at: string;
  updated_at: string;
};

export type CryptoAssetNetworkRecord = {
  id: number;
  asset: number;
  asset_symbol: string;
  network: number;
  network_code: string;
  contract_address: string;
  token_standard: string;
  decimals_override: number | null;
  is_native: boolean;
  deposit_enabled: boolean;
  withdrawal_enabled: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CryptoWalletRecord = {
  id: number;
  network: number;
  network_name: string;
  name: string;
  wallet_type: "software" | "hardware" | "exchange" | "defi" | "custodial" | "watch_only" | "other";
  provider: string;
  address: string;
  address_label: string;
  xpub: string;
  note: string;
  color: string;
  is_active: boolean;
  is_watch_only: boolean;
  last_synced_at: string | null;
  sync_status: "idle" | "pending" | "synced" | "error";
  last_sync_error: string;
  created_at: string;
  updated_at: string;
};

export type CryptoHoldingRecord = {
  id: number;
  wallet: number;
  wallet_name: string;
  asset: number;
  asset_symbol: string;
  asset_network: number | null;
  network_code: string;
  wallet_address: string;
  balance: string;
  available_balance: string;
  locked_balance: string;
  average_cost: string | null;
  cost_basis: string | null;
  last_price: string | null;
  price_currency: string | null;
  last_synced_at: string | null;
  is_tracked: boolean;
  created_at: string;
  updated_at: string;
};

export type TransactionRecord = {
  id: number;
  account: number;
  destination_account: number | null;
  category: number | null;
  type: "income" | "expense" | "transfer";
  status: "draft" | "pending" | "cleared" | "canceled";
  amount: string;
  destination_amount: string | null;
  exchange_rate: string | null;
  title: string;
  merchant: string;
  description: string;
  occurred_on: string;
  posted_at: string | null;
  cleared_at: string | null;
  external_reference: string;
  idempotency_key: string;
  currency: string;
  account_name: string;
  destination_account_name: string | null;
  category_name: string | null;
  created_at: string;
  updated_at: string;
};

export type TransactionTemplateRecord = {
  id: number;
  name: string;
  account: number;
  account_name: string;
  destination_account: number | null;
  destination_account_name: string | null;
  category: number | null;
  category_name: string | null;
  currency: string;
  type: "income" | "expense" | "transfer";
  status: "draft" | "pending" | "cleared" | "canceled";
  amount: string;
  destination_amount: string | null;
  exchange_rate: string | null;
  title: string;
  merchant: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
  updated_at: string;
};

export type BudgetRecord = {
  id: number;
  kind: "expense" | "saving" | "goal";
  name: string;
  category: number | null;
  category_name: string | null;
  currency: string;
  currency_name: string;
  period: "weekly" | "monthly" | "quarterly" | "yearly" | "custom";
  amount: string;
  target_amount: string | null;
  spent_amount: string;
  utilization_percent: number;
  target_account: number | null;
  target_account_name: string | null;
  start_date: string;
  end_date: string;
  alert_threshold: number;
  rollover_enabled: boolean;
  is_active: boolean;
  note: string;
  created_at: string;
  updated_at: string;
};

export type CreateAccountPayload = {
  currency: string;
  name: string;
  kind: string;
  status: string;
  institution: string;
  account_number_mask: string;
  iban: string;
  note: string;
  icon: string;
  color: string;
  include_in_net_worth: boolean;
  opening_balance: string;
  credit_limit: string;
  tax_profile?: {
    tax_rate: string;
    social_fund_rate: string;
    template_code?: string;
    calculation_source?: "transactions" | "manual";
    manual_tax_base?: string | null;
    manual_tax_amount?: string | null;
    manual_social_fund_amount?: string | null;
    note: string;
    is_active: boolean;
  };
  deposit_profile?: {
    annual_interest_rate: string;
    interest_payout_frequency: "monthly" | "quarterly" | "yearly" | "at_maturity";
    day_count_convention: "actual_365" | "actual_366" | "actual_actual" | "thirty_360";
    term_start_date: string;
    maturity_date?: string | null;
    capitalization_enabled: boolean;
    auto_renewal: boolean;
    allow_top_up: boolean;
    allow_partial_withdrawal: boolean;
    recurring_contribution_amount: string;
    recurring_contribution_frequency: "none" | "monthly" | "quarterly" | "yearly";
    recurring_contribution_day: number;
    minimum_balance: string;
    note: string;
    is_active: boolean;
  };
};

export type CreateTransactionPayload = {
  account: number;
  template_id?: number | null;
  destination_account?: number | null;
  category?: number | null;
  type: string;
  status: string;
  amount: string;
  destination_amount?: string | null;
  exchange_rate?: string | null;
  title: string;
  merchant: string;
  description: string;
  occurred_on: string;
  external_reference?: string;
  idempotency_key?: string;
};

export type CreateTransactionTemplatePayload = {
  name: string;
  account: number;
  destination_account?: number | null;
  category?: number | null;
  type: string;
  status: string;
  amount: string;
  destination_amount?: string | null;
  exchange_rate?: string | null;
  title: string;
  merchant: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
  is_active: boolean;
};

export type CreateTaxObligationTransactionsPayload = {
  source_account: number;
  mode: "tax" | "social_fund" | "both";
  status: "draft" | "pending" | "cleared";
  occurred_on: string;
  obligation_period_start: string;
  obligation_period_end: string;
  tax_category?: number | null;
  social_fund_category?: number | null;
  tax_title?: string;
  social_fund_title?: string;
  tax_merchant?: string;
  social_fund_merchant?: string;
  description?: string;
};

export type CreateTaxObligationTransactionsResponse = {
  obligation: TaxObligationRecord;
  transactions: TransactionRecord[];
};

export type CreateBudgetPayload = {
  kind: "expense" | "saving" | "goal";
  name: string;
  category?: number | null;
  currency: string;
  period: string;
  amount: string;
  target_amount?: string | null;
  target_account?: number | null;
  start_date: string;
  end_date: string;
  alert_threshold: number;
  rollover_enabled: boolean;
  is_active: boolean;
  note: string;
};

export type CreateCategoryPayload = {
  parent?: number | null;
  kind: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
  is_active: boolean;
};

export type CreateCryptoNetworkPayload = {
  name: string;
  code: string;
  chain_id: string;
  protocol: string;
  native_symbol: string;
  icon: string;
  color: string;
  explorer_url: string;
  is_evm: boolean;
  is_active: boolean;
};

export type CreateCryptoAssetPayload = {
  symbol: string;
  name: string;
  slug: string;
  asset_type: "coin" | "token" | "stablecoin" | "wrapped" | "other";
  decimals: number;
  icon: string;
  color: string;
  coingecko_id: string;
  cmc_slug: string;
  description: string;
  is_active: boolean;
};

export type CreateCryptoWalletPayload = {
  network: number;
  name: string;
  wallet_type: "software" | "hardware" | "exchange" | "defi" | "custodial" | "watch_only" | "other";
  provider: string;
  address: string;
  address_label: string;
  xpub: string;
  note: string;
  color: string;
  is_active: boolean;
  is_watch_only: boolean;
};

export type CreateCryptoHoldingPayload = {
  wallet: number;
  asset: number;
  asset_network?: number | null;
  wallet_address: string;
  balance: string;
  available_balance: string;
  locked_balance: string;
  average_cost?: string | null;
  cost_basis?: string | null;
  last_price?: string | null;
  price_currency?: string | null;
  is_tracked: boolean;
};

export function extractApiErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : "Request failed.";
  }

  const payload = error.response?.data;
  if (!payload || typeof payload !== "object") {
    return error.message;
  }

  for (const value of Object.values(payload)) {
    if (Array.isArray(value) && value[0]) {
      return String(value[0]);
    }
    if (typeof value === "string") {
      return value;
    }
  }

  return error.message;
}

export async function fetchWorkspaceOverview() {
  const { data } = await apiClient.get<WorkspaceOverview>("/workspace/overview/");
  return data;
}

export async function fetchCurrencies() {
  const { data } = await apiClient.get<CurrencyRecord[]>("/finance/currencies/");
  return data;
}

export async function fetchExchangeRates(params?: {
  base_currency?: string;
  quote_currency?: string;
}) {
  const { data } = await apiClient.get<ExchangeRateRecord[]>("/finance/exchange-rates/", {
    params,
  });
  return data;
}

export async function fetchMarketSnapshot(params?: {
  provider?: "binance" | "okx" | "bybit" | "kraken";
  quote_currency?: string;
}) {
  const { data } = await apiClient.get<MarketSnapshotRecord>("/finance/market-snapshot/", {
    params,
  });
  return data;
}

export async function fetchNotifications() {
  const { data } = await apiClient.get<NotificationRecord[]>("/finance/notifications/");
  return data;
}

export async function fetchSubscriptionPlans() {
  const { data } = await apiClient.get<SubscriptionPlanRecord[]>("/subscriptions/plans/");
  return data;
}

export async function markNotificationRead(id: number) {
  const { data } = await apiClient.post<NotificationRecord>(`/finance/notifications/${id}/mark-read/`);
  return data;
}

export async function markAllNotificationsRead() {
  await apiClient.post("/finance/notifications/mark-all-read/");
}

export async function fetchCategories() {
  const { data } = await apiClient.get<CategoryRecord[]>("/finance/categories/");
  return data;
}

export async function fetchAccounts() {
  const { data } = await apiClient.get<AccountRecord[]>("/finance/accounts/");
  return data;
}

export async function fetchCryptoNetworks() {
  const { data } = await apiClient.get<CryptoNetworkRecord[]>("/finance/crypto-networks/");
  return data;
}

export async function fetchCryptoAssets() {
  const { data } = await apiClient.get<CryptoAssetRecord[]>("/finance/crypto-assets/");
  return data;
}

export async function fetchCryptoAssetNetworks(params?: {
  asset?: number;
  network?: number;
}) {
  const { data } = await apiClient.get<CryptoAssetNetworkRecord[]>("/finance/crypto-asset-networks/", {
    params,
  });
  return data;
}

export async function fetchCryptoWallets() {
  const { data } = await apiClient.get<CryptoWalletRecord[]>("/finance/crypto-wallets/");
  return data;
}

export async function fetchCryptoHoldings() {
  const { data } = await apiClient.get<CryptoHoldingRecord[]>("/finance/crypto-holdings/");
  return data;
}

export async function fetchTransactions() {
  const { data } = await apiClient.get<TransactionRecord[]>("/finance/transactions/");
  return data;
}

export async function fetchTransactionTemplates() {
  const { data } = await apiClient.get<TransactionTemplateRecord[]>("/finance/transaction-templates/");
  return data;
}

export async function fetchBudgets() {
  const { data } = await apiClient.get<BudgetRecord[]>("/finance/budgets/");
  return data;
}

export async function createAccount(payload: CreateAccountPayload) {
  const { data } = await apiClient.post<AccountRecord>("/finance/accounts/", payload);
  return data;
}

export async function createCryptoNetwork(payload: CreateCryptoNetworkPayload) {
  const { data } = await apiClient.post<CryptoNetworkRecord>("/finance/crypto-networks/", payload);
  return data;
}

export async function createCryptoAsset(payload: CreateCryptoAssetPayload) {
  const { data } = await apiClient.post<CryptoAssetRecord>("/finance/crypto-assets/", payload);
  return data;
}

export async function createCryptoWallet(payload: CreateCryptoWalletPayload) {
  const { data } = await apiClient.post<CryptoWalletRecord>("/finance/crypto-wallets/", payload);
  return data;
}

export async function createCryptoHolding(payload: CreateCryptoHoldingPayload) {
  const { data } = await apiClient.post<CryptoHoldingRecord>("/finance/crypto-holdings/", payload);
  return data;
}

export async function updateAccount(id: number, payload: Partial<CreateAccountPayload>) {
  const { data } = await apiClient.patch<AccountRecord>(`/finance/accounts/${id}/`, payload);
  return data;
}

export async function deleteAccount(id: number) {
  await apiClient.delete(`/finance/accounts/${id}/`);
}

export async function createTransaction(payload: CreateTransactionPayload) {
  const { data } = await apiClient.post<TransactionRecord>("/finance/transactions/", payload);
  return data;
}

export async function createTaxObligationTransactions(
  accountId: number,
  payload: CreateTaxObligationTransactionsPayload,
) {
  const { data } = await apiClient.post<CreateTaxObligationTransactionsResponse>(
    `/finance/accounts/${accountId}/create-tax-transactions/`,
    payload,
  );
  return data;
}

export async function updateTransaction(id: number, payload: Partial<CreateTransactionPayload>) {
  const { data } = await apiClient.patch<TransactionRecord>(`/finance/transactions/${id}/`, payload);
  return data;
}

export async function deleteTransaction(id: number) {
  await apiClient.delete(`/finance/transactions/${id}/`);
}

export async function createTransactionTemplate(payload: CreateTransactionTemplatePayload) {
  const { data } = await apiClient.post<TransactionTemplateRecord>("/finance/transaction-templates/", payload);
  return data;
}

export async function updateTransactionTemplate(id: number, payload: Partial<CreateTransactionTemplatePayload>) {
  const { data } = await apiClient.patch<TransactionTemplateRecord>(`/finance/transaction-templates/${id}/`, payload);
  return data;
}

export async function deleteTransactionTemplate(id: number) {
  await apiClient.delete(`/finance/transaction-templates/${id}/`);
}

export async function createBudget(payload: CreateBudgetPayload) {
  const { data } = await apiClient.post<BudgetRecord>("/finance/budgets/", payload);
  return data;
}

export async function updateBudget(id: number, payload: Partial<CreateBudgetPayload>) {
  const { data } = await apiClient.patch<BudgetRecord>(`/finance/budgets/${id}/`, payload);
  return data;
}

export async function deleteBudget(id: number) {
  await apiClient.delete(`/finance/budgets/${id}/`);
}

export async function createCategory(payload: CreateCategoryPayload) {
  const { data } = await apiClient.post<CategoryRecord>("/finance/categories/", payload);
  return data;
}

export async function updateCategory(id: number, payload: Partial<CreateCategoryPayload>) {
  const { data } = await apiClient.patch<CategoryRecord>(`/finance/categories/${id}/`, payload);
  return data;
}

export async function deleteCategory(id: number) {
  await apiClient.delete(`/finance/categories/${id}/`);
}
