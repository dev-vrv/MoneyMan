"use client";

import { useCallback, useState } from "react";
import clsx from "clsx";
import {
  RiArrowRightUpLine,
  RiBrainLine,
  RiCopperCoinLine,
  RiExchangeFundsLine,
  RiFlashlightLine,
} from "react-icons/ri";

import { HomeSectionHeading } from "@/components/home/home-section-heading";
import {
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { FeatureDialog } from "@/components/ui/feature-dialog";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

type UseCaseCard = {
  title: string;
  description: string;
  kicker: string;
  metric: string;
  accent: string;
  detailsTitle: string;
  detailsDescription: string;
  highlights: string[];
  outcomes: Array<{
    label: string;
    value: string;
  }>;
};

type HomeUseCasesSectionProps = {
  section: {
    eyebrow: string;
    title: string;
    description: string;
    modalCta: string;
    modalHighlightsTitle: string;
    previousLabel?: string;
    nextLabel?: string;
    cards: UseCaseCard[];
  };
};

const cardMeta = [
  {
    icon: RiCopperCoinLine,
    tone:
      "border-cyan-300/18 bg-[linear-gradient(180deg,rgba(8,21,32,0.94),rgba(7,13,22,0.98))] shadow-[0_24px_80px_rgba(34,211,238,0.14)]",
    iconTone: "border-cyan-300/20 bg-cyan-300/12 text-cyan-100",
    beam: "from-cyan-300/0 via-cyan-300/30 to-cyan-300/0",
    glow: "bg-cyan-300/14",
    dialogTone:
      "border-cyan-300/24 bg-[linear-gradient(180deg,rgba(6,20,31,0.96),rgba(4,11,19,0.99))] text-cyan-50 shadow-[0_32px_120px_rgba(34,211,238,0.18)]",
    dialogPanel: "border-cyan-300/14 bg-cyan-300/8",
    dialogBadge: "border-cyan-200/18 bg-cyan-200/10 text-cyan-50/90",
  },
  {
    icon: RiExchangeFundsLine,
    tone:
      "border-amber-300/18 bg-[linear-gradient(180deg,rgba(30,20,9,0.94),rgba(18,11,7,0.98))] shadow-[0_24px_80px_rgba(251,191,36,0.12)]",
    iconTone: "border-amber-300/20 bg-amber-300/12 text-amber-100",
    beam: "from-amber-300/0 via-amber-300/30 to-amber-300/0",
    glow: "bg-amber-300/14",
    dialogTone:
      "border-amber-300/24 bg-[linear-gradient(180deg,rgba(31,20,7,0.96),rgba(17,11,5,0.99))] text-amber-50 shadow-[0_32px_120px_rgba(251,191,36,0.18)]",
    dialogPanel: "border-amber-300/14 bg-amber-300/8",
    dialogBadge: "border-amber-200/18 bg-amber-200/10 text-amber-50/90",
  },
  {
    icon: RiBrainLine,
    tone:
      "border-fuchsia-300/18 bg-[linear-gradient(180deg,rgba(28,12,27,0.94),rgba(14,8,21,0.98))] shadow-[0_24px_80px_rgba(232,121,249,0.12)]",
    iconTone: "border-fuchsia-300/20 bg-fuchsia-300/12 text-fuchsia-100",
    beam: "from-fuchsia-300/0 via-fuchsia-300/30 to-fuchsia-300/0",
    glow: "bg-fuchsia-300/14",
    dialogTone:
      "border-fuchsia-300/24 bg-[linear-gradient(180deg,rgba(29,11,31,0.96),rgba(13,7,18,0.99))] text-fuchsia-50 shadow-[0_32px_120px_rgba(232,121,249,0.18)]",
    dialogPanel: "border-fuchsia-300/14 bg-fuchsia-300/8",
    dialogBadge: "border-fuchsia-200/18 bg-fuchsia-200/10 text-fuchsia-50/90",
  },
] as const;

const useCaseFloatClassNames = [
  "section-card-float",
  "section-card-float section-card-float-alt-1 section-card-float-delay-1",
  "section-card-float section-card-float-alt-2 section-card-float-delay-2",
] as const;

function renderUseCasePattern(index: number) {
  switch (index) {
    case 0:
      return (
        <>
          <div className="absolute right-5 top-6 flex w-20 items-end gap-2 opacity-70">
            <span className="h-8 w-3 rounded-full bg-white/10" />
            <span className="h-12 w-3 rounded-full bg-white/14" />
            <span className="h-16 w-3 rounded-full bg-cyan-100/18" />
          </div>
          <div className="absolute right-5 top-10 h-px w-20 bg-gradient-to-r from-transparent via-white/12 to-transparent" />
          <div className="absolute right-9 top-24 h-2 w-2 rounded-full bg-cyan-100/45" />
        </>
      );
    case 1:
      return (
        <>
          <div className="absolute right-5 top-8 h-16 w-16 rounded-full border border-white/12 opacity-80" />
          <div className="absolute right-9 top-12 h-8 w-8 rounded-full border border-amber-100/18" />
          <div className="absolute right-7 top-[4.5rem] h-px w-10 bg-gradient-to-r from-transparent via-amber-100/24 to-transparent" />
        </>
      );
    default:
      return (
        <>
          <div className="absolute right-5 top-8 h-14 w-14 rotate-45 border border-white/14 opacity-80" />
          <div className="absolute right-9 top-12 h-6 w-6 rotate-45 border border-fuchsia-100/18" />
          <div className="absolute right-6 top-7 h-2 w-2 rounded-full bg-fuchsia-100/46 shadow-[0_0_10px_rgba(244,114,182,0.34)]" />
        </>
      );
  }
}

export function HomeUseCasesSection({ section }: HomeUseCasesSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const activeCard = openIndex === null ? null : section.cards[openIndex];
  const activeMeta = openIndex === null ? null : cardMeta[openIndex];
  const stepModalCard = useCallback((direction: -1 | 1) => {
    setOpenIndex((current) => {
      if (current === null || section.cards.length === 0) {
        return current;
      }

      return (current + direction + section.cards.length) % section.cards.length;
    });
  }, [section.cards.length]);

  return (
    <section className="relative z-10 flex min-h-screen items-center">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
        <HomeSectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {section.cards.map((card, index) => {
            const meta = cardMeta[index];
            const Icon = meta.icon;
            const isActive = hoveredIndex === index || focusedIndex === index;

            return (
              <ScrollReveal
                key={card.title}
                delay={0.08 + index * 0.1}
                distance={30}
                blur={12}
              >
                <div className={clsx("h-full", useCaseFloatClassNames[index % useCaseFloatClassNames.length])}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(index)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                    className={clsx(
                      "group relative flex min-h-[22rem] h-full w-full flex-col overflow-hidden rounded-[1.8rem] border px-5 py-6 text-left backdrop-blur-2xl transition duration-500 ease-out sm:min-h-[24rem] sm:px-6 sm:py-7",
                      meta.tone,
                      isActive
                        ? "translate-y-[-6px] scale-[1.01]"
                        : "translate-y-0 opacity-90 hover:translate-y-[-4px] hover:opacity-100",
                    )}
                  >
                    <div
                      className={clsx(
                        "absolute inset-x-6 top-0 h-px bg-gradient-to-r",
                        meta.beam,
                      )}
                    />
                    <div
                      className={clsx(
                        "absolute -right-8 top-6 h-28 w-28 rounded-full blur-3xl transition duration-500",
                        meta.glow,
                        isActive ? "opacity-100 scale-100" : "opacity-50 scale-90",
                      )}
                    />
                    <div className="absolute inset-y-0 right-0 w-28 opacity-90">
                      {renderUseCasePattern(index)}
                    </div>
                    <div className="absolute inset-x-5 bottom-9 h-px bg-white/8 sm:inset-x-6" />

                    <div className="relative z-10 flex h-full flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div
                          className={clsx(
                            "inline-flex rounded-[1rem] border p-3 transition duration-500",
                            meta.iconTone,
                            isActive ? "scale-105" : "scale-100",
                          )}
                        >
                          <Icon className="size-5" />
                        </div>
                        <div className="shrink-0 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-white/64">
                          {card.metric}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col pr-16 sm:pr-20">
                        <div className="mt-5 text-[0.66rem] uppercase tracking-[0.16em] text-white/48">
                          {card.kicker}
                        </div>
                        <h3 className="mt-2 text-xl font-semibold tracking-tight text-white text-balance">
                          {card.title}
                        </h3>
                        <p className="mt-3 flex-1 text-sm leading-6 text-white/74">
                          {card.description}
                        </p>
                      </div>

                      <div className="mt-6 flex items-center justify-between gap-4">
                        <div className="flex gap-1.5">
                          {section.cards.map((_, dotIndex) => (
                            <span
                              key={dotIndex}
                              className={clsx(
                                "h-1.5 rounded-full transition-all",
                                dotIndex === index
                                  ? "w-6 bg-white/70"
                                  : "w-1.5 bg-white/20",
                              )}
                            />
                          ))}
                        </div>
                        <div className="text-right text-[0.68rem] uppercase tracking-[0.16em] text-white/44">
                          {card.accent}
                        </div>
                      </div>
                      <div className="mt-6 inline-flex items-center gap-2 rounded-full py-3.5 text-[0.68rem] uppercase tracking-[0.16em] text-white/52">
                        <span>{section.modalCta}</span>
                        <RiArrowRightUpLine className="size-3.5" />
                      </div>
                    </div>
                  </button>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      <FeatureDialog
        open={openIndex !== null}
        onOpenChange={(open) => {
          if (!open) {
            setOpenIndex(null);
          }
        }}
        dialogClassName={clsx(
          "max-h-[calc(100vh-2rem)] overflow-y-auto rounded-[1.9rem] border p-0 sm:max-w-4xl",
          activeMeta?.dialogTone,
        )}
        decorations={
          <>
            <div className={clsx("absolute -right-10 top-8 h-40 w-40 rounded-full blur-3xl", activeMeta?.glow)} />
            <div className="absolute inset-y-0 right-0 w-40 opacity-80">
              {renderUseCasePattern(openIndex ?? 0)}
            </div>
          </>
        }
        navigation={{
          currentIndex: openIndex ?? 0,
          total: section.cards.length,
          previousLabel: section.previousLabel ?? "Previous",
          nextLabel: section.nextLabel ?? "Next",
          onPrevious: () => stepModalCard(-1),
          onNext: () => stepModalCard(1),
        }}
      >
        {activeCard && activeMeta ? (
          <>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className={clsx(
                      "inline-flex rounded-[1rem] border p-3",
                      activeMeta.iconTone,
                    )}
                  >
                    <activeMeta.icon className="size-5" />
                  </div>
                  <div
                    className={clsx(
                      "rounded-full border px-3 py-1 text-[0.68rem] uppercase tracking-[0.16em]",
                      activeMeta.dialogBadge,
                    )}
                  >
                    {activeCard.metric}
                  </div>
                </div>

                <div className="mt-5 text-[0.68rem] uppercase tracking-[0.16em] text-white/56">
                  {activeCard.kicker}
                </div>
                <DialogTitle className="mt-2 text-3xl font-semibold tracking-tight text-white">
                  {activeCard.detailsTitle}
                </DialogTitle>
                <DialogDescription className="mt-3 max-w-2xl text-base leading-7 text-white/74">
                  {activeCard.detailsDescription}
                </DialogDescription>
              </div>

              <div
                className={clsx(
                  "min-w-40 rounded-[1.4rem] border p-4",
                  activeMeta.dialogPanel,
                )}
              >
                <div className="text-[0.66rem] uppercase tracking-[0.16em] text-white/48">
                  {activeCard.accent}
                </div>
                <div className="mt-3 text-sm leading-6 text-white/72">
                  {activeCard.description}
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {activeCard.outcomes.map((item) => (
                <div
                  key={item.label}
                  className={clsx(
                    "rounded-[1.3rem] border p-4",
                    activeMeta.dialogPanel,
                  )}
                >
                  <div className="text-[0.66rem] uppercase tracking-[0.16em] text-white/48">
                    {item.label}
                  </div>
                  <div className="mt-2 text-sm font-medium leading-6 text-white/84">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div
              className={clsx(
                "mt-6 rounded-[1.6rem] border p-5 sm:p-6",
                activeMeta.dialogPanel,
              )}
            >
              <div className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.16em] text-white/58">
                <RiFlashlightLine className="size-4" />
                <span>{section.modalHighlightsTitle}</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {activeCard.highlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.15rem] border border-white/10 bg-white/6 px-4 py-3 text-sm leading-6 text-white/80"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </FeatureDialog>
    </section>
  );
}
