"use client";

import { useState } from "react";
import { RiAddLine, RiBarChartBoxLine, RiBookletLine, RiCalendarLine, RiExchangeDollarLine, RiPencilLine } from "react-icons/ri";

import { AccountDetailsDialog } from "@/components/workspace/account-details-dialog";
import { BudgetUtilizationBar } from "@/components/workspace/budget-utilization-bar";
import type { UiCopy } from "@/components/workspace/finance-workspace.types";
import { AccountCard, PriorityPill } from "@/components/workspace/finance-workspace-ui";
import {
  formatDate,
  formatMoney,
  transactionStatusLabel,
  transactionDisplayTitle,
  transactionSignedValue,
} from "@/components/workspace/finance-workspace.utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AccountRecord, BudgetRecord, TransactionRecord } from "@/lib/api/finance";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type WorkspaceOverviewSectionProps = {
  ui: UiCopy;
  content: Dictionary["workspace"];
  accounts: AccountRecord[];
  budgets: BudgetRecord[];
  transactions: TransactionRecord[];
  quickExpenseCount: number;
  budgetAlertsCount: number;
  customCategoriesCount: number;
  onOpenQuickExpenseDialog: () => void;
  onOpenBudgetDialog: () => void;
  onOpenAccountEditDialog: (account: AccountRecord) => void;
  onOpenTransactionEditDialog: (transaction: TransactionRecord) => void;
  onOpenTransactionsSection: () => void;
  onOpenBudgetsSection: () => void;
  onOpenSettingsSection: () => void;
};

