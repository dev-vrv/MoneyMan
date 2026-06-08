import { RiCopperCoinLine, RiRadarLine, RiSparkling2Line } from "react-icons/ri";

export function HeroSideWidget() {
  return (
    <div className="relative max-w-xl">
      <div className="hero-side-widget relative overflow-hidden rounded-[1.75rem] border border-white/10 p-5 backdrop-blur-2xl sm:p-6">
        <div className="hero-side-sweep absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.14),transparent_34%),radial-gradient(circle_at_78%_28%,rgba(251,191,36,0.12),transparent_32%),radial-gradient(circle_at_52%_82%,rgba(232,121,249,0.12),transparent_34%)]" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 text-[0.68rem] font-medium uppercase tracking-[0.34em] text-white/55">
              live money signal
            </div>
            <div className="text-sm leading-6 text-white/72">
              Быстрый визуальный слой про деньги, контроль и движение средств.
            </div>
          </div>
          <div className="hero-float inline-flex rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.18)]">
            <RiRadarLine className="size-5" />
          </div>
        </div>

        <div className="relative z-10 mt-6 flex items-center gap-5">
          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.16),rgba(255,255,255,0.02)_58%,rgba(8,10,18,0.92)_100%)]">
            <div className="hero-side-ring absolute inset-2 rounded-full border border-cyan-300/20" />
            <div className="hero-side-ring hero-side-ring-delay absolute inset-5 rounded-full border border-fuchsia-300/20" />
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.18),transparent_62%)] blur-xl" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-amber-300/25 bg-amber-300/12 text-amber-100 shadow-[0_0_36px_rgba(251,191,36,0.2)]">
              <RiCopperCoinLine className="size-8" />
            </div>
            <div className="absolute -right-1 top-4 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.85)]" />
            <div className="absolute bottom-5 left-2 h-2 w-2 rounded-full bg-fuchsia-300 shadow-[0_0_16px_rgba(232,121,249,0.85)]" />
          </div>

          <div className="flex-1 space-y-3">
            <div className="hero-float rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
              <div className="mb-1 text-[0.65rem] uppercase tracking-[0.32em] text-cyan-100/65">
                cash focus
              </div>
              <div className="text-2xl font-semibold tracking-tight text-white">$12.4k</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="hero-float hero-float-delay rounded-2xl border border-fuchsia-300/15 bg-fuchsia-300/10 px-3 py-3 text-white/88">
                <div className="mb-1 text-[0.64rem] uppercase tracking-[0.3em] text-white/58">
                  pulse
                </div>
                <div className="text-lg font-semibold">+8.2%</div>
              </div>
              <div className="hero-float rounded-2xl border border-amber-300/15 bg-amber-300/10 px-3 py-3 text-white/88">
                <div className="mb-1 text-[0.64rem] uppercase tracking-[0.3em] text-white/58">
                  control
                </div>
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <RiSparkling2Line className="size-4 text-amber-100" />
                  stable
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-5 flex flex-wrap gap-2">
          <div className="rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1.5 text-xs uppercase tracking-[0.22em] text-cyan-50/84">
            money map
          </div>
          <div className="rounded-full border border-amber-300/15 bg-amber-300/10 px-3 py-1.5 text-xs uppercase tracking-[0.22em] text-amber-50/84">
            fast overview
          </div>
          <div className="rounded-full border border-fuchsia-300/15 bg-fuchsia-300/10 px-3 py-1.5 text-xs uppercase tracking-[0.22em] text-fuchsia-50/84">
            signal layer
          </div>
        </div>
      </div>
    </div>
  );
}
