"use client";

import { type ReactNode, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type FinancialLoaderProps = {
  messages: Dictionary["loading"];
  icon?: ReactNode;
};

type FinancialLoaderVisualProps = {
  icon?: ReactNode;
  className?: string;
};

const loaderBars = [
  { height: "h-10", delay: "0ms" },
  { height: "h-16", delay: "120ms" },
  { height: "h-24", delay: "240ms" },
  { height: "h-14", delay: "360ms" },
];

export function FinancialLoaderVisual({
  icon = "$",
  className,
}: FinancialLoaderVisualProps) {
  return (
    <div
      className={cn(
        "relative flex h-40 w-40 items-center justify-center",
        className,
      )}
    >
      <div className="finance-loader-ring absolute inset-0 rounded-full border border-emerald-300/15" />
      <div className="finance-loader-ring finance-loader-ring-delayed absolute inset-3 rounded-full border border-lime-300/10" />

      <div className="absolute bottom-8 flex items-end gap-2">
        {loaderBars.map((bar) => (
          <div
            key={`${bar.height}-${bar.delay}`}
            className={`finance-loader-bar ${bar.height} w-3 rounded-full bg-gradient-to-t from-emerald-500/35 via-emerald-300/80 to-lime-200`}
            style={{ animationDelay: bar.delay }}
          />
        ))}
      </div>

      <div className="finance-loader-coin absolute flex h-12 w-12 items-center justify-center rounded-full border border-emerald-200/30 bg-emerald-300/12 text-lg font-semibold text-emerald-100 shadow-[0_0_30px_rgba(74,222,128,0.18)]">
        {icon}
      </div>
    </div>
  );
}

export function FinancialLoader({ messages, icon }: FinancialLoaderProps) {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const rootNode = rootRef.current;

    return () => {
      if (!rootNode || typeof document === "undefined") {
        return;
      }

      const clone = rootNode.cloneNode(true) as HTMLElement;
      clone.classList.add("finance-loader-exit-clone");
      document.body.appendChild(clone);

      window.requestAnimationFrame(() => {
        clone.classList.add("finance-loader-exit-active");
      });

      window.setTimeout(() => {
        clone.remove();
      }, 320);
    };
  }, []);

  return (
    <main
      ref={rootRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.16),_transparent_24%),linear-gradient(180deg,_#040806_0%,_#08110d_44%,_#040705_100%)] px-6"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      <div className="absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />

      <section className="relative z-10 flex w-full max-w-md flex-col items-center gap-8 rounded-[2rem] border border-white/8 bg-white/[0.045] px-8 py-10 text-center shadow-[0_0_80px_rgba(34,197,94,0.08)] backdrop-blur-2xl">
        <FinancialLoaderVisual icon={icon} />

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/70">
            {messages.brand}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            {messages.title}
          </h1>
          <p className="text-sm leading-7 text-slate-300">
            {messages.description}
          </p>
        </div>
      </section>
    </main>
  );
}
