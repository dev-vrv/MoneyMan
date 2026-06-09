"use client";

import { useState } from "react";
import Link from "next/link";
import {
  RiArrowRightUpLine,
  RiExchangeFundsLine,
  RiLineChartLine,
  RiSparklingLine,
} from "react-icons/ri";

import { HomeSectionHeading } from "@/components/home/home-section-heading";
import { MarketingPageIntro } from "@/components/marketing/marketing-page-intro";
import { FaqAccordionShowcase } from "@/components/ui/faq-accordion-showcase";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getLocalizedPath, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type PricingPageExperienceProps = {
  locale: Locale;
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
      billing: {
        monthly: string;
        yearly: string;
        yearlyDiscount: string;
        yearlyEquivalentLabel: string;
        yearlyBilledLabel: string;
        yearlySuffix: string;
      };
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
  page,
}: PricingPageExperienceProps) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const includeCardStyles = [
    {
      Icon: RiExchangeFundsLine,
      iconClassName: "text-cyan-100",
      iconWrapClassName:
        "border-cyan-300/18 bg-cyan-300/10",
      glowClassName:
        "bg-[radial-gradient(circle_at_14%_18%,rgba(34,211,238,0.16),transparent_24%),linear-gradient(135deg,rgba(34,211,238,0.08),transparent_52%)]",
      patternClassName:
        "bg-[linear-gradient(to_right,rgba(34,211,238,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.08)_1px,transparent_1px)] bg-[size:26px_26px]",
    },
    {
      Icon: RiLineChartLine,
      iconClassName: "text-amber-100",
      iconWrapClassName:
        "border-amber-300/18 bg-amber-300/10",
      glowClassName:
        "bg-[radial-gradient(circle_at_84%_18%,rgba(251,191,36,0.16),transparent_24%),linear-gradient(160deg,rgba(251,191,36,0.08),transparent_55%)]",
      patternClassName:
        "bg-[radial-gradient(circle,rgba(251,191,36,0.12)_1px,transparent_1px)] bg-[size:18px_18px]",
    },
    {
      Icon: RiSparklingLine,
      iconClassName: "text-emerald-100",
      iconWrapClassName:
        "border-emerald-300/18 bg-emerald-300/10",
      glowClassName:
        "bg-[radial-gradient(circle_at_18%_18%,rgba(74,222,128,0.16),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.12),transparent_24%)]",
      patternClassName:
        "bg-[linear-gradient(135deg,rgba(74,222,128,0.09)_0,rgba(74,222,128,0.09)_2px,transparent_2px,transparent_14px)] bg-[size:20px_20px]",
    },
  ] as const;
  const planCardStyles = [
    {
      articleClassName:
        "border-white/10 bg-[linear-gradient(180deg,rgba(10,16,18,0.94),rgba(8,10,18,0.98))]",
      overlayClassName:
        "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_28%)] opacity-70",
      badgeClassName:
        "border-white/10 bg-white/7 text-white/72",
    },
    {
      articleClassName:
        "border-emerald-300/24 bg-[linear-gradient(180deg,rgba(15,29,22,0.97),rgba(9,12,18,0.99))] shadow-[0_20px_60px_rgba(0,0,0,0.24)]",
      overlayClassName:
        "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_28%),linear-gradient(135deg,rgba(34,197,94,0.08),transparent_52%)] opacity-90",
      badgeClassName:
        "border-emerald-300/16 bg-emerald-300/10 text-emerald-50",
    },
    {
      articleClassName:
        "border-cyan-300/20 bg-[linear-gradient(180deg,rgba(12,18,28,0.97),rgba(8,10,18,0.99))] shadow-[0_20px_60px_rgba(0,0,0,0.24)]",
      overlayClassName:
        "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_26%),radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.14),transparent_24%),linear-gradient(135deg,rgba(59,130,246,0.08),transparent_56%)] opacity-90",
      animatedOverlayClassName: "pricing-pro-aurora",
      badgeClassName:
        "border-cyan-300/16 bg-cyan-300/10 text-cyan-50",
    },
  ] as const;

  function getNumericPrice(value: string) {
    const normalized = value.replace(/[^0-9.]/g, "");
    const parsed = Number(normalized);

    return Number.isFinite(parsed) ? parsed : 0;
  }

  function formatPrice(value: number) {
    return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : locale === "kg" ? "ru-RU" : "en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: value % 1 === 0 ? 0 : 1,
      maximumFractionDigits: value % 1 === 0 ? 0 : 1,
    }).format(value);
  }

  return (
    <div className="px-6 sm:px-10 lg:px-12">
      <section className="relative z-10 py-14 lg:py-16">
        <MarketingPageIntro
          eyebrow={page.eyebrow}
          title={page.title}
          description={page.description}
          maxWidthClassName="max-w-4xl"
        />
      </section>

      <section className="relative z-10 py-8 lg:py-10">
        <div className="max-w-2xl">
          <div className="text-[0.68rem] uppercase tracking-[0.18em] text-white/42">
            {page.plans.eyebrow}
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
            {page.plans.description}
          </p>

          <div className="mt-5 inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1">
            {(["monthly", "yearly"] as const).map((mode) => {
              const isActive = billingPeriod === mode;
              const label =
                mode === "monthly" ? page.plans.billing.monthly : page.plans.billing.yearly;

              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setBillingPeriod(mode)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-white text-slate-950 shadow-[0_8px_24px_rgba(255,255,255,0.12)]"
                      : "text-white/68 hover:text-white",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-4 xl:grid-cols-3">
          {page.plans.cards.map((plan, index) => {
            const style = planCardStyles[index % planCardStyles.length];
            const monthlyPrice = getNumericPrice(plan.price);
            const yearlyMonthlyPrice = monthlyPrice * 0.8;
            const yearlyTotalPrice = yearlyMonthlyPrice * 12;
            const displayPrice =
              billingPeriod === "yearly" && monthlyPrice > 0
                ? formatPrice(yearlyTotalPrice)
                : plan.price;
            const displayPeriod =
              billingPeriod === "yearly" && monthlyPrice > 0
                ? page.plans.billing.yearlySuffix
                : plan.period;

            return (
              <ScrollReveal
                key={`${plan.name}-${index}`}
                delay={0.04 + index * 0.08}
                distance={26}
                blur={10}
              >
                <article
                  className={cn(
                    "relative flex h-full flex-col overflow-hidden rounded-[1.9rem] border p-5 transition duration-300 hover:-translate-y-1",
                    style.articleClassName,
                  )}
                >
                  <div className={cn("absolute inset-0", style.overlayClassName)} />
                  {"animatedOverlayClassName" in style ? (
                    <div className={cn("absolute inset-0", style.animatedOverlayClassName)} />
                  ) : null}
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={cn(
                          "inline-flex rounded-full border px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em]",
                          style.badgeClassName,
                        )}
                      >
                        {plan.badge}
                      </div>
                      {billingPeriod === "yearly" && monthlyPrice > 0 ? (
                        <div className="inline-flex rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-white/78">
                          {page.plans.billing.yearlyDiscount}
                        </div>
                      ) : null}
                    </div>

                    <h2 className="mt-4 text-2xl font-semibold leading-[1.12] tracking-[-0.04em] text-white">
                      {plan.name}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      {plan.description}
                    </p>

                    <div className="mt-6 flex items-end gap-2">
                      <div className="text-4xl font-semibold tracking-[-0.05em] text-white">
                        {displayPrice}
                      </div>
                      <div className="pb-1 text-sm text-white/62">
                        {displayPeriod}
                      </div>
                    </div>

                    {billingPeriod === "yearly" && monthlyPrice > 0 ? (
                      <div className="mt-2 text-xs leading-6 text-white/54">
                        {page.plans.billing.yearlyEquivalentLabel} {formatPrice(yearlyMonthlyPrice)} {plan.period} · {page.plans.billing.yearlyBilledLabel}
                      </div>
                    ) : null}

                    <div className="mt-5 h-px w-full bg-gradient-to-r from-white/12 via-white/6 to-transparent" />

                    <div className="mt-5 space-y-2.5">
                      {plan.features.map((feature, featureIndex) => (
                        <div
                          key={`${feature}-${featureIndex}`}
                          className="flex items-start gap-3 rounded-[0.95rem] bg-white/[0.03] px-3 py-2.5 text-sm text-white/82"
                        >
                          <div className="mt-1 size-2 shrink-0 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(74,222,128,0.42)]" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 py-10 lg:py-12">
        <HomeSectionHeading
          eyebrow={page.includes.eyebrow}
          title={page.includes.title}
          description={page.includes.description}
          maxWidthClassName="max-w-3xl"
        />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {page.includes.cards.map((card, index) => {
            const style = includeCardStyles[index % includeCardStyles.length];
            const Icon = style.Icon;

            return (
              <ScrollReveal
                key={`${card.title}-${index}`}
                delay={0.05 + index * 0.06}
                distance={22}
                blur={8}
              >
                <article className="relative h-full overflow-hidden rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(9,15,18,0.94),rgba(7,10,16,0.98))] p-5">
                  <div className={`absolute inset-0 opacity-90 ${style.glowClassName}`} />
                  <div className={`absolute inset-0 opacity-35 ${style.patternClassName}`} />
                  <div className="relative z-10">
                    <div
                      className={`inline-flex rounded-[0.95rem] border p-3 ${style.iconWrapClassName}`}
                    >
                      <Icon className={`size-5 ${style.iconClassName}`} />
                    </div>
                    <div className="mt-4 text-[0.68rem] uppercase tracking-[0.18em] text-white/42">
                      {card.eyebrow}
                    </div>
                    <h3 className="mt-3 text-xl font-semibold leading-[1.14] tracking-[-0.04em] text-white">
                      {card.title}
                    </h3>
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

      <section className="relative z-10 py-10 lg:py-14">
        <FaqAccordionShowcase
          eyebrow={page.faq.eyebrow}
          title={page.faq.title}
          description={page.faq.description}
          items={page.faq.items}
          previousLabel={locale === "ru" ? "Назад" : locale === "kg" ? "Артка" : "Previous"}
          nextLabel={locale === "ru" ? "Дальше" : locale === "kg" ? "Кийинки" : "Next"}
          sidebarVariant="compact"
        />

        <div className="mt-6">
          <div className="relative flex overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(9,14,16,0.96),rgba(8,10,18,0.99))] px-6 py-7 shadow-[0_20px_70px_rgba(0,0,0,0.24)] sm:px-8 sm:py-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(74,222,128,0.18),transparent_26%),radial-gradient(circle_at_50%_110%,rgba(251,191,36,0.14),transparent_30%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:42px_42px] opacity-20" />
            <div className="relative z-10 flex h-full flex-col">
              <h2 className="text-2xl font-semibold leading-[1.14] tracking-[-0.04em] text-white sm:text-[2rem]">
                {page.cta.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                {page.cta.description}
              </p>

              <div className="mt-7 flex flex-1 flex-col justify-end gap-3">
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
        </div>
      </section>
    </div>
  );
}
