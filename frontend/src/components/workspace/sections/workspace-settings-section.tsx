"use client";

import type { Dispatch, SetStateAction } from "react";

import { RiAddLine, RiDeleteBin6Line, RiGlobalLine, RiPencilLine, RiUserSettingsLine } from "react-icons/ri";

import type { CashFlowChartMode, UiCopy } from "@/components/workspace/finance-workspace.types";
import { EmptyState, PriorityPill, WorkspaceSelect } from "@/components/workspace/finance-workspace-ui";
import { createProfileForm, localeDisplayLabel, statusTone, transactionTypeLabel } from "@/components/workspace/finance-workspace.utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CategoryRecord, CurrencyRecord, WorkspaceOverview } from "@/lib/api/finance";
import { locales, type Locale } from "@/lib/i18n/config";

type ProfileFormState = ReturnType<typeof createProfileForm>;

type WorkspaceSettingsSectionProps = {
  ui: UiCopy;
  locale: Locale;
  user: { email?: string | null; phone?: string | null } | null;
  overview: WorkspaceOverview;
  currencies: CurrencyRecord[];
  categories: CategoryRecord[];
  filteredCategories: CategoryRecord[];
  categorySearchQuery: string;
  categorySourceFilter: "all" | "system" | "custom";
  categoryKindFilter: "all" | "income" | "expense" | "transfer";
  systemCategoriesCount: number;
  customCategoriesCount: number;
  activeProfileForm: ProfileFormState;
  updateProfilePending: boolean;
  setCashFlowChartMode: Dispatch<SetStateAction<CashFlowChartMode | null>>;
  onOpenCategoryDialog: () => void;
  onCategorySearchChange: (value: string) => void;
  onCategorySourceFilterChange: (value: "all" | "system" | "custom") => void;
  onCategoryKindFilterChange: (value: "all" | "income" | "expense" | "transfer") => void;
  onOpenCategoryEditDialog: (category: CategoryRecord) => void;
  onDeleteCategoryRequest: (category: CategoryRecord) => void;
  onLocaleChange: (locale: Locale) => void;
  onUpdateProfileFormState: (updater: (current: ProfileFormState) => ProfileFormState) => void;
  onSaveProfile: () => void;
};

