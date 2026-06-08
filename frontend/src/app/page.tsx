import {
  RiCheckboxCircleFill,
  RiLineChartLine,
  RiShieldCheckLine,
  RiWallet3Line,
} from "react-icons/ri";

import { HeroCardDeck } from "@/components/home/hero-card-deck";
import { HeroMoneyBeacon } from "@/components/home/hero-money-beacon";
import { HeroSideWidget } from "@/components/home/hero-side-widget";
import { AnimatedText } from "@/components/ui/animated-text";
import { SiteHeader } from "@/components/layout/site-header";
import { AppProviders } from "@/components/providers/app-providers";
import { defaultLocale } from "@/lib/i18n/config";
import { getLocaleDictionary } from "@/lib/i18n/server";

export default async function RootPage() {
  const locale = defaultLocale;
  const dictionary = await getLocaleDictionary(locale);
  const home = dictionary.home;
  const heroSignals = [
    { icon: RiWallet3Line, value: "24/7", label: home.signals.sync },
    { icon: RiLineChartLine, value: "+18%", label: home.signals.growth },
    { icon: RiShieldCheckLine, value: "AES", label: home.signals.security },
  ];

  return (
    <AppProviders locale={locale} messages={dictionary}>
      <main className="relative flex min-h-screen flex-1 overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.16),_transparent_28%),linear-gradient(180deg,_#040806_0%,_#08110d_42%,_#040705_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.085)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.085)_1px,transparent_1px),linear-gradient(to_right,rgba(34,211,238,0.075)_1px,transparent_1px),linear-gradient(to_bottom,rgba(244,114,182,0.06)_1px,transparent_1px)] bg-[size:72px_72px,72px_72px,216px_216px,216px_216px] opacity-40" />
        <div className="hero-drift-light hero-drift-light-cyan hero-drift-light-one absolute left-[-8%] top-[10%] h-[24rem] w-[24rem] rounded-full" />
        <div className="hero-drift-light hero-drift-light-amber hero-drift-light-two absolute right-[-6%] top-[18%] h-[28rem] w-[28rem] rounded-full" />
        <div className="hero-drift-light hero-drift-light-fuchsia hero-drift-light-three absolute bottom-[-6%] left-[28%] h-[26rem] w-[26rem] rounded-full" />
        <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-400/12 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-lime-400/6 blur-3xl" />

        <section className="relative z-10 mx-auto flex w-full max-w-7xl flex-col">
          <SiteHeader locale={locale} messages={dictionary.header} />

          <div className="px-6 pb-16 pt-8 sm:px-10 lg:px-12">
            <div className="mb-10 flex items-center justify-between">
              <div className="rounded-full border border-emerald-400/10 bg-white/5 px-5 py-2.5 text-sm font-medium uppercase tracking-[0.22em] text-emerald-50/70 backdrop-blur">
                {home.badge}
              </div>
              <div className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-5 py-2.5 text-sm font-medium text-emerald-100 md:block">
                {home.architecture}
              </div>
            </div>

            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(360px,560px)] lg:items-center">
              <div className="space-y-10">
                <div className="space-y-6">
                  <p className="text-xs uppercase tracking-[0.42em] text-emerald-200/70">
                    {home.eyebrow}
                  </p>
                  <AnimatedText
                    text={home.title}
                    as="h1"
                    size="2xl"
                    className="max-w-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl"
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

                <HeroMoneyBeacon />

                <HeroSideWidget />

                <div className="flex flex-wrap gap-3">
                  {home.highlights.map((item) => (
                    <div
                      key={item}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-sm text-slate-200 backdrop-blur-xl"
                    >
                      <RiCheckboxCircleFill className="size-4 text-emerald-300" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
                  {heroSignals.map(({ icon: Icon, value, label }) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/8 bg-white/[0.045] px-4 py-4 backdrop-blur-xl"
                    >
                      <div className="mb-3 inline-flex rounded-2xl border border-emerald-300/15 bg-emerald-300/10 p-2.5 text-emerald-200">
                        <Icon className="size-5" />
                      </div>
                      <div className="text-2xl font-semibold tracking-tight text-white">{value}</div>
                      <div className="text-sm text-slate-400">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <HeroCardDeck cards={home.cards} visual={home.visual} />
            </div>
          </div>
        </section>
      </main>
    </AppProviders>
  );
}
