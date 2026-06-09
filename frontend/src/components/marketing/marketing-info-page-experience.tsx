import Link from "next/link";
import {
  RiArrowRightUpLine,
  RiFlashlightLine,
  RiFlowChart,
  RiPulseLine,
  RiRadarLine,
  RiSparklingLine,
  RiShieldCheckLine,
  RiStackLine,
} from "react-icons/ri";

import { HomeSectionHeading } from "@/components/home/home-section-heading";
import { MarketingPageIntro } from "@/components/marketing/marketing-page-intro";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getLocalizedPath, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type StatItem = {
  label: string;
  value: string;
};

type VisualItem = {
  label: string;
  value: string;
  detail: string;
};

type CardItem = {
  eyebrow?: string;
  title: string;
  description: string;
  meta?: string;
};

type TimelineItem = {
  label: string;
  title: string;
  description: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type CardSection = {
  eyebrow: string;
  title: string;
  description: string;
  cards: CardItem[];
};

type TimelineSection = {
  eyebrow: string;
  title: string;
  description: string;
  items: TimelineItem[];
};

type FaqSection = {
  eyebrow: string;
  title: string;
  description: string;
  items: FaqItem[];
};

type CtaSection = {
  title: string;
  description: string;
  primary: string;
  primaryHref: string;
  secondary?: string;
  secondaryHref?: string;
};

type MarketingInfoPageExperienceProps = {
  locale: Locale;
  liveLabel?: string;
  compactHero?: boolean;
  streamlined?: boolean;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    stats: StatItem[];
    visual: {
      title: string;
      description: string;
      items: VisualItem[];
    };
  };
  primarySection: CardSection;
  secondarySection?: CardSection | TimelineSection;
  faqSection?: FaqSection;
  cta: CtaSection;
};

const cardIcons = [RiShieldCheckLine, RiFlowChart, RiRadarLine, RiStackLine] as const;

function getPageCopy(locale: Locale) {
  switch (locale) {
    case "ru":
      return {
        overview: "Обзор",
        core: "Основа",
        details: "Детали",
        faq: "FAQ",
        next: "Дальше",
        nextStep: "Следующий шаг",
        readingMap: "Карта страницы",
        readingFlow: "Подробная структура страницы с продуктовым и юридическим контекстом.",
        workingLayer: "Рабочий слой",
        step: "Шаг",
        operationalDetail: "Рабочая деталь",
        nextAction: "Следующее действие",
      };
    case "kg":
      return {
        overview: "Обзор",
        core: "Негиз",
        details: "Деталдар",
        faq: "FAQ",
        next: "Кийинки",
        nextStep: "Кийинки кадам",
        readingMap: "Барак картасы",
        readingFlow: "Барак продукт жана юридикалык контекст менен кеңири структурада берилет.",
        workingLayer: "Жумушчу катмар",
        step: "Кадам",
        operationalDetail: "Иштөөчү деталь",
        nextAction: "Кийинки аракет",
      };
    default:
      return {
        overview: "Overview",
        core: "Core",
        details: "Details",
        faq: "FAQ",
        next: "Next",
        nextStep: "Next step",
        readingMap: "Reading map",
        readingFlow: "A structured page flow with product context and legal framing.",
        workingLayer: "Working layer",
        step: "Step",
        operationalDetail: "Operational detail",
        nextAction: "Next action",
      };
  }
}

function buildSectionMap(
  locale: Locale,
  primarySection: CardSection,
  secondarySection?: CardSection | TimelineSection,
  faqSection?: FaqSection,
) {
  const copy = getPageCopy(locale);
  return [
    { id: "page-overview", label: copy.overview, title: primarySection.eyebrow || copy.overview },
    { id: "page-core", label: copy.core, title: primarySection.title },
    secondarySection
      ? {
          id: "page-details",
          label: copy.details,
          title: secondarySection.title,
        }
      : null,
    faqSection
      ? {
          id: "page-faq",
          label: copy.faq,
          title: faqSection.title,
        }
      : null,
    { id: "page-cta", label: copy.next, title: copy.nextStep },
  ].filter(Boolean) as Array<{ id: string; label: string; title: string }>;
}

