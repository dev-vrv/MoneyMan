"use client";

import { useState } from "react";

import { RiAddLine, RiDeleteBin6Line, RiFlashlightLine, RiGlobalLine, RiPencilLine, RiUserSettingsLine } from "react-icons/ri";

import { resolveCategoryAppearance, resolveCategoryIcon } from "@/components/workspace/category-appearance-picker";
import type { CashFlowChartMode, UiCopy } from "@/components/workspace/finance-workspace.types";
import { EmptyState, PriorityPill, WorkspaceSelect } from "@/components/workspace/finance-workspace-ui";
import { createProfileForm, localeDisplayLabel, statusTone, transactionTypeLabel } from "@/components/workspace/finance-workspace.utils";
import { WorkspaceDialogShell } from "@/components/workspace/workspace-dialog-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CurrencyOptionLabel } from "@/components/workspace/currency-flag";
import type { CategoryRecord, CurrencyRecord, SubscriptionPlanRecord } from "@/lib/api/finance";
import { locales, type Locale } from "@/lib/i18n/config";

type ProfileFormState = ReturnType<typeof createProfileForm>;

const premiumCtaClassName =
  "relative overflow-hidden rounded-2xl border border-emerald-300/24 bg-[linear-gradient(135deg,rgba(16,185,129,0.18)_0%,rgba(52,211,153,0.12)_42%,rgba(163,230,53,0.14)_100%)] text-emerald-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_0_1px_rgba(52,211,153,0.08),0_10px_30px_rgba(6,95,70,0.2),0_0_36px_rgba(16,185,129,0.1)] transition-all duration-300 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_left_center,rgba(255,255,255,0.16),transparent_42%)] before:opacity-70 before:content-[''] hover:border-emerald-200/40 hover:text-emerald-50 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_0_1px_rgba(110,231,183,0.14),0_16px_42px_rgba(6,95,70,0.26),0_0_52px_rgba(16,185,129,0.16)]";

type WorkspaceSettingsSectionProps = {
  ui: UiCopy;
  locale: Locale;
  isPremium: boolean;
  currencies: CurrencyRecord[];
  subscriptionPlans: Array<
    SubscriptionPlanRecord & {
      display_currency: string;
      display_amount: number;
      display_price_label: string;
      usd_price_label: string;
    }
  >;
  selectedSubscriptionPlan: (SubscriptionPlanRecord & {
    display_currency: string;
    display_amount: number;
    display_price_label: string;
    usd_price_label: string;
  }) | null;
  categories: CategoryRecord[];
  filteredCategories: CategoryRecord[];
  categorySearchQuery: string;
  categorySourceFilter: "all" | "system" | "custom";
  categoryKindFilter: "all" | "income" | "expense" | "transfer";
  systemCategoriesCount: number;
  customCategoriesCount: number;
  activeProfileForm: ProfileFormState;
  updateProfilePending: boolean;
  onDefaultCurrencyChange: (value: string) => void;
  onCashFlowChartModeChange: (value: CashFlowChartMode) => void;
  onCryptoMarketProviderChange: (value: "binance" | "okx" | "bybit" | "kraken") => void;
  onOpenCategoryDialog: () => void;
  onCategorySearchChange: (value: string) => void;
  onCategorySourceFilterChange: (value: "all" | "system" | "custom") => void;
  onCategoryKindFilterChange: (value: "all" | "income" | "expense" | "transfer") => void;
  onOpenCategoryEditDialog: (category: CategoryRecord) => void;
  onDeleteCategoryRequest: (category: CategoryRecord) => void;
  onLocaleChange: (locale: Locale) => void;
  onOpenPremiumDialog: () => void;
  onUpdateProfileFormState: (updater: (current: ProfileFormState) => ProfileFormState) => void;
  onSaveProfile: () => void;
};

