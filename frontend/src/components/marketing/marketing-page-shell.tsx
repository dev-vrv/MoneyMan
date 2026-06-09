import type { ReactNode } from "react";

import { SiteHeader } from "@/components/layout/site-header";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type MarketingPageShellProps = {
  locale: Locale;
  header: Dictionary["header"];
  children: ReactNode;
};

export function MarketingPageShell({
  locale,
  header,
  children,
}: MarketingPageShellProps) {
  return (
    <main className="relative flex min-h-screen flex-1 flex-col overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.16),_transparent_28%),linear-gradient(180deg,_#040806_0%,_#08110d_42%,_#040705_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.085)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.085)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      <div className="header-aurora header-aurora-primary absolute inset-x-[4%] top-[-4rem] h-40 sm:h-48 lg:top-[-3rem] lg:h-56" />
      <div className="header-aurora header-aurora-secondary absolute inset-x-[10%] top-6 h-32 sm:h-40 lg:top-8 lg:h-44" />
      <div className="hero-drift-light hero-drift-light-cyan hero-drift-light-one absolute left-[-10%] top-[2%] h-[20rem] w-[20rem] rounded-full" />
      <div className="hero-drift-light hero-drift-light-amber hero-drift-light-two absolute right-[-8%] top-[4%] h-[22rem] w-[22rem] rounded-full" />
      <div className="hero-drift-light hero-drift-light-fuchsia hero-drift-light-three absolute left-[36%] top-[-2%] h-[18rem] w-[18rem] rounded-full opacity-55" />
      <div className="absolute left-[8%] top-[10%] h-72 w-72 rounded-full bg-emerald-400/12 blur-3xl" />
      <div className="absolute right-[8%] top-[18%] h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute bottom-[8%] left-[30%] h-72 w-72 rounded-full bg-amber-300/8 blur-3xl" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col">
        <SiteHeader locale={locale} messages={header} />
        {children}
      </section>
    </main>
  );
}
