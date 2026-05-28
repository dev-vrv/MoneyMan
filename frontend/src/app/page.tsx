import {
  RiArrowRightLine,
  RiLineChartLine,
  RiShieldCheckLine,
  RiWallet3Line,
} from "react-icons/ri";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-1 overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.16),_transparent_28%),linear-gradient(180deg,_#050816_0%,_#090d1b_42%,_#050816_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <section className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-6 py-16 sm:px-10 lg:px-12">
        <div className="mb-14 flex items-center justify-between">
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur">
            Fin Man Platform
          </div>
          <div className="hidden rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100 md:block">
            API-first fintech architecture
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,440px)] lg:items-center">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/70">
                Personal finance, crypto, analytics, AI
              </p>
              <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
                Premium financial control built on a single scalable API core.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Web, future mobile, integrations and automation all connect to one
                backend contract designed for secure financial operations.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="/api/v1/health/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                API health
                <RiArrowRightLine className="size-4" />
              </a>
              <a
                href="/api/v1/docs/"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white/90 backdrop-blur transition hover:bg-white/10"
              >
                OpenAPI docs
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            {[
              {
                icon: RiWallet3Line,
                title: "Financial core",
                description:
                  "Balances, transactions, recurring payments and account abstractions prepared for shared and business use cases.",
              },
              {
                icon: RiLineChartLine,
                title: "Analytics layer",
                description:
                  "Typed APIs, background sync and realtime-ready data flows for charts, reports, PnL and forecasting modules.",
              },
              {
                icon: RiShieldCheckLine,
                title: "Security baseline",
                description:
                  "JWT rotation, environment-driven config, isolated services, Postgres consistency and Redis-backed async processing.",
              },
            ].map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur-xl"
              >
                <div className="mb-4 inline-flex rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-200">
                  <Icon className="size-5" />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-white">{title}</h2>
                <p className="text-sm leading-7 text-slate-300">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
