"use client";

import { RiAddLine, RiPencilLine } from "react-icons/ri";

import type { UiCopy } from "@/components/workspace/finance-workspace.types";
import { EmptyState } from "@/components/workspace/finance-workspace-ui";
import { formatDate, formatMoney, statusTone } from "@/components/workspace/finance-workspace.utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress, ProgressLabel } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { BudgetRecord } from "@/lib/api/finance";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type WorkspaceBudgetsSectionProps = {
  ui: UiCopy;
  content: Dictionary["workspace"];
  budgets: BudgetRecord[];
  onOpenBudgetDialog: () => void;
  onOpenBudgetEditDialog: (budget: BudgetRecord) => void;
  onToggleBudgetActive: (budget: BudgetRecord) => void;
};

export function WorkspaceBudgetsSection({
  ui,
  content,
  budgets,
  onOpenBudgetDialog,
  onOpenBudgetEditDialog,
  onToggleBudgetActive,
}: WorkspaceBudgetsSectionProps) {
  return (
    <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
      <CardHeader className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-white">{ui.budgets}</CardTitle>
            <CardDescription className="text-zinc-400">{ui.manageBudgets}</CardDescription>
          </div>
          <Button className="rounded-2xl bg-emerald-300 text-slate-950" onClick={onOpenBudgetDialog}>
            <RiAddLine className="size-4" />
            {ui.createBudget}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 p-6 pt-0 md:grid-cols-2">
        {budgets.length === 0 ? <EmptyState text={ui.emptyBudgets} /> : null}
        {budgets.map((budget) => (
          <div key={budget.id} className="rounded-[1.6rem] border border-white/8 bg-black/18 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-white">{budget.category_name}</p>
                <p className="text-sm text-zinc-500">
                  {formatDate(budget.start_date)} - {formatDate(budget.end_date)}
                </p>
              </div>
              <Badge variant="outline" className={`rounded-full ${budget.is_active ? statusTone("active") : statusTone("archived")}`}>
                {budget.is_active ? ui.activeLabel : ui.inactiveLabel}
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-zinc-400">
                {formatMoney(budget.spent_amount, budget.currency)} / {formatMoney(budget.amount, budget.currency)}
              </p>
              <Progress value={budget.utilization_percent} className="mt-3 gap-2">
                <ProgressLabel className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  {content.labels.utilization}
                </ProgressLabel>
                <div className="ml-auto text-xs text-zinc-400">{Math.round(budget.utilization_percent)}%</div>
              </Progress>
            </div>
            <Separator className="my-4 bg-white/8" />
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-zinc-100" onClick={() => onOpenBudgetEditDialog(budget)}>
                <RiPencilLine className="size-4" />
                {ui.editLabel}
              </Button>
              <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-zinc-100" onClick={() => onToggleBudgetActive(budget)}>
                {budget.is_active ? ui.deactivate : ui.activate}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
