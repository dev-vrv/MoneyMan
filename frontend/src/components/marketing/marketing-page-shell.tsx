import type { ReactNode } from "react";

import { SiteHeader } from "@/components/layout/site-header";
import { RouteScrollReset } from "@/components/marketing/route-scroll-reset";
import { ScrollToTopButton } from "@/components/marketing/scroll-to-top-button";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type MarketingPageShellProps = {
  locale: Locale;
  header: Dictionary["header"];
  children: ReactNode;
  pattern?:
    | "about"
    | "pricing"
    | "security"
    | "faq"
    | "privacy"
    | "terms"
    | "offer"
    | "contacts";
};

function renderBackgroundPattern(
  pattern: NonNullable<MarketingPageShellProps["pattern"]>,
) {
  switch (pattern) {
    case "about":
      return (
        <>
          <div className="absolute left-[-2%] top-[-1.25rem] h-80 w-80 rounded-full border border-cyan-300/12" />
          <div className="absolute left-[7%] top-[1.9rem] h-48 w-48 rounded-full border border-cyan-300/8" />
          <div className="absolute left-[27%] top-[4.9rem] h-px w-[14%] bg-gradient-to-r from-cyan-300/0 via-cyan-200/20 to-transparent" />
          <div className="absolute left-[43%] top-[2.8rem] h-28 w-28 rotate-45 rounded-[1.8rem] border border-emerald-300/10" />
          <div className="absolute left-[48.5%] top-[4.4rem] h-12 w-12 rotate-45 rounded-[0.9rem] border border-emerald-200/10" />
          <div className="absolute left-[11%] top-2 h-40 w-40 rounded-full bg-cyan-300/6 blur-3xl" />
        </>
      );
    case "pricing":
      return (
        <>
          <div className="absolute right-[-6%] top-[-2.25rem] h-[26rem] w-[26rem] rounded-full border border-amber-300/10" />
          <div className="absolute right-[4.5%] top-[1.25rem] h-[15.5rem] w-[15.5rem] rounded-full border border-amber-200/9" />
          <div className="absolute right-[12.5%] top-[4.15rem] h-[8rem] w-[8rem] rounded-full border border-white/8" />
          <div className="absolute right-[17.5%] top-[7rem] h-3.5 w-3.5 rounded-full bg-white/55" />
          <div className="absolute left-[12%] top-[1.2rem] h-[9rem] w-[9rem] rotate-45 rounded-[2rem] border border-emerald-300/10" />
          <div className="absolute left-[16.5%] top-[4.1rem] h-[4.4rem] w-[4.4rem] rotate-45 rounded-[1rem] border border-emerald-200/9" />
          <div className="absolute left-[27%] top-[5.1rem] h-px w-[18%] bg-gradient-to-r from-emerald-300/0 via-emerald-200/18 to-transparent" />
          <div className="absolute right-[26%] top-[5.3rem] h-px w-[16%] bg-gradient-to-l from-amber-300/0 via-amber-200/20 to-transparent" />
          <div className="absolute left-[11%] top-3 h-36 w-36 rounded-[2.25rem] bg-emerald-300/4 blur-3xl" />
          <div className="absolute right-[10%] top-0 h-44 w-44 rounded-full bg-amber-300/6 blur-3xl" />
        </>
      );
    case "security":
      return (
        <>
          <div className="absolute right-[5%] top-[-0.5rem] h-36 w-36 rotate-45 rounded-[2.2rem] border border-cyan-300/12" />
          <div className="absolute right-[11%] top-[3rem] h-20 w-20 rotate-45 rounded-[1.15rem] border border-cyan-200/10" />
          <div className="absolute left-[16%] top-[5rem] h-px w-[26%] bg-gradient-to-r from-transparent via-cyan-200/18 to-transparent" />
          <div className="absolute left-[48%] top-[1.8rem] h-32 w-32 -translate-x-1/2 rounded-full border border-white/9" />
          <div className="absolute left-[48%] top-[4.6rem] h-10 w-10 -translate-x-1/2 rounded-full border border-white/8" />
          <div className="absolute right-[12%] top-1 h-36 w-36 rounded-full bg-cyan-300/6 blur-3xl" />
        </>
      );
    case "faq":
      return (
        <>
          <div className="absolute left-[6%] top-[0.75rem] h-60 w-60 rounded-full border border-emerald-300/11" />
          <div className="absolute left-[13%] top-[2.9rem] h-28 w-28 rounded-full border border-emerald-200/10" />
          <div className="absolute left-[28%] top-[5rem] h-px w-[14%] bg-gradient-to-r from-emerald-300/0 via-emerald-200/20 to-transparent" />
          <div className="absolute right-[12%] top-[1.6rem] h-28 w-28 [clip-path:polygon(50%_0%,100%_100%,0%_100%)] border border-amber-300/11" />
          <div className="absolute right-[16.5%] top-[4rem] h-12 w-12 [clip-path:polygon(50%_0%,100%_100%,0%_100%)] border border-amber-200/10" />
          <div className="absolute left-[10%] top-4 h-38 w-38 rounded-full bg-emerald-300/6 blur-3xl" />
        </>
      );
    case "privacy":
      return (
        <>
          <div className="absolute left-[2%] top-[1.8rem] h-32 w-72 rounded-r-full border border-sky-300/10" />
          <div className="absolute left-[18%] top-[5rem] h-px w-[18%] bg-gradient-to-r from-sky-300/0 via-sky-200/18 to-transparent" />
          <div className="absolute left-[47%] top-[1.5rem] h-36 w-36 rounded-full border border-white/8" />
          <div className="absolute left-[52%] top-[3.4rem] h-24 w-24 rounded-full border border-white/7" />
          <div className="absolute right-[11%] top-[3rem] h-20 w-20 rotate-45 rounded-[1.4rem] border border-cyan-300/10" />
          <div className="absolute left-[9%] top-5 h-36 w-36 rounded-full bg-sky-300/6 blur-3xl" />
        </>
      );
    case "terms":
      return (
        <>
          <div className="absolute left-[11%] top-[2.2rem] h-22 w-22 rotate-45 rounded-[1.35rem] border border-white/8" />
          <div className="absolute left-[16%] top-[5rem] h-px w-[12%] bg-gradient-to-r from-white/0 via-white/16 to-transparent" />
          <div className="absolute left-[35%] top-[2.8rem] h-18 w-18 rounded-full border border-white/7" />
          <div className="absolute right-[6%] top-[1.8rem] h-32 w-52 rounded-l-full border border-amber-300/10" />
          <div className="absolute right-[20%] top-[4.8rem] h-4 w-4 rounded-full bg-amber-200/52" />
          <div className="absolute right-[10%] top-4 h-32 w-32 rounded-full bg-amber-300/5 blur-3xl" />
        </>
      );
    case "offer":
      return (
        <>
          <div className="absolute left-[9%] top-[2rem] h-28 w-28 [clip-path:polygon(50%_0%,100%_100%,0%_100%)] border border-cyan-300/11" />
          <div className="absolute left-[14%] top-[4.3rem] h-12 w-12 [clip-path:polygon(50%_0%,100%_100%,0%_100%)] border border-cyan-200/10" />
          <div className="absolute left-[23%] top-[5rem] h-px w-[16%] bg-gradient-to-r from-cyan-300/0 via-cyan-200/20 to-transparent" />
          <div className="absolute right-[7%] top-[0.5rem] h-60 w-60 rounded-full border border-emerald-300/11" />
          <div className="absolute right-[14%] top-[3rem] h-28 w-28 rounded-full border border-emerald-200/10" />
          <div className="absolute right-[11%] top-2 h-38 w-38 rounded-full bg-emerald-300/6 blur-3xl" />
        </>
      );
    case "contacts":
      return (
        <>
          <div className="absolute left-[6%] top-[-0.5rem] h-72 w-72 rounded-full border border-cyan-300/12" />
          <div className="absolute left-[13%] top-[2rem] h-44 w-44 rounded-full border border-cyan-300/8" />
          <div className="absolute left-[20%] top-[4.4rem] h-16 w-16 rounded-full border border-cyan-200/10" />
          <div className="absolute left-[31%] top-[5rem] h-px w-[14%] bg-gradient-to-r from-cyan-300/0 via-cyan-200/20 to-transparent" />
          <div className="absolute left-[48%] top-[2.3rem] h-24 w-24 rounded-full border border-white/8" />
          <div className="absolute left-[51.5%] top-[4rem] h-4 w-4 rounded-full bg-white/56" />
          <div className="absolute right-[9%] top-[1.9rem] h-36 w-36 rounded-[2.2rem] border border-fuchsia-300/11" />
          <div className="absolute right-[14.5%] top-[4rem] h-16 w-16 rounded-[1rem] border border-fuchsia-200/10" />
          <div className="absolute right-[19%] top-[5rem] h-px w-[10%] bg-gradient-to-l from-fuchsia-300/0 via-fuchsia-200/18 to-transparent" />
          <div className="absolute left-[12%] top-2 h-40 w-40 rounded-full bg-cyan-300/6 blur-3xl" />
          <div className="absolute right-[10%] top-3 h-32 w-32 rounded-[2rem] bg-fuchsia-300/5 blur-3xl" />
        </>
      );
  }
}

export function MarketingPageShell({
  locale,
  header,
  children,
  pattern = "about",
}: MarketingPageShellProps) {
  return (
    <main className="relative flex min-h-screen flex-1 flex-col overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.16),_transparent_28%),linear-gradient(180deg,_#040806_0%,_#08110d_42%,_#040705_100%)]">
      <RouteScrollReset />
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
        <div className="relative">
          <SiteHeader locale={locale} messages={header} />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-full hidden h-72 overflow-hidden lg:block"
          >
            <div className="absolute inset-x-[-8%] top-0 h-60 bg-[linear-gradient(180deg,rgba(8,14,18,0.14),rgba(8,14,18,0))]" />
            <div className="absolute inset-x-[-2%] top-10 h-48 bg-[linear-gradient(to_right,rgba(255,255,255,0.026)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.026)_1px,transparent_1px)] bg-[size:44px_44px] opacity-18" />
            <div className="absolute inset-x-[14%] top-[5.2rem] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute left-1/2 top-2 h-40 w-40 -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
            {renderBackgroundPattern(pattern)}
          </div>
        </div>
        {children}
      </section>
      <ScrollToTopButton locale={locale} />
    </main>
  );
}