function isTimelineSection(
  section: CardSection | TimelineSection,
): section is TimelineSection {
  return "items" in section;
}

export function MarketingInfoPageExperience({
  locale,
  liveLabel = "Live",
  compactHero = false,
  streamlined = false,
  hero,
  primarySection,
  secondarySection,
  faqSection,
  cta,
}: MarketingInfoPageExperienceProps) {
  const copy = getPageCopy(locale);
  const sectionMap = buildSectionMap(locale, primarySection, secondarySection, faqSection);

  return (
    <div className="px-6 sm:px-10 lg:px-12">
      <section
        id="page-overview"
        className={cn(
          "relative z-10 py-14 lg:py-20",
          compactHero ? "" : "flex min-h-[calc(100vh-5rem)] items-center",
        )}
        >
          <div
            className={cn(
              "w-full",
              compactHero || streamlined
                ? ""
                : "grid gap-10 lg:grid-cols-[minmax(0,0.94fr)_minmax(22rem,0.9fr)] lg:items-center",
            )}
          >
          <div className="min-w-0">
            <MarketingPageIntro
              eyebrow={hero.eyebrow}
              title={hero.title}
              description={hero.description}
            />

            {!compactHero && !streamlined ? (
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {hero.stats.map((stat, index) => (
                  <div
                    key={`${stat.label}-${index}`}
                    className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-xl"
                  >
                    <div className="text-[0.68rem] uppercase tracking-[0.18em] text-white/42">
                      {stat.label}
                    </div>
                    <div className="mt-2 text-lg font-semibold tracking-[-0.04em] text-white">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {!compactHero && !streamlined ? (
            <ScrollReveal delay={0.08} distance={34} blur={14}>
              <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,18,0.96),rgba(8,12,18,0.98))] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.32)] sm:p-7">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_14%,rgba(34,211,238,0.14),transparent_26%),radial-gradient(circle_at_88%_16%,rgba(251,191,36,0.14),transparent_24%),radial-gradient(circle_at_68%_84%,rgba(74,222,128,0.12),transparent_28%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:34px_34px] opacity-25" />
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/24 to-transparent" />
                <div className="absolute left-8 top-8 h-24 w-24 rounded-full bg-cyan-300/10 blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
                <div className="absolute bottom-8 right-8 h-24 w-24 rounded-full bg-emerald-300/10 blur-3xl animate-[pulse_9s_ease-in-out_infinite]" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[0.68rem] uppercase tracking-[0.18em] text-white/44">
                        {hero.visual.title}
                      </div>
                      <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                        {hero.visual.description}
                      </div>
                    </div>
                    <div className="rounded-full border border-emerald-300/18 bg-emerald-300/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-emerald-100/80">
                      {liveLabel}
                    </div>
                  </div>

                  <div className="mt-8 grid gap-3">
                    {hero.visual.items.map((item, index) => (
                      <div
                        key={`${item.label}-${index}`}
                        className="grid gap-3 rounded-[1.4rem] border border-white/8 bg-white/[0.03] px-4 py-4 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-300/18 hover:bg-white/[0.05] sm:grid-cols-[5.2rem_minmax(0,1fr)_minmax(0,1.1fr)] sm:items-center"
                      >
                        <div className="text-[0.68rem] uppercase tracking-[0.18em] text-white/42">
                          {item.label}
                        </div>
                        <div className="text-base font-semibold text-white">{item.value}</div>
                        <div className="text-sm leading-6 text-white/62">{item.detail}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ) : null}
        </div>
      </section>

      {!compactHero && !streamlined ? (
        <section className="relative z-10 py-6 lg:py-10">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,0.82fr)_minmax(21rem,0.72fr)]">
            <ScrollReveal delay={0.03} distance={24} blur={10}>
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,18,0.9),rgba(7,10,16,0.98))] p-5 sm:p-6">
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(34,211,238,0.08),transparent_34%,rgba(74,222,128,0.06)_72%,transparent)]" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex rounded-[1rem] border border-emerald-300/18 bg-emerald-300/10 p-3 text-emerald-100">
                      <RiFlashlightLine className="size-5" />
                    </div>
                    <div>
                      <div className="text-[0.68rem] uppercase tracking-[0.18em] text-white/44">
                        {copy.readingMap}
                      </div>
                      <div className="mt-1 text-xl font-semibold tracking-[-0.04em] text-white">
                        {copy.readingFlow}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {hero.stats.map((stat, index) => (
                      <div
                        key={`${stat.label}-brief-${index}`}
                        className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] px-4 py-4"
                      >
                        <div className="text-[0.66rem] uppercase tracking-[0.2em] text-white/42">
                          {stat.label}
                        </div>
                        <div className="mt-2 text-lg font-semibold tracking-[-0.04em] text-white">
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.08} distance={24} blur={10}>
              <div className="rounded-[2rem] border border-white/10 bg-black/24 p-5 backdrop-blur-xl sm:p-6">
                <div className="flex items-center gap-3">
                  <RiPulseLine className="size-5 text-cyan-300" />
                  <div className="text-[0.68rem] uppercase tracking-[0.18em] text-white/48">
                    Section map
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {sectionMap.map((item, index) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="group flex items-start gap-3 rounded-[1.2rem] border border-white/8 bg-white/[0.03] px-4 py-4 transition hover:border-emerald-300/18 hover:bg-white/[0.05]"
                    >
                      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6 text-[0.7rem] font-semibold text-white/84">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-[0.66rem] uppercase tracking-[0.18em] text-white/42">
                          {item.label}
                        </div>
                        <div className="mt-1 text-sm font-medium leading-6 text-white transition group-hover:text-emerald-100">
                          {item.title}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      ) : null}

      <section
        id="page-core"
        className={cn("relative z-10", streamlined ? "py-10 lg:py-12" : "py-20")}
      >
          <HomeSectionHeading
            eyebrow={primarySection.eyebrow}
            title={primarySection.title}
            description={primarySection.description}
            maxWidthClassName="max-w-3xl"
          />

          <div className={cn("grid gap-5", streamlined ? "mt-7 md:grid-cols-2 xl:grid-cols-3" : "mt-10 lg:grid-cols-3")}>
            {primarySection.cards.map((card, index) => {
              const Icon = cardIcons[index % cardIcons.length];

              return (
                <ScrollReveal
                  key={`${card.title}-${index}`}
                  delay={0.06 + index * 0.08}
                  distance={30}
                  blur={12}
                >
                  <article
                    className={cn(
                      "group relative h-full overflow-hidden border border-white/10 transition duration-300",
                      streamlined
                        ? "rounded-[1.5rem] bg-[linear-gradient(180deg,rgba(9,14,18,0.94),rgba(7,10,16,0.98))] p-5 hover:border-white/16"
                        : "rounded-[2rem] bg-[linear-gradient(180deg,rgba(10,16,18,0.94),rgba(8,10,18,0.98))] p-6 hover:-translate-y-1.5 hover:border-emerald-300/24 hover:shadow-[0_22px_70px_rgba(0,0,0,0.26)]",
                    )}
                  >
                    {!streamlined ? (
                      <>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_28%),linear-gradient(135deg,rgba(34,197,94,0.05),transparent_52%)] opacity-80" />
                        <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent" />
                      </>
                    ) : null}
                    <div className="relative z-10">
                      {!streamlined ? (
                        <div className="flex items-start justify-between gap-4">
                          <div className="inline-flex rounded-[1rem] border border-white/10 bg-white/6 p-3 text-white">
                            <Icon className="size-5" />
                          </div>
                          <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.66rem] uppercase tracking-[0.16em] text-white/52">
                            {String(index + 1).padStart(2, "0")}
                          </div>
                        </div>
                      ) : (
                        <div className="text-[0.66rem] uppercase tracking-[0.18em] text-white/38">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                      )}
                      {card.eyebrow ? (
                        <div className={cn("text-[0.68rem] uppercase tracking-[0.24em] text-white/52", streamlined ? "mt-3" : "mt-5")}>
                          {card.eyebrow}
                        </div>
                      ) : null}
                      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                        {card.title}
                      </h2>
                      <p className="mt-3 text-sm leading-7 text-slate-300">
                        {card.description}
                      </p>
                      {card.meta && !streamlined ? (
                        <div className="mt-5 inline-flex rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/72">
                          {card.meta}
                        </div>
                      ) : null}
                      {!streamlined ? (
                        <div className="mt-6 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.18em] text-white/38">
                          <RiSparklingLine className="size-3.5 text-emerald-200/70" />
                          <span>{card.eyebrow || copy.workingLayer}</span>
                        </div>
                      ) : null}
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

      {secondarySection ? (
        <section
          id="page-details"
          className={cn("relative z-10", streamlined ? "py-10 lg:py-12" : "py-20")}
        >
          {"cards" in secondarySection ? (
            <>
              <HomeSectionHeading
                eyebrow={secondarySection.eyebrow}
                title={secondarySection.title}
                description={secondarySection.description}
                maxWidthClassName="max-w-3xl"
              />

              <div className={cn("grid gap-5", streamlined ? "mt-7 md:grid-cols-2 xl:grid-cols-3" : "mt-10 lg:grid-cols-3")}>
                {secondarySection.cards.map((card, index) => {
                  const Icon = cardIcons[(index + 1) % cardIcons.length];

                  return (
                    <ScrollReveal
                      key={`${card.title}-${index}`}
                      delay={0.06 + index * 0.08}
                      distance={30}
                      blur={12}
                    >
                      <article
                        className={cn(
                          "relative h-full overflow-hidden border border-white/10 transition duration-300",
                          streamlined
                            ? "rounded-[1.5rem] bg-[linear-gradient(180deg,rgba(9,14,18,0.94),rgba(7,10,16,0.98))] p-5 hover:border-white/16"
                            : "rounded-[2rem] bg-[linear-gradient(180deg,rgba(8,14,18,0.92),rgba(6,10,14,0.98))] p-6 hover:-translate-y-1 hover:border-cyan-300/20",
                        )}
                      >
                        {!streamlined ? (
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_18%,rgba(34,211,238,0.1),transparent_26%),linear-gradient(160deg,rgba(255,255,255,0.04),transparent_55%)]" />
                        ) : null}
                        <div className="relative z-10">
                          {!streamlined ? (
                            <div className="flex items-start justify-between gap-4">
                              <div className="inline-flex rounded-[1rem] border border-white/10 bg-white/6 p-3 text-white">
                                <Icon className="size-5" />
                              </div>
                              <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.66rem] uppercase tracking-[0.16em] text-white/48">
                                {copy.step} {index + 1}
                              </div>
                            </div>
                          ) : (
                            <div className="text-[0.66rem] uppercase tracking-[0.18em] text-white/38">
                              {copy.step} {index + 1}
                            </div>
                          )}
                          {card.eyebrow ? (
                            <div className={cn("text-[0.68rem] uppercase tracking-[0.24em] text-white/52", streamlined ? "mt-3" : "mt-5")}>
                              {card.eyebrow}
                            </div>
                          ) : null}
                          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                            {card.title}
                          </h2>
                          <p className="mt-3 text-sm leading-7 text-slate-300">
                            {card.description}
                          </p>
                          {!streamlined ? (
                            <>
                              <div className="mt-6 h-px w-full bg-gradient-to-r from-white/10 via-white/4 to-transparent" />
                              <div className="mt-4 text-[0.72rem] uppercase tracking-[0.18em] text-white/38">
                                {card.meta || card.eyebrow || copy.operationalDetail}
                              </div>
                            </>
                          ) : null}
                        </div>
                      </article>
                    </ScrollReveal>
                  );
                })}
              </div>
            </>
          ) : isTimelineSection(secondarySection) ? (
            <div className="grid gap-10 xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)] xl:items-start">
              <HomeSectionHeading
                eyebrow={secondarySection.eyebrow}
                title={secondarySection.title}
                description={secondarySection.description}
                align="left"
                maxWidthClassName="max-w-xl"
              />

              <div className="relative space-y-5 before:absolute before:left-4 before:top-4 before:h-[calc(100%-2rem)] before:w-px before:bg-white/10">
                {secondarySection.items.map((item, index) => (
                  <ScrollReveal
                    key={`${item.label}-${index}`}
                    delay={0.05 + index * 0.08}
                    distance={26}
                    blur={10}
                  >
                    <article className="relative ml-0 rounded-[1.9rem] border border-white/10 bg-black/24 p-6 pl-12 backdrop-blur-xl transition duration-300 hover:border-emerald-300/22 hover:bg-black/28">
                      <div className="absolute left-[0.9rem] top-7 size-3 rounded-full border border-emerald-300/30 bg-emerald-300/80 shadow-[0_0_18px_rgba(74,222,128,0.4)]" />
                      <div className="text-[0.68rem] uppercase tracking-[0.24em] text-emerald-200/70">
                        {item.label}
                      </div>
                      <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-white">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-300">
                        {item.description}
                      </p>
                    </article>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {faqSection ? (
        <section id="page-faq" className={cn("relative z-10", compactHero ? "py-8 lg:py-10" : "py-12 lg:py-14")}>
          <div className={cn("max-w-4xl", compactHero ? "" : "space-y-5")}>
            {!compactHero ? (
              <div className="max-w-2xl">
                <div className="text-[0.68rem] uppercase tracking-[0.18em] text-white/42">
                  {faqSection.eyebrow}
                </div>
                <div className="mt-3 text-3xl font-semibold leading-[1.12] tracking-[-0.04em] text-white">
                  {faqSection.title}
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {faqSection.description}
                </p>
              </div>
            ) : null}

            <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(9,14,18,0.9),rgba(7,10,16,0.96))] p-3 backdrop-blur-xl sm:p-4">
              <Accordion className="gap-1.5">
                {faqSection.items.map((item, index) => (
                  <AccordionItem
                    key={`${item.question}-${index}`}
                    value={`faq-${index}`}
                    className="rounded-[1rem] border-none px-3 transition hover:bg-white/[0.03]"
                  >
                    <AccordionTrigger className="py-3 text-left text-[0.96rem] font-medium leading-6 text-white hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-3 text-sm leading-6 text-slate-300">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      ) : null}

      <section id="page-cta" className="relative z-10 py-20 pt-8 lg:py-24 lg:pt-10">
        <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(10,15,18,0.95),rgba(7,9,17,0.98))] px-6 py-8 sm:px-8 sm:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(74,222,128,0.18),transparent_26%),radial-gradient(circle_at_50%_110%,rgba(251,191,36,0.15),transparent_30%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:42px_42px] opacity-20" />
          <div className="relative z-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.66rem] uppercase tracking-[0.16em] text-white/52">
                {copy.nextAction}
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                {cta.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                {cta.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row xl:justify-end">
              <Link
                href={getLocalizedPath(locale, cta.primaryHref)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-300/20 bg-linear-to-r from-emerald-300 via-emerald-400 to-lime-300 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_32px_rgba(74,222,128,0.16)] transition hover:brightness-105"
              >
                {cta.primary}
                <RiArrowRightUpLine className="size-4 shrink-0" />
              </Link>

              {cta.secondary && cta.secondaryHref ? (
                <Link
                  href={getLocalizedPath(locale, cta.secondaryHref)}
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/6 px-6 py-3 text-sm font-medium text-zinc-100 transition hover:border-emerald-300/18 hover:bg-white/8"
                >
                  {cta.secondary}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
