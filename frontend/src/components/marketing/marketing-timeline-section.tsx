import { HomeSectionHeading } from "@/components/home/home-section-heading";

type MarketingTimelineItem = {
  label: string;
  title: string;
  description: string;
};

type MarketingTimelineSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: MarketingTimelineItem[];
};

export function MarketingTimelineSection({
  eyebrow,
  title,
  description,
  items,
}: MarketingTimelineSectionProps) {
  return (
    <section className="relative z-10 py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)] xl:items-start">
          <HomeSectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
            align="left"
            maxWidthClassName="max-w-xl"
          />

          <div className="relative space-y-5 before:absolute before:left-4 before:top-4 before:h-[calc(100%-2rem)] before:w-px before:bg-white/10">
            {items.map((item, index) => (
              <article
                key={`${item.label}-${index}`}
                className="relative ml-0 rounded-[1.9rem] border border-white/10 bg-black/24 p-6 pl-12 backdrop-blur-xl transition duration-300 hover:border-emerald-300/22 hover:bg-black/28"
              >
                <div className="absolute left-[0.9rem] top-7 size-3 rounded-full border border-emerald-300/30 bg-emerald-300/80 shadow-[0_0_18px_rgba(74,222,128,0.4)]" />
                <div className="text-[0.68rem] uppercase tracking-[0.24em] text-emerald-200/70">
                  {item.label}
                </div>
                <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