export function WorkspaceSettingsSection({
  ui,
  locale,
  isPremium,
  currencies,
  subscriptionPlans,
  selectedSubscriptionPlan,
  categories,
  filteredCategories,
  categorySearchQuery,
  categorySourceFilter,
  categoryKindFilter,
  systemCategoriesCount,
  customCategoriesCount,
  activeProfileForm,
  updateProfilePending,
  onDefaultCurrencyChange,
  onCashFlowChartModeChange,
  onCryptoMarketProviderChange,
  onOpenCategoryDialog,
  onCategorySearchChange,
  onCategorySourceFilterChange,
  onCategoryKindFilterChange,
  onOpenCategoryEditDialog,
  onDeleteCategoryRequest,
  onLocaleChange,
  onOpenPremiumDialog,
  onUpdateProfileFormState,
  onSaveProfile,
}: WorkspaceSettingsSectionProps) {
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [operationsDialogOpen, setOperationsDialogOpen] = useState(false);
  const visibleCategories = categoriesExpanded ? filteredCategories : filteredCategories.slice(0, 6);
  const hiddenCategoriesCount = Math.max(filteredCategories.length - visibleCategories.length, 0);

  return (
    <div className="space-y-6">
      <Card className="surface-panel relative rounded-[2rem] border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(110,231,183,0.1),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.018)_100%)] py-0">
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(110,231,183,0.34),transparent)]" />
        <CardHeader className="gap-5 p-7 lg:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/18 bg-amber-300/10 px-3 py-1 text-xs font-medium text-amber-100">
              {ui.premiumBadge}
            </div>
            <Badge
              variant="outline"
              className={`w-fit rounded-full px-3 py-1 ${
                isPremium
                  ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
                  : "border-white/10 bg-white/5 text-zinc-200"
              }`}
            >
              {isPremium ? ui.premiumPlanStatusPremium : ui.premiumPlanStatusFree}
            </Badge>
          </div>
          <div className="max-w-4xl space-y-3">
            <CardTitle className="text-[1.35rem] leading-tight text-white sm:text-[1.65rem]">
              {ui.premiumPlanTitle}
            </CardTitle>
            <CardDescription className="max-w-3xl text-[0.95rem] leading-7 text-zinc-300">
              {ui.premiumPlanBody}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 p-7 pt-0 xl:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.9fr)] lg:p-8 lg:pt-0">
          <div className="grid gap-5">
            <div className="rounded-[1.7rem] border border-white/8 bg-[linear-gradient(180deg,rgba(10,16,20,0.94)_0%,rgba(8,12,16,0.98)_100%)] p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{ui.premiumHistoryRetention}</p>
              <p className="mt-3 text-[1.75rem] font-semibold leading-tight text-white">
                {isPremium ? ui.premiumHistoryPremium : ui.premiumHistoryFree}
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">{ui.premiumFeatureUnlimitedHistory}</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {subscriptionPlans.length > 0 ? subscriptionPlans.slice(0, 2).map((plan) => (
                <div
                  key={plan.code}
                  className={`rounded-[1.5rem] px-5 py-5 ${
                    plan.is_highlighted
                      ? "border border-emerald-300/12 bg-emerald-300/[0.06]"
                      : "border border-white/8 bg-white/[0.03]"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className={`text-xs uppercase tracking-[0.2em] ${plan.is_highlighted ? "text-emerald-100/70" : "text-zinc-500"}`}>
                        {plan.name}
                      </p>
                      <p className={`mt-3 text-2xl font-semibold leading-tight ${plan.is_highlighted ? "text-emerald-50" : "text-white"}`}>
                        {plan.display_price_label}
                      </p>
                      <p className="mt-2 text-xs text-zinc-500">
                        {plan.duration_label} · {plan.usd_price_label}
                      </p>
                    </div>
                    {plan.is_highlighted ? (
                      <Badge variant="outline" className="rounded-full border-emerald-300/16 bg-emerald-300/10 text-emerald-100">
                        {ui.premiumSaveBadge}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              )) : (
                <div className="lg:col-span-2">
                  <EmptyState text={ui.notAvailable} />
                </div>
              )}
            </div>
          </div>
          <div className="flex h-full flex-col gap-5 rounded-[1.7rem] border border-emerald-300/12 bg-[linear-gradient(180deg,rgba(16,185,129,0.08)_0%,rgba(8,16,12,0.72)_100%)] p-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-100/70">{selectedSubscriptionPlan?.name ?? ui.premiumBadge}</p>
              <p className="text-lg font-semibold leading-tight text-emerald-50">
                {isPremium ? ui.premiumManage : ui.premiumUpgrade}
              </p>
              <p className="text-sm leading-7 text-emerald-100/70">
                {selectedSubscriptionPlan
                  ? `${selectedSubscriptionPlan.display_price_label} · ${selectedSubscriptionPlan.duration_label}`
                  : ui.premiumCheckoutNote}
              </p>
            </div>
            <div className="grid gap-3 rounded-[1.4rem] border border-white/8 bg-black/18 p-4">
              <p className="text-sm font-medium text-white">{ui.premiumFeatureAdvancedAnalytics}</p>
              <p className="text-sm leading-6 text-zinc-400">{ui.premiumFeaturePriorityRates}</p>
            </div>
            <div className="mt-auto">
              <Button className={`${premiumCtaClassName} h-12 w-full justify-center`} onClick={onOpenPremiumDialog}>
                <RiFlashlightLine className="relative z-10 size-4" />
                <span className="relative z-10">{isPremium ? ui.premiumManage : ui.premiumUpgrade}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(19rem,0.72fr)_minmax(0,1.28fr)]">
        <Card className="surface-panel sticky top-6 rounded-[2rem] border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(163,230,53,0.06),transparent_24%),linear-gradient(180deg,rgba(14,20,16,0.88)_0%,rgba(8,13,10,0.94)_100%)] py-0">
          <CardHeader className="space-y-5 p-6">
            <div className="space-y-3">
              <CardTitle className="text-white">{ui.operationsCenter}</CardTitle>
              <CardDescription className="max-w-md text-sm leading-6 text-zinc-400">{ui.operationsDescription}</CardDescription>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              <PriorityPill label={ui.systemLabel} value={ui.systemCategoriesValue.replace("{count}", String(systemCategoriesCount))} />
              <PriorityPill label={ui.customLabel} value={ui.customCategoriesValue.replace("{count}", String(customCategoriesCount))} />
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-[rgba(12,18,26,0.76)] p-4">
              <p className="max-w-sm text-sm leading-6 text-zinc-400">{ui.manageCategories}</p>
              <Button
                className="mt-4 h-auto min-h-11 w-full whitespace-normal rounded-2xl bg-emerald-300 px-4 py-3 text-center text-slate-950"
                onClick={() => setOperationsDialogOpen(true)}
              >
                <RiAddLine className="size-4" />
                {ui.categorySettingsTitle}
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
          <CardHeader className="p-6">
            <CardTitle className="text-white">{ui.interfaceSettingsTitle}</CardTitle>
            <CardDescription className="max-w-3xl text-zinc-400">{ui.interfaceSettingsBody}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                onSaveProfile();
              }}
            >
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="space-y-4 rounded-[1.6rem] border border-white/8 bg-black/18 p-5">
                  <div>
                    <p className="text-sm font-medium text-white">{ui.profileSettingsTitle}</p>
                    <p className="mt-1 text-sm text-zinc-400">{ui.profileSettingsBody}</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field>
                      <FieldLabel>{ui.firstName}</FieldLabel>
                      <Input value={activeProfileForm.first_name} onChange={(event) => onUpdateProfileFormState((current) => ({ ...current, first_name: event.target.value }))} />
                    </Field>
                    <Field>
                      <FieldLabel>{ui.lastName}</FieldLabel>
                      <Input value={activeProfileForm.last_name} onChange={(event) => onUpdateProfileFormState((current) => ({ ...current, last_name: event.target.value }))} />
                    </Field>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field>
                      <FieldLabel>{ui.email}</FieldLabel>
                      <Input type="email" value={activeProfileForm.email} disabled readOnly />
                    </Field>
                    <Field>
                      <FieldLabel>{ui.phone}</FieldLabel>
                      <Input value={activeProfileForm.phone} onChange={(event) => onUpdateProfileFormState((current) => ({ ...current, phone: event.target.value }))} />
                    </Field>
                  </div>
                  <label className="flex items-start gap-3 rounded-[1.4rem] border border-white/8 bg-white/[0.03] px-4 py-3 text-zinc-100">
                    <Checkbox
                      checked={activeProfileForm.two_factor_enabled}
                      onCheckedChange={(nextValue) =>
                        onUpdateProfileFormState((current) => ({
                          ...current,
                          two_factor_enabled: Boolean(nextValue),
                        }))
                      }
                      className="mt-0.5 size-4.5 rounded-md border-white/16 bg-white/5 data-checked:border-emerald-300 data-checked:bg-emerald-300 data-checked:text-slate-950"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-white">{ui.twoFactorAuth}</span>
                      <span className="mt-1 block text-sm leading-6 text-zinc-400">{ui.twoFactorAuthDescription}</span>
                    </span>
                  </label>
                </div>

                <div className="space-y-4 rounded-[1.6rem] border border-white/8 bg-black/18 p-5">
                  <div>
                    <p className="text-sm font-medium text-white">{ui.interfaceSettingsTitle}</p>
                    <p className="mt-1 text-sm text-zinc-400">{ui.interfaceSettingsBody}</p>
                  </div>
                  <div className="grid gap-3">
                    {locales.map((targetLocale) => (
                      <Button
                        key={targetLocale}
                        type="button"
                        variant={locale === targetLocale ? "default" : "outline"}
                        className={
                          locale === targetLocale
                            ? "justify-start rounded-2xl bg-emerald-300 text-slate-950"
                            : "justify-start rounded-2xl border-white/10 bg-white/5 text-zinc-100"
                        }
                        onClick={() => onLocaleChange(targetLocale)}
                      >
                        <RiGlobalLine className="size-4" />
                        {ui.interfaceLanguage}: {localeDisplayLabel(targetLocale)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-3">
                <div className="rounded-[1.4rem] border border-white/8 bg-black/18 p-4">
                  <Field>
                    <FieldLabel>{ui.defaultCurrency}</FieldLabel>
                    <WorkspaceSelect
                      value={activeProfileForm.default_currency}
                      onValueChange={onDefaultCurrencyChange}
                      options={currencies.map((currency) => ({
                        value: currency.code,
                        label: <CurrencyOptionLabel currencyCode={currency.code} text={`${currency.code} · ${currency.name}`} />,
                      }))}
                    />
                    <p className="mt-3 text-sm leading-6 text-zinc-400">{ui.defaultCurrencyDescription}</p>
                  </Field>
                </div>
                <div className="rounded-[1.4rem] border border-white/8 bg-black/18 p-4">
                  <Field>
                    <FieldLabel>{ui.defaultCashFlowView}</FieldLabel>
                    <WorkspaceSelect
                      value={activeProfileForm.cash_flow_chart_default}
                      onValueChange={(value) => onCashFlowChartModeChange(value as CashFlowChartMode)}
                      options={[
                        { value: "bars", label: ui.chartBarsView },
                        { value: "line", label: ui.chartLineView },
                        { value: "tradingview", label: ui.chartTradingView },
                        { value: "candles", label: ui.chartCandlesView },
                        { value: "structure", label: ui.chartStructureView },
                      ]}
                    />
                    <p className="mt-3 text-sm leading-6 text-zinc-400">{ui.defaultCashFlowViewDescription}</p>
                  </Field>
                </div>
                <div className="rounded-[1.4rem] border border-white/8 bg-black/18 p-4">
                  <Field>
                    <FieldLabel>{ui.cryptoMarketProvider}</FieldLabel>
                    <WorkspaceSelect
                      value={activeProfileForm.crypto_market_provider}
                      onValueChange={(value) => onCryptoMarketProviderChange(value as "binance" | "okx" | "bybit" | "kraken")}
                      options={[
                        { value: "binance", label: ui.cryptoProviderBinance },
                        { value: "okx", label: ui.cryptoProviderOkx },
                        { value: "bybit", label: ui.cryptoProviderBybit },
                        { value: "kraken", label: ui.cryptoProviderKraken },
                      ]}
                    />
                    <p className="mt-3 text-sm leading-6 text-zinc-400">{ui.cryptoMarketProviderDescription}</p>
                  </Field>
                </div>
              </div>

              <Button type="submit" className="rounded-2xl bg-emerald-300 text-slate-950" disabled={updateProfilePending}>
                <RiUserSettingsLine className="size-4" />
                {ui.saveProfile}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={operationsDialogOpen} onOpenChange={setOperationsDialogOpen}>
        <WorkspaceDialogShell
          title={ui.operationsCenter}
          description={ui.operationsDescription}
          variant="operations"
          contentClassName="h-[min(90vh,58rem)] w-[min(96vw,78rem)]"
          bodyClassName="px-6 pb-6 pt-5 sm:px-7 sm:pb-7"
          className="space-y-5"
        >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-medium text-white">{ui.categorySettingsTitle}</p>
                <p className="mt-1 text-sm leading-6 text-zinc-400">{ui.categorySettingsBody}</p>
              </div>
              <Button className="h-auto min-h-11 whitespace-normal rounded-2xl bg-emerald-300 px-4 py-3 text-slate-950" onClick={onOpenCategoryDialog}>
                <RiAddLine className="size-4" />
                {ui.createCategory}
              </Button>
            </div>
            <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_240px_240px]">
              <Input
                value={categorySearchQuery}
                onChange={(event) => onCategorySearchChange(event.target.value)}
                placeholder={ui.categorySearchPlaceholder}
                className="rounded-2xl border-white/10 bg-black/18 text-zinc-100 placeholder:text-zinc-500"
              />
              <WorkspaceSelect
                value={categorySourceFilter}
                onValueChange={(value) => onCategorySourceFilterChange(value as "all" | "system" | "custom")}
                options={[
                  { value: "all", label: `${ui.categorySourceFilter}: ${ui.categoryAllFilter}` },
                  { value: "system", label: `${ui.categorySourceFilter}: ${ui.categorySystemFilter}` },
                  { value: "custom", label: `${ui.categorySourceFilter}: ${ui.categoryCustomFilter}` },
                ]}
              />
              <WorkspaceSelect
                value={categoryKindFilter}
                onValueChange={(value) => onCategoryKindFilterChange(value as "all" | "income" | "expense" | "transfer")}
                options={[
                  { value: "all", label: `${ui.categoryTypeFilter}: ${ui.categoryAllFilter}` },
                  { value: "income", label: `${ui.categoryTypeFilter}: ${ui.txTypeIncome}` },
                  { value: "expense", label: `${ui.categoryTypeFilter}: ${ui.txTypeExpense}` },
                  { value: "transfer", label: `${ui.categoryTypeFilter}: ${ui.txTypeTransfer}` },
                ]}
              />
              <div className="grid gap-2 sm:grid-cols-3 lg:col-span-3">
                <PriorityPill label={ui.categoryAllFilter} value={ui.totalCategoriesValue.replace("{count}", String(categories.length))} />
                <PriorityPill label={ui.systemLabel} value={ui.systemCategoriesValue.replace("{count}", String(systemCategoriesCount))} />
                <PriorityPill label={ui.customLabel} value={ui.customCategoriesValue.replace("{count}", String(customCategoriesCount))} />
              </div>
            </div>

            <div className="grid gap-2">
              {filteredCategories.length === 0 ? <EmptyState text={ui.emptyCategories} /> : null}
              {visibleCategories.map((category) => {
                const appearance = resolveCategoryAppearance(category.color, category.kind, category.slug);
                const CategoryIcon = resolveCategoryIcon(category.icon, category.kind, category.slug).icon;

                return (
                  <div key={category.id} className="rounded-[1.2rem] border border-white/8 bg-black/18 px-4 py-3">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="inline-flex size-9 shrink-0 items-center justify-center rounded-2xl border bg-black/25"
                            style={{
                              borderColor: appearance.border,
                              boxShadow: `0 0 0 1px ${appearance.glow}, 0 14px 28px -22px ${appearance.glow}`,
                            }}
                          >
                            <CategoryIcon className="size-4.5" style={{ color: appearance.text }} />
                          </span>
                          <p className="text-sm font-semibold text-white">{category.name}</p>
                          <Badge variant="outline" className={`rounded-full ${category.is_system ? statusTone("active") : statusTone("pending")}`}>
                            {category.is_system ? ui.systemLabel : ui.customLabel}
                          </Badge>
                          <Badge variant="outline" className="rounded-full border-white/10 bg-white/5 text-zinc-200">
                            {transactionTypeLabel(category.kind, ui)}
                          </Badge>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                          <span>{category.slug}</span>
                          {category.parent_name ? <span>{ui.category}: {category.parent_name}</span> : null}
                          <span>{category.is_active ? ui.activeLabel : ui.inactiveLabel}</span>
                        </div>
                        {category.description ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">{category.description}</p> : null}
                      </div>
                      {!category.is_system ? (
                        <div className="flex shrink-0 items-center gap-2">
                          <Button variant="ghost" className="rounded-2xl text-zinc-300 hover:text-white" onClick={() => onOpenCategoryEditDialog(category)}>
                            <RiPencilLine className="size-4" />
                            {ui.editLabel}
                          </Button>
                          <Button variant="ghost" className="rounded-2xl text-zinc-300 hover:text-white" onClick={() => onDeleteCategoryRequest(category)}>
                            <RiDeleteBin6Line className="size-4" />
                            {ui.deleteLabel}
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
              {filteredCategories.length > 6 ? (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 w-full rounded-2xl border-white/10 bg-white/5 text-zinc-100 hover:bg-white/[0.08]"
                  onClick={() => setCategoriesExpanded((current) => !current)}
                >
                  {categoriesExpanded
                    ? ui.showLessCategories
                    : ui.showMoreCategories.replace("{count}", String(hiddenCategoriesCount))}
                </Button>
              ) : null}
            </div>
        </WorkspaceDialogShell>
      </Dialog>
    </div>
  );
}