export function WorkspaceOverviewSection({
  ui,
  content,
  accounts,
  budgets,
  transactions,
  quickExpenseCount,
  budgetAlertsCount,
  customCategoriesCount,
  onOpenQuickExpenseDialog,
  onOpenBudgetDialog,
  onOpenAccountEditDialog,
  onOpenTransactionEditDialog,
  onOpenTransactionsSection,
  onOpenBudgetsSection,
  onOpenSettingsSection,
}: WorkspaceOverviewSectionProps) {
  const [activeAccount, setActiveAccount] = useState<AccountRecord | null>(null);

  return (
    <>
      <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
        <CardHeader className="p-6">
          <CardTitle className="text-white">{content.sections.nextSteps}</CardTitle>
          <CardDescription className="text-zinc-400">{ui.workflowSectionDescription}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 p-6 pt-0 xl:grid-cols-2">
          <div className="rounded-[1.7rem] border border-emerald-300/12 bg-[linear-gradient(180deg,rgba(16,185,129,0.12)_0%,rgba(8,18,14,0.58)_100%)] p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="inline-flex size-10 items-center justify-center rounded-2xl border border-emerald-300/18 bg-emerald-300/10 text-emerald-100">
                <RiAddLine className="size-4" />
              </div>
              <Badge variant="outline" className="rounded-full border-emerald-300/20 bg-emerald-300/10 text-emerald-100">
                {ui.quickExpenseMeta.replace("{count}", String(quickExpenseCount))}
              </Badge>
            </div>
            <p className="mt-4 text-base font-semibold text-white">{ui.quickExpenseTitle}</p>
            <p className="mt-1.5 text-sm leading-6 text-zinc-300">{ui.quickExpenseBody}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" className="rounded-2xl bg-emerald-300 text-slate-950" onClick={onOpenQuickExpenseDialog}>
                <RiAddLine className="size-4" />
                {ui.addExpense}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-2xl border-white/10 bg-white/5 text-zinc-100"
                onClick={onOpenTransactionsSection}
              >
                <RiExchangeDollarLine className="size-4" />
                {ui.openTransactionsSection}
              </Button>
            </div>
          </div>

          <div className="rounded-[1.7rem] border border-amber-300/12 bg-[linear-gradient(180deg,rgba(251,191,36,0.12)_0%,rgba(8,18,14,0.58)_100%)] p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="inline-flex size-10 items-center justify-center rounded-2xl border border-amber-300/18 bg-amber-300/10 text-amber-100">
                <RiCalendarLine className="size-4" />
              </div>
              <Badge variant="outline" className="rounded-full border-amber-300/20 bg-amber-300/10 text-amber-100">
                {ui.budgetWorkflowMeta.replace("{active}", String(budgets.length)).replace("{alerts}", String(budgetAlertsCount))}
              </Badge>
            </div>
            <p className="mt-4 text-base font-semibold text-white">{ui.budgetWorkflowTitle}</p>
            <p className="mt-1.5 text-sm leading-6 text-zinc-300">{ui.budgetWorkflowBody}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <PriorityPill label={ui.activeBudgets} value={String(budgets.length)} />
              <PriorityPill label={ui.categories} value={String(customCategoriesCount)} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" className="rounded-2xl bg-amber-300 text-slate-950 hover:bg-amber-200" onClick={onOpenBudgetDialog}>
                <RiBarChartBoxLine className="size-4" />
                {ui.createBudget}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-2xl border-white/10 bg-white/5 text-zinc-100"
                onClick={onOpenBudgetsSection}
              >
                <RiCalendarLine className="size-4" />
                {ui.openBudgets}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-2xl border-white/10 bg-white/5 text-zinc-100"
                onClick={onOpenSettingsSection}
              >
                <RiBookletLine className="size-4" />
                {ui.openSettings}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
          <CardHeader className="p-6">
            <CardTitle className="text-white">{content.sections.accounts}</CardTitle>
            <CardDescription className="text-zinc-400">{content.sections.accountsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[34rem] space-y-3 overflow-x-hidden overflow-y-auto p-6 pt-2 pr-5">
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} ui={ui} onOpen={(nextAccount) => setActiveAccount(nextAccount)} />
            ))}
          </CardContent>
        </Card>

        <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
          <CardHeader className="p-6">
            <CardTitle className="text-white">{content.sections.budgets}</CardTitle>
            <CardDescription className="text-zinc-400">{content.sections.budgetsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 p-6 pt-0">
            {budgets.slice(0, 4).map((budget) => (
              <div key={budget.id} className="rounded-[1.5rem] border border-white/8 bg-black/18 px-4 py-4">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-base font-medium text-white">{budget.name || budget.category_name || ui.budgetKindGoal}</p>
                    <p className="text-sm text-zinc-500">
                      {formatMoney(budget.spent_amount, budget.currency)} / {formatMoney(budget.amount, budget.currency)}
                    </p>
                  </div>
                  <Badge variant="outline" className="rounded-full border-white/10 bg-white/5 text-zinc-200">
                    {Math.round(budget.utilization_percent)}%
                  </Badge>
                </div>
                <BudgetUtilizationBar
                  utilizationPercent={budget.utilization_percent}
                  label={
                    <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                      {content.labels.utilization}
                    </div>
                  }
                  valueLabel={
                    <div className="text-xs text-zinc-400">
                      {content.remaining.replace(
                        "{value}",
                        formatMoney(String(Math.max(Number(budget.amount) - Number(budget.spent_amount), 0)), budget.currency),
                      )}
                    </div>
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
        <CardHeader className="p-6">
          <CardTitle className="text-white">{content.sections.transactions}</CardTitle>
          <CardDescription className="text-zinc-400">{content.sections.transactionsDescription}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <Table className="text-zinc-200">
            <TableHeader>
              <TableRow className="border-white/8 hover:bg-transparent">
                <TableHead>{content.table.title}</TableHead>
                <TableHead>{content.table.account}</TableHead>
                <TableHead>{content.table.category}</TableHead>
                <TableHead>{content.table.date}</TableHead>
                <TableHead className="text-right">{content.table.amount}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.slice(0, 8).map((transaction) => {
                const signedValue = transactionSignedValue(transaction);

                return (
                  <TableRow
                    key={transaction.id}
                    className="group cursor-pointer border-white/8 hover:bg-white/[0.03]"
                    onClick={() => onOpenTransactionEditDialog(transaction)}
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{transactionDisplayTitle(transaction, ui)}</div>
                        <div className="text-xs text-zinc-500">{transaction.merchant || transactionStatusLabel(transaction.status, ui)}</div>
                      </div>
                    </TableCell>
                    <TableCell>{transaction.account_name}</TableCell>
                    <TableCell>{transaction.category_name || ui.transferLabel}</TableCell>
                    <TableCell>{formatDate(transaction.occurred_on)}</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center justify-end gap-3">
                        <span className={`font-medium ${signedValue.startsWith("-") ? "text-rose-300" : "text-emerald-300"}`}>
                          {formatMoney(signedValue, transaction.currency)}
                        </span>
                        <RiPencilLine className="size-4 text-zinc-500 transition group-hover:text-zinc-200" />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AccountDetailsDialog
        account={activeAccount}
        transactions={transactions}
        ui={ui}
        onClose={() => setActiveAccount(null)}
        onEdit={onOpenAccountEditDialog}
      />
    </>
  );
}
