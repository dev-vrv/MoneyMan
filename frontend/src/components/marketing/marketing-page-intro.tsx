type MarketingPageIntroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  maxWidthClassName?: string;
};

export function MarketingPageIntro({
  eyebrow,
  title,
  description,
  maxWidthClassName = "max-w-3xl",
}: MarketingPageIntroProps) {
  return (
    <div className={maxWidthClassName}>
      {eyebrow ? (
        <div className="inline-flex rounded-full border border-emerald-300/18 bg-emerald-300/10 px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-emerald-100/84">
          {eyebrow}
        </div>
      ) : null}

      <h1 className="mt-5 text-4xl font-semibold leading-[1.12] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
        {description}
      </p>
    </div>
  );
}
