import { RiMoneyDollarCircleLine, RiRadarLine } from "react-icons/ri";

export function HeroMoneyBeacon() {
  return (
    <div className="relative max-w-2xl">
      <div className="hero-money-beacon relative overflow-hidden rounded-[2rem] border border-white/10 px-5 py-6 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(251,191,36,0.14),transparent_26%),radial-gradient(circle_at_64%_78%,rgba(232,121,249,0.14),transparent_30%)]" />
        <div className="hero-money-beacon-sweep absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <div className="text-[0.68rem] font-medium uppercase tracking-[0.34em] text-white/52">
              cyber cash beacon
            </div>
            <div className="mt-2 max-w-sm text-sm leading-6 text-white/72">
              Декоративный live-сигнал вокруг денег, движения и контроля.
            </div>
          </div>

          <div className="hero-float inline-flex rounded-2xl border border-cyan-300/18 bg-cyan-300/10 p-3 text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.18)]">
            <RiRadarLine className="size-5" />
          </div>
        </div>

        <div className="relative z-10 mt-6 grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
          <div className="relative mx-auto flex h-[12.5rem] w-[12.5rem] items-center justify-center rounded-full">
            <div className="hero-money-ring absolute inset-0 rounded-full border border-cyan-300/20" />
            <div className="hero-money-ring hero-money-ring-delay absolute inset-4 rounded-full border border-fuchsia-300/18" />
            <div className="hero-money-ring hero-money-ring-slow absolute inset-8 rounded-full border border-amber-300/16" />
            <div className="absolute inset-5 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.12),rgba(99,102,241,0.05)_58%,transparent_74%)] blur-xl" />
            <div className="hero-float relative flex h-28 w-28 items-center justify-center rounded-full border border-white/12 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),rgba(255,255,255,0.03)_56%,rgba(8,10,18,0.94)_100%)] shadow-[0_0_70px_rgba(34,211,238,0.14)]">
              <RiMoneyDollarCircleLine className="size-14 text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.35)]" />
            </div>
            <div className="absolute right-2 top-6 h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.88)]" />
            <div className="absolute bottom-4 left-4 h-2.5 w-2.5 rounded-full bg-fuchsia-300 shadow-[0_0_16px_rgba(232,121,249,0.86)]" />
            <div className="absolute left-2 top-14 h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.86)]" />
          </div>

          <div className="space-y-4">
            <div className="hero-money-track relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-4">
              <div className="mb-2 flex items-center justify-between text-[0.68rem] uppercase tracking-[0.32em] text-white/50">
                <span>money radar</span>
                <span>active</span>
              </div>
              <div className="text-3xl font-semibold tracking-tight text-white">$ • • •</div>
              <div className="mt-2 text-sm text-white/64">
                Живой декоративный слой для hero без лишнего product-текста.
              </div>
              <div className="hero-money-line absolute bottom-0 left-0 h-px w-full" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="hero-float rounded-2xl border border-cyan-300/15 bg-cyan-300/10 px-3 py-3 text-center">
                <div className="text-[0.62rem] uppercase tracking-[0.28em] text-white/52">scan</div>
                <div className="mt-1 text-lg font-semibold text-white">01</div>
              </div>
              <div className="hero-float hero-float-delay rounded-2xl border border-amber-300/15 bg-amber-300/10 px-3 py-3 text-center">
                <div className="text-[0.62rem] uppercase tracking-[0.28em] text-white/52">pulse</div>
                <div className="mt-1 text-lg font-semibold text-white">02</div>
              </div>
              <div className="hero-float rounded-2xl border border-fuchsia-300/15 bg-fuchsia-300/10 px-3 py-3 text-center">
                <div className="text-[0.62rem] uppercase tracking-[0.28em] text-white/52">glow</div>
                <div className="mt-1 text-lg font-semibold text-white">03</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
