import { HeroCardDeck } from "@/components/home/hero-card-deck";
import { SiteHeader } from "@/components/layout/site-header";
import { AnimatedText } from "@/components/ui/animated-text";
import { type Locale } from "@/lib/i18n/config";

type HomeHeroSectionProps = {
  locale: Locale;
  header: {
    logo: string;
    navigation: {
      pricing: string;
      contacts: string;
      security: string;
      info: string;
    };
    infoMenu: {
      about: string;
      faq: string;
      roadmap: string;
    };
    language: {
      label: string;
      en: string;
      ru: string;
      kg: string;
    };
    actions: {
      auth: string;
      workspace: string;
    };
  };
  home: {
    badge: string;
    architecture: string;
    eyebrow: string;
    title: string;
    description: string;
    cards: Array<{
      title: string;
      description: string;
    }>;
    visual: {
      topLeft: string;
      topRight: string;
      radar: string;
      radarValue: string;
      alert: string;
      alertValue: string;
      flow: string;
      flowValue: string;
    };
    deck: {
      active: string;
      stacked: string;
      previousCard: string;
      nextCard: string;
      showCard: string;
    };
  };
};

export function HomeHeroSection({
  locale,
  header,
  home,
}: HomeHeroSectionProps) {
  return (
    <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col">
      <SiteHeader locale={locale} messages={header} />

      <div className="flex flex-1 items-center px-6 pb-16 pt-8 sm:px-10 lg:px-12">
        <div className="w-full">
          <div className="mb-10 flex items-center justify-between">
            <div className="rounded-full border border-emerald-400/10 bg-white/5 px-5 py-2.5 text-sm font-medium uppercase tracking-[0.22em] text-emerald-50/70 backdrop-blur">
              {home.badge}
            </div>
            <div className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-5 py-2.5 text-sm font-medium text-emerald-100 md:block">
              {home.architecture}
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(360px,560px)] lg:items-center">
            <div className="space-y-5">
              <p className="text-xs uppercase tracking-[0.42em] text-emerald-200/70">
                {home.eyebrow}
              </p>
              <AnimatedText
                text={home.title}
                as="h1"
                size="2xl"
                className="max-w-3xl font-semibold leading-[1.08] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl"
                letterClassName="drop-shadow-[0_0_24px_rgba(110,231,183,0.22)]"
                config={{ duration: 0.35, delayStep: 26, distance: 52 }}
              />
              <AnimatedText
                text={home.description}
                as="p"
                size="lg"
                delay={280}
                className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg"
                config={{ duration: 0.28, delayStep: 12, distance: 22 }}
              />
            </div>

            <HeroCardDeck cards={home.cards} visual={home.visual} copy={home.deck} />
          </div>
        </div>
      </div>
    </section>
  );
}
