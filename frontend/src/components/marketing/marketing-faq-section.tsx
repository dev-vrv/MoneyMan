import { HomeSectionHeading } from "@/components/home/home-section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type MarketingFaqItem = {
  question: string;
  answer: string;
};

type MarketingFaqSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: MarketingFaqItem[];
};

export function MarketingFaqSection({
  eyebrow,
  title,
  description,
  items,
}: MarketingFaqSectionProps) {
  return (
    <section className="relative z-10 py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] xl:items-start">
          <HomeSectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
            align="left"
            maxWidthClassName="max-w-xl"
          />

          <div className="rounded-[2rem] border border-white/10 bg-black/24 p-4 backdrop-blur-xl sm:p-6">
            <Accordion className="gap-2">
              {items.map((item, index) => (
                <AccordionItem
                  key={`${item.question}-${index}`}
                  value={`faq-${index}`}
                  className="rounded-[1.4rem] border-none px-4 transition hover:bg-white/[0.03]"
                >
                  <AccordionTrigger className="py-5 text-base font-medium text-white hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-7 text-slate-300">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
