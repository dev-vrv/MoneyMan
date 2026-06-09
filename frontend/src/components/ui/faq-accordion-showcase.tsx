"use client";

import { useEffect, useRef, useState } from "react";
import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type FaqAccordionItem = {
  question: string;
  answer: string;
};

type FaqAccordionShowcaseProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: FaqAccordionItem[];
  previousLabel: string;
  nextLabel: string;
  className?: string;
  sidebarVariant?: "default" | "compact";
};

const faqCardGlowStyles = [
  "bg-[radial-gradient(circle_at_14%_18%,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(59,130,246,0.1),transparent_24%)]",
  "bg-[radial-gradient(circle_at_18%_18%,rgba(74,222,128,0.14),transparent_28%),radial-gradient(circle_at_84%_82%,rgba(34,211,238,0.08),transparent_24%)]",
  "bg-[radial-gradient(circle_at_18%_82%,rgba(251,191,36,0.12),transparent_26%),radial-gradient(circle_at_82%_16%,rgba(74,222,128,0.1),transparent_22%)]",
] as const;

const faqCardNeonShadowStyles = [
  "bg-[radial-gradient(circle,rgba(34,211,238,0.32)_0%,rgba(14,116,144,0.18)_42%,transparent_76%)]",
  "bg-[radial-gradient(circle,rgba(74,222,128,0.28)_0%,rgba(13,148,136,0.16)_42%,transparent_76%)]",
  "bg-[radial-gradient(circle,rgba(251,191,36,0.26)_0%,rgba(249,115,22,0.16)_42%,transparent_76%)]",
] as const;

