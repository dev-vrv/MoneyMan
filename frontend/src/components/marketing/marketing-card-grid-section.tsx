import { HomeSectionHeading } from "@/components/home/home-section-heading";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

type MarketingCard = {
  eyebrow?: string;
  title: string;
  description: string;
  meta?: string;
};

type MarketingCardGridSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  cards: MarketingCard[];
  columns?: 2 | 3;
};

export function MarketingCardGridSection({
  eyebrow,
  title,
  description,
  cards,
  columns = 3,
}: MarketingCardGridSectionProps) {
  const gridClassName =
    columns === 2
      ? "lg:grid-cols-2"
      : "md:grid-cols-2 xl:grid-cols-3";

  return (
    <section className="relative z-10 py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
        <HomeSectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          maxWidthClassName="max-w-3xl"
        />

        <div className={`mt-10 grid gap-5 ${gridClassName}`}>
          {cards.map((card, index) => {
            const shapes = [
              <div key="circle" className="relative size-14 rounded-full border border-emerald-300/28 bg-emerald-300/10">
                <div className="absolute inset-3 rounded-full border border-emerald-200/28" />
              </div>,
              <div key="square" className="relative size-14 rounded-[1.15rem] border border-cyan-300/28 bg-cyan-300/10">
                <div className="absolute inset-2 rounded-[0.85rem] border border-cyan-200/28" />
              </div>,
              <div key="triangle" className="relative flex size-14 items-center justify-center rounded-[1.15rem] border border-amber-300/28 bg-amber-300/10">
                <div className="h-0 w-0 border-r-[12px] border-b-[22px] border-l-[12px] border-r-transparent border-b-amber-200/80 border-l-transparent" />
              </div>,
            ];

            return (
              <ScrollReveal
                key={`${card.title}-${index}`}
                delay={(columns === 2 ? 0.06 : 0.1) + index * 0.08}
                distance={30}
                blur={12}
              >
                <article className="group relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,18,0.94),rgba(8,10,18,0.98))] p-6 transition duration-300 hover:-translate-y-1.5 hover:border-emerald-300/24 hover:shadow-[0_22px_70px_rgba(0,0,0,0.26)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_28%),linear-gradient(135deg,rgba(34,197,94,0.05),transparent_52%)] opacity-80" />
                  <div className="relative z-10">
                    {shapes[index % shapes.length]}

                    {card.eyebrow ? (
                      <div className="mt-5 text-[0.68rem] uppercase tracking-[0.24em] text-white/52">
                        {card.eyebrow}
                      </div>
                    ) : null}

                    <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-white">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      {card.description}
                    </p>
                    {card.meta ? (
                      <div className="mt-5 inline-flex rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/72">
                        {card.meta}
                      </div>
                    ) : null}
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
