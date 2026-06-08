import Link from "next/link";
import {
  RiArrowRightLine,
  RiLineChartLine,
  RiShieldCheckLine,
  RiStackLine,
  RiWallet3Line,
} from "react-icons/ri";

import { SiteHeader } from "@/components/layout/site-header";
import { AppProviders } from "@/components/providers/app-providers";
import { defaultLocale, getLocalizedPath } from "@/lib/i18n/config";
import { getLocaleDictionary } from "@/lib/i18n/server";

export default async function RootPage() {
  const locale = defaultLocale;
  const dictionary = await getLocaleDictionary(locale);
  const home = dictionary.home;

  return (
    <AppProviders locale={locale} messages={dictionary}>
      <main className="relative flex min-h-screen flex-1 overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.16),_transparent_28%),linear-gradient(180deg,_#040806_0%,_#08110d_42%,_#040705_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
        <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-400/12 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-lime-400/6 blur-3xl" />

        <section className="relative z-10 mx-auto flex w-full max-w-7xl flex-col">
          <SiteHeader locale={locale} messages={dictionary.header} />

          <div className="px-6 pb-16 pt-8 sm:px-10 lg:px-12">
            <div className="mb-14 flex items-center justify-between">
              <div className="rounded-full border border-emerald-400/10 bg-white/5 px-5 py-2.5 text-base font-medium text-emerald-50/70 backdrop-blur">
                {home.badge}
              </div>
              <div className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-5 py-2.5 text-base font-medium text-emerald-100 md:block">
                {home.architecture}
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,440px)] lg:items-center">
              <div className="space-y-8">
                <div className="space-y-5">
                  <p className="text-sm uppercase tracking-[0.3em] text-emerald-200/70">
                    {home.eyebrow}
                  </p>
                  <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
                    {home.title}
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-slate-300">
                    {home.description}
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/api/v1/health/"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200"
                  >
                    {home.actions.apiHealth}
                    <RiArrowRightLine className="size-4" />
                  </Link>
                  <Link
                    href="/api/v1/docs/"
                    className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/5 px-6 py-3 text-sm font-medium text-white/90 backdrop-blur transition hover:bg-white/8"
                  >
                    {home.actions.openApiDocs}
                  </Link>
                  <Link
                    href={getLocalizedPath(locale, "/ui-components")}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-6 py-3 text-sm font-medium text-emerald-100 transition hover:bg-emerald-300/15"
                  >
                    {home.actions.uiComponents}
                    <RiStackLine className="size-4" />
                  </Link>
                </div>
              </div>

              <div className="grid gap-4">
                {home.cards.map(({ title, description }, index) => {
                  const Icon = [RiWallet3Line, RiLineChartLine, RiShieldCheckLine][index];

                  return (
                    <article
                      key={title}
                      className="rounded-3xl border border-white/8 bg-white/[0.045] p-6 backdrop-blur-xl transition duration-300 hover:border-emerald-300/15 hover:bg-white/[0.06]"
                    >
                      <div className="mb-4 inline-flex rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-emerald-200">
                        <Icon className="size-5" />
                      </div>
                      <h2 className="mb-2 text-xl font-semibold text-white">{title}</h2>
                      <p className="text-sm leading-7 text-slate-300">{description}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
    </AppProviders>
  );
}
