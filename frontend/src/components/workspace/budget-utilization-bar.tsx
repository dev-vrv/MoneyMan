"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BudgetUtilizationBarProps = {
  utilizationPercent: number;
  className?: string;
  label?: ReactNode;
  valueLabel?: ReactNode;
};

export function BudgetUtilizationBar({
  utilizationPercent,
  className,
  label,
  valueLabel,
}: BudgetUtilizationBarProps) {
  const normalizedValue = Number.isFinite(utilizationPercent) ? Math.max(utilizationPercent, 0) : 0;
  const baseFillWidth = Math.min(normalizedValue, 100);
  const overspendWidth = Math.min(Math.max(normalizedValue - 100, 0), 100);

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {label}
      {valueLabel ? <div className="ml-auto">{valueLabel}</div> : null}
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/8">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-emerald-300 transition-[width] duration-300"
          style={{ width: `${baseFillWidth}%` }}
        />
        {overspendWidth > 0 ? (
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-rose-400/90 shadow-[0_0_12px_rgba(251,113,133,0.45)] transition-[width] duration-300"
            style={{ width: `${overspendWidth}%` }}
          />
        ) : null}
      </div>
    </div>
  );
}
