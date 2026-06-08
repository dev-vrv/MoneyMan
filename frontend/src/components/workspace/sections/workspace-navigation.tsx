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
    <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
      <CardHeader className="p-5">
        <CardTitle className="text-white">{title}</CardTitle>
        <CardDescription className="text-zinc-400">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-5 pt-0">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition ${
                isActive
                  ? "border-emerald-300/20 bg-[linear-gradient(90deg,rgba(16,185,129,0.24)_0%,rgba(16,185,129,0.08)_100%)] text-white"
                  : "border-white/8 bg-black/15 text-zinc-300 hover:bg-white/[0.04]"
              }`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  className={`inline-flex size-10 shrink-0 items-center justify-center rounded-2xl border ${
                    isActive ? "border-emerald-300/18 bg-emerald-300/10 text-emerald-100" : "border-white/8 bg-white/[0.04]"
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
