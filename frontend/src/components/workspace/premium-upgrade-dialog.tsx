"use client";

import { RiFlashlightLine } from "react-icons/ri";

import type { UiCopy } from "@/components/workspace/finance-workspace.types";
import { WorkspaceDialogShell } from "@/components/workspace/workspace-dialog-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { SubscriptionPlanRecord } from "@/lib/api/finance";

type DisplaySubscriptionPlan = SubscriptionPlanRecord & {
  display_currency: string;
  display_amount: number;
  display_price_label: string;
  usd_price_label: string;
};

type PremiumUpgradeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ui: UiCopy;
  plans: DisplaySubscriptionPlan[];
  selectedPlan: DisplaySubscriptionPlan | null;
  ctaClassName: string;
  onSelectPlan: (planCode: string) => void;
  onCheckout: () => void;
};

export function PremiumUpgradeDialog({
  open,
  onOpenChange,
  ui,
  plans,
  selectedPlan,
  ctaClassName,
  onSelectPlan,
  onCheckout,
}: PremiumUpgradeDialogProps) {
  const fallbackFeatures = [
    ui.premiumFeatureUnlimitedHistory,
    ui.premiumFeatureAdvancedAnalytics,
    ui.premiumFeaturePriorityRates,
    ui.premiumFeatureFreedomPay,
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <WorkspaceDialogShell
        title={ui.premiumDialogTitle}
        description={ui.premiumDialogBody}
        variant="premium"
        contentClassName="h-[min(90vh,56rem)] w-[min(96vw,52rem)]"
        bodyClassName="px-6 pb-6 pt-5 sm:px-8"
        headerAddon={(
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/18 bg-amber-300/10 px-3 py-1 text-xs font-medium text-amber-100">
            {ui.premiumBadge}
          </div>
        )}
      >
        {plans.length > 0 ? (
          <>
            <div className="grid gap-3">
              {plans.map((plan) => {
                const isSelected = selectedPlan?.code === plan.code;

                return (
                  <button
                    key={plan.code}
                    type="button"
                    onClick={() => onSelectPlan(plan.code)}
                    className={`rounded-[1.5rem] border p-4 text-left transition ${
                      isSelected
                        ? "border-emerald-300/20 bg-emerald-300/[0.08]"
                        : "border-white/8 bg-black/18 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{plan.name}</p>
                        <p className="mt-2 text-2xl font-semibold text-white">{plan.display_price_label}</p>
                        <p className="mt-2 text-sm text-zinc-400">
                          {plan.duration_label} · {plan.usd_price_label}
                        </p>
                        {plan.description ? (
                          <p className="mt-2 text-sm leading-6 text-zinc-400">{plan.description}</p>
                        ) : null}
                      </div>
                      {plan.is_highlighted ? (
                        <Badge variant="outline" className="rounded-full border-emerald-300/16 bg-emerald-300/10 text-emerald-100">
                          {ui.premiumSaveBadge}
                        </Badge>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="grid gap-3">
              {(selectedPlan?.features.length ? selectedPlan.features : fallbackFeatures).map((feature) => (
                <div key={feature} className="rounded-[1.2rem] border border-white/8 bg-black/18 px-4 py-3 text-sm text-zinc-200">
                  {feature}
                </div>
              ))}
            </div>

            <div className="rounded-[1.4rem] border border-sky-300/14 bg-sky-300/[0.06] p-4">
              <p className="text-sm font-medium text-sky-100">{selectedPlan?.name ?? ui.premiumBadge}</p>
              <p className="mt-1 text-sm leading-6 text-sky-100/70">
                {selectedPlan
                  ? `${selectedPlan.display_price_label} · ${selectedPlan.duration_label}`
                  : ui.premiumCheckoutNote}
              </p>
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl border-white/10 bg-white/5 text-zinc-100"
                onClick={() => onOpenChange(false)}
              >
                {ui.cancel}
              </Button>
              <Button type="button" className={ctaClassName} onClick={onCheckout}>
                <RiFlashlightLine className="relative z-10 size-4" />
                <span className="relative z-10">{ui.premiumCheckoutAction}</span>
              </Button>
            </div>
          </>
        ) : (
          <div className="rounded-[1.4rem] border border-white/8 bg-black/18 p-4 text-sm text-zinc-400">
            {ui.notAvailable}
          </div>
        )}
      </WorkspaceDialogShell>
    </Dialog>
  );
}
