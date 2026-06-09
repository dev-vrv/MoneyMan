"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  RiArrowRightLine,
  RiArrowRightUpLine,
  RiDatabase2Line,
  RiFingerprintLine,
  RiLock2Line,
  RiRadarLine,
  RiShieldCheckLine,
} from "react-icons/ri";

import { MarketingPageIntro } from "@/components/marketing/marketing-page-intro";
import { FaqAccordionShowcase } from "@/components/ui/faq-accordion-showcase";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FeatureDialog } from "@/components/ui/feature-dialog";
import { getLocalizedPath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

type SecurityPageExperienceProps = {
  locale: Locale;
  page: Dictionary["pages"]["security"];
};

const visualCardStyles = [
  {
    icon: RiLock2Line,
    cardClassName:
      "border-cyan-300/20 bg-[linear-gradient(180deg,rgba(8,20,28,0.92),rgba(7,10,16,0.98))] hover:border-cyan-200/34 hover:shadow-[0_20px_70px_rgba(6,18,32,0.34)]",
    glowClassName:
      "bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.2),transparent_24%),radial-gradient(circle_at_84%_80%,rgba(59,130,246,0.16),transparent_26%)]",
    patternClassName:
      "bg-[linear-gradient(135deg,rgba(34,211,238,0.12)_0,rgba(34,211,238,0.12)_2px,transparent_2px,transparent_18px)] bg-[size:22px_22px]",
    badgeClassName: "text-cyan-100/65",
    accentClassName: "bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.55)]",
    modalClassName:
      "border-cyan-300/20 bg-[linear-gradient(180deg,rgba(7,18,28,0.99),rgba(6,9,15,1))] text-white shadow-[0_28px_100px_rgba(0,0,0,0.42)]",
    modalGlowClassName:
      "bg-[radial-gradient(circle_at_18%_16%,rgba(34,211,238,0.18),transparent_24%),radial-gradient(circle_at_82%_84%,rgba(59,130,246,0.14),transparent_26%)]",
  },
  {
    icon: RiDatabase2Line,
    cardClassName:
      "border-amber-300/20 bg-[linear-gradient(180deg,rgba(28,18,8,0.92),rgba(7,10,16,0.98))] hover:border-amber-200/34 hover:shadow-[0_20px_70px_rgba(34,20,8,0.34)]",
    glowClassName:
      "bg-[radial-gradient(circle_at_18%_18%,rgba(251,191,36,0.2),transparent_24%),radial-gradient(circle_at_82%_80%,rgba(249,115,22,0.16),transparent_26%)]",
    patternClassName:
      "bg-[radial-gradient(circle,rgba(251,191,36,0.14)_1.5px,transparent_1.5px)] bg-[size:18px_18px]",
    badgeClassName: "text-amber-100/65",
    accentClassName: "bg-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.55)]",
    modalClassName:
      "border-amber-300/20 bg-[linear-gradient(180deg,rgba(28,18,8,0.99),rgba(6,9,15,1))] text-white shadow-[0_28px_100px_rgba(0,0,0,0.42)]",
    modalGlowClassName:
      "bg-[radial-gradient(circle_at_16%_16%,rgba(251,191,36,0.18),transparent_24%),radial-gradient(circle_at_84%_82%,rgba(249,115,22,0.14),transparent_26%)]",
  },
  {
    icon: RiRadarLine,
    cardClassName:
      "border-emerald-300/20 bg-[linear-gradient(180deg,rgba(8,23,18,0.92),rgba(7,10,16,0.98))] hover:border-emerald-200/34 hover:shadow-[0_20px_70px_rgba(8,24,18,0.34)]",
    glowClassName:
      "bg-[radial-gradient(circle_at_22%_18%,rgba(74,222,128,0.2),transparent_24%),radial-gradient(circle_at_84%_80%,rgba(16,185,129,0.16),transparent_26%)]",
    patternClassName:
      "bg-[linear-gradient(to_right,rgba(74,222,128,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(74,222,128,0.08)_1px,transparent_1px)] bg-[size:22px_22px]",
    badgeClassName: "text-emerald-100/65",
    accentClassName: "bg-emerald-300 shadow-[0_0_18px_rgba(74,222,128,0.55)]",
    modalClassName:
      "border-emerald-300/20 bg-[linear-gradient(180deg,rgba(8,23,18,0.99),rgba(6,9,15,1))] text-white shadow-[0_28px_100px_rgba(0,0,0,0.42)]",
    modalGlowClassName:
      "bg-[radial-gradient(circle_at_18%_18%,rgba(74,222,128,0.18),transparent_24%),radial-gradient(circle_at_82%_84%,rgba(16,185,129,0.14),transparent_26%)]",
  },
  {
    icon: RiFingerprintLine,
    cardClassName:
      "border-sky-300/20 bg-[linear-gradient(180deg,rgba(8,18,28,0.92),rgba(7,10,16,0.98))] hover:border-sky-200/34 hover:shadow-[0_20px_70px_rgba(8,18,30,0.34)]",
    glowClassName:
      "bg-[radial-gradient(circle_at_18%_18%,rgba(125,211,252,0.18),transparent_24%),radial-gradient(circle_at_84%_80%,rgba(96,165,250,0.16),transparent_26%)]",
    patternClassName:
      "bg-[linear-gradient(135deg,rgba(125,211,252,0.08)_0,rgba(125,211,252,0.08)_1px,transparent_1px,transparent_15px),linear-gradient(45deg,rgba(96,165,250,0.06)_0,rgba(96,165,250,0.06)_1px,transparent_1px,transparent_15px)] bg-[size:18px_18px]",
    badgeClassName: "text-sky-100/65",
    accentClassName: "bg-sky-300 shadow-[0_0_18px_rgba(125,211,252,0.55)]",
    modalClassName:
      "border-sky-300/20 bg-[linear-gradient(180deg,rgba(8,18,28,0.99),rgba(6,9,15,1))] text-white shadow-[0_28px_100px_rgba(0,0,0,0.42)]",
    modalGlowClassName:
      "bg-[radial-gradient(circle_at_18%_18%,rgba(125,211,252,0.18),transparent_24%),radial-gradient(circle_at_82%_84%,rgba(96,165,250,0.14),transparent_26%)]",
  },
] as const;

export function SecurityPageExperience({
  locale,
  page,
}: SecurityPageExperienceProps) {
  const [selectedVisualIndex, setSelectedVisualIndex] = useState<number | null>(null);
  const selectedVisualItem = useMemo(
    () => (selectedVisualIndex === null ? null : page.visual.items[selectedVisualIndex] ?? null),
    [page.visual.items, selectedVisualIndex],
  );
  const selectedVisualStyle = selectedVisualIndex === null
    ? visualCardStyles[0]
    : visualCardStyles[selectedVisualIndex % visualCardStyles.length];
  const visualNodes = useMemo(
    () => [
      {
        item: page.visual.items[0],
        className: "left-[14%] top-[20%]",
        lineClassName:
          "left-[18%] top-[24%] h-px w-[28%] rotate-[18deg] bg-[linear-gradient(90deg,rgba(34,211,238,0.7),rgba(34,211,238,0))]",
        dotClassName: "bg-cyan-300",
        labelClassName: "-left-3 top-4 items-start text-cyan-100/82",
      },
      {
        item: page.visual.items[1],
        className: "right-[15%] top-[26%]",
        lineClassName:
          "right-[21%] top-[31%] h-px w-[24%] -rotate-[28deg] bg-[linear-gradient(90deg,rgba(74,222,128,0.7),rgba(74,222,128,0))]",
        dotClassName: "bg-emerald-300 [animation-delay:0.8s]",
        labelClassName: "right-[-0.25rem] top-4 items-end text-right text-emerald-100/82",
      },
      {
        item: page.visual.items[2],
        className: "bottom-[16%] left-[20%]",
        lineClassName:
          "bottom-[26%] left-[27%] h-px w-[22%] rotate-[42deg] bg-[linear-gradient(90deg,rgba(255,255,255,0.7),rgba(255,255,255,0))]",
        dotClassName: "bg-white [animation-delay:1.6s]",
        labelClassName: "-left-3 bottom-4 items-start text-white/80",
      },
      {
        item: page.visual.items[3],
        className: "bottom-[22%] right-[14%]",
        lineClassName:
          "bottom-[28%] right-[21%] h-px w-[20%] -rotate-[46deg] bg-[linear-gradient(90deg,rgba(125,211,252,0.76),rgba(125,211,252,0))]",
        dotClassName: "bg-sky-300 [animation-delay:2.2s]",
        labelClassName: "bottom-4 right-[-0.25rem] items-end text-right text-sky-100/82",
      },
    ].filter((node) => node.item),
    [page.visual.items],
  );

  const securityCopy = useMemo(() => {
    switch (locale) {
      case "ru":
        return {
          open: "Открыть подробнее",
          inDetail: "Подробно",
          previous: "Назад",
          next: "Далее",
          security: "Безопасность",
        };
      case "kg":
        return {
          open: "Толугураак ачуу",
          inDetail: "Толугураак",
          previous: "Артка",
          next: "Кийинки",
          security: "Коопсуздук",
        };
      default:
        return {
          open: "Open details",
          inDetail: "In detail",
          previous: "Previous",
          next: "Next",
          security: "Security",
        };
    }
  }, [locale]);

  return (
    <div className="px-6 sm:px-10 lg:px-12">
      <section className="relative z-10 py-14 lg:py-16">
        <div className="min-w-0">
          <MarketingPageIntro
            eyebrow={page.eyebrow}
            title={page.title}
            description={page.description}
            maxWidthClassName="max-w-3xl"
          />
        </div>

        <ScrollReveal delay={0.1} distance={28} blur={12}>
          <aside className="relative z-20 mt-8 overflow-visible rounded-[2.4rem] border border-cyan-300/14 bg-[linear-gradient(180deg,rgba(8,13,18,0.98),rgba(5,8,14,1))] p-6 shadow-[0_32px_120px_rgba(0,0,0,0.34)] sm:p-7">
            <div className="security-command-grid absolute inset-0 opacity-45" />
            <div className="security-aurora absolute inset-0" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(34,211,238,0.12),transparent_22%),radial-gradient(circle_at_78%_22%,rgba(74,222,128,0.08),transparent_20%),radial-gradient(circle_at_54%_88%,rgba(59,130,246,0.1),transparent_24%)]" />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-4">
                <div className="inline-flex rounded-full border border-cyan-300/16 bg-cyan-300/10 px-3 py-1 text-[0.66rem] uppercase tracking-[0.18em] text-cyan-50">
                  {page.visual.title}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/16 bg-emerald-300/10 px-3 py-1 text-[0.66rem] uppercase tracking-[0.16em] text-emerald-100">
                  <span className="security-node size-2 rounded-full bg-emerald-300" />
                  {page.visual.badge}
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(15rem,0.92fr)] lg:items-center">
                <div className="relative mx-auto aspect-square w-full max-w-[25rem]">
                  <div className="absolute inset-[7%] rounded-[2rem] border border-cyan-300/18 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] rotate-45" />
                  <div className="absolute inset-[18%] rounded-[1.7rem] border border-emerald-300/16 bg-[linear-gradient(135deg,rgba(52,211,153,0.05),rgba(34,211,238,0.02))] -rotate-[18deg]" />
                  <div className="absolute inset-[10%] rounded-full border border-white/8 security-ring security-ring-delay" />
                  <div className="absolute inset-[22%] rounded-full border border-cyan-300/16 security-ring" />
                  <div className="absolute inset-[34%] rounded-full border border-emerald-300/18 security-ring security-ring-slow" />
                  <div className="security-scan absolute inset-[12%] rounded-full" />
                  <div className="absolute inset-[26%] rounded-full border border-white/8 bg-[radial-gradient(circle,rgba(9,18,26,0.9)_0%,rgba(7,10,16,0.98)_72%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_22px_80px_rgba(0,0,0,0.3)]" />
                  <div className="absolute left-1/2 top-1/2 z-10 flex size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[1.8rem] border border-cyan-300/18 bg-[linear-gradient(135deg,rgba(11,20,28,0.96),rgba(8,11,18,0.99))] shadow-[0_0_0_1px_rgba(34,211,238,0.06),0_16px_42px_rgba(0,0,0,0.26)] before:absolute before:inset-[-0.55rem] before:rounded-[2.2rem] before:border before:border-cyan-300/14 before:content-[''] before:animate-[pulse_4.6s_ease-in-out_infinite]">
                    <RiShieldCheckLine className="size-10 animate-[pulse_3.2s_ease-in-out_infinite] text-cyan-100 drop-shadow-[0_0_16px_rgba(34,211,238,0.4)]" />
                  </div>

                  {visualNodes.map((node, index) => (
                    <div key={`${node.item.label}-${index}`}>
                      <div className={cn("absolute", node.lineClassName)} />
                      <button
                        type="button"
                        onClick={() => setSelectedVisualIndex(index)}
                        className={cn(
                          "group absolute z-30 flex min-w-[7.5rem] flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60",
                          node.className,
                        )}
                      >
                        <span
                          className={cn(
                            "security-node relative block size-3 rounded-full shadow-[0_0_0_6px_rgba(255,255,255,0.03)] transition-transform duration-300 group-hover:scale-110 after:absolute after:left-1/2 after:top-1/2 after:size-6 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:opacity-55 after:blur-[1px] after:content-[''] after:animate-[ping_2.8s_ease-out_infinite]",
                            node.dotClassName,
                          )}
                        />
                        <span
                          className={cn(
                            "absolute flex min-w-[6rem] flex-col gap-0.5 whitespace-nowrap",
                            node.labelClassName,
                          )}
                        >
                          <span className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-white/44">
                            {node.item.label}
                          </span>
                          <span className="text-[0.8rem] font-semibold leading-none text-white">
                            {node.item.value}
                          </span>
                        </span>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <p className="text-sm leading-7 text-slate-300">
                    {page.visual.description}
                  </p>

                  <div className="space-y-3">
                    {page.visual.items.map((item, index) => (
                      (() => {
                        const style = visualCardStyles[index % visualCardStyles.length];
                        const Icon = style.icon;

                        return (
                      <button
                        type="button"
                        key={`${item.label}-${index}`}
                        onClick={() => setSelectedVisualIndex(index)}
                        className={cn(
                          "group relative block w-full overflow-hidden rounded-[1rem] border px-3.5 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60",
                          "animate-[float_8s_ease-in-out_infinite]",
                          style.cardClassName,
                        )}
                        style={{ animationDelay: `${index * 0.8}s` }}
                      >
                        <div className={cn("absolute inset-0 opacity-90", style.glowClassName)} />
                        <div className={cn("absolute inset-0 opacity-30", style.patternClassName)} />
                        <div className="absolute -right-8 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full bg-white/8 blur-3xl transition duration-300 group-hover:bg-white/12" />
                        <div className="flex items-start justify-between gap-4">
                          <div className="relative z-10">
                            <div className="inline-flex size-8 items-center justify-center rounded-[0.82rem] border border-white/10 bg-black/18 text-white/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                              <Icon className="size-[1.05rem]" />
                            </div>
                            <div className="mt-1 text-[0.56rem] uppercase tracking-[0.14em] text-white/44">
                              {item.label}
                            </div>
                            <div className="mt-0.5 text-[0.86rem] font-semibold leading-[1.2] text-white">
                              {item.value}
                            </div>
                          </div>
                          <div className={cn("relative z-10 text-[0.58rem] uppercase tracking-[0.16em]", style.badgeClassName)}>
                            0{index + 1}
                          </div>
                        </div>
                        <div className="relative z-10 mt-1 text-[0.72rem] leading-[1.35] text-white/62">
                          {item.detail}
                        </div>
                        <div className="relative z-10 mt-2 flex items-center justify-between">
                          <span className={cn("inline-flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.16em]", style.badgeClassName)}>
                            <span className={cn("size-1.5 rounded-full", style.accentClassName)} />
                            {securityCopy.open}
                          </span>
                          <RiArrowRightLine className="relative z-10 size-3.5 text-white/68 transition duration-300 group-hover:translate-x-1 group-hover:text-white" />
                        </div>
                      </button>
                        );
                      })()
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </ScrollReveal>
      </section>

      <section className="relative z-10 py-10 lg:py-14">
        <FaqAccordionShowcase
          eyebrow={page.faq.eyebrow}
          title={page.faq.title}
          description={page.faq.description}
          items={page.faq.items}
          previousLabel={securityCopy.previous}
          nextLabel={securityCopy.next}
          sidebarVariant="compact"
        />

        <div className="relative mt-6 overflow-hidden rounded-[2rem] border border-cyan-300/12 bg-[linear-gradient(135deg,rgba(8,14,20,0.96),rgba(6,9,15,0.99))] px-5 py-6 shadow-[0_24px_90px_rgba(0,0,0,0.3)] sm:px-6 sm:py-7">
          <div className="security-command-grid absolute inset-0 opacity-35" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_24%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(74,222,128,0.16),transparent_24%),radial-gradient(circle_at_46%_100%,rgba(59,130,246,0.14),transparent_28%)]" />
          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.66rem] uppercase tracking-[0.16em] text-white/56">
                {securityCopy.security}
              </div>
              <h2 className="mt-3 text-[1.45rem] font-semibold leading-[1.12] tracking-[-0.04em] text-white sm:text-[1.7rem]">
                {page.cta.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {page.cta.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={getLocalizedPath(locale, "/contacts")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-300/20 bg-linear-to-r from-emerald-300 via-emerald-400 to-lime-300 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_32px_rgba(74,222,128,0.16)] transition hover:brightness-105"
              >
                {page.cta.primary}
                <RiArrowRightUpLine className="size-4 shrink-0" />
              </Link>

              <Link
                href={getLocalizedPath(locale, "/faq")}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/6 px-6 py-3 text-sm font-medium text-zinc-100 transition hover:border-cyan-300/18 hover:bg-white/8"
              >
                {page.cta.secondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FeatureDialog
        open={selectedVisualIndex !== null}
        onOpenChange={(open) => setSelectedVisualIndex(open ? selectedVisualIndex : null)}
        dialogClassName={cn("overflow-hidden rounded-[2rem] border p-0 max-w-[calc(100%-2rem)] sm:max-w-5xl", selectedVisualStyle.modalClassName)}
        glowClassName={selectedVisualStyle.modalGlowClassName}
        bodyClassName="p-6 sm:p-8"
        navigation={{
          currentIndex: selectedVisualIndex ?? 0,
          total: page.visual.items.length,
          previousLabel: securityCopy.previous,
          nextLabel: securityCopy.next,
          onPrevious: () => setSelectedVisualIndex((prev) => ((prev ?? 0) - 1 + page.visual.items.length) % page.visual.items.length),
          onNext: () => setSelectedVisualIndex((prev) => ((prev ?? 0) + 1) % page.visual.items.length),
        }}
      >
        {selectedVisualItem ? (
          <>
            <DialogHeader className="max-w-3xl pr-10">
              <div className="text-[0.68rem] uppercase tracking-[0.18em] text-white/46">
                {selectedVisualItem.label}
              </div>
              <DialogTitle className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-[2rem]">
                {selectedVisualItem.value}
              </DialogTitle>
              <DialogDescription className="text-sm leading-7 text-white/68">
                {selectedVisualItem.detail}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/18 p-5 sm:p-6">
              <div className="text-[0.68rem] uppercase tracking-[0.18em] text-white/42">
                {securityCopy.inDetail}
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-200/88">
                {selectedVisualItem.extended}
              </p>
            </div>
          </>
        ) : null}
      </FeatureDialog>
    </div>
  );
}
