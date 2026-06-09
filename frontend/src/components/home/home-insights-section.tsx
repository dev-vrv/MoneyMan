import { HeroMoneyBeacon } from "@/components/home/hero-money-beacon";
import { HomeSectionHeading } from "@/components/home/home-section-heading";
import { HeroSideWidget } from "@/components/home/hero-side-widget";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

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
        <HomeSectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
          maxWidthClassName="max-w-3xl"
        />

        <div className="mt-12 grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,420px)] xl:items-stretch">
          <ScrollReveal delay={0.05} distance={34}>
            <HeroMoneyBeacon copy={beacon} />
          </ScrollReveal>
          <ScrollReveal delay={0.16} distance={34}>
            <HeroSideWidget copy={widget} />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
