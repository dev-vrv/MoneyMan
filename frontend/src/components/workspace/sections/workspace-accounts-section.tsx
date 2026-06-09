"use client";

import { useMemo, useState } from "react";
import { RiAddLine } from "react-icons/ri";

import { AccountDetailsDialog } from "@/components/workspace/account-details-dialog";
import type { UiCopy } from "@/components/workspace/finance-workspace.types";
import { AccountCard, EmptyState, WorkspaceSelect } from "@/components/workspace/finance-workspace-ui";
import { formatDate, formatMoney, reportingPeriodLabel, statusTone, taxEntityLabel } from "@/components/workspace/finance-workspace.utils";
import { WorkspaceDialogShell } from "@/components/workspace/workspace-dialog-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateInput } from "@/components/ui/date-input";
import { Dialog } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type {
  AccountRecord,
  CategoryRecord,
  CreateTaxObligationTransactionsPayload,
  TaxObligationRecord,
  TransactionRecord,
  WorkspaceOverview,
} from "@/lib/api/finance";

type TaxTransactionFormState = {
  source_account: string;
  mode: "tax" | "social_fund" | "both";
  status: "draft" | "pending" | "cleared";
  occurred_on: string;
  tax_category: string;
  social_fund_category: string;
  tax_title: string;
  social_fund_title: string;
  tax_merchant: string;
  social_fund_merchant: string;
  description: string;
};

type WorkspaceAccountsSectionProps = {
  ui: UiCopy;
  accounts: AccountRecord[];
  transactions: TransactionRecord[];
  categories: CategoryRecord[];
  overview: WorkspaceOverview;
  onOpenAccountDialog: () => void;
  onOpenAccountEditDialog: (account: AccountRecord) => void;
  onCreateTaxTransactions: (accountId: number, payload: CreateTaxObligationTransactionsPayload) => Promise<unknown>;
  createTaxTransactionsPending: boolean;
};

