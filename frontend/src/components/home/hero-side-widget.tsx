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
    <div className="relative min-w-0 select-none">
      <div className="hero-side-widget relative h-full overflow-hidden rounded-[1.75rem] border border-white/10 p-4 backdrop-blur-2xl sm:p-5">
        <div className="hero-side-sweep absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.14),transparent_34%),radial-gradient(circle_at_78%_28%,rgba(251,191,36,0.12),transparent_32%),radial-gradient(circle_at_52%_82%,rgba(232,121,249,0.12),transparent_34%)]" />

        <div className="relative z-10 flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 break-words text-[0.62rem] font-medium tracking-[0.06em] text-white/58">
              {copy.title}
            </div>
            <div className="break-words text-[0.82rem] leading-5 text-white/72">{copy.description}</div>
          </div>
          <div className="hero-float inline-flex shrink-0 rounded-[1rem] border border-cyan-300/20 bg-cyan-300/10 p-2.5 text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.18)]">
            <RiRadarLine className="size-[1.125rem]" />
          </div>
        </div>

        <div className="relative z-10 mt-5 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative mx-auto flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.16),rgba(255,255,255,0.02)_58%,rgba(8,10,18,0.92)_100%)] sm:mx-0">
            <div className="hero-side-ring absolute inset-2 rounded-full border border-cyan-300/20" />
            <div className="hero-side-ring hero-side-ring-delay absolute inset-5 rounded-full border border-fuchsia-300/20" />
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.18),transparent_62%)] blur-xl" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-amber-300/25 bg-amber-300/12 text-amber-100 shadow-[0_0_36px_rgba(251,191,36,0.2)]">
              <RiCopperCoinLine className="size-7" />
            </div>
            <div className="absolute -right-1 top-4 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.85)]" />
            <div className="absolute bottom-5 left-2 h-2 w-2 rounded-full bg-fuchsia-300 shadow-[0_0_16px_rgba(232,121,249,0.85)]" />
          </div>

          <div className="min-w-0 flex-1 space-y-2.5">
            <div className="hero-float min-w-0 rounded-[1rem] border border-white/8 bg-white/[0.04] px-3 py-2.5">
              <div className="mb-1 break-words text-[0.54rem] tracking-[0.06em] text-cyan-100/65">
                {copy.focusLabel}
              </div>
              <div className="break-words text-[0.88rem] font-semibold leading-5 tracking-tight text-white sm:text-[0.94rem]">
                {copy.focusValue}
              </div>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              <div className="hero-float hero-float-delay min-w-0 overflow-hidden rounded-[1rem] border border-fuchsia-300/15 bg-fuchsia-300/10 px-2.5 py-2 text-white/88">
                <div className="mb-1 break-words text-[0.5rem] tracking-[0.05em] text-white/58">
                  {copy.pulseLabel}
                </div>
                <div className="break-words text-[0.74rem] font-semibold leading-4 sm:text-[0.8rem]">
                  {copy.pulseValue}
                </div>
              </div>
              <div className="hero-float min-w-0 overflow-hidden rounded-[1rem] border border-amber-300/15 bg-amber-300/10 px-2.5 py-2 text-white/88">
                <div className="mb-1 break-words text-[0.5rem] tracking-[0.05em] text-white/58">
                  {copy.controlLabel}
                </div>
                <div className="flex min-w-0 items-start gap-1 text-[0.74rem] font-semibold leading-4 sm:text-[0.8rem]">
                  <RiSparkling2Line className="mt-0.5 size-3 shrink-0 text-amber-100" />
                  <span className="min-w-0 break-words">{copy.controlValue}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-4 flex flex-wrap gap-2">
          {copy.pills.map((pill, index) => (
            <div
              key={pill}
              className={[
                "max-w-full break-words rounded-full px-2.5 py-1.5 text-[0.62rem] tracking-[0.06em]",
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
