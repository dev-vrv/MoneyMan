"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import { RiFlashlightLine } from "react-icons/ri";

import { CryptoAssetIcon } from "@/components/workspace/crypto-asset-icon";
import type { UiCopy } from "@/components/workspace/finance-workspace.types";
import { CurrencyFlag, CurrencyOptionLabel } from "@/components/workspace/currency-flag";
import { WorkspaceSelect } from "@/components/workspace/finance-workspace-ui";
import { formatDate, formatDateTime, formatRate } from "@/components/workspace/finance-workspace.utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CryptoMarketAssetRecord, CurrencyRecord, ExchangeRateRecord } from "@/lib/api/finance";

const premiumCtaClassName =
  "relative overflow-hidden rounded-2xl border border-cyan-300/28 bg-[linear-gradient(135deg,rgba(34,211,238,0.2)_0%,rgba(56,189,248,0.14)_35%,rgba(129,140,248,0.18)_100%)] text-cyan-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_0_1px_rgba(56,189,248,0.08),0_10px_30px_rgba(14,165,233,0.18),0_0_36px_rgba(59,130,246,0.12)] transition-all duration-300 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_left_center,rgba(255,255,255,0.2),transparent_42%)] before:opacity-70 before:content-[''] hover:border-cyan-200/44 hover:text-cyan-50 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_0_1px_rgba(103,232,249,0.14),0_16px_42px_rgba(14,165,233,0.24),0_0_52px_rgba(99,102,241,0.18)]";

type WorkspaceRatesSectionProps = {
  ui: UiCopy;
  isPremium: boolean;
  currencies: CurrencyRecord[];
  exchangeRates: ExchangeRateRecord[];
  featuredFilteredExchangeRates: ExchangeRateRecord[];
  filteredExchangeRates: ExchangeRateRecord[];
  cryptoAssets: Array<CryptoMarketAssetRecord & { usdt_price_label: string | null }>;
  featuredCryptoAssets: Array<CryptoMarketAssetRecord & { usdt_price_label: string | null }>;
  filteredCryptoAssets: Array<CryptoMarketAssetRecord & { usdt_price_label: string | null }>;
  exchangeRatesLoading: boolean;
  cryptoAssetsLoading: boolean;
  cryptoProvider: "binance" | "okx" | "bybit" | "kraken";
  cryptoProviderError: string | null;
  ratesComparisonCurrency: string;
  onRatesComparisonCurrencyChange: (value: string) => void;
  ratesSearchQuery: string;
  onRatesSearchChange: (value: string) => void;
  onOpenPremiumDialog: () => void;
};