export function WorkspaceAccountsSection({
  ui,
  accounts,
  transactions,
  categories,
  overview,
  onOpenAccountDialog,
  onOpenAccountEditDialog,
  onCreateTaxTransactions,
  createTaxTransactionsPending,
}: WorkspaceAccountsSectionProps) {
  const [activeObligation, setActiveObligation] = useState<TaxObligationRecord | null>(null);
  const [activeAccount, setActiveAccount] = useState<AccountRecord | null>(null);
  const [taxTransactionErrors, setTaxTransactionErrors] = useState<Record<string, string>>({});
  const expenseCategories = useMemo(
    () => categories.filter((category) => category.kind === "expense" && category.is_active),
    [categories],
  );
  const accountOptions = useMemo(
    () => accounts
      .filter((account) => account.status === "active")
      .map((account) => ({ value: String(account.id), label: `${account.name} · ${account.currency}` })),
    [accounts],
  );
  const categoryOptions = useMemo(
    () => expenseCategories.map((category) => ({ value: String(category.id), label: category.name })),
    [expenseCategories],
  );
  const [taxTransactionForm, setTaxTransactionForm] = useState<TaxTransactionFormState>({
    source_account: "",
    mode: "both",
    status: "pending",
    occurred_on: new Date().toISOString().slice(0, 10),
    tax_category: "",
    social_fund_category: "",
    tax_title: "",
    social_fund_title: "",
    tax_merchant: "",
    social_fund_merchant: "",
    description: "",
  });

  const findCategoryBySlug = (...slugs: string[]) =>
    expenseCategories.find((category) => slugs.includes(category.slug));

  const buildTaxTransactionForm = (obligation: TaxObligationRecord): TaxTransactionFormState => {
    const preferredSourceAccount = accounts.find(
      (account) => account.status === "active" && account.currency === obligation.currency,
    ) ?? accounts.find((account) => account.status === "active") ?? accounts[0];
    const defaultTaxCategory = findCategoryBySlug("taxes", "tax") ?? expenseCategories[0];
    const defaultSocialFundCategory =
      findCategoryBySlug("social-contributions", "social-fund", "fees", "taxes", "tax")
      ?? defaultTaxCategory
      ?? expenseCategories[0];
    const hasTaxAmount = Number(obligation.tax_amount) > 0;
    const hasSocialFundAmount = Number(obligation.social_fund_amount) > 0;

    return {
      source_account: preferredSourceAccount ? String(preferredSourceAccount.id) : "",
      mode: hasTaxAmount && hasSocialFundAmount ? "both" : hasTaxAmount ? "tax" : "social_fund",
      status: "cleared",
      occurred_on: new Date().toISOString().slice(0, 10),
      tax_category: defaultTaxCategory ? String(defaultTaxCategory.id) : "",
      social_fund_category: defaultSocialFundCategory ? String(defaultSocialFundCategory.id) : "",
      tax_title: `${ui.taxLabel} · ${obligation.account_name}`,
      social_fund_title: `${ui.socialFundLabel} · ${obligation.account_name}`,
      tax_merchant: "Налоговая служба",
      social_fund_merchant: "Социальный фонд",
      description: `${taxEntityLabel(obligation.entity_type, ui)} · ${reportingPeriodLabel(obligation.reporting_period, ui)}`,
    };
  };

  const openTaxTransactionDialog = (obligation: TaxObligationRecord) => {
    setTaxTransactionForm(buildTaxTransactionForm(obligation));
    setTaxTransactionErrors({});
    setActiveObligation(obligation);
  };

  const handleCreateTaxTransactions = async () => {
    if (!activeObligation) {
      return;
    }

    const nextErrors: Record<string, string> = {};
    if (!taxTransactionForm.source_account) {
      nextErrors.source_account = ui.selectSourceAccount;
    }
    if (
      (taxTransactionForm.mode === "tax" || taxTransactionForm.mode === "both")
      && !taxTransactionForm.tax_category
    ) {
      nextErrors.tax_category = ui.selectCategory;
    }
    if (
      (taxTransactionForm.mode === "social_fund" || taxTransactionForm.mode === "both")
      && !taxTransactionForm.social_fund_category
    ) {
      nextErrors.social_fund_category = ui.selectCategory;
    }

    if (Object.keys(nextErrors).length > 0) {
      setTaxTransactionErrors(nextErrors);
      return;
    }

    try {
      await onCreateTaxTransactions(activeObligation.account_id, {
        source_account: Number(taxTransactionForm.source_account),
        mode: taxTransactionForm.mode,
        status: taxTransactionForm.status,
        occurred_on: taxTransactionForm.occurred_on,
        obligation_period_start: activeObligation.period_start,
        obligation_period_end: activeObligation.period_end,
        tax_category: taxTransactionForm.tax_category ? Number(taxTransactionForm.tax_category) : null,
        social_fund_category: taxTransactionForm.social_fund_category ? Number(taxTransactionForm.social_fund_category) : null,
        tax_title: taxTransactionForm.tax_title,
        social_fund_title: taxTransactionForm.social_fund_title,
        tax_merchant: taxTransactionForm.tax_merchant,
        social_fund_merchant: taxTransactionForm.social_fund_merchant,
        description: taxTransactionForm.description,
      });
      setActiveObligation(null);
    } catch {
      return;
    }
  };

  return (
    <>
      <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
        <CardHeader className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-white">{ui.accounts}</CardTitle>
              <CardDescription className="text-zinc-400">{ui.manageAccounts}</CardDescription>
            </div>
            <Button className="rounded-2xl bg-emerald-300 text-slate-950" onClick={onOpenAccountDialog}>
              <RiAddLine className="size-4" />
              {ui.createAccount}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid auto-rows-fr gap-4 p-6 pt-0 md:grid-cols-2">
          {accounts.length === 0 ? <EmptyState text={ui.emptyAccounts} /> : null}
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              ui={ui}
              className="h-full"
              onEdit={onOpenAccountEditDialog}
              onOpen={(nextAccount) => setActiveAccount(nextAccount)}
            />
          ))}
        </CardContent>
      </Card>

      <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
        <CardHeader className="p-6">
          <CardTitle className="text-white">{ui.taxCalendar}</CardTitle>
          <CardDescription className="text-zinc-400">{ui.taxCalendarDescription}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 p-6 pt-0 lg:grid-cols-2">
          {overview.tax_obligations.length === 0 ? (
            <div className="lg:col-span-2">
              <EmptyState text={ui.noTaxProfiles} />
            </div>
          ) : (
            overview.tax_obligations.map((obligation) => (
              <div key={`${obligation.account_id}-${obligation.due_date}`} className="rounded-[1.4rem] border border-white/8 bg-black/18 px-4 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white">{obligation.account_name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">
                      {taxEntityLabel(obligation.entity_type, ui)} · {reportingPeriodLabel(obligation.reporting_period, ui)}
                    </p>
                    <p className="mt-2 text-sm text-zinc-400">
                      {formatDate(obligation.period_start)} - {formatDate(obligation.period_end)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline" className={`rounded-full ${obligation.days_left <= 7 ? statusTone("pending") : statusTone("active")}`}>
                      {ui.taxDueBy.replace("{date}", formatDate(obligation.due_date))}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`rounded-full ${
                        obligation.payment_status === "cleared"
                          ? statusTone("active")
                          : obligation.payment_status === "partial"
                            ? statusTone("pending")
                            : "border-white/10 bg-white/5 text-zinc-200"
                      }`}
                    >
                      {obligation.payment_status === "cleared"
                        ? ui.taxObligationSettled
                        : obligation.payment_status === "partial"
                          ? ui.taxObligationPartial
                          : ui.taxObligationOpen}
                    </Badge>
                  </div>
                </div>
                <p className="mt-4 text-2xl font-semibold text-white">{formatMoney(obligation.total_amount, obligation.currency)}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                      {obligation.calculation_source === "transactions" ? ui.receivedLabel : ui.taxBaseLabel}
                    </p>
                    <p className="mt-1 text-sm text-zinc-200">{formatMoney(obligation.tax_base, obligation.currency)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.taxLabel}</p>
                    <p className="mt-1 text-sm text-zinc-200">
                      {formatMoney(obligation.tax_amount, obligation.currency)} · {Number(obligation.tax_rate)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.socialFundLabel}</p>
                    <p className="mt-1 text-sm text-zinc-200">
                      {formatMoney(obligation.social_fund_amount, obligation.currency)} · {Number(obligation.social_fund_rate)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.periodResultLabel}</p>
                    <p className="mt-1 text-sm font-medium text-zinc-100">
                      {formatMoney(obligation.total_amount, obligation.currency)}
                    </p>
                  </div>
                </div>
                {obligation.can_create_payment ? (
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      className="h-10 rounded-2xl border-white/10 bg-white/5 px-4 text-zinc-100 transition hover:border-white/16 hover:bg-white/[0.08]"
                      onClick={() => openTaxTransactionDialog(obligation)}
                    >
                      {ui.createTaxPayment}
                    </Button>
                  </div>
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <AccountDetailsDialog
        account={activeAccount}
        transactions={transactions}
        ui={ui}
        onClose={() => setActiveAccount(null)}
        onEdit={onOpenAccountEditDialog}
      />

      <Dialog
        open={Boolean(activeObligation)}
        onOpenChange={(open) => {
          if (!open) {
            setActiveObligation(null);
          }
        }}
      >
        <WorkspaceDialogShell
          title={ui.createTaxPayment}
          description={ui.createTaxPaymentDescription}
          variant="tax"
          contentClassName="h-[min(88vh,56rem)] w-[min(96vw,72rem)]"
          bodyClassName="p-6"
        >
          {activeObligation ? (
            <div className="grid gap-4">
              <div className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-sm font-medium text-white">{activeObligation.account_name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">
                  {taxEntityLabel(activeObligation.entity_type, ui)} · {reportingPeriodLabel(activeObligation.reporting_period, ui)}
                </p>
                <p className="mt-2 text-sm text-zinc-300">
                  {formatDate(activeObligation.period_start)} - {formatDate(activeObligation.period_end)}
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {formatMoney(activeObligation.total_amount, activeObligation.currency)}
                </p>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                <Field>
                  <FieldLabel>{ui.taxPaymentModeLabel}</FieldLabel>
                  <WorkspaceSelect
                    value={taxTransactionForm.mode}
                    onValueChange={(value) => {
                      setTaxTransactionErrors((current) => ({ ...current, mode: "" }));
                      setTaxTransactionForm((current) => ({
                        ...current,
                        mode: value as TaxTransactionFormState["mode"],
                      }));
                    }}
                    options={[
                      { value: "tax", label: ui.taxPaymentModeTax },
                      { value: "social_fund", label: ui.taxPaymentModeSocialFund },
                      { value: "both", label: ui.taxPaymentModeBoth },
                    ]}
                  />
                </Field>
                <Field>
                  <FieldLabel>{ui.status}</FieldLabel>
                  <WorkspaceSelect
                    value={taxTransactionForm.status}
                    onValueChange={(value) =>
                      setTaxTransactionForm((current) => ({
                        ...current,
                        status: value as TaxTransactionFormState["status"],
                      }))
                    }
                    options={[
                      { value: "draft", label: ui.txStatusDraft },
                      { value: "pending", label: ui.txStatusPending },
                      { value: "cleared", label: ui.txStatusCleared },
                    ]}
                  />
                </Field>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                <Field>
                  <FieldLabel>{ui.sourceAccountLabel}</FieldLabel>
                  <WorkspaceSelect
                    value={taxTransactionForm.source_account || undefined}
                    onValueChange={(value) => {
                      setTaxTransactionErrors((current) => ({ ...current, source_account: "" }));
                      setTaxTransactionForm((current) => ({ ...current, source_account: value }));
                    }}
                    placeholder={ui.selectSourceAccount}
                    invalid={Boolean(taxTransactionErrors.source_account)}
                    options={accountOptions}
                  />
                  <FieldError>{taxTransactionErrors.source_account}</FieldError>
                </Field>
                <Field>
                  <FieldLabel>{ui.date}</FieldLabel>
                  <DateInput
                    value={taxTransactionForm.occurred_on}
                    onChange={(value) => setTaxTransactionForm((current) => ({ ...current, occurred_on: value }))}
                    placeholder={ui.date}
                  />
                </Field>
              </div>

              {taxTransactionForm.mode === "tax" || taxTransactionForm.mode === "both" ? (
                <div className="grid gap-4 xl:grid-cols-3">
                  <Field>
                    <FieldLabel>{ui.taxCategoryLabel}</FieldLabel>
                    <WorkspaceSelect
                      value={taxTransactionForm.tax_category || undefined}
                      onValueChange={(value) => {
                        setTaxTransactionErrors((current) => ({ ...current, tax_category: "" }));
                        setTaxTransactionForm((current) => ({ ...current, tax_category: value }));
                      }}
                      placeholder={ui.selectCategory}
                      invalid={Boolean(taxTransactionErrors.tax_category)}
                      options={categoryOptions}
                    />
                    <FieldError>{taxTransactionErrors.tax_category}</FieldError>
                  </Field>
                  <Field>
                    <FieldLabel>{ui.taxTitleLabel}</FieldLabel>
                    <Input
                      value={taxTransactionForm.tax_title}
                      onChange={(event) => setTaxTransactionForm((current) => ({ ...current, tax_title: event.target.value }))}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>{ui.taxMerchantLabel}</FieldLabel>
                    <Input
                      value={taxTransactionForm.tax_merchant}
                      onChange={(event) => setTaxTransactionForm((current) => ({ ...current, tax_merchant: event.target.value }))}
                    />
                  </Field>
                </div>
              ) : null}

              {taxTransactionForm.mode === "social_fund" || taxTransactionForm.mode === "both" ? (
                <div className="grid gap-4 xl:grid-cols-3">
                  <Field>
                    <FieldLabel>{ui.socialFundCategoryLabel}</FieldLabel>
                    <WorkspaceSelect
                      value={taxTransactionForm.social_fund_category || undefined}
                      onValueChange={(value) => {
                        setTaxTransactionErrors((current) => ({ ...current, social_fund_category: "" }));
                        setTaxTransactionForm((current) => ({ ...current, social_fund_category: value }));
                      }}
                      placeholder={ui.selectCategory}
                      invalid={Boolean(taxTransactionErrors.social_fund_category)}
                      options={categoryOptions}
                    />
                    <FieldError>{taxTransactionErrors.social_fund_category}</FieldError>
                  </Field>
                  <Field>
                    <FieldLabel>{ui.socialFundTitleLabel}</FieldLabel>
                    <Input
                      value={taxTransactionForm.social_fund_title}
                      onChange={(event) => setTaxTransactionForm((current) => ({ ...current, social_fund_title: event.target.value }))}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>{ui.socialFundMerchantLabel}</FieldLabel>
                    <Input
                      value={taxTransactionForm.social_fund_merchant}
                      onChange={(event) => setTaxTransactionForm((current) => ({ ...current, social_fund_merchant: event.target.value }))}
                    />
                  </Field>
                </div>
              ) : null}

              <Field>
                <FieldLabel>{ui.notes}</FieldLabel>
                <Textarea
                  value={taxTransactionForm.description}
                  onChange={(event) => setTaxTransactionForm((current) => ({ ...current, description: event.target.value }))}
                />
              </Field>
              <p className="text-xs text-zinc-500">{ui.createLinkedTransactionsLabel}</p>
              <div className="flex flex-wrap justify-end gap-3 pt-2">
                <Button variant="ghost" className="rounded-2xl" onClick={() => setActiveObligation(null)}>
                  {ui.cancel}
                </Button>
                <Button
                  className="rounded-2xl bg-emerald-300 text-slate-950 hover:bg-emerald-200"
                  disabled={createTaxTransactionsPending}
                  onClick={handleCreateTaxTransactions}
                >
                  {ui.createTaxPayment}
                </Button>
              </div>
            </div>
          ) : null}
        </WorkspaceDialogShell>
      </Dialog>
    </>
  );
}
