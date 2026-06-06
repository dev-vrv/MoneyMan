"use client";

import { RiAddLine } from "react-icons/ri";

import type { UiCopy } from "@/components/workspace/finance-workspace.types";
import { AccountCard, EmptyState } from "@/components/workspace/finance-workspace-ui";
import { formatDate, formatMoney, reportingPeriodLabel, statusTone, taxEntityLabel } from "@/components/workspace/finance-workspace.utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AccountRecord, WorkspaceOverview } from "@/lib/api/finance";

type WorkspaceAccountsSectionProps = {
  ui: UiCopy;
  accounts: AccountRecord[];
  overview: WorkspaceOverview;
  onOpenAccountDialog: () => void;
  onOpenAccountEditDialog: (account: AccountRecord) => void;
};

export function WorkspaceAccountsSection({
  ui,
  accounts,
  overview,
  onOpenAccountDialog,
  onOpenAccountEditDialog,
}: WorkspaceAccountsSectionProps) {
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
        <CardContent className="grid gap-4 p-6 pt-0 md:grid-cols-2">
          {accounts.length === 0 ? <EmptyState text={ui.emptyAccounts} /> : null}
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} ui={ui} onEdit={onOpenAccountEditDialog} />
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
                  </div>
                  <Badge variant="outline" className={`rounded-full ${obligation.days_left <= 7 ? statusTone("pending") : statusTone("active")}`}>
                    {ui.taxDueBy.replace("{date}", formatDate(obligation.due_date))}
                  </Badge>
                </div>
                <p className="mt-4 text-2xl font-semibold text-white">{formatMoney(obligation.total_amount, obligation.currency)}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{ui.taxBaseLabel}</p>
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
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </>
  );
}
