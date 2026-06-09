import Link from "next/link";
import {
  RiAndroidLine,
  RiAppleLine,
  RiArrowRightUpLine,
  RiBarChartBoxLine,
  RiCoinsLine,
  RiGlobalLine,
  RiRobot3Line,
  RiShieldStarLine,
  RiSparklingLine,
  RiWindowsLine,
} from "react-icons/ri";
import type { IconType } from "react-icons";

import { HomeSectionHeading } from "@/components/home/home-section-heading";
import { MarketingPageIntro } from "@/components/marketing/marketing-page-intro";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getLocalizedPath, type Locale } from "@/lib/i18n/config";

type AboutPageExperienceProps = {
  locale: Locale;
  page: {
    eyebrow: string;
    title: string;
    description: string;
    founder: {
      eyebrow: string;
      title: string;
      description: string;
      badges: string[];
      signals: Array<{
        label: string;
        value: string;
      }>;
    };
    platforms: {
      eyebrow: string;
      title: string;
      description: string;
      items: Array<{
        label: string;
        value: string;
        detail: string;
      }>;
    };
    capabilities: {
      eyebrow: string;
      title: string;
      description: string;
      cards: Array<{
        eyebrow: string;
        title: string;
        description: string;
      }>;
    };
    stack: {
      eyebrow: string;
      title: string;
      description: string;
      items: Array<{
        label: string;
        title: string;
        description: string;
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

const platformIcons: IconType[] = [
  RiGlobalLine,
  RiWindowsLine,
  RiAppleLine,
  RiAndroidLine,
];

const platformStyles = [
  {
    articleClassName:
      "border-cyan-300/16 bg-[linear-gradient(180deg,rgba(7,18,24,0.96),rgba(7,10,16,0.99))] shadow-[0_18px_54px_rgba(3,10,18,0.28)]",
    glowClassName:
      "bg-[radial-gradient(circle_at_16%_18%,rgba(34,211,238,0.18),transparent_24%),radial-gradient(circle_at_84%_18%,rgba(59,130,246,0.14),transparent_22%),linear-gradient(145deg,rgba(34,211,238,0.06),transparent_58%)]",
    iconWrapClassName: "border-cyan-300/20 bg-cyan-300/12 text-cyan-50",
    labelClassName: "text-cyan-100/60",
    numberClassName: "text-cyan-50",
  },
  {
    articleClassName:
      "border-amber-300/16 bg-[linear-gradient(180deg,rgba(29,18,8,0.96),rgba(13,10,8,0.99))] shadow-[0_18px_54px_rgba(24,14,3,0.28)]",
    glowClassName:
      "bg-[radial-gradient(circle_at_20%_18%,rgba(251,191,36,0.18),transparent_24%),radial-gradient(circle_at_84%_18%,rgba(249,115,22,0.14),transparent_22%),linear-gradient(145deg,rgba(251,191,36,0.06),transparent_58%)]",
    iconWrapClassName: "border-amber-300/20 bg-amber-300/12 text-amber-50",
    labelClassName: "text-amber-100/60",
    numberClassName: "text-amber-50",
  },
  {
    articleClassName:
      "border-fuchsia-300/16 bg-[linear-gradient(180deg,rgba(24,14,28,0.96),rgba(11,8,18,0.99))] shadow-[0_18px_54px_rgba(18,7,22,0.28)]",
    glowClassName:
      "bg-[radial-gradient(circle_at_20%_18%,rgba(232,121,249,0.18),transparent_24%),radial-gradient(circle_at_84%_18%,rgba(168,85,247,0.14),transparent_22%),linear-gradient(145deg,rgba(232,121,249,0.06),transparent_58%)]",
    iconWrapClassName: "border-fuchsia-300/20 bg-fuchsia-300/12 text-fuchsia-50",
    labelClassName: "text-fuchsia-100/60",
    numberClassName: "text-fuchsia-50",
  },
  {
    articleClassName:
      "border-emerald-300/16 bg-[linear-gradient(180deg,rgba(8,24,18,0.96),rgba(7,11,13,0.99))] shadow-[0_18px_54px_rgba(4,18,9,0.28)]",
    glowClassName:
      "bg-[radial-gradient(circle_at_20%_18%,rgba(52,211,153,0.18),transparent_24%),radial-gradient(circle_at_86%_20%,rgba(34,211,238,0.12),transparent_22%),linear-gradient(145deg,rgba(16,185,129,0.08),transparent_58%)]",
    iconWrapClassName: "border-emerald-300/20 bg-emerald-300/12 text-emerald-50",
    labelClassName: "text-emerald-100/60",
    numberClassName: "text-emerald-50",
  },
] as const;

const capabilityStyles = [
  {
    Icon: RiCoinsLine,
    iconClassName: "text-cyan-100",
    iconWrapClassName: "border-cyan-300/20 bg-cyan-300/10",
    glowClassName:
      "bg-[radial-gradient(circle_at_16%_18%,rgba(34,211,238,0.18),transparent_24%),linear-gradient(135deg,rgba(34,211,238,0.07),transparent_54%)]",
  },
  {
    Icon: RiBarChartBoxLine,
    iconClassName: "text-amber-100",
    iconWrapClassName: "border-amber-300/20 bg-amber-300/10",
    glowClassName:
      "bg-[radial-gradient(circle_at_84%_18%,rgba(251,191,36,0.18),transparent_24%),linear-gradient(160deg,rgba(249,115,22,0.08),transparent_55%)]",
  },
  {
    Icon: RiRobot3Line,
    iconClassName: "text-emerald-100",
    iconWrapClassName: "border-emerald-300/20 bg-emerald-300/10",
    glowClassName:
      "bg-[radial-gradient(circle_at_18%_18%,rgba(74,222,128,0.16),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(168,85,247,0.16),transparent_24%)]",
  },
] as const;

export function AboutPageExperience({
  locale,
  page,
}: AboutPageExperienceProps) {
  const aboutCopy = locale === "ru"
    ? {
        founderSignal: "Сигнал основателя",
        epicBuild: "Сборка продукта",
      }
    : locale === "kg"
      ? {
          founderSignal: "Негиздөөчүнүн сигналы",
          epicBuild: "Продукт түзүлүшү",
        }
      : {
          founderSignal: "Founder signal",
          epicBuild: "Product build",
        };

  return (
    <div className="px-6 sm:px-10 lg:px-12">
      <section className="relative z-10 py-14 lg:py-18">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1.02fr)_minmax(24rem,0.98fr)] xl:items-center">
          <div className="min-w-0">
            <MarketingPageIntro
              eyebrow={page.eyebrow}
              title={page.title}
              description={page.description}
              maxWidthClassName="max-w-3xl"
            />
          </div>

          <ScrollReveal delay={0.08} distance={28} blur={12}>
            <div className="about-command-shell relative overflow-hidden rounded-[2.4rem] border border-white/10 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.34)] sm:p-7">
              <div className="about-command-grid absolute inset-0 opacity-35" />
              <div className="about-command-beam absolute inset-x-0 top-0 h-px" />
              <div className="about-command-orb about-command-orb-one absolute left-[8%] top-[10%] size-32 rounded-full" />
              <div className="about-command-orb about-command-orb-two absolute right-[10%] top-[18%] size-28 rounded-full" />
              <div className="about-command-orb about-command-orb-three absolute bottom-[10%] left-[42%] size-36 rounded-full" />

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-4">
                  <div className="inline-flex rounded-full border border-emerald-300/18 bg-emerald-300/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-emerald-100">
                    {aboutCopy.founderSignal}
                  </div>
                  <RiShieldStarLine className="size-5 text-emerald-200/80" />
                </div>

                <div className="mt-5 max-w-md text-2xl font-semibold leading-[1.12] tracking-[-0.04em] text-white">
                  {page.founder.title}
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {page.founder.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  {page.founder.badges.map((badge, index) => (
                    <div
                      key={`${badge}-${index}`}
                      className="about-float inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[0.72rem] text-white/82"
                      style={{ animationDelay: `${index * 0.35}s` }}
                    >
                      {badge}
                    </div>
                  ))}
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {page.founder.signals.map((item, index) => (
                    <div
                      key={`${item.label}-${index}`}
                      className="rounded-[1.3rem] border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur-xl"
                    >
                      <div className="text-[0.66rem] uppercase tracking-[0.18em] text-white/40">
                        {item.label}
                      </div>
                      <div className="mt-2 text-base font-semibold tracking-[-0.03em] text-white">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative z-10 py-8 lg:py-12">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <ScrollReveal delay={0.04} distance={24} blur={10}>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,18,0.94),rgba(8,10,18,0.99))] p-6 sm:p-7">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(34,211,238,0.12),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(74,222,128,0.1),transparent_22%)]" />
              <div className="relative z-10">
                <div className="text-[0.68rem] uppercase tracking-[0.18em] text-white/42">
                  {page.founder.eyebrow}
                </div>
                <h2 className="mt-4 max-w-lg text-3xl font-semibold leading-[1.12] tracking-[-0.04em] text-white sm:text-4xl">
                  {page.platforms.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                  {page.platforms.description}
                </p>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {page.platforms.items.map((item, index) => {
              const Icon = platformIcons[index % platformIcons.length];
              const style = platformStyles[index % platformStyles.length];

              return (
                <ScrollReveal
                  key={`${item.label}-${index}`}
                  delay={0.06 + index * 0.08}
                  distance={20}
                  blur={8}
                >
                  <article className={`about-platform-card group relative h-full overflow-hidden rounded-[1.7rem] border p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(0,0,0,0.28)] ${style.articleClassName}`}>
                    <div className={`absolute inset-0 opacity-90 ${style.glowClassName}`} />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px] opacity-15" />
                    <div className="about-platform-card-line absolute inset-x-0 top-0 h-px" />
                    <div className="relative z-10 flex h-full flex-col">
                      <div className={`inline-flex rounded-[1rem] border p-3 ${style.iconWrapClassName}`}>
                        <Icon className="size-5" />
                      </div>
                      <div className={`mt-4 text-[0.66rem] uppercase tracking-[0.18em] ${style.labelClassName}`}>
                        {item.label}
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-4">
                        <div className="text-xl font-semibold tracking-[-0.04em] text-white">
                          {item.value}
                        </div>
                        <div className={`text-sm font-semibold tracking-[0.22em] ${style.numberClassName}`}>
                          {item.label.padStart(2, "0")}
                        </div>
                      </div>
                      <p className="mt-3 flex-1 text-sm leading-7 text-slate-300">
                        {item.detail}
                      </p>
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-10 lg:py-14">
        <HomeSectionHeading
          eyebrow={page.capabilities.eyebrow}
          title={page.capabilities.title}
          description={page.capabilities.description}
          maxWidthClassName="max-w-2xl"
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {page.capabilities.cards.map((card, index) => {
            const style = capabilityStyles[index % capabilityStyles.length];
            const Icon = style.Icon;

            return (
              <ScrollReveal
                key={`${card.title}-${index}`}
                delay={0.05 + index * 0.08}
                distance={24}
                blur={10}
              >
                <article className="relative h-full overflow-hidden rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,18,0.94),rgba(8,10,18,0.98))] p-6">
                  <div className={`absolute inset-0 opacity-90 ${style.glowClassName}`} />
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:28px_28px] opacity-20" />
                  <div className="relative z-10">
                    <div className={`inline-flex rounded-[1rem] border p-3 ${style.iconWrapClassName}`}>
                      <Icon className={`size-5 ${style.iconClassName}`} />
                    </div>
                    <div className="mt-5 text-[0.68rem] uppercase tracking-[0.22em] text-white/46">
                      {card.eyebrow}
                    </div>
                    <h3 className="mt-3 max-w-[12rem] text-2xl font-semibold leading-[1.12] tracking-[-0.04em] text-white">
                      {card.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-slate-300">
                      {card.description}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 py-10 lg:py-14">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <HomeSectionHeading
            eyebrow={page.stack.eyebrow}
            title={page.stack.title}
            description={page.stack.description}
            align="left"
            maxWidthClassName="max-w-lg"
          />

          <div className="space-y-4">
            {page.stack.items.map((item, index) => (
              <ScrollReveal
                key={`${item.label}-${index}`}
                delay={0.05 + index * 0.08}
                distance={22}
                blur={8}
              >
                <article className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(9,15,18,0.94),rgba(7,10,16,0.98))] p-5 sm:p-6">
                  <div className="grid gap-4 sm:grid-cols-[5rem_minmax(0,1fr)] sm:items-start">
                    <div className="inline-flex h-10 items-center justify-center rounded-full border border-emerald-300/18 bg-emerald-300/10 px-4 text-sm font-semibold text-emerald-100">
                      {item.label}
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
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-14 lg:py-18">
        <div className="relative overflow-hidden rounded-[2.3rem] border border-white/10 bg-[linear-gradient(135deg,rgba(9,14,16,0.96),rgba(8,10,18,0.99))] px-6 py-8 shadow-[0_24px_90px_rgba(0,0,0,0.28)] sm:px-8 sm:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_24%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_84%_18%,rgba(74,222,128,0.18),transparent_26%),radial-gradient(circle_at_50%_110%,rgba(251,191,36,0.14),transparent_30%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:42px_42px] opacity-20" />

          <div className="relative z-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.66rem] uppercase tracking-[0.16em] text-white/52">
                <RiSparklingLine className="mr-2 size-3.5 text-emerald-200" />
                {aboutCopy.epicBuild}
              </div>
              <h2 className="mt-4 text-2xl font-semibold leading-[1.14] tracking-[-0.04em] text-white sm:text-[2rem]">
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
                href={getLocalizedPath(locale, "/pricing")}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/6 px-6 py-3 text-sm font-medium text-zinc-100 transition hover:border-emerald-300/18 hover:bg-white/8"
              >
                {page.cta.secondary}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
