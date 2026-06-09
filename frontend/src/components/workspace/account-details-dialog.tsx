"use client";

import { useMemo, useState } from "react";
import { RiCloseLine, RiPencilLine } from "react-icons/ri";

import { resolveAccountAppearance } from "@/components/workspace/account-appearance-picker";
import type { UiCopy } from "@/components/workspace/finance-workspace.types";
import { EmptyState, WorkspaceSelect } from "@/components/workspace/finance-workspace-ui";
import {
  accountKindLabel,
  formatDate,
  formatMoney,
  reportingPeriodLabel,
  statusTone,
  taxEntityLabel,
  transactionDisplayTitle,
  transactionStatusLabel,
  transactionTypeLabel,
} from "@/components/workspace/finance-workspace.utils";
import { WorkspaceDialogShell } from "@/components/workspace/workspace-dialog-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/ui/date-input";
import { Dialog } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { AccountRecord, TransactionRecord } from "@/lib/api/finance";

function taxTemplateLabel(templateCode: string) {
  if (templateCode === "kg_ip_simplified_4") {
    return "КР ИП 4%";
  }
  if (templateCode === "kg_social_fund") {
    return "Соцфонд КР";
  }
  if (templateCode === "custom") {
    return "Custom";
  }
  return templateCode;
}

type AccountDetailsDialogProps = {
  account: AccountRecord | null;
  transactions: TransactionRecord[];
  ui: UiCopy;
  onClose: () => void;
  onEdit?: (account: AccountRecord) => void;
};

