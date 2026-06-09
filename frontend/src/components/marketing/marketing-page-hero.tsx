import { HomeSectionHeading } from "@/components/home/home-section-heading";

type MarketingHeroStat = {
  label: string;
  value: string;
};

type MarketingHeroVisualItem = {
  label: string;
  value: string;
  detail: string;
};

type MarketingPageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  stats: MarketingHeroStat[];
  visualTitle: string;
  visualDescription: string;
  visualItems: MarketingHeroVisualItem[];
};

export function MarketingPageHero({
  eyebrow,
  title,
  description,
  stats,
  visualTitle,
  visualDescription,
  visualItems,
}: MarketingPageHeroProps) {
  return (
    <section className="relative z-10 flex min-h-[calc(100vh-112px)] items-center py-16">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,0.88fr)_minmax(390px,1fr)] xl:items-center">
          <div className="space-y-8">
            <HomeSectionHeading
              eyebrow={eyebrow}
              title={title}
              description={description}
              align="left"
              maxWidthClassName="max-w-2xl"
            />

            <div className="grid gap-3 sm:grid-cols-3">
              {stats.map((stat, index) => (
                <div
                  key={`${stat.label}-${index}`}
                  className="rounded-[1.6rem] border border-white/10 bg-white/[0.05] px-4 py-4 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-300/24 hover:bg-white/[0.08]"
                >
                  <div className="text-[0.68rem] uppercase tracking-[0.24em] text-emerald-200/70">
                    {stat.label}
                  </div>
                  <div className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[30rem] select-none overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(6,12,15,0.96),rgba(8,10,18,0.98))] p-6 shadow-[0_28px_100px_rgba(0,0,0,0.28)] sm:p-7">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.16),transparent_26%),radial-gradient(circle_at_82%_20%,rgba(251,191,36,0.15),transparent_22%),radial-gradient(circle_at_50%_78%,rgba(74,222,128,0.16),transparent_28%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:50px_50px] opacity-40" />
            <div className="absolute left-[12%] top-[14%] h-36 w-36 rounded-full border border-cyan-300/18 bg-cyan-300/10 blur-3xl animate-[pulse_9s_ease-in-out_infinite]" />
            <div className="absolute right-[12%] top-[12%] h-32 w-32 rounded-full border border-amber-300/18 bg-amber-300/12 blur-3xl animate-[pulse_10s_ease-in-out_infinite]" />
            <div className="absolute bottom-[12%] left-[42%] h-40 w-40 rounded-full border border-emerald-300/18 bg-emerald-300/12 blur-3xl animate-[pulse_11s_ease-in-out_infinite]" />

            <div className="relative z-10 flex h-full flex-col justify-between gap-8">
              <div className="max-w-sm">
                <div className="inline-flex rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-white/72">
                  {visualTitle}
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {visualDescription}
                </p>
              </div>

              <div className="relative mx-auto flex h-full w-full max-w-[24rem] items-center justify-center">
                <div className="absolute size-[18rem] rounded-full border border-white/10" />
                <div className="absolute size-[13rem] rounded-full border border-emerald-300/16" />
                <div className="absolute size-[8.5rem] rounded-full border border-cyan-300/16" />
                <div className="absolute size-28 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.22),rgba(34,197,94,0.18),transparent_74%)] blur-xl" />
                <div className="absolute size-16 rounded-full border border-white/16 bg-black/35 shadow-[0_0_40px_rgba(74,222,128,0.22)]" />

                {visualItems.map((item, index) => {
                  const positions = [
                    "left-[2%] top-[12%] animate-[float_8s_ease-in-out_infinite]",
                    "right-[3%] top-[24%] animate-[float_9s_ease-in-out_infinite_0.8s]",
                    "left-[10%] bottom-[8%] animate-[float_10s_ease-in-out_infinite_1.2s]",
                    "right-[12%] bottom-[10%] animate-[float_8.6s_ease-in-out_infinite_0.4s]",
                  ];

                  return (
                    <div
                      key={`${item.label}-${index}`}
                      className={`absolute w-36 rounded-[1.4rem] border border-white/10 bg-black/38 px-4 py-3 backdrop-blur-xl ${positions[index % positions.length]}`}
                    >
                      <div className="text-[0.66rem] uppercase tracking-[0.24em] text-white/54">
                        {item.label}
                      </div>
                      <div className="mt-2 text-lg font-semibold tracking-[-0.04em] text-white">
                        {item.value}
                      </div>
                      <div className="mt-1 text-xs leading-5 text-slate-300">
                        {item.detail}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
