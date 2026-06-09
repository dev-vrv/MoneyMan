import { HomeSectionHeading } from "@/components/home/home-section-heading";

type MarketingPlan = {
  name: string;
  price: string;
  period: string;
  description: string;
  badge: string;
  features: string[];
};

type MarketingPlanGridSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  plans: MarketingPlan[];
};

export function MarketingPlanGridSection({
  eyebrow,
  title,
  description,
  plans,
}: MarketingPlanGridSectionProps) {
  return (
    <section className="relative z-10 py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
        <HomeSectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          maxWidthClassName="max-w-3xl"
        />

        <div className="mt-10 grid gap-5 xl:grid-cols-3">
          {plans.map((plan, index) => (
            <article
              key={`${plan.name}-${index}`}
              className={`relative overflow-hidden rounded-[2rem] border p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_80px_rgba(0,0,0,0.24)] ${
                index === 1
                  ? "border-emerald-300/26 bg-[linear-gradient(180deg,rgba(15,32,22,0.96),rgba(9,12,18,0.98))]"
                  : "border-white/10 bg-[linear-gradient(180deg,rgba(10,16,18,0.94),rgba(8,10,18,0.98))]"
              }`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_28%),linear-gradient(135deg,rgba(34,197,94,0.05),transparent_52%)] opacity-90" />
              <div className="relative z-10">
                <div className="inline-flex rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-white/72">
                  {plan.badge}
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-white">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-end gap-2">
                  <div className="text-4xl font-semibold tracking-[-0.05em] text-white">
                    {plan.price}
                  </div>
                  <div className="pb-1 text-sm text-slate-300">
                    {plan.period}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {plan.description}
                </p>

                <div className="mt-6 space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div
                      key={`${feature}-${featureIndex}`}
                      className="flex items-start gap-3 rounded-[1rem] border border-white/8 bg-white/[0.04] px-3 py-3 text-sm text-white/84"
                    >
                      <div className="mt-1 size-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(74,222,128,0.45)]" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