export function WorkspaceSettingsSection({
  ui,
  locale,
  user,
  overview,
  currencies,
  categories,
  filteredCategories,
  categorySearchQuery,
  categorySourceFilter,
  categoryKindFilter,
  systemCategoriesCount,
  customCategoriesCount,
  activeProfileForm,
  updateProfilePending,
  setCashFlowChartMode,
  onOpenCategoryDialog,
  onCategorySearchChange,
  onCategorySourceFilterChange,
  onCategoryKindFilterChange,
  onOpenCategoryEditDialog,
  onDeleteCategoryRequest,
  onLocaleChange,
  onUpdateProfileFormState,
  onSaveProfile,
}: WorkspaceSettingsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="surface-panel rounded-[2rem] border border-white/8 bg-white/[0.04] p-8">
        <h1 className="text-2xl font-semibold text-white">{ui.settingsSectionTitle}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">{ui.settingsSectionBody}</p>
      </div>
      <div>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_360px]">
          <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
            <CardHeader className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle className="text-white">{ui.categorySettingsTitle}</CardTitle>
                  <CardDescription className="text-zinc-400">{ui.categorySettingsBody}</CardDescription>
                </div>
                <Button className="rounded-2xl bg-emerald-300 text-slate-950" onClick={onOpenCategoryDialog}>
                  <RiAddLine className="size-4" />
                  {ui.createCategory}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 p-6 pt-0">
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px_auto]">
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
                <div className="grid grid-cols-3 gap-2 lg:min-w-[16rem]">
                  <PriorityPill label={ui.categoryAllFilter} value={ui.totalCategoriesValue.replace("{count}", String(categories.length))} />
                  <PriorityPill label={ui.systemLabel} value={ui.systemCategoriesValue.replace("{count}", String(systemCategoriesCount))} />
                  <PriorityPill label={ui.customLabel} value={ui.customCategoriesValue.replace("{count}", String(customCategoriesCount))} />
                </div>
              </div>

              <div className="grid gap-2">
                {filteredCategories.length === 0 ? <EmptyState text={ui.emptyCategories} /> : null}
                {filteredCategories.map((category) => (
                  <div key={category.id} className="rounded-[1.3rem] border border-white/8 bg-black/18 px-4 py-3">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-white">{category.name}</p>
                          <Badge variant="outline" className={`rounded-full ${category.is_system ? statusTone("active") : statusTone("pending")}`}>
                            {category.is_system ? ui.systemLabel : ui.customLabel}
                          </Badge>
                          <Badge variant="outline" className="rounded-full border-white/10 bg-white/5 text-zinc-200">
                            {transactionTypeLabel(category.kind, ui)}
                          </Badge>
                          <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[0.72rem] uppercase tracking-[0.16em] text-zinc-500">
                            {category.color}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                          <span>{category.slug}</span>
                          {category.parent_name ? <span>{ui.category}: {category.parent_name}</span> : null}
                          <span>{category.is_active ? ui.activeLabel : ui.inactiveLabel}</span>
                        </div>
                        {category.description ? <p className="mt-2 text-sm leading-6 text-zinc-400">{category.description}</p> : null}
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
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
              <CardHeader className="p-6">
                <CardTitle className="text-white">{ui.interfaceSettingsTitle}</CardTitle>
                <CardDescription className="text-zinc-400">{ui.interfaceSettingsBody}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 p-6 pt-0">
                {locales.map((targetLocale) => (
                  <Button
                    key={targetLocale}
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
                <div className="mt-2 rounded-[1.4rem] border border-white/8 bg-black/18 p-4">
                  <Field>
                    <FieldLabel>{ui.defaultCurrency}</FieldLabel>
                    <WorkspaceSelect
                      value={activeProfileForm.default_currency}
                      onValueChange={(value) => onUpdateProfileFormState((current) => ({ ...current, default_currency: value }))}
                      options={currencies.map((currency) => ({
                        value: currency.code,
                        label: `${currency.code} · ${currency.name}`,
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
                      onValueChange={(value) => {
                        setCashFlowChartMode(value as CashFlowChartMode);
                        onUpdateProfileFormState((current) => ({
                          ...current,
                          cash_flow_chart_default: value as CashFlowChartMode,
                        }));
                      }}
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
              </CardContent>
            </Card>

            <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
              <CardHeader className="p-6">
                <CardTitle className="text-white">{ui.saveProfile}</CardTitle>
                <CardDescription className="text-zinc-400">{ui.settingsDescription}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 p-6 pt-0">
                <PriorityPill label={ui.email} value={user?.email ?? overview.user.email} />
                <PriorityPill label={ui.phone} value={user?.phone || overview.user.phone || ui.notAvailable} />
                <PriorityPill label={ui.interfaceLanguage} value={localeDisplayLabel(locale)} />
                <PriorityPill label={ui.defaultCurrency} value={activeProfileForm.default_currency} />
                <PriorityPill
                  label={ui.defaultCashFlowView}
                  value={
                    activeProfileForm.cash_flow_chart_default === "bars"
                      ? ui.chartBarsView
                      : activeProfileForm.cash_flow_chart_default === "line"
                        ? ui.chartLineView
                        : activeProfileForm.cash_flow_chart_default === "tradingview"
                          ? ui.chartTradingView
                          : activeProfileForm.cash_flow_chart_default === "candles"
                            ? ui.chartCandlesView
                            : ui.chartStructureView
                  }
                />
              </CardContent>
            </Card>
          </div>
        </div>
        <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
          <CardHeader className="p-6">
            <CardTitle className="text-white">{ui.saveProfile}</CardTitle>
            <CardDescription className="text-zinc-400">{ui.settingsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                onSaveProfile();
              }}
            >
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
                  <Input type="email" value={activeProfileForm.email} onChange={(event) => onUpdateProfileFormState((current) => ({ ...current, email: event.target.value }))} />
                </Field>
                <Field>
                  <FieldLabel>{ui.phone}</FieldLabel>
                  <Input value={activeProfileForm.phone} onChange={(event) => onUpdateProfileFormState((current) => ({ ...current, phone: event.target.value }))} />
                </Field>
              </div>
              <Button type="submit" className="rounded-2xl bg-emerald-300 text-slate-950" disabled={updateProfilePending}>
                <RiUserSettingsLine className="size-4" />
                {ui.saveProfile}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
