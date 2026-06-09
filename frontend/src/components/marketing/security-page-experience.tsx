import Link from "next/link";
import {
  RiArrowRightUpLine,
  RiCheckboxCircleLine,
  RiRadarLine,
  RiShieldCheckLine,
  RiStackLine,
} from "react-icons/ri";

import { HomeSectionHeading } from "@/components/home/home-section-heading";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getLocalizedPath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type SecurityPageExperienceProps = {
  locale: Locale;
  page: Dictionary["pages"]["security"];
};

const icons = [RiShieldCheckLine, RiStackLine, RiRadarLine] as const;

export function SecurityPageExperience({
  locale,
  page,
}: SecurityPageExperienceProps) {
  return (
    <>
      <section className="relative z-10 flex min-h-[calc(100vh-5rem)] items-center py-14 lg:py-20">
        <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,0.96fr)_minmax(22rem,0.88fr)] lg:items-center">
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
              {page.stats.map((stat) => (
                <div
                  key={`${stat.label}-${stat.value}`}
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
                    Secure
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  {page.visual.items.map((item) => (
                    <div
                      key={`${item.label}-${item.value}`}
                      className="grid gap-3 rounded-[1.4rem] border border-white/8 bg-white/[0.03] px-4 py-4 sm:grid-cols-[5rem_minmax(0,0.9fr)_minmax(0,1fr)] sm:items-center"
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
          eyebrow={page.pillars.eyebrow}
          title={page.pillars.title}
          description={page.pillars.description}
          maxWidthClassName="max-w-3xl"
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {page.pillars.cards.map((card, index) => {
            const Icon = icons[index % icons.length];

            return (
              <ScrollReveal
                key={`${card.title}-${index}`}
                delay={0.06 + index * 0.08}
                distance={30}
                blur={12}
              >
                <article className="relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,18,0.94),rgba(8,10,18,0.98))] p-6">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_28%),linear-gradient(135deg,rgba(34,197,94,0.05),transparent_52%)] opacity-80" />
                  <div className="relative z-10">
                    <div className="inline-flex rounded-[1rem] border border-white/10 bg-white/6 p-3 text-white">
                      <Icon className="size-5" />
                    </div>
                    <div className="mt-5 text-[0.68rem] uppercase tracking-[0.24em] text-white/52">
                      {card.eyebrow}
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                      {card.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      {card.description}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 py-20">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)] xl:items-start">
          <HomeSectionHeading
            eyebrow={page.controls.eyebrow}
            title={page.controls.title}
            description={page.controls.description}
            align="left"
            maxWidthClassName="max-w-xl"
          />

          <div className="relative space-y-5 before:absolute before:left-4 before:top-4 before:h-[calc(100%-2rem)] before:w-px before:bg-white/10">
            {page.controls.items.map((item, index) => (
              <article
                key={`${item.label}-${index}`}
                className="relative rounded-[1.9rem] border border-white/10 bg-black/24 p-6 pl-12 backdrop-blur-xl"
              >
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
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] xl:items-start">
          <div className="rounded-[2.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,14,18,0.92),rgba(6,10,14,0.98))] p-6 sm:p-7">
            <div className="text-[0.68rem] uppercase tracking-[0.18em] text-white/42">
              {page.faq.eyebrow}
            </div>
            <div className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
              {page.faq.title}
            </div>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              {page.faq.description}
            </p>

            <div className="mt-8 space-y-3">
              {page.faq.items.slice(0, 3).map((item, index) => (
                <div
                  key={`${item.question}-${index}`}
                  className="flex items-start gap-3 rounded-[1.3rem] border border-white/8 bg-white/[0.03] px-4 py-4"
                >
                  <RiCheckboxCircleLine className="mt-0.5 size-5 text-emerald-300" />
                  <div>
                    <div className="text-sm font-medium text-white">{item.question}</div>
                    <div className="mt-1 text-sm leading-6 text-white/58">{item.answer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black/24 p-4 backdrop-blur-xl sm:p-6">
            <Accordion className="gap-2">
              {page.faq.items.map((item, index) => (
                <AccordionItem
                  key={`${item.question}-${index}`}
                  value={`security-faq-${index}`}
                  className="rounded-[1.4rem] border-none px-4 transition hover:bg-white/[0.03]"
                >
                  <AccordionTrigger className="py-5 text-base font-medium text-white hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-7 text-slate-300">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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
                href={getLocalizedPath(locale, "/faq")}
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
