type HomeSectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "center" | "left";
  maxWidthClassName?: string;
};

export function HomeSectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  maxWidthClassName = "max-w-2xl",
}: HomeSectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div className={isCenter ? `mx-auto ${maxWidthClassName} text-center` : maxWidthClassName}>
      <p className="text-xs uppercase tracking-[0.26em] text-emerald-200/70">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-semibold leading-[1.12] tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className={`mt-4 text-sm leading-7 text-slate-300 sm:text-base ${isCenter ? "mx-auto max-w-xl" : "max-w-xl"}`}>
        {description}
      </p>
    </div>
  );
}