export function AccountDetailsDialog({
  account,
  transactions,
  ui,
  onClose,
  onEdit,
}: AccountDetailsDialogProps) {
  const [accountPeriod, setAccountPeriod] = useState<"all" | "month" | "quarter" | "year" | "custom">("month");
  const [accountTypeFilter, setAccountTypeFilter] = useState<"all" | "income" | "expense" | "transfer">("all");
  const [accountStatusFilter, setAccountStatusFilter] = useState<"all" | "cleared" | "pending" | "draft" | "canceled">("all");
  const [accountSearchQuery, setAccountSearchQuery] = useState("");
  const [accountDateRange, setAccountDateRange] = useState(() => ({
    startDate: new Date().toISOString().slice(0, 8) + "01",
    endDate: new Date().toISOString().slice(0, 10),
  }));

  const isBusinessAccount = account?.kind === "entrepreneur" || account?.kind === "company";
  const activeTaxProfile = account?.tax_profile ?? null;
  const activeTaxBaseLabel = activeTaxProfile?.calculation_source === "transactions" ? ui.receivedLabel : ui.taxBaseLabel;
  const activeTaxCalculationSourceLabel =
    activeTaxProfile?.calculation_source === "transactions"
      ? ui.taxCalculationSourceTransactions
      : ui.taxCalculationSourceManual;
  const socialFundModeLabel = activeTaxProfile?.manual_social_fund_amount
    ? ui.socialFundModeFixed
    : ui.socialFundModePercent;
  const accountAppearance = useMemo(() => resolveAccountAppearance(account?.color), [account?.color]);

  const accountTransactions = useMemo(() => {
    if (!account) {
      return [];
    }

    const today = new Date();
    const periodStart = (() => {
      if (accountPeriod === "all") {
        return null;
      }
      if (accountPeriod === "custom") {
        return accountDateRange.startDate || null;
      }
      if (accountPeriod === "month") {
        return new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
      }
      if (accountPeriod === "quarter") {
        const quarterMonth = Math.floor(today.getMonth() / 3) * 3;
        return new Date(today.getFullYear(), quarterMonth, 1).toISOString().slice(0, 10);
      }
      return new Date(today.getFullYear(), 0, 1).toISOString().slice(0, 10);
    })();
    const periodEnd = accountPeriod === "custom" ? accountDateRange.endDate || null : null;
    const normalizedQuery = accountSearchQuery.trim().toLowerCase();

    return transactions
      .filter((transaction) => {
        const involvesSource = transaction.account === account.id;
        const involvesDestination = transaction.destination_account === account.id;
        if (!involvesSource && !involvesDestination) {
          return false;
        }
        if (accountTypeFilter !== "all" && transaction.type !== accountTypeFilter) {
          return false;
        }
        if (accountStatusFilter !== "all" && transaction.status !== accountStatusFilter) {
          return false;
        }
        if (periodStart && transaction.occurred_on < periodStart) {
          return false;
        }
        if (periodEnd && transaction.occurred_on > periodEnd) {
          return false;
        }
        if (!normalizedQuery) {
          return true;
        }
        return [
          transaction.title,
          transaction.category_name,
          transaction.merchant,
          transaction.description,
          transaction.account_name,
          transaction.destination_account_name,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedQuery));
      })
      .map((transaction) => {
        const isTransferIn = transaction.type === "transfer" && transaction.destination_account === account.id;
        const isTransferOut = transaction.type === "transfer" && transaction.account === account.id;
        const signedAmount =
          transaction.type === "income"
            ? Number(transaction.amount)
            : transaction.type === "expense"
              ? -Number(transaction.amount)
              : isTransferIn
                ? Number(transaction.destination_amount ?? transaction.amount)
                : -Number(transaction.amount);

        return {
          transaction,
          signedAmount,
          direction: isTransferIn ? "in" : isTransferOut ? "out" : transaction.type === "income" ? "in" : "out",
          relatedAccountName: isTransferIn ? transaction.account_name : transaction.destination_account_name,
        };
      })
      .sort((left, right) => {
        const dateCompare = right.transaction.occurred_on.localeCompare(left.transaction.occurred_on);
        if (dateCompare !== 0) {
          return dateCompare;
        }
        return right.transaction.id - left.transaction.id;
      });
  }, [account, accountDateRange.endDate, accountDateRange.startDate, accountPeriod, accountSearchQuery, accountStatusFilter, accountTypeFilter, transactions]);

  const accountMovementSummary = useMemo(() => {
    return accountTransactions.reduce(
      (accumulator, item) => {
        const amount = Math.abs(item.signedAmount);
        accumulator.operations += 1;

        if (item.transaction.type === "income") {
          accumulator.income += amount;
        } else if (item.transaction.type === "expense") {
          accumulator.expense += amount;
        } else if (item.direction === "in") {
          accumulator.transferIn += amount;
        } else {
          accumulator.transferOut += amount;
        }

        accumulator.net += item.signedAmount;
        return accumulator;
      },
      { income: 0, expense: 0, transferIn: 0, transferOut: 0, net: 0, operations: 0 },
    );
  }, [accountTransactions]);

  return (
    <Dialog open={Boolean(account)} onOpenChange={(open) => !open && onClose()}>
      <WorkspaceDialogShell
        title={account?.name ?? ui.accountDetailsTitle}
        description={ui.accountDetailsDescription}
        variant="account"
        accentAppearance={accountAppearance}
        contentClassName="h-[min(92vh,64rem)] w-[min(96vw,78rem)]"
        bodyClassName="p-6"
      >
        {account ? (
          <>
              <div className="rounded-[1.4rem] border border-white/8 bg-[linear-gradient(180deg,rgba(10,14,15,0.84)_0%,rgba(8,10,12,0.94)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.accountDetailsTitle}</p>
                    <p className="mt-1 text-sm text-zinc-300">{accountKindLabel(account.kind, ui)} · {account.currency}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {onEdit ? (
                      <Button
                        type="button"
                        className="h-11 rounded-2xl px-5 text-slate-950"
                        style={{
                          backgroundColor: accountAppearance.border,
                          boxShadow: `0 14px 30px -18px ${accountAppearance.glow}`,
                          color: "#020617",
                        }}
                        onClick={() => onEdit(account)}
                      >
                        <RiPencilLine className="size-4" />
                        {ui.editLabel}
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 rounded-2xl border-white/10 bg-white/5 px-5 text-zinc-100 hover:border-white/16 hover:bg-white/[0.08]"
                      onClick={onClose}
                    >
                      <RiCloseLine className="size-4" />
                      {ui.cancel}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_320px]">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-[1.4rem] border border-white/8 bg-black/18 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.balance}</p>
                      <p className="mt-2 text-lg font-semibold text-white">{formatMoney(account.current_balance, account.currency)}</p>
                    </div>
                    <div className="rounded-[1.4rem] border border-white/8 bg-black/18 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.receivedLabel}</p>
                      <p className="mt-2 text-lg font-semibold text-emerald-200">
                        {formatMoney(String(accountMovementSummary.income + accountMovementSummary.transferIn), account.currency)}
                      </p>
                    </div>
                    <div className="rounded-[1.4rem] border border-white/8 bg-black/18 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.spentLabel}</p>
                      <p className="mt-2 text-lg font-semibold text-rose-200">
                        {formatMoney(String(accountMovementSummary.expense + accountMovementSummary.transferOut), account.currency)}
                      </p>
                    </div>
                    <div className="rounded-[1.4rem] border border-white/8 bg-black/18 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.periodResultLabel}</p>
                      <p className={`mt-2 text-lg font-semibold ${accountMovementSummary.net >= 0 ? "text-emerald-200" : "text-rose-200"}`}>
                        {formatMoney(String(accountMovementSummary.net), account.currency)}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Field>
                      <FieldLabel>{ui.period}</FieldLabel>
                      <WorkspaceSelect
                        value={accountPeriod}
                        onValueChange={(value) => setAccountPeriod(value as typeof accountPeriod)}
                        options={[
                          { value: "all", label: ui.allLabel },
                          { value: "month", label: ui.monthly },
                          { value: "quarter", label: ui.quarterly },
                          { value: "year", label: ui.yearly },
                          { value: "custom", label: ui.customPeriod },
                        ]}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>{ui.filterTypeLabel}</FieldLabel>
                      <WorkspaceSelect
                        value={accountTypeFilter}
                        onValueChange={(value) => setAccountTypeFilter(value as typeof accountTypeFilter)}
                        options={[
                          { value: "all", label: ui.allLabel },
                          { value: "income", label: ui.txTypeIncome },
                          { value: "expense", label: ui.txTypeExpense },
                          { value: "transfer", label: ui.txTypeTransfer },
                        ]}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>{ui.filterStatusLabel}</FieldLabel>
                      <WorkspaceSelect
                        value={accountStatusFilter}
                        onValueChange={(value) => setAccountStatusFilter(value as typeof accountStatusFilter)}
                        options={[
                          { value: "all", label: ui.allLabel },
                          { value: "cleared", label: ui.txStatusCleared },
                          { value: "pending", label: ui.txStatusPending },
                          { value: "draft", label: ui.txStatusDraft },
                          { value: "canceled", label: ui.txStatusCanceled },
                        ]}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>{ui.operationsCountLabel}</FieldLabel>
                      <div className="flex h-11 items-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-zinc-100">
                        {accountMovementSummary.operations}
                      </div>
                    </Field>
                  </div>

                  {accountPeriod === "custom" ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field>
                        <FieldLabel>{ui.startDate}</FieldLabel>
                        <DateInput
                          value={accountDateRange.startDate}
                          onChange={(nextValue) => setAccountDateRange((current) => ({ ...current, startDate: nextValue }))}
                          placeholder={ui.startDate}
                        />
                      </Field>
                      <Field>
                        <FieldLabel>{ui.endDate}</FieldLabel>
                        <DateInput
                          value={accountDateRange.endDate}
                          onChange={(nextValue) => setAccountDateRange((current) => ({ ...current, endDate: nextValue }))}
                          placeholder={ui.endDate}
                        />
                      </Field>
                    </div>
                  ) : null}

                  <Input
                    value={accountSearchQuery}
                    onChange={(event) => setAccountSearchQuery(event.target.value)}
                    placeholder={ui.accountTransactionSearchPlaceholder}
                    className="rounded-2xl border-white/10 bg-black/18 text-zinc-100 placeholder:text-zinc-500"
                  />

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-[1.2rem] border border-white/8 bg-black/18 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.transferInLabel}</p>
                      <p className="mt-2 text-base font-semibold text-emerald-100">{formatMoney(String(accountMovementSummary.transferIn), account.currency)}</p>
                    </div>
                    <div className="rounded-[1.2rem] border border-white/8 bg-black/18 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.transferOutLabel}</p>
                      <p className="mt-2 text-base font-semibold text-rose-100">{formatMoney(String(accountMovementSummary.transferOut), account.currency)}</p>
                    </div>
                    <div className="rounded-[1.2rem] border border-white/8 bg-black/18 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.accountKind}</p>
                      <p className="mt-2 text-base font-semibold text-white">{accountKindLabel(account.kind, ui)}</p>
                    </div>
                    <div className="rounded-[1.2rem] border border-white/8 bg-black/18 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.status}</p>
                      <p className="mt-2 text-base font-semibold text-white">{transactionStatusLabel(account.status, ui)}</p>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {accountTransactions.length === 0 ? (
                      <div
                        className="w-full rounded-[1.6rem] border px-5 py-10 text-center text-sm text-zinc-300"
                        style={{
                          borderColor: accountAppearance.glow,
                          background: `linear-gradient(180deg, rgba(10, 12, 14, 0.9) 0%, rgba(7, 8, 10, 0.96) 100%), radial-gradient(circle at 18% 18%, ${accountAppearance.orb}, transparent 28%)`,
                          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 1px ${accountAppearance.glow}`,
                        }}
                      >
                        {ui.emptyTransactions}
                      </div>
                    ) : null}
                    {accountTransactions.map((item) => (
                      <div key={item.transaction.id} className="rounded-[1.3rem] border border-white/8 bg-black/18 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-white">{transactionDisplayTitle(item.transaction, ui)}</p>
                              <Badge variant="outline" className={`rounded-full ${statusTone(item.transaction.status)}`}>
                                {transactionStatusLabel(item.transaction.status, ui)}
                              </Badge>
                              <Badge variant="outline" className="rounded-full border-white/10 bg-white/5 text-zinc-200">
                                {transactionTypeLabel(item.transaction.type, ui)}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm text-zinc-500">{formatDate(item.transaction.occurred_on)}</p>
                            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-400">
                              {item.transaction.category_name ? <span>{ui.category}: {item.transaction.category_name}</span> : null}
                              {item.transaction.merchant ? <span>{ui.merchant}: {item.transaction.merchant}</span> : null}
                              {item.relatedAccountName ? (
                                <span>
                                  {item.transaction.type === "transfer" && item.direction === "in" ? ui.sourceAccountLabelShort : ui.relatedAccountLabel}
                                  : {item.relatedAccountName}
                                </span>
                              ) : null}
                            </div>
                            {item.transaction.description ? <p className="mt-2 text-sm leading-6 text-zinc-400">{item.transaction.description}</p> : null}
                          </div>
                          <div className={`shrink-0 text-base font-semibold ${item.signedAmount >= 0 ? "text-emerald-200" : "text-rose-200"}`}>
                            {formatMoney(String(item.signedAmount), account.currency)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.6rem] border border-white/8 bg-black/18 p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.balanceOverview}</p>
                    <p className="mt-3 text-xl font-semibold text-white">{formatMoney(account.current_balance, account.currency)}</p>
                    <div className="mt-4 space-y-2 text-sm text-zinc-400">
                      <p>{ui.currency}: {account.currency}</p>
                      <p>{ui.accountKind}: {accountKindLabel(account.kind, ui)}</p>
                      <p>{ui.creditLimit}: {formatMoney(account.credit_limit, account.currency)}</p>
                      {account.institution ? <p>{ui.institution}: {account.institution}</p> : null}
                    </div>
                    {isBusinessAccount ? (
                      <>
                        <Separator className="my-4 bg-white/8" />
                        {activeTaxProfile ? (
                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.taxSettingsTitle}</p>
                                <p className="mt-2 text-sm font-medium text-white">
                                  {taxEntityLabel(activeTaxProfile.entity_type, ui)} · {reportingPeriodLabel(activeTaxProfile.reporting_period, ui)}
                                </p>
                              </div>
                              <div className="rounded-full border border-emerald-300/16 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100">
                                {ui.taxDueBy.replace("{date}", formatDate(activeTaxProfile.due_date))}
                              </div>
                            </div>

                            <div className="grid gap-3">
                              <div className="rounded-[1.1rem] border border-white/8 bg-white/[0.03] p-3">
                                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{activeTaxBaseLabel}</p>
                                <p className="mt-1 text-sm font-semibold text-white">{formatMoney(activeTaxProfile.tax_base, account.currency)}</p>
                              </div>
                              <div className="rounded-[1.1rem] border border-white/8 bg-white/[0.03] p-3">
                                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.taxLabel}</p>
                                <p className="mt-1 text-sm font-semibold text-white">
                                  {formatMoney(activeTaxProfile.tax_amount, account.currency)} · {Number(activeTaxProfile.tax_rate)}%
                                </p>
                              </div>
                              <div className="rounded-[1.1rem] border border-white/8 bg-white/[0.03] p-3">
                                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.socialFundLabel}</p>
                                <p className="mt-1 text-sm font-semibold text-white">
                                  {formatMoney(activeTaxProfile.social_fund_amount, account.currency)} · {socialFundModeLabel === ui.socialFundModeFixed ? socialFundModeLabel : `${Number(activeTaxProfile.social_fund_rate)}%`}
                                </p>
                              </div>
                              <div className="rounded-[1.1rem] border border-white/8 bg-white/[0.03] p-3">
                                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.periodResultLabel}</p>
                                <p className="mt-1 text-sm font-semibold text-white">{formatMoney(activeTaxProfile.total_amount, account.currency)}</p>
                              </div>
                            </div>

                            <div className="space-y-2 text-sm text-zinc-400">
                              <p>{ui.taxTemplateLabel}: {taxTemplateLabel(activeTaxProfile.template_code)}</p>
                              <p>{ui.taxCalculationSourceLabel}: {activeTaxCalculationSourceLabel}</p>
                              <p>{ui.dueDayLabel}: {activeTaxProfile.due_day}</p>
                              <p>{ui.currentTaxPeriodLabel}: {formatDate(activeTaxProfile.period_start)} - {formatDate(activeTaxProfile.period_end)}</p>
                              <p>{ui.nextDueDateLabel}: {formatDate(activeTaxProfile.due_date)}</p>
                              <p>{ui.status}: {activeTaxProfile.is_active ? ui.activeLabel : ui.inactiveLabel}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-[1.1rem] border border-amber-300/16 bg-amber-300/10 p-3 text-sm text-amber-100">
                            Налоговый профиль для этого бизнес-счета не найден.
                          </div>
                        )}
                      </>
                    ) : null}
                    {account.note ? (
                      <>
                        <Separator className="my-4 bg-white/8" />
                        <p className="text-sm leading-6 text-zinc-400">{account.note}</p>
                      </>
                    ) : null}
                    {activeTaxProfile?.note ? (
                      <>
                        <Separator className="my-4 bg-white/8" />
                        <p className="text-sm leading-6 text-zinc-400">{activeTaxProfile.note}</p>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
          </>
        ) : null}
      </WorkspaceDialogShell>
    </Dialog>
  );
}
