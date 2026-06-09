"use client";

import type { ReactNode } from "react";

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type WorkspaceDialogShellProps = {
  title: ReactNode;
  description?: ReactNode;
  headerAddon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  variant?: "default" | "account" | "tax" | "premium" | "operations" | "markets" | "analytics";
  accentAppearance?: {
    border: string;
    glow: string;
    soft: string;
    orb: string;
    text: string;
  };
};

export function WorkspaceDialogShell({
  title,
  description,
  headerAddon,
  children,
  footer,
  className,
  bodyClassName,
  headerClassName,
  contentClassName,
  variant = "default",
  accentAppearance,
}: WorkspaceDialogShellProps) {
  const variantStyles = {
    default: {
      shell:
        "border-emerald-300/10 bg-[linear-gradient(180deg,rgba(8,18,14,0.84)_0%,rgba(6,12,10,0.72)_100%)] shadow-[0_30px_120px_rgba(6,34,22,0.34)]",
      glow:
        "bg-[radial-gradient(circle_at_14%_16%,rgba(110,231,183,0.14),transparent_24%),radial-gradient(circle_at_86%_18%,rgba(45,212,191,0.10),transparent_28%)]",
      grid:
        "bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:30px_30px]",
      orbA: "left-[-4rem] top-[-3rem] h-32 w-32 rounded-[2rem] rotate-12 border-emerald-300/12 bg-emerald-300/8",
      orbB: "right-[-3rem] bottom-[-4rem] h-40 w-40 rounded-[2.8rem] -rotate-12 border-teal-300/12 bg-teal-300/8",
    },
    account: {
      shell:
        "border-cyan-300/10 bg-[linear-gradient(180deg,rgba(9,19,22,0.84)_0%,rgba(6,11,14,0.72)_100%)] shadow-[0_30px_120px_rgba(8,42,48,0.34)]",
      glow:
        "bg-[radial-gradient(circle_at_16%_18%,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(59,130,246,0.10),transparent_28%)]",
      grid:
        "bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:28px_28px]",
      orbA: "left-[-4rem] top-[-3rem] h-32 w-32 rounded-[2.4rem] rotate-[18deg] border-cyan-300/12 bg-cyan-300/8",
      orbB: "right-[-4rem] bottom-[-4rem] h-44 w-44 rounded-full border-sky-300/12 bg-sky-300/8",
    },
    tax: {
      shell:
        "border-amber-300/10 bg-[linear-gradient(180deg,rgba(24,18,10,0.84)_0%,rgba(14,11,8,0.74)_100%)] shadow-[0_30px_120px_rgba(52,30,6,0.34)]",
      glow:
        "bg-[radial-gradient(circle_at_16%_18%,rgba(251,191,36,0.14),transparent_24%),radial-gradient(circle_at_84%_18%,rgba(249,115,22,0.10),transparent_28%)]",
      grid:
        "bg-[linear-gradient(135deg,rgba(255,255,255,0.045)_0,rgba(255,255,255,0.045)_1px,transparent_1px,transparent_18px)] bg-[size:24px_24px]",
      orbA: "left-[-3rem] top-[-3rem] h-28 w-28 rounded-[1.8rem] rotate-45 border-amber-300/12 bg-amber-300/8",
      orbB: "right-[-4rem] bottom-[-4rem] h-44 w-44 rounded-[3rem] -rotate-6 border-orange-300/12 bg-orange-300/8",
    },
    premium: {
      shell:
        "border-fuchsia-300/10 bg-[linear-gradient(180deg,rgba(24,12,26,0.84)_0%,rgba(15,9,18,0.74)_100%)] shadow-[0_30px_120px_rgba(48,10,42,0.36)]",
      glow:
        "bg-[radial-gradient(circle_at_14%_16%,rgba(217,70,239,0.14),transparent_24%),radial-gradient(circle_at_86%_18%,rgba(251,191,36,0.10),transparent_28%)]",
      grid:
        "bg-[radial-gradient(circle,rgba(255,255,255,0.065)_1px,transparent_1px)] bg-[size:18px_18px]",
      orbA: "left-[-3rem] top-[-3rem] h-28 w-28 rounded-full border-fuchsia-300/12 bg-fuchsia-300/8",
      orbB: "right-[-3rem] bottom-[-4rem] h-40 w-40 rounded-[2.6rem] rotate-12 border-amber-300/12 bg-amber-300/8",
    },
    operations: {
      shell:
        "border-emerald-300/10 bg-[linear-gradient(180deg,rgba(10,20,16,0.86)_0%,rgba(7,12,10,0.76)_100%)] shadow-[0_30px_120px_rgba(6,34,22,0.34)]",
      glow:
        "bg-[radial-gradient(circle_at_14%_18%,rgba(52,211,153,0.16),transparent_24%),radial-gradient(circle_at_84%_18%,rgba(163,230,53,0.10),transparent_28%)]",
      grid:
        "bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:26px_26px]",
      orbA: "left-[-4rem] top-[-4rem] h-36 w-36 rounded-[2.8rem] -rotate-12 border-emerald-300/12 bg-emerald-300/8",
      orbB: "right-[-4rem] bottom-[-3rem] h-32 w-32 rounded-[1.6rem] rotate-12 border-lime-300/12 bg-lime-300/8",
    },
    markets: {
      shell:
        "border-sky-300/10 bg-[linear-gradient(180deg,rgba(10,16,28,0.84)_0%,rgba(8,11,20,0.74)_100%)] shadow-[0_30px_120px_rgba(12,28,60,0.34)]",
      glow:
        "bg-[radial-gradient(circle_at_14%_16%,rgba(56,189,248,0.14),transparent_24%),radial-gradient(circle_at_86%_18%,rgba(16,185,129,0.10),transparent_28%)]",
      grid:
        "bg-[linear-gradient(135deg,rgba(255,255,255,0.045)_0,rgba(255,255,255,0.045)_2px,transparent_2px,transparent_18px)] bg-[size:26px_26px]",
      orbA: "left-[-4rem] top-[-3rem] h-32 w-32 rounded-full border-sky-300/12 bg-sky-300/8",
      orbB: "right-[-4rem] bottom-[-4rem] h-44 w-44 rounded-[3rem] rotate-[14deg] border-emerald-300/12 bg-emerald-300/8",
    },
    analytics: {
      shell:
        "border-emerald-300/10 bg-[linear-gradient(180deg,rgba(8,18,14,0.82)_0%,rgba(6,12,10,0.70)_100%)] shadow-[0_30px_120px_rgba(6,34,22,0.38)]",
      glow:
        "bg-[radial-gradient(circle_at_14%_18%,rgba(52,211,153,0.16),transparent_24%),radial-gradient(circle_at_84%_18%,rgba(163,230,53,0.10),transparent_28%)]",
      grid:
        "bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:24px_24px]",
      orbA: "left-[-4rem] top-[-4rem] h-36 w-36 rounded-[3rem] rotate-6 border-emerald-300/12 bg-emerald-300/8",
      orbB: "right-[-4rem] bottom-[-4rem] h-44 w-44 rounded-[2rem] -rotate-12 border-lime-300/12 bg-lime-300/8",
    },
  }[variant];

  return (
    <DialogContent
      className={cn(
        "flex h-[min(88vh,56rem)] w-[min(96vw,64rem)] max-w-none flex-col overflow-hidden rounded-[2rem] border p-0 text-zinc-100 backdrop-blur-2xl sm:max-w-none",
        variantStyles.shell,
        contentClassName,
      )}
      style={
        variant === "account" && accentAppearance
          ? {
              borderColor: accentAppearance.glow,
              backgroundImage: `linear-gradient(180deg, rgba(11, 11, 12, 0.94) 0%, rgba(7, 8, 10, 0.98) 100%)`,
              boxShadow: `0 30px 120px rgba(0, 0, 0, 0.42), 0 0 0 1px ${accentAppearance.glow}`,
            }
          : undefined
      }
    >
      <div
        className={cn("pointer-events-none absolute inset-0 opacity-95", variantStyles.glow)}
        style={
          variant === "account" && accentAppearance
            ? {
                backgroundImage: `radial-gradient(circle at 16% 18%, ${accentAppearance.orb}, transparent 24%), radial-gradient(circle at 84% 16%, ${accentAppearance.glow}, transparent 28%)`,
              }
            : undefined
        }
      />
      <div className={cn("pointer-events-none absolute inset-0 opacity-25", variantStyles.grid)} />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent" />
      <div
        className={cn("pointer-events-none absolute border blur-3xl", variantStyles.orbA)}
        style={
          variant === "account" && accentAppearance
            ? {
                borderColor: accentAppearance.border,
                backgroundColor: accentAppearance.soft,
              }
            : undefined
        }
      />
      <div
        className={cn("pointer-events-none absolute border blur-3xl", variantStyles.orbB)}
        style={
          variant === "account" && accentAppearance
            ? {
                borderColor: accentAppearance.border,
                backgroundColor: accentAppearance.orb,
              }
            : undefined
        }
      />

      <DialogHeader className={cn("relative z-10 shrink-0 p-6 pb-0 sm:p-8 sm:pb-0", headerClassName)}>
        {headerAddon}
        <DialogTitle>{title}</DialogTitle>
        {description ? <DialogDescription className="text-zinc-400">{description}</DialogDescription> : null}
      </DialogHeader>
      <div className={cn("relative z-10 min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-6 sm:px-8", bodyClassName)}>
        <div className={cn("space-y-4", className)}>{children}</div>
      </div>
      {footer}
    </DialogContent>
  );
}
