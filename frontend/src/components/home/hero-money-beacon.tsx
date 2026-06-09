import { RiMoneyDollarCircleLine } from "react-icons/ri";

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
  const signals = [
    {
      label: copy.scan,
      value: copy.scanValue,
      toneClassName:
        "border-cyan-300/18 bg-cyan-300/10 text-cyan-50 shadow-[0_18px_48px_rgba(34,211,238,0.12)]",
    },
    {
      label: copy.pulse,
      value: copy.pulseValue,
      toneClassName:
        "border-emerald-300/18 bg-emerald-300/10 text-emerald-50 shadow-[0_18px_48px_rgba(74,222,128,0.12)]",
    },
    {
      label: copy.glow,
      value: copy.glowValue,
      toneClassName:
        "border-amber-300/18 bg-amber-300/10 text-amber-50 shadow-[0_18px_48px_rgba(251,191,36,0.12)]",
    },
  ] as const;

  return (
    <div className="relative h-full min-w-0">
      <div className="hero-money-beacon relative flex h-full min-h-[28rem] flex-col overflow-hidden rounded-[2rem] border border-white/10 px-5 py-6 sm:px-6 sm:py-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_22%,rgba(34,211,238,0.14),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(251,191,36,0.12),transparent_24%),linear-gradient(180deg,rgba(8,18,28,0.94),rgba(5,11,18,0.98))]" />
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent" />
        <div className="absolute left-[14%] top-[18%] h-24 w-24 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute bottom-[16%] right-[12%] h-28 w-28 rounded-full bg-amber-300/10 blur-3xl" />

        <div className="relative z-10 flex min-w-0 flex-col gap-6">
          <div className="max-w-2xl min-w-0">
            <div className="text-[0.68rem] font-medium uppercase tracking-[0.12em] text-white/54">
              {copy.title}
            </div>
            <p className="mt-2 max-w-xl text-[0.94rem] leading-6 text-white/70 text-pretty">
              {copy.description}
            </p>
          </div>

          <div className="grid flex-1 items-center gap-6 lg:grid-cols-[minmax(220px,280px)_minmax(0,1fr)]">
            <div className="relative mx-auto flex h-[14.5rem] w-[14.5rem] items-center justify-center sm:h-[16rem] sm:w-[16rem] xl:h-[17rem] xl:w-[17rem]">
              <div className="hero-money-ring absolute inset-0 rounded-full border border-cyan-300/18" />
              <div className="hero-money-ring hero-money-ring-delay absolute inset-[1.15rem] rounded-full border border-fuchsia-300/16" />
              <div className="hero-money-ring hero-money-ring-slow absolute inset-[2.3rem] rounded-full border border-amber-300/14" />
              <div className="absolute inset-[3.2rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),rgba(59,130,246,0.05)_58%,transparent_78%)] blur-2xl" />
              <div className="hero-float relative flex h-24 w-24 items-center justify-center rounded-full border border-white/12 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),rgba(255,255,255,0.04)_54%,rgba(8,10,18,0.94)_100%)] shadow-[0_0_90px_rgba(34,211,238,0.16)] sm:h-28 sm:w-28">
                <RiMoneyDollarCircleLine className="size-12 text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.35)] sm:size-14" />
              </div>
              <div className="absolute right-[17%] top-[22%] h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.9)]" />
              <div className="absolute left-[18%] top-[31%] h-2.5 w-2.5 rounded-full bg-white/70 shadow-[0_0_14px_rgba(255,255,255,0.32)]" />
              <div className="absolute bottom-[20%] left-[23%] h-2.5 w-2.5 rounded-full bg-fuchsia-300 shadow-[0_0_16px_rgba(232,121,249,0.82)]" />
              <div className="absolute bottom-[24%] right-[19%] h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.84)]" />
            </div>

            <div className="min-w-0">
              <div className="rounded-[1.8rem] border border-white/8 bg-white/[0.04] p-4 backdrop-blur-xl sm:p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-full border border-cyan-300/14 bg-cyan-300/10 px-3 py-1 text-[0.62rem] uppercase tracking-[0.12em] text-cyan-50/90">
                    {copy.radarLabel}
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.62rem] uppercase tracking-[0.12em] text-white/62">
                    {copy.active}
                  </div>
                </div>

                <div className="mt-4 max-w-lg text-[1.7rem] font-semibold leading-[1.06] tracking-[-0.04em] text-white text-balance sm:text-[2rem] xl:text-[2.25rem]">
                  {copy.headline}
                </div>
                <p className="mt-3 max-w-xl text-[0.92rem] leading-6 text-white/68 text-pretty">
                  {copy.body}
                </p>
              </div>

              <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                {signals.map((signal) => (
                  <div
                    key={signal.label}
                    className={`rounded-[1.2rem] border px-3.5 py-3 backdrop-blur-xl ${signal.toneClassName}`}
                  >
                    <div className="text-[0.56rem] uppercase tracking-[0.1em] text-white/52">
                      {signal.label}
                    </div>
                    <div className="mt-1.5 text-[0.94rem] font-semibold leading-5 text-balance">
                      {signal.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
