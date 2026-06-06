import type { AccountRecord, ExchangeRateRecord } from "@/lib/api/finance";

type CurrencyBalance = {
  currency: string;
  amount: number;
};

type AccountBalanceSnapshot = {
  primaryAccount: AccountRecord | null;
  balancesByCurrency: CurrencyBalance[];
  convertedTotal: {
    currency: string;
    amount: number;
    hasAllRates: boolean;
    missingCurrencies: string[];
  } | null;
};

const DEFAULT_TARGET_CURRENCY = "KGS";

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getRateToTargetCurrency(
  currency: string,
  exchangeRates: ExchangeRateRecord[],
  targetCurrency: string,
) {
  if (currency === targetCurrency) {
    return 1;
  }

  const directRate = exchangeRates.find(
    (item) =>
      item.base_currency.code === currency &&
      item.quote_currency.code === targetCurrency,
  );

  if (directRate) {
    return toNumber(directRate.rate);
  }

  const reverseRate = exchangeRates.find(
    (item) =>
      item.base_currency.code === targetCurrency &&
      item.quote_currency.code === currency,
  );

  if (reverseRate) {
    const rate = toNumber(reverseRate.rate);
    return rate > 0 ? 1 / rate : null;
  }

  return null;
}

function getAccountBalanceAmount(account: AccountRecord) {
  return toNumber(account.deposit_profile?.projected_balance ?? account.current_balance);
}

export function buildAccountBalanceSnapshot(
  accounts: AccountRecord[],
  exchangeRates: ExchangeRateRecord[],
  targetCurrency = DEFAULT_TARGET_CURRENCY,
): AccountBalanceSnapshot {
  const activeAccounts = accounts.filter((account) => account.status === "active");
  const rankedAccounts = activeAccounts.slice().sort(
    (left, right) => getAccountBalanceAmount(right) - getAccountBalanceAmount(left),
  );
  const primaryAccount = rankedAccounts[0] ?? null;

  const balancesByCurrencyMap = new Map<string, number>();
  for (const account of activeAccounts) {
    balancesByCurrencyMap.set(
      account.currency,
      (balancesByCurrencyMap.get(account.currency) ?? 0) + getAccountBalanceAmount(account),
    );
  }

  const balancesByCurrency = Array.from(balancesByCurrencyMap.entries())
    .map(([currency, amount]) => ({ currency, amount }))
    .sort((left, right) => right.amount - left.amount);

  let convertedTotal = 0;
  const missingCurrencies: string[] = [];

  for (const entry of balancesByCurrency) {
    const rate = getRateToTargetCurrency(entry.currency, exchangeRates, targetCurrency);
    if (rate === null) {
      missingCurrencies.push(entry.currency);
      continue;
    }

    convertedTotal += entry.amount * rate;
  }

  return {
    primaryAccount,
    balancesByCurrency,
    convertedTotal:
      balancesByCurrency.length > 0
        ? {
            currency: targetCurrency,
            amount: convertedTotal,
            hasAllRates: missingCurrencies.length === 0,
            missingCurrencies,
          }
        : null,
  };
}
