import { ContactForm, type ContactFormCopy } from "@/components/contact/contact-form";
import { HomeSectionHeading } from "@/components/home/home-section-heading";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

type ContactSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  form: ContactFormCopy;
  fullScreen?: boolean;
};

export function ContactSection({
  eyebrow,
  title,
  description,
  form,
  fullScreen = false,
}: ContactSectionProps) {
  return (
    <section className={`relative z-10 flex ${fullScreen ? "min-h-screen items-center" : "py-20 lg:py-24"}`}>
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,0.82fr)_minmax(420px,1fr)] xl:items-center">
          <div className="space-y-6">
            <HomeSectionHeading
              eyebrow={eyebrow}
              title={title}
              description={description}
              align="left"
              maxWidthClassName="max-w-xl"
            />
          </div>

          <ScrollReveal delay={0.12} distance={36} blur={14}>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(9,18,20,0.94),rgba(8,10,18,0.98))] p-6 backdrop-blur-2xl sm:p-7">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(251,191,36,0.1),transparent_24%),radial-gradient(circle_at_60%_75%,rgba(232,121,249,0.1),transparent_28%)]" />
              <div className="relative z-10">
                <ContactForm copy={form} variant="compact" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
