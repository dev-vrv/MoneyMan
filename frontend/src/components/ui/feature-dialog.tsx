"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type FeatureDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  dialogClassName?: string;
  surfaceClassName?: string;
  bodyClassName?: string;
  glowClassName?: string;
  patternClassName?: string;
  decorations?: ReactNode;
  showCloseButton?: boolean;
  navigation?: {
    currentIndex: number;
    total: number;
    previousLabel: string;
    nextLabel: string;
    onPrevious: () => void;
    onNext: () => void;
  };
};

export function FeatureDialog({
  open,
  onOpenChange,
  children,
  dialogClassName,
  surfaceClassName,
  bodyClassName,
  glowClassName,
  patternClassName,
  decorations,
  showCloseButton = true,
  navigation,
}: FeatureDialogProps) {
  useEffect(() => {
    if (!open || !navigation) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigation.onPrevious();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        navigation.onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigation, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={showCloseButton} className={dialogClassName}>
        <div className={cn("relative overflow-hidden rounded-[inherit]", surfaceClassName)}>
          {glowClassName ? <div className={cn("absolute inset-0", glowClassName)} /> : null}
          <div
            className={cn(
              "absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:28px_28px] opacity-20",
              patternClassName,
            )}
          />
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
          {decorations}

          <div className={cn("relative z-10 p-6 sm:p-8", bodyClassName)}>
            {children}

            {navigation ? (
              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={navigation.onPrevious}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                  aria-label={navigation.previousLabel}
                >
                  <RiArrowLeftLine className="size-4" />
                  {navigation.previousLabel}
                </button>
                <div className="text-[0.68rem] uppercase tracking-[0.18em] text-white/44">
                  {String(navigation.currentIndex + 1).padStart(2, "0")} / {String(navigation.total).padStart(2, "0")}
                </div>
                <button
                  type="button"
                  onClick={navigation.onNext}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                  aria-label={navigation.nextLabel}
                >
                  {navigation.nextLabel}
                  <RiArrowRightLine className="size-4" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