export function WorkspaceRatesSection({
  ui,
  isPremium,
  currencies,
  exchangeRates,
  featuredFilteredExchangeRates,
  filteredExchangeRates,
  cryptoAssets,
  featuredCryptoAssets,
  filteredCryptoAssets,
  exchangeRatesLoading,
  cryptoAssetsLoading,
  cryptoProvider,
  cryptoProviderError,
  ratesComparisonCurrency,
  onRatesComparisonCurrencyChange,
  ratesSearchQuery,
  onRatesSearchChange,
  onOpenPremiumDialog,
}: WorkspaceRatesSectionProps) {
  const [fiatExpanded, setFiatExpanded] = useState(false);
  const [cryptoExpanded, setCryptoExpanded] = useState(false);
  const visibleFiatRates = fiatExpanded ? filteredExchangeRates : featuredFilteredExchangeRates;
  const hiddenFiatRatesCount = Math.max(filteredExchangeRates.length - visibleFiatRates.length, 0);
  const visibleCryptoAssets = cryptoExpanded ? filteredCryptoAssets : featuredCryptoAssets;
  const hiddenCryptoAssetsCount = Math.max(filteredCryptoAssets.length - visibleCryptoAssets.length, 0);
  const cryptoProviderLabel = {
    binance: ui.cryptoProviderBinance,
    okx: ui.cryptoProviderOkx,
    bybit: ui.cryptoProviderBybit,
    kraken: ui.cryptoProviderKraken,
  }[cryptoProvider];
  const showFiatLoading = exchangeRatesLoading && exchangeRates.length === 0;
  const showCryptoLoading = cryptoAssetsLoading && cryptoAssets.length === 0;

  return (
    <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
      <CardHeader className="p-6">
        <CardTitle className="text-white">{ui.marketRates}</CardTitle>
        <CardDescription className="text-zinc-400">{ui.marketRatesDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6 pt-0">
        {!isPremium ? (
          <div className="flex flex-col gap-3 rounded-[1.4rem] border border-sky-300/14 bg-sky-300/[0.06] p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-sky-100">{ui.premiumRatesUpsell}</p>
              <p className="mt-1 text-sm text-sky-100/70">{ui.premiumFeaturePriorityRates}</p>
            </div>
            <Button type="button" className={premiumCtaClassName} onClick={onOpenPremiumDialog}>
              <RiFlashlightLine className="relative z-10 size-4" />
              <span className="relative z-10">{ui.premiumUpgrade}</span>
            </Button>
          </div>
        ) : null}
        <div className="max-w-xl">
          <Input
            value={ratesSearchQuery}
            onChange={(event: ChangeEvent<HTMLInputElement>) => onRatesSearchChange(event.target.value)}
            placeholder={ui.searchRatesPlaceholder}
            className="rounded-2xl border-white/10 bg-black/18 text-zinc-100 placeholder:text-zinc-500"
          />
        </div>
        <Tabs defaultValue="fiat" className="gap-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <TabsList className="grid w-full grid-cols-2 rounded-2xl border border-white/10 bg-black/18 p-1 lg:max-w-sm">
              <TabsTrigger className="rounded-[1rem] text-zinc-300 data-active:bg-white/10 data-active:text-white" value="fiat">
                {ui.fiatRatesTitle}
              </TabsTrigger>
              <TabsTrigger className="rounded-[1rem] text-zinc-300 data-active:bg-white/10 data-active:text-white" value="crypto">
                {ui.cryptoRatesTitle}
              </TabsTrigger>
            </TabsList>
            <div className="w-full lg:w-[18rem]">
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.ratesComparisonCurrency}</p>
              <WorkspaceSelect
                value={ratesComparisonCurrency}
                onValueChange={onRatesComparisonCurrencyChange}
                options={currencies.map((currency) => ({
                  value: currency.code,
                  label: <CurrencyOptionLabel currencyCode={currency.code} text={`${currency.code} · ${currency.name}`} />,
                }))}
              />
            </div>
          </div>
          <TabsContent value="fiat" className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-zinc-500">
                {ui.fiatRatesDescriptionWithCurrency.replace("{currency}", ratesComparisonCurrency)}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {showFiatLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={`fiat-skeleton-${index}`} className="rounded-[1.4rem] border border-white/8 bg-black/18 px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <Skeleton className="h-6 w-24 rounded-full bg-white/8" />
                      <Skeleton className="h-6 w-20 rounded-full bg-white/8" />
                    </div>
                    <Skeleton className="mt-3 h-8 w-28 rounded-xl bg-white/8" />
                    <Skeleton className="mt-2 h-4 w-32 rounded-xl bg-white/8" />
                  </div>
                ))
              ) : visibleFiatRates.length > 0 ? (
                visibleFiatRates.map((rate) => (
                  <div key={rate.id} className="rounded-[1.4rem] border border-white/8 bg-black/18 px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="inline-flex items-center gap-2 text-sm text-zinc-400">
                        <span>1</span>
                        <CurrencyFlag currencyCode={rate.base_currency.code} />
                        <span>{rate.base_currency.code}</span>
                      </p>
                      <Badge variant="outline" className="inline-flex h-8 shrink-0 items-center rounded-full border-white/10 px-3 text-zinc-200">
                        <span className="inline-flex items-center gap-2">
                          <CurrencyFlag currencyCode={rate.quote_currency.code} />
                          <span>{rate.quote_currency.code}</span>
                        </span>
                      </Badge>
                    </div>
                    <p className="mt-3 text-2xl font-semibold text-white">{formatRate(rate.rate)}</p>
                    <p className="mt-2 text-sm text-zinc-500">
                      {ui.latestRateSnapshot}: {formatDate(rate.rate_date)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-black/18 px-4 py-6 text-sm text-zinc-400 md:col-span-2 xl:col-span-3">
                  {exchangeRates.length > 0 ? ui.noRatesMatch : ui.noRatesAvailable}
                </div>
              )}
            </div>
            {showFiatLoading ? <p className="text-sm text-zinc-500">{ui.ratesLoading}</p> : null}
            {filteredExchangeRates.length > featuredFilteredExchangeRates.length ? (
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-2xl border-white/10 bg-white/5 text-zinc-100 hover:bg-white/[0.08]"
                onClick={() => setFiatExpanded((current) => !current)}
              >
                {fiatExpanded ? ui.showLessCategories : ui.showMoreCategories.replace("{count}", String(hiddenFiatRatesCount))}
              </Button>
            ) : null}
          </TabsContent>
          <TabsContent value="crypto" className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-zinc-500">{ui.cryptoRatesDescription}</p>
              <Badge variant="outline" className="inline-flex h-8 shrink-0 items-center rounded-full border-white/10 bg-white/5 px-3 text-zinc-200">
                {cryptoProviderLabel}
              </Badge>
            </div>
            {cryptoProviderError ? (
              <div className="rounded-[1.4rem] border border-dashed border-amber-300/20 bg-amber-300/[0.06] px-4 py-4 text-sm text-amber-100">
                {ui.providerUnavailable}: {cryptoProviderError}
              </div>
            ) : null}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {showCryptoLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={`crypto-skeleton-${index}`} className="rounded-[1.4rem] border border-white/8 bg-black/18 px-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <Skeleton className="h-6 w-28 rounded-full bg-white/8" />
                        <Skeleton className="mt-2 h-4 w-20 rounded-xl bg-white/8" />
                      </div>
                      <Skeleton className="h-6 w-16 rounded-full bg-white/8" />
                    </div>
                    <Skeleton className="mt-4 h-8 w-32 rounded-xl bg-white/8" />
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <Skeleton className="h-4 w-16 rounded-xl bg-white/8" />
                      <Skeleton className="h-4 w-20 rounded-xl bg-white/8" />
                    </div>
                    <Skeleton className="mt-2 h-4 w-32 rounded-xl bg-white/8" />
                  </div>
                ))
              ) : visibleCryptoAssets.length > 0 ? (
                visibleCryptoAssets.map((asset) => {
                  const isPositive = Number(asset.price_change_24h) >= 0;

                  return (
                    <div key={`${asset.provider}-${asset.symbol}`} className="rounded-[1.4rem] border border-white/8 bg-black/18 px-4 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="inline-flex items-center gap-3 text-sm font-medium text-white">
                            <CryptoAssetIcon icon={asset.icon} symbol={asset.symbol} color={asset.color} />
                            <span className="truncate">{asset.symbol}</span>
                          </p>
                          <p className="mt-2 text-sm text-zinc-500">{asset.name}</p>
                        </div>
                        <Badge variant="outline" className="inline-flex h-8 shrink-0 items-center rounded-full border-white/10 px-3 text-zinc-200">
                          {asset.quote_currency}
                        </Badge>
                      </div>
                      <p className="mt-4 text-2xl font-semibold text-white">{formatRate(asset.price)}</p>
                      <div className="mt-3 space-y-1.5 text-sm">
                        <div className="flex items-center justify-between gap-3 text-zinc-400">
                          <span>{ui.priceInLabel.replace("{currency}", asset.quote_currency)}</span>
                          <span className="text-zinc-100">{formatRate(asset.price)}</span>
                        </div>
                        {asset.usdt_price_label ? (
                          <div className="flex items-center justify-between gap-3 text-zinc-400">
                            <span>{ui.priceInUsdtLabel}</span>
                            <span className="text-zinc-100">{asset.usdt_price_label}</span>
                          </div>
                        ) : null}
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                        <span className={isPositive ? "text-emerald-300" : "text-rose-300"}>
                          {ui.priceChange24hLabel}:{" "}
                          {Number(asset.price_change_24h) > 0 ? "+" : ""}
                          {asset.price_change_24h}%
                        </span>
                        <span className="text-zinc-500">{asset.quote_currency}</span>
                      </div>
                      <p className="mt-2 text-sm text-zinc-500">
                        {ui.latestRateSnapshot}: {formatDateTime(asset.last_updated)}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-black/18 px-4 py-6 text-sm text-zinc-400 md:col-span-2 xl:col-span-3">
                  {cryptoAssets.length > 0 ? ui.noRatesMatch : ui.noRatesAvailable}
                </div>
              )}
            </div>
            {showCryptoLoading ? <p className="text-sm text-zinc-500">{ui.ratesLoading}</p> : null}
            {filteredCryptoAssets.length > featuredCryptoAssets.length ? (
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-2xl border-white/10 bg-white/5 text-zinc-100 hover:bg-white/[0.08]"
                onClick={() => setCryptoExpanded((current) => !current)}
              >
                {cryptoExpanded ? ui.showLessCategories : ui.showMoreCategories.replace("{count}", String(hiddenCryptoAssetsCount))}
              </Button>
            ) : null}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