export function FaqAccordionShowcase({
  eyebrow,
  title,
  description,
  items,
  previousLabel,
  nextLabel,
  className,
  sidebarVariant = "default",
}: FaqAccordionShowcaseProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const hasMountedRef = useRef(false);
  const activeIndex = items.length ? Math.min(selectedIndex, items.length - 1) : 0;
  const progress = items.length
    ? items.length === 1
      ? 100
      : (activeIndex / (items.length - 1)) * 100
    : 0;

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const activeItem = itemRefs.current[activeIndex];
    activeItem?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [activeIndex]);

  return (
    <div className={cn("grid gap-6 xl:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] xl:items-start", className)}>
      <div className="relative z-30 max-w-2xl">
        <div className="sticky top-24 z-30">
          <div
            className={cn(
              "relative rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(9,14,18,0.9),rgba(7,10,16,0.97))] shadow-[0_20px_70px_rgba(0,0,0,0.24)]",
              sidebarVariant === "compact" ? "p-5 sm:p-6" : "p-6 sm:p-7",
            )}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_82%_82%,rgba(74,222,128,0.12),transparent_26%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:26px_26px] opacity-15" />
            <div className="relative z-10">
              <div className="inline-flex rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-white/52">
                {eyebrow}
              </div>
              <div
                className={cn(
                  "font-semibold leading-[1.14] tracking-[-0.04em] text-white",
                  sidebarVariant === "compact"
                    ? "mt-3 text-[1.65rem] sm:text-[1.85rem]"
                    : "mt-4 text-2xl sm:text-[2rem]",
                )}
              >
                {title}
              </div>
              <p
                className={cn(
                  "max-w-xl text-slate-300",
                  sidebarVariant === "compact"
                    ? "mt-3 text-sm leading-6"
                    : "mt-4 text-sm leading-7",
                )}
              >
                {description}
              </p>
              <div className="mt-6">
                <div className="relative h-10">
                  <div className="absolute left-5 right-5 top-1/2 h-px -translate-y-1/2 bg-white/10" />
                  <div
                    className="absolute left-5 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-cyan-300/70 via-cyan-200/80 to-emerald-300/75 transition-all duration-500 ease-out"
                    style={{ width: `calc((100% - 2.5rem) * ${progress / 100})` }}
                  />
                  <div className="absolute inset-x-2 top-1/2 flex -translate-y-1/2 items-center justify-between">
                    {items.map((item, index) => (
                      <button
                        key={`${item.question}-marker-${index}`}
                        type="button"
                      onClick={() => setSelectedIndex(index)}
                      className="group relative flex size-6 items-center justify-center"
                      aria-label={item.question}
                    >
                        <span
                          className={cn(
                            "block size-2 rounded-full border transition duration-300",
                            index === activeIndex
                              ? "border-cyan-200 bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.5)]"
                              : index < activeIndex
                                ? "border-emerald-200/70 bg-emerald-300/90 shadow-[0_0_12px_rgba(74,222,128,0.32)]"
                                : "border-white/20 bg-white/10 hover:border-cyan-300/45 hover:bg-cyan-300/30",
                          )}
                        />
                        <span className="pointer-events-none absolute bottom-full left-1/2 z-[120] mb-2 w-max max-w-[14rem] -translate-x-1/2 rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(9,14,18,0.98),rgba(7,10,16,1))] px-3 py-2 text-left text-[0.72rem] leading-5 text-white/86 opacity-0 shadow-[0_16px_40px_rgba(0,0,0,0.28)] transition duration-200 group-hover:opacity-100">
                          {item.question}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div
                    className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
                    style={{ left: `calc(1.25rem + (100% - 2.5rem) * ${progress / 100})` }}
                  >
                    <div className="relative size-2.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.5)] animate-[pulse_2.8s_ease-in-out_infinite]">
                      <div className="absolute -inset-2 rounded-full border border-cyan-300/20 animate-[ping_3.2s_ease-out_infinite]" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedIndex((current) => (current - 1 + items.length) % items.length)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-300/18 hover:bg-white/10"
                >
                  <RiArrowLeftLine className="size-4" />
                  {previousLabel}
                </button>
                <div className="text-[0.68rem] uppercase tracking-[0.18em] text-white/42">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedIndex((current) => (current + 1) % items.length)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-medium text-white transition hover:border-emerald-300/18 hover:bg-white/10"
                >
                  {nextLabel}
                  <RiArrowRightLine className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,18,0.88),rgba(6,9,15,0.98))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_14%,rgba(34,211,238,0.12),transparent_24%),radial-gradient(circle_at_14%_86%,rgba(74,222,128,0.1),transparent_24%)]" />
        <Accordion
          value={[`faq-${activeIndex}`]}
          onValueChange={(value) => {
            const nextValue = value[0];

            if (!nextValue) {
              return;
            }

            const nextIndex = Number(String(nextValue).replace("faq-", ""));
            if (!Number.isNaN(nextIndex)) {
              setSelectedIndex(nextIndex);
            }
          }}
          className="relative z-10 gap-2"
        >
          {items.map((item, index) => (
            <AccordionItem
              key={`${item.question}-${index}`}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              value={`faq-${index}`}
              className="group relative isolate z-10 scroll-mt-28 overflow-hidden rounded-[1.4rem] border border-white/8 bg-white/[0.03] pl-12 pr-3 transition duration-300 hover:border-cyan-300/16 hover:bg-white/[0.05]"
            >
              <div
                className={cn(
                  "section-card-neon-glow pointer-events-none absolute inset-x-5 -bottom-4 -top-4 -z-10 rounded-[1.9rem] opacity-60 blur-3xl transition duration-300",
                  faqCardNeonShadowStyles[index % faqCardNeonShadowStyles.length],
                  activeIndex === index ? "scale-100 opacity-95" : "scale-90 opacity-45",
                )}
              />
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 transition duration-300",
                  faqCardGlowStyles[index % faqCardGlowStyles.length],
                  activeIndex === index ? "opacity-100" : "opacity-55 group-hover:opacity-80",
                )}
              />
              <div className="absolute left-4 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/24 bg-[linear-gradient(180deg,rgba(8,14,20,0.98),rgba(6,10,16,1))]">
                {activeIndex === index ? (
                  <div className="absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/18 bg-emerald-300/10 blur-[1px]">
                    <div className="absolute inset-0 rounded-full border border-emerald-300/24 animate-[ping_3s_ease-out_infinite]" />
                  </div>
                ) : null}
                <div
                  className={cn(
                    "relative z-10 rounded-full transition duration-300",
                    activeIndex === index
                      ? "size-[0.6rem] bg-emerald-300 shadow-[0_0_14px_rgba(74,222,128,0.55)] animate-[pulse_2.6s_ease-in-out_infinite]"
                      : "size-[0.45rem] bg-cyan-300/85 shadow-[0_0_12px_rgba(34,211,238,0.45)] group-hover:bg-emerald-300 group-hover:shadow-[0_0_12px_rgba(74,222,128,0.45)]",
                  )}
                />
              </div>
              <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />
              <AccordionTrigger className="py-4 text-left text-[0.98rem] font-medium leading-6 text-white hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-7 text-slate-300">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
