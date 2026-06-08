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
}: WorkspaceDialogShellProps) {
  return (
    <DialogContent
      className={cn(
        "flex h-[min(88vh,56rem)] w-[min(96vw,64rem)] max-w-none flex-col overflow-hidden rounded-[2rem] border-white/10 bg-[#07110c] p-0 text-zinc-100 sm:max-w-none",
        contentClassName,
      )}
    >
      <DialogHeader className={cn("shrink-0 p-6 pb-0 sm:p-8 sm:pb-0", headerClassName)}>
        {headerAddon}
        <DialogTitle>{title}</DialogTitle>
        {description ? <DialogDescription className="text-zinc-400">{description}</DialogDescription> : null}
      </DialogHeader>
      <div className={cn("min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-6 sm:px-8", bodyClassName)}>
        <div className={cn("space-y-4", className)}>{children}</div>
      </div>
      {footer}
    </DialogContent>
  );
}
