import Link from "next/link";
import { RiArrowRightUpLine, RiPagesLine } from "react-icons/ri";

import { getLocalizedPath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type PlaceholderPageShellProps = {
  locale: Locale;
  title: string;
  description: string;
  common: Dictionary["pages"]["common"];
};

export function PlaceholderPageShell({
  locale,
  title,
  description,
  common,
}: PlaceholderPageShellProps) {
  return (
    <main className="relative flex min-h-screen flex-1 overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.16),_transparent_26%),linear-gradient(180deg,_#040806_0%,_#08110d_40%,_#040705_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      <div className="absolute right-[12%] top-16 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

      <section className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-6 py-16 text-center sm:px-10 lg:px-12">
        <div className="surface-panel w-full max-w-3xl rounded-[2.4rem] px-8 py-12 shadow-[0_24px_100px_rgba(0,0,0,0.25)]">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-[1.6rem] border border-emerald-300/20 bg-emerald-300/10 text-emerald-100">
            <RiPagesLine className="size-7" />
          </div>

          <div className="mb-4 inline-flex rounded-full border border-emerald-300/18 bg-emerald-300/10 px-4 py-2 text-sm font-medium text-emerald-100">
            {common.status}
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
            {description}
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href={getLocalizedPath(locale, "/")}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-zinc-100 transition hover:border-emerald-300/18 hover:bg-white/8"
            >
              {common.backHome}
              <RiArrowRightUpLine className="size-4 shrink-0" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
