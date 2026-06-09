import { RiCopperCoinLine, RiRadarLine, RiSparkling2Line } from "react-icons/ri";

type HeroSideWidgetCopy = {
  title: string;
  description: string;
  focusLabel: string;
  focusValue: string;
  pulseLabel: string;
  pulseValue: string;
  controlLabel: string;
  controlValue: string;
  pills: string[];
};

type HeroSideWidgetProps = {
  copy: HeroSideWidgetCopy;
};

export function HeroSideWidget({ copy }: HeroSideWidgetProps) {
  return (
    <div className="relative h-full min-w-0 select-none">
      <div className="hero-side-widget relative flex h-full min-h-[28rem] flex-col overflow-hidden rounded-[1.75rem] border border-white/10 p-4 backdrop-blur-2xl sm:p-4.5">
        <div className="hero-side-sweep absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.14),transparent_34%),radial-gradient(circle_at_78%_28%,rgba(251,191,36,0.12),transparent_32%),radial-gradient(circle_at_52%_82%,rgba(232,121,249,0.12),transparent_34%)]" />

        <div className="relative z-10 flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="break-words text-[0.68rem] font-medium uppercase tracking-[0.12em] text-white/54">
              {copy.title}
            </div>
            <div className="mt-2 max-w-md break-words text-[0.92rem] leading-6 text-white/70">
              {copy.description}
            </div>
          </div>
          <div className="hero-float inline-flex shrink-0 rounded-[1rem] border border-cyan-300/20 bg-cyan-300/10 p-2.5 text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.18)]">
            <RiRadarLine className="size-[1.125rem]" />
          </div>
        </div>

        <div className="relative z-10 mt-4 flex min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative mx-auto flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.16),rgba(255,255,255,0.02)_58%,rgba(8,10,18,0.92)_100%)] sm:mx-0 lg:h-24 lg:w-24">
            <div className="hero-side-ring absolute inset-2 rounded-full border border-cyan-300/20" />
            <div className="hero-side-ring hero-side-ring-delay absolute inset-5 rounded-full border border-fuchsia-300/20" />
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.18),transparent_62%)] blur-xl" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-amber-300/25 bg-amber-300/12 text-amber-100 shadow-[0_0_36px_rgba(251,191,36,0.2)] lg:h-14 lg:w-14">
              <RiCopperCoinLine className="size-6 lg:size-7" />
            </div>
            <div className="absolute -right-1 top-4 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.85)]" />
            <div className="absolute bottom-5 left-2 h-2 w-2 rounded-full bg-fuchsia-300 shadow-[0_0_16px_rgba(232,121,249,0.85)]" />
          </div>

          <div className="min-w-0 flex-1 self-stretch space-y-2">
            <div className="hero-float flex min-h-[5.25rem] min-w-0 flex-col justify-between rounded-[1.15rem] border border-white/8 bg-white/[0.04] px-3 py-3 sm:px-3.5">
              <div className="mb-1 text-[0.58rem] uppercase tracking-[0.1em] text-cyan-100/65">
                {copy.focusLabel}
              </div>
              <div className="text-[1rem] font-semibold leading-5 tracking-tight text-white text-balance sm:text-[1.05rem]">
                {copy.focusValue}
              </div>
            </div>

            <div className="grid gap-2.5 xl:grid-cols-2">
              <div className="hero-float hero-float-delay flex min-h-[5.5rem] min-w-0 flex-col justify-between overflow-hidden rounded-[1.15rem] border border-fuchsia-300/15 bg-fuchsia-300/10 px-3 py-3 text-left text-white/88 sm:px-3.5">
                <div className="mb-1 text-[0.58rem] uppercase tracking-[0.1em] text-white/58">
                  {copy.pulseLabel}
                </div>
                <div className="text-[1rem] font-semibold leading-5 text-balance sm:text-[1.05rem]">
                  {copy.pulseValue}
                </div>
              </div>
              <div className="hero-float flex min-h-[5.5rem] min-w-0 flex-col justify-between overflow-hidden rounded-[1.15rem] border border-amber-300/15 bg-amber-300/10 px-3 py-3 text-left text-white/88 sm:px-3.5">
                <div className="mb-1 text-[0.58rem] uppercase tracking-[0.1em] text-white/58">
                  {copy.controlLabel}
                </div>
                <div className="flex min-w-0 items-start gap-1.5 text-[1rem] font-semibold leading-5 sm:text-[1.05rem]">
                  <RiSparkling2Line className="mt-0.5 size-3.5 shrink-0 text-amber-100" />
                  <span className="min-w-0 text-balance">{copy.controlValue}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-3 flex min-h-[3.5rem] flex-wrap content-start gap-2">
          {copy.pills.map((pill, index) => (
            <div
              key={pill}
              className={[
                "max-w-full break-words rounded-full px-2.5 py-1.5 text-[0.66rem] tracking-[0.06em]",
                index === 0 &&
                  "border border-cyan-300/15 bg-cyan-300/10 text-cyan-50/84",
                index === 1 &&
                  "border border-amber-300/15 bg-amber-300/10 text-amber-50/84",
                index === 2 &&
                  "border border-fuchsia-300/15 bg-fuchsia-300/10 text-fuchsia-50/84",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {pill}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
