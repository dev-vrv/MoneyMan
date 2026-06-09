"use client";

import Link from "next/link";
import type { IconType } from "react-icons";
import { RiArrowRightUpLine } from "react-icons/ri";

import type { WorkspaceSection } from "@/components/workspace/finance-workspace.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type NavigationItem = {
  id: WorkspaceSection;
  href: string;
  label: string;
  icon: IconType;
};

type WorkspaceNavigationProps = {
  items: readonly NavigationItem[];
  activeSection: WorkspaceSection;
  title: string;
  description: string;
};

export function WorkspaceNavigation({
  items,
  activeSection,
  title,
  description,
}: WorkspaceNavigationProps) {
  return (
    <Card className="surface-panel relative overflow-hidden rounded-[2rem] border-white/10 bg-[linear-gradient(180deg,rgba(9,18,16,0.92)_0%,rgba(7,11,13,0.98)_100%)] py-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(16,185,129,0.14),transparent_22%),linear-gradient(150deg,rgba(255,255,255,0.04),transparent_42%,rgba(56,189,248,0.05)_78%,transparent)]" />
      <CardHeader className="p-5">
        <CardTitle className="text-white">{title}</CardTitle>
        <CardDescription className="text-zinc-400">{description}</CardDescription>
      </CardHeader>
      <CardContent className="relative space-y-2 p-5 pt-0">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition ${
                isActive
                  ? "border-emerald-300/22 bg-[linear-gradient(90deg,rgba(5,150,105,0.3)_0%,rgba(16,185,129,0.1)_58%,rgba(56,189,248,0.08)_100%)] text-white shadow-[0_12px_28px_rgba(16,185,129,0.14)]"
                  : "border-white/10 bg-[rgba(10,16,12,0.72)] text-zinc-300 hover:border-emerald-300/14 hover:bg-white/[0.06]"
              }`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  className={`inline-flex size-10 shrink-0 items-center justify-center rounded-2xl border ${
                    isActive ? "border-emerald-300/18 bg-emerald-300/10 text-emerald-100" : "border-white/10 bg-[rgba(255,255,255,0.04)]"
                  }`}
                >
                  <Icon className="size-4" />
                </span>
                <span className="truncate text-sm font-medium">{item.label}</span>
              </span>
              <RiArrowRightUpLine className="size-4 shrink-0" />
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
