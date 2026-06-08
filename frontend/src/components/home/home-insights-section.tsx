import { HeroMoneyBeacon } from "@/components/home/hero-money-beacon";
import { HeroSideWidget } from "@/components/home/hero-side-widget";

type HomeInsightsSectionProps = {
  section: {
    eyebrow: string;
    title: string;
    description: string;
  };
  beacon: {
    title: string;
    description: string;
    radarLabel: string;
    active: string;
    headline: string;
    body: string;
    scan: string;
    scanValue: string;
    pulse: string;
    pulseValue: string;
    glow: string;
    glowValue: string;
  };
  widget: {
    title: string;
    description: string;
    focusLabel: string;
    focusValue: string;
    pulseLabel: string;
    pulseValue: string;
    controlLabel: string;
    controlValue: string;
    pills: string[];
  };
};

export function HomeInsightsSection({
  section,
  beacon,
  widget,
}: HomeInsightsSectionProps) {
  return (
    <section className="relative z-10 flex min-h-screen items-center">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
            {section.eyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
            {section.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            {section.description}
          </p>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,420px)] xl:items-stretch">
          <HeroMoneyBeacon copy={beacon} />
          <HeroSideWidget copy={widget} />
        </div>
      </div>
    </section>
  );
}
