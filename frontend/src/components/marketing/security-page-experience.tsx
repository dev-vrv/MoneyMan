import Link from "next/link";
import {
  RiArrowRightUpLine,
  RiFingerprintLine,
  RiLock2Line,
  RiRadarLine,
  RiScan2Line,
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
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

type SecurityPageExperienceProps = {
  locale: Locale;
  page: Dictionary["pages"]["security"];
};

const pillarIcons = [
  RiShieldCheckLine,
  RiLock2Line,
  RiFingerprintLine,
] as const;

const controlIcons = [
  RiStackLine,
  RiScan2Line,
  RiRadarLine,
] as const;

export function SecurityPageExperience({
  locale,
  page,
}: SecurityPageExperienceProps) {
  return (
    <div className="px-6 sm:px-10 lg:px-12">
      <section className="relative z-10 py-14 lg:py-16">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.02fr)_minmax(24rem,0.98fr)] xl:items-center">
          <div className="min-w-0">
            <MarketingPageIntro
              eyebrow={page.eyebrow}
              title={page.title}
              description={page.description}
              maxWidthClassName="max-w-4xl"
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {page.stats.map((stat, index) => (
                <ScrollReveal
                  key={`${stat.label}-${index}`}
                  delay={0.04 + index * 0.06}
                  distance={18}
                  blur={8}
                >
                  <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(9,14,18,0.94),rgba(7,10,16,0.98))] px-5 py-5 shadow-[0_18px_50px_rgba(0,0,0,0.24)]">
                    <div className="security-card-beam absolute inset-x-4 top-0 h-px" />
                    <div className="text-[0.68rem] uppercase tracking-[0.18em] text-white/40">
                      {stat.label}
                    </div>
                    <div className="mt-3 text-xl font-semibold tracking-[-0.04em] text-white">
                      {stat.value}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <ScrollReveal delay={0.1} distance={28} blur={12}>
            <aside className="relative overflow-hidden rounded-[2.4rem] border border-cyan-300/14 bg-[linear-gradient(180deg,rgba(8,13,18,0.98),rgba(5,8,14,1))] p-6 shadow-[0_32px_120px_rgba(0,0,0,0.34)] sm:p-7">
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
                    Secure
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
                    <div className="absolute left-1/2 top-1/2 z-10 flex size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[1.8rem] border border-cyan-300/18 bg-[linear-gradient(135deg,rgba(11,20,28,0.96),rgba(8,11,18,0.99))] shadow-[0_0_0_1px_rgba(34,211,238,0.06),0_16px_42px_rgba(0,0,0,0.26)]">
                      <RiShieldCheckLine className="size-10 text-cyan-100" />
                    </div>

                    <div className="security-node absolute left-[16%] top-[22%] size-3 rounded-full bg-cyan-300" />
                    <div className="security-node absolute right-[18%] top-[28%] size-3 rounded-full bg-emerald-300 [animation-delay:0.8s]" />
                    <div className="security-node absolute bottom-[18%] left-[22%] size-3 rounded-full bg-white [animation-delay:1.6s]" />
                    <div className="security-node absolute bottom-[24%] right-[16%] size-3 rounded-full bg-sky-300 [animation-delay:2.2s]" />

                    <div className="absolute left-[18%] top-[24%] h-px w-[28%] rotate-[18deg] bg-[linear-gradient(90deg,rgba(34,211,238,0.7),rgba(34,211,238,0))]" />
                    <div className="absolute right-[21%] top-[31%] h-px w-[24%] -rotate-[28deg] bg-[linear-gradient(90deg,rgba(74,222,128,0.7),rgba(74,222,128,0))]" />
                    <div className="absolute bottom-[26%] left-[27%] h-px w-[22%] rotate-[42deg] bg-[linear-gradient(90deg,rgba(255,255,255,0.7),rgba(255,255,255,0))]" />
                    <div className="absolute bottom-[28%] right-[21%] h-px w-[20%] -rotate-[46deg] bg-[linear-gradient(90deg,rgba(125,211,252,0.76),rgba(125,211,252,0))]" />
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm leading-7 text-slate-300">
                      {page.visual.description}
                    </p>

                    <div className="space-y-3">
                      {page.visual.items.map((item, index) => (
                        <div
                          key={`${item.label}-${index}`}
                          className="rounded-[1.25rem] border border-white/8 bg-white/[0.04] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="text-[0.66rem] uppercase tracking-[0.18em] text-white/38">
                                {item.label}
                              </div>
                              <div className="mt-2 text-base font-semibold text-white">
                                {item.value}
                              </div>
                            </div>
                            <div className="text-[0.66rem] uppercase tracking-[0.18em] text-cyan-100/55">
                              0{index + 1}
                            </div>
                          </div>
                          <div className="mt-2 text-sm leading-6 text-white/58">
                            {item.detail}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative z-10 py-10 lg:py-12">
        <HomeSectionHeading
          eyebrow={page.pillars.eyebrow}
          title={page.pillars.title}
          description={page.pillars.description}
          maxWidthClassName="max-w-3xl"
        />

        <div className="mt-8 grid gap-4 xl:grid-cols-12">
          {page.pillars.cards.map((card, index) => {
            const Icon = pillarIcons[index % pillarIcons.length];
            const isLead = index === 0;

            return (
              <ScrollReveal
                key={`${card.title}-${index}`}
                delay={0.05 + index * 0.08}
                distance={24}
                blur={10}
              >
                <article
                  className={cn(
                    "relative h-full overflow-hidden rounded-[2rem] border border-white/10",
                    isLead
                      ? "xl:col-span-6 bg-[linear-gradient(135deg,rgba(8,18,24,0.98),rgba(7,10,16,0.98))] p-6"
                      : "xl:col-span-3 bg-[linear-gradient(180deg,rgba(9,15,18,0.94),rgba(7,10,16,0.98))] p-5",
                  )}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_28%),linear-gradient(135deg,rgba(34,211,238,0.07),transparent_40%,rgba(74,222,128,0.06),transparent_100%)] opacity-90" />
                  <div className="security-card-beam absolute inset-x-5 top-0 h-px" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="inline-flex rounded-[1rem] border border-white/10 bg-white/6 p-3 text-cyan-100">
                        <Icon className="size-5" />
                      </div>
                      <div className="text-[0.66rem] uppercase tracking-[0.18em] text-white/36">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>

                    <div className="mt-5 text-[0.68rem] uppercase tracking-[0.2em] text-white/44">
                      {card.eyebrow}
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold leading-[1.12] tracking-[-0.04em] text-white">
                      {card.title}
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
                      {card.description}
                    </p>

                    {isLead ? (
                      <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        {page.stats.map((stat, statIndex) => (
                          <div
                            key={`${stat.label}-${statIndex}`}
                            className="rounded-[1.15rem] border border-white/8 bg-black/16 px-4 py-4"
                          >
                            <div className="text-[0.66rem] uppercase tracking-[0.16em] text-white/36">
                              {stat.label}
                            </div>
                            <div className="mt-2 text-base font-semibold text-white">
                              {stat.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 py-10 lg:py-12">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div>
            <HomeSectionHeading
              eyebrow={page.controls.eyebrow}
              title={page.controls.title}
              description={page.controls.description}
              align="left"
              maxWidthClassName="max-w-xl"
            />

            <div className="mt-6 rounded-[1.9rem] border border-cyan-300/12 bg-[linear-gradient(180deg,rgba(8,14,20,0.9),rgba(7,10,16,0.98))] p-5">
              <div className="security-mini-grid relative overflow-hidden rounded-[1.5rem] border border-white/8 bg-black/18 p-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_24%,rgba(34,211,238,0.14),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(74,222,128,0.14),transparent_24%)]" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="security-node size-3 rounded-full bg-emerald-300" />
                    <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(74,222,128,0.56),rgba(34,211,238,0.24),transparent)]" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {page.visual.items.map((item, index) => (
                      <div key={`${item.value}-${index}`} className="rounded-[1.1rem] border border-white/8 bg-white/[0.04] px-3 py-3">
                        <div className="text-[0.65rem] uppercase tracking-[0.18em] text-white/36">{item.label}</div>
                        <div className="mt-2 text-sm font-semibold text-white">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {page.controls.items.map((item, index) => {
              const Icon = controlIcons[index % controlIcons.length];

              return (
                <ScrollReveal
                  key={`${item.label}-${index}`}
                  delay={0.05 + index * 0.08}
                  distance={22}
                  blur={8}
                >
                  <article className="relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(9,15,18,0.94),rgba(7,10,16,0.98))] p-5 sm:p-6">
                    <div className="absolute left-8 top-0 bottom-0 w-px bg-[linear-gradient(180deg,rgba(34,211,238,0),rgba(34,211,238,0.45),rgba(74,222,128,0.28),rgba(34,211,238,0))]" />
                    <div className="relative z-10 grid gap-4 sm:grid-cols-[4.8rem_minmax(0,1fr)] sm:items-start">
                      <div className="flex flex-col items-center gap-3">
                        <div className="inline-flex size-12 items-center justify-center rounded-full border border-cyan-300/18 bg-cyan-300/10 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.06)]">
                          <Icon className="size-5" />
                        </div>
                        <div className="text-[0.66rem] uppercase tracking-[0.18em] text-white/38">
                          {item.label}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl font-semibold leading-[1.14] tracking-[-0.04em] text-white">
                          {item.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-300">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-10 lg:py-14">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,26rem)]">
          <div className="rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(9,14,18,0.92),rgba(7,10,16,0.98))] p-3 backdrop-blur-xl sm:p-4">
            <div className="px-3 pb-3 pt-2">
              <div className="text-[0.68rem] uppercase tracking-[0.18em] text-white/42">
                {page.faq.eyebrow}
              </div>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-[1.12] tracking-[-0.04em] text-white sm:text-4xl">
                {page.faq.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                {page.faq.description}
              </p>
            </div>

            <Accordion className="gap-1.5">
              {page.faq.items.map((item, index) => (
                <AccordionItem
                  key={`${item.question}-${index}`}
                  value={`security-faq-${index}`}
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

          <div className="relative overflow-hidden rounded-[2.15rem] border border-cyan-300/12 bg-[linear-gradient(135deg,rgba(8,14,20,0.96),rgba(6,9,15,0.99))] px-6 py-7 shadow-[0_24px_90px_rgba(0,0,0,0.3)] sm:px-7 sm:py-8">
            <div className="security-command-grid absolute inset-0 opacity-35" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_24%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(74,222,128,0.16),transparent_24%),radial-gradient(circle_at_46%_100%,rgba(59,130,246,0.14),transparent_28%)]" />
            <div className="relative z-10">
              <div className="inline-flex rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.66rem] uppercase tracking-[0.16em] text-white/56">
                Security
              </div>
              <h2 className="mt-4 text-3xl font-semibold leading-[1.12] tracking-[-0.04em] text-white">
                {page.cta.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                {page.cta.description}
              </p>

              <div className="mt-7 flex flex-col gap-3">
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
        </div>
      </section>
    </div>
  );
}
