import Link from "next/link";
import { RiArrowRightUpLine, RiCheckboxCircleLine, RiShieldCheckLine } from "react-icons/ri";

import { HomeSectionHeading } from "@/components/home/home-section-heading";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getLocalizedPath, type Locale } from "@/lib/i18n/config";

type PricingPageExperienceProps = {
  locale: Locale;
  liveLabel?: string;
  page: {
    eyebrow: string;
    title: string;
    description: string;
    stats: Array<{
      label: string;
      value: string;
    }>;
    visual: {
      title: string;
      description: string;
      items: Array<{
        label: string;
        value: string;
        detail: string;
      }>;
    };
    plans: {
      eyebrow: string;
      title: string;
      description: string;
      cards: Array<{
        name: string;
        price: string;
        period: string;
        badge: string;
        description: string;
        features: string[];
      }>;
    };
    includes: {
      eyebrow: string;
      title: string;
      description: string;
      cards: Array<{
        eyebrow: string;
        title: string;
        description: string;
      }>;
    };
    faq: {
      eyebrow: string;
      title: string;
      description: string;
      items: Array<{
        question: string;
        answer: string;
      }>;
    };
    cta: {
      title: string;
      description: string;
      primary: string;
      secondary: string;
    };
  };
};

export function PricingPageExperience({
  locale,
  liveLabel = "Live",
  page,
}: PricingPageExperienceProps) {
  return (
    <>
      <section className="relative z-10 flex min-h-[calc(100vh-5rem)] items-center py-14 lg:py-20">
        <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,0.94fr)_minmax(22rem,0.9fr)] lg:items-center">
          <div className="min-w-0">
            <div className="inline-flex rounded-full border border-emerald-300/18 bg-emerald-300/10 px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-emerald-100/84">
              {page.eyebrow}
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
              {page.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              {page.description}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {page.stats.map((stat, index) => (
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
          </div>

          <ScrollReveal delay={0.08} distance={34} blur={14}>
            <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,18,0.96),rgba(8,12,18,0.98))] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.32)] sm:p-7">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_14%,rgba(34,211,238,0.14),transparent_26%),radial-gradient(circle_at_88%_16%,rgba(251,191,36,0.14),transparent_24%),radial-gradient(circle_at_68%_84%,rgba(74,222,128,0.12),transparent_28%)]" />
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[0.68rem] uppercase tracking-[0.18em] text-white/44">
                      {page.visual.title}
                    </div>
                    <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                      {page.visual.description}
                    </div>
                  </div>
                  <div className="rounded-full border border-emerald-300/18 bg-emerald-300/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-emerald-100/80">
                    {liveLabel}
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  {page.visual.items.map((item, index) => (
                    <div
                      key={`${item.label}-${index}`}
                      className="grid gap-3 rounded-[1.4rem] border border-white/8 bg-white/[0.03] px-4 py-4 sm:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1.1fr)] sm:items-center"
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
        </div>
      </section>

      <section className="relative z-10 py-20">
        <HomeSectionHeading
          eyebrow={page.plans.eyebrow}
          title={page.plans.title}
          description={page.plans.description}
          maxWidthClassName="max-w-3xl"
        />

        <div className="mt-10 grid gap-5 xl:grid-cols-3">
          {page.plans.cards.map((plan, index) => (
            <article
              key={`${plan.name}-${index}`}
              className={`relative overflow-hidden rounded-[2rem] border p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_80px_rgba(0,0,0,0.24)] ${
                index === 1
                  ? "border-emerald-300/26 bg-[linear-gradient(180deg,rgba(15,32,22,0.96),rgba(9,12,18,0.98))]"
                  : "border-white/10 bg-[linear-gradient(180deg,rgba(10,16,18,0.94),rgba(8,10,18,0.98))]"
              }`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_28%),linear-gradient(135deg,rgba(34,197,94,0.05),transparent_52%)] opacity-90" />
              <div className="relative z-10">
                <div className="inline-flex rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-white/72">
                  {plan.badge}
                </div>
                <h2 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-white">
                  {plan.name}
                </h2>
                <div className="mt-4 flex items-end gap-2">
                  <div className="text-4xl font-semibold tracking-[-0.05em] text-white">
                    {plan.price}
                  </div>
                  <div className="pb-1 text-sm text-slate-300">
                    {plan.period}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {plan.description}
                </p>

                <div className="mt-6 space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div
                      key={`${feature}-${featureIndex}`}
                      className="flex items-start gap-3 rounded-[1rem] border border-white/8 bg-white/[0.04] px-3 py-3 text-sm text-white/84"
                    >
                      <div className="mt-1 size-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(74,222,128,0.45)]" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 py-20">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,0.84fr)_minmax(0,1fr)] xl:items-start">
          <div>
            <HomeSectionHeading
              eyebrow={page.includes.eyebrow}
              title={page.includes.title}
              description={page.includes.description}
              align="left"
              maxWidthClassName="max-w-xl"
            />

            <div className="mt-8 space-y-4">
              {page.includes.cards.map((card, index) => (
                <ScrollReveal
                  key={`${card.title}-${index}`}
                  delay={0.06 + index * 0.08}
                  distance={28}
                  blur={10}
                >
                  <article className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,18,0.92),rgba(8,10,16,0.98))] p-5">
                    <div className="text-[0.68rem] uppercase tracking-[0.18em] text-white/44">
                      {card.eyebrow}
                    </div>
                    <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-white">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      {card.description}
                    </p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,14,18,0.92),rgba(6,10,14,0.98))] p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="inline-flex rounded-[1rem] border border-emerald-300/18 bg-emerald-300/10 p-3 text-emerald-100">
                <RiShieldCheckLine className="size-5" />
              </div>
              <div className="text-[0.68rem] uppercase tracking-[0.18em] text-white/42">
                {page.faq.eyebrow}
              </div>
            </div>

            <div className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white">
              {page.faq.title}
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {page.faq.description}
            </p>

            <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-3 sm:p-4">
              <Accordion className="gap-2">
                {page.faq.items.map((item, index) => (
                  <AccordionItem
                    key={`${item.question}-${index}`}
                    value={`pricing-faq-${index}`}
                    className="rounded-[1.2rem] border-none px-3 transition hover:bg-white/[0.03]"
                  >
                    <AccordionTrigger className="py-4 text-left text-base font-medium text-white hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-sm leading-7 text-slate-300">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="mt-6 space-y-3">
              {page.plans.cards.map((plan) => (
                <div
                  key={plan.name}
                  className="flex items-start gap-3 rounded-[1.2rem] border border-white/8 bg-white/[0.03] px-4 py-3"
                >
                  <RiCheckboxCircleLine className="mt-0.5 size-5 text-emerald-300" />
                  <div>
                    <div className="text-sm font-medium text-white">{plan.name}</div>
                    <div className="mt-1 text-sm leading-6 text-white/58">{plan.badge}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 pt-8 lg:py-24 lg:pt-10">
        <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(10,15,18,0.95),rgba(7,9,17,0.98))] px-6 py-8 sm:px-8 sm:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(74,222,128,0.18),transparent_26%),radial-gradient(circle_at_50%_110%,rgba(251,191,36,0.15),transparent_30%)]" />
          <div className="relative z-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                {page.cta.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                {page.cta.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row xl:justify-end">
              <Link
                href={getLocalizedPath(locale, "/contacts")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-300/20 bg-linear-to-r from-emerald-300 via-emerald-400 to-lime-300 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_32px_rgba(74,222,128,0.16)] transition hover:brightness-105"
              >
                {page.cta.primary}
                <RiArrowRightUpLine className="size-4 shrink-0" />
              </Link>
              <Link
                href={getLocalizedPath(locale, "/security")}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/6 px-6 py-3 text-sm font-medium text-zinc-100 transition hover:border-emerald-300/18 hover:bg-white/8"
              >
                {page.cta.secondary}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
