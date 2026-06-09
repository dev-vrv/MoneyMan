import { RiMoneyDollarCircleLine, RiRadarLine } from "react-icons/ri";

type HeroMoneyBeaconCopy = {
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

type HeroMoneyBeaconProps = {
  copy: HeroMoneyBeaconCopy;
};

export function HeroMoneyBeacon({ copy }: HeroMoneyBeaconProps) {
  return (
    <div className="relative min-w-0 h-full">
      <div className="hero-money-beacon relative flex h-full min-h-[32rem] flex-col overflow-hidden rounded-[2rem] border border-white/10 px-5 py-6 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(251,191,36,0.14),transparent_26%),radial-gradient(circle_at_64%_78%,rgba(232,121,249,0.14),transparent_30%)]" />
        <div className="hero-money-beacon-sweep absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full" />

        <div className="relative z-10 flex min-w-0 items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="break-words text-[0.7rem] font-medium tracking-[0.08em] text-white/58">
              {copy.title}
            </div>
            <div className="mt-2 max-w-xl break-words text-[0.95rem] leading-6 text-white/72">
              {copy.description}
            </div>
          </div>

          <div className="hero-float inline-flex shrink-0 rounded-2xl border border-cyan-300/18 bg-cyan-300/10 p-3 text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.18)]">
            <RiRadarLine className="size-5" />
          </div>
        </div>

        <div className="relative z-10 mt-6 grid flex-1 gap-5 lg:grid-cols-[200px_minmax(0,1fr)] lg:items-center">
          <div className="relative mx-auto flex h-[11.5rem] w-[11.5rem] items-center justify-center rounded-full">
            <div className="hero-money-ring absolute inset-0 rounded-full border border-cyan-300/20" />
            <div className="hero-money-ring hero-money-ring-delay absolute inset-4 rounded-full border border-fuchsia-300/18" />
            <div className="hero-money-ring hero-money-ring-slow absolute inset-8 rounded-full border border-amber-300/16" />
            <div className="absolute inset-5 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.12),rgba(99,102,241,0.05)_58%,transparent_74%)] blur-xl" />
            <div className="hero-float relative flex h-24 w-24 items-center justify-center rounded-full border border-white/12 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),rgba(255,255,255,0.03)_56%,rgba(8,10,18,0.94)_100%)] shadow-[0_0_70px_rgba(34,211,238,0.14)]">
              <RiMoneyDollarCircleLine className="size-12 text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.35)]" />
            </div>
            <div className="absolute right-2 top-6 h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.88)]" />
            <div className="absolute bottom-4 left-4 h-2.5 w-2.5 rounded-full bg-fuchsia-300 shadow-[0_0_16px_rgba(232,121,249,0.86)]" />
            <div className="absolute left-2 top-14 h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.86)]" />
          </div>

          <div className="min-w-0 self-stretch space-y-4">
            <div className="hero-money-track relative min-h-[10rem] overflow-hidden rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-4">
              <div className="mb-2 flex items-center justify-between gap-3 text-[0.66rem] tracking-[0.08em] text-white/50">
                <span className="min-w-0 break-words pr-2">{copy.radarLabel}</span>
                <span className="shrink-0">{copy.active}</span>
              </div>
              <div className="max-w-full break-words text-[1.35rem] font-semibold leading-tight tracking-tight text-white sm:text-[1.5rem]">
                {copy.headline}
              </div>
              <div className="mt-2 break-words text-[0.95rem] leading-6 text-white/64">{copy.body}</div>
              <div className="hero-money-line absolute bottom-0 left-0 h-px w-full" />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="hero-float flex min-h-[5.7rem] min-w-0 flex-col justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/10 px-3 py-3 text-center">
                <div className="break-words text-[0.58rem] tracking-[0.08em] text-white/52">{copy.scan}</div>
                <div className="mt-1 break-words text-[1rem] font-semibold leading-5 text-white">{copy.scanValue}</div>
              </div>
              <div className="hero-float hero-float-delay flex min-h-[5.7rem] min-w-0 flex-col justify-center rounded-2xl border border-amber-300/15 bg-amber-300/10 px-3 py-3 text-center">
                <div className="break-words text-[0.58rem] tracking-[0.08em] text-white/52">{copy.pulse}</div>
                <div className="mt-1 break-words text-[1rem] font-semibold leading-5 text-white">{copy.pulseValue}</div>
              </div>
              <div className="hero-float flex min-h-[5.7rem] min-w-0 flex-col justify-center rounded-2xl border border-fuchsia-300/15 bg-fuchsia-300/10 px-3 py-3 text-center">
                <div className="break-words text-[0.58rem] tracking-[0.08em] text-white/52">{copy.glow}</div>
                <div className="mt-1 break-words text-[1rem] font-semibold leading-5 text-white">{copy.glowValue}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
