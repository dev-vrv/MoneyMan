"use client";

import type { ChangeEvent } from "react";

import type { UiCopy } from "@/components/workspace/finance-workspace.types";
import { CurrencyFlag } from "@/components/workspace/currency-flag";
import { formatDate, formatRate } from "@/components/workspace/finance-workspace.utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ExchangeRateRecord } from "@/lib/api/finance";

type WorkspaceRatesSectionProps = {
  ui: UiCopy;
  exchangeRates: ExchangeRateRecord[];
  featuredExchangeRates: ExchangeRateRecord[];
  featuredFilteredExchangeRates: ExchangeRateRecord[];
  filteredExchangeRates: ExchangeRateRecord[];
  ratesSearchQuery: string;
  onRatesSearchChange: (value: string) => void;
  onOpenAllRates: () => void;
};

export function WorkspaceRatesSection({
  ui,
  exchangeRates,
  featuredExchangeRates,
  featuredFilteredExchangeRates,
  filteredExchangeRates,
  ratesSearchQuery,
  onRatesSearchChange,
  onOpenAllRates,
}: WorkspaceRatesSectionProps) {
  return (
    <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
      <CardHeader className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-white">{ui.marketRates}</CardTitle>
            <CardDescription className="text-zinc-400">{ui.marketRatesDescription}</CardDescription>
          </div>
          {exchangeRates.length > featuredExchangeRates.length ? (
            <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-zinc-100" onClick={onOpenAllRates}>
              {ui.allRatesAction}
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-6 pt-0">
        <div className="max-w-md">
          <Input
            value={ratesSearchQuery}
            onChange={(event: ChangeEvent<HTMLInputElement>) => onRatesSearchChange(event.target.value)}
            placeholder={ui.searchRatesPlaceholder}
            className="rounded-2xl border-white/10 bg-black/18 text-zinc-100 placeholder:text-zinc-500"
          />
        </div>
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.primaryRatesLabel}</p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredFilteredExchangeRates.length > 0 ? (
              featuredFilteredExchangeRates.map((rate) => (
                <div key={rate.id} className="rounded-[1.4rem] border border-white/8 bg-black/18 px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="inline-flex items-center gap-2 text-sm text-zinc-400">
                      <span>1</span>
                      <CurrencyFlag currencyCode={rate.base_currency.code} />
                      <span>{rate.base_currency.code}</span>
                    </p>
                    <Badge variant="outline" className="rounded-full border-white/10 text-zinc-200">
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
        </div>
        {filteredExchangeRates.length > featuredFilteredExchangeRates.length ? (
          <div className="rounded-[1.4rem] border border-white/8 bg-black/18 px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white">{ui.allRatesAction}</p>
                <p className="mt-1 text-sm text-zinc-500">{ui.allRatesDescription}</p>
              </div>
              <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-zinc-100" onClick={onOpenAllRates}>
                {filteredExchangeRates.length}
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
