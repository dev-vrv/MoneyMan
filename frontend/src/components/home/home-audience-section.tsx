import { AudienceFlowMonitor } from "@/components/home/audience-flow-monitor";
import { RiLineChartLine, RiWallet3Line, RiCoinsLine } from "react-icons/ri";

import { HomeSectionHeading } from "@/components/home/home-section-heading";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

type AudienceCard = {
  title: string;
  description: string;
  accent: string;
};

type HomeAudienceSectionProps = {
  section: {
    eyebrow: string;
    title: string;
    description: string;
    visualLabel: string;
    visualTitle: string;
    monitor: {
      eyebrow: string;
      title: string;
      status: string;
      stats: Array<{
        label: string;
        value: string;
        caption: string;
      }>;
      summaries: Array<{
        label: string;
        value: string;
      }>;
    };
    cards: AudienceCard[];
  };
};

const icons = [RiWallet3Line, RiLineChartLine, RiCoinsLine] as const;

export function HomeAudienceSection({ section }: HomeAudienceSectionProps) {
  return (
    <section className="relative z-10 flex min-h-screen items-center">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
        <HomeSectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
        />

        <ScrollReveal delay={0.05} distance={34} blur={14}>
          <div className="relative mt-12 overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(7,13,15,0.96),rgba(6,10,13,0.98))] p-6 backdrop-blur-2xl sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(110,231,183,0.08),transparent_24%),radial-gradient(circle_at_84%_18%,rgba(148,163,184,0.08),transparent_24%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] lg:items-center">
            <div className="min-w-0">
              <div className="mb-3 text-[0.68rem] uppercase tracking-[0.18em] text-white/48">
                {section.visualLabel}
              </div>
              <div className="max-w-xl text-lg font-semibold tracking-tight text-white sm:text-2xl">
                {section.visualTitle}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {section.monitor.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4"
                  >
                    <div className="text-[0.68rem] uppercase tracking-[0.18em] text-white/40">
                      {stat.label}
                    </div>
                    <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-sm text-white/56">{stat.caption}</div>
                  </div>
                ))}
              </div>
            </div>

            <AudienceFlowMonitor copy={section.monitor} />
          </div>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {section.cards.map((card, index) => {
            const Icon = icons[index] ?? RiWallet3Line;

            return (
              <ScrollReveal
                key={card.title}
                delay={0.18 + index * 0.1}
                distance={30}
                blur={12}
              >
                <article className="relative h-full overflow-hidden rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(9,18,20,0.94),rgba(8,10,18,0.98))] p-6 backdrop-blur-2xl">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,rgba(251,191,36,0.12),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_60%)]" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="inline-flex rounded-[1rem] border border-white/10 bg-white/6 p-3 text-white">
                        <Icon className="size-5" />
                      </div>
                      <div className="rounded-full border border-amber-300/15 bg-amber-300/10 px-3 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-amber-100/84">
                        {card.accent}
                      </div>
                    </div>
                    <h3 className="mt-5 text-xl font-semibold tracking-tight text-white">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-white/72">
                      {card.description}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
