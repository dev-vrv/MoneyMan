import Link from "next/link";
import {
  RiMailLine,
  RiMapPinLine,
  RiPhoneLine,
  RiTelegram2Fill,
  RiTimeLine,
  RiWhatsappFill,
} from "react-icons/ri";
import type { IconType } from "react-icons";

import { ContactForm, type ContactFormCopy } from "@/components/contact/contact-form";
import { HomeSectionHeading } from "@/components/home/home-section-heading";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import {
  getPublicContactSocialLinks,
  type PublicContactDetails,
} from "@/lib/public-contact-details";

type ContactPageExperienceProps = {
  locale: Locale;
  page: Dictionary["pages"]["contacts"];
  form: ContactFormCopy;
  publicContactDetails: PublicContactDetails | null;
};

function buildTelHref(value: string) {
  return `tel:${value.replace(/\s+/g, "")}`;
}

type ContactRailItem = {
  key: string;
  label: string;
  value: string;
  href?: string;
  icon: IconType;
};

export function ContactPageExperience({
  page,
  form,
  publicContactDetails,
}: ContactPageExperienceProps) {
  const socialLinks = getPublicContactSocialLinks(publicContactDetails);
  const railItems: ContactRailItem[] = [
    {
      key: "phone_primary",
      label: page.details.phonePrimary,
      value: publicContactDetails?.phone_primary?.trim() || "",
      href: publicContactDetails?.phone_primary?.trim()
        ? buildTelHref(publicContactDetails.phone_primary)
        : undefined,
      icon: RiPhoneLine,
    },
    {
      key: "phone_secondary",
      label: page.details.phoneSecondary,
      value: publicContactDetails?.phone_secondary?.trim() || "",
      href: publicContactDetails?.phone_secondary?.trim()
        ? buildTelHref(publicContactDetails.phone_secondary)
        : undefined,
      icon: RiPhoneLine,
    },
    {
      key: "email",
      label: page.details.email,
      value: publicContactDetails?.email?.trim() || "",
      href: publicContactDetails?.email?.trim()
        ? `mailto:${publicContactDetails.email.trim()}`
        : undefined,
      icon: RiMailLine,
    },
    {
      key: "telegram",
      label: "Telegram",
      value: "Telegram",
      href: socialLinks.find((item) => item.key === "telegram")?.url,
      icon: RiTelegram2Fill,
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      value: "WhatsApp",
      href: socialLinks.find((item) => item.key === "whatsapp")?.url,
      icon: RiWhatsappFill,
    },
    {
      key: "address",
      label: page.details.address,
      value: publicContactDetails?.address?.trim() || "",
      icon: RiMapPinLine,
    },
    {
      key: "working_hours",
      label: page.details.workingHours,
      value: publicContactDetails?.working_hours?.trim() || "",
      icon: RiTimeLine,
    },
  ].filter((item) => item.value);

  return (
    <div className="relative z-10 flex flex-1 flex-col px-6 py-14 sm:px-10 lg:px-12 lg:py-18">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(7,14,18,0.98),rgba(7,11,18,0.98))] px-6 py-8 shadow-[0_24px_100px_rgba(0,0,0,0.28)] sm:px-8 sm:py-10 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(34,211,238,0.18),transparent_22%),radial-gradient(circle_at_84%_18%,rgba(74,222,128,0.14),transparent_24%),radial-gradient(circle_at_52%_100%,rgba(251,191,36,0.12),transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:42px_42px] opacity-20" />

        <div className="relative z-10 min-w-0">
          <HomeSectionHeading
            eyebrow={page.eyebrow}
            title={page.title}
            description={page.description}
            align="left"
            maxWidthClassName="max-w-3xl"
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {page.channels.cards.map((card, index) => (
              <ScrollReveal
                key={`${card.title}-${index}`}
                delay={0.04 + index * 0.08}
                distance={24}
                blur={10}
              >
                <article className="flex h-full flex-col rounded-[1.7rem] border border-white/10 bg-white/[0.04] px-5 py-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-300/18 hover:bg-white/[0.06]">
                  <div className="text-[0.66rem] uppercase tracking-[0.18em] text-white/42">
                    {card.eyebrow}
                  </div>
                  <h2 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-white">
                    {card.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-300">
                    {card.description}
                  </p>
                  {card.meta ? (
                    <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.72rem] text-white/70">
                      {card.meta}
                    </div>
                  ) : null}
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <ScrollReveal delay={0.06} distance={28} blur={12}>
          <div className="relative overflow-hidden rounded-[2.3rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,18,0.96),rgba(8,10,18,0.99))] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.28)] sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_84%_16%,rgba(251,191,36,0.14),transparent_24%),radial-gradient(circle_at_68%_84%,rgba(74,222,128,0.12),transparent_28%)]" />
            <div className="relative z-10">
              <HomeSectionHeading
                eyebrow={page.form.eyebrow}
                title={page.form.title}
                description={page.form.description}
                align="left"
                maxWidthClassName="max-w-2xl"
              />
              <div className="mt-8">
                <ContactForm copy={form} variant="expanded" />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="grid gap-6 pb-8 pt-2 xl:grid-cols-2 lg:pb-12">
        <ScrollReveal delay={0.16} distance={22} blur={10}>
          <aside className="h-full rounded-[2rem] border border-white/10 bg-black/24 p-5 backdrop-blur-2xl sm:p-6">
            <div className="text-[0.68rem] uppercase tracking-[0.18em] text-white/42">
              {page.process.eyebrow}
            </div>
            <div className="mt-3 text-xl font-semibold tracking-[-0.04em] text-white">
              {page.process.title}
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {page.process.description}
            </p>

            <div className="mt-6 space-y-3">
              {page.process.items.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.35rem] border border-white/8 bg-white/[0.03] px-4 py-4"
                >
                  <div className="text-[0.66rem] uppercase tracking-[0.18em] text-emerald-200/72">
                    {item.label}
                  </div>
                  <div className="mt-2 text-sm font-medium text-white">
                    {item.title}
                  </div>
                  <div className="mt-2 text-sm leading-6 text-white/60">
                    {item.description}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </ScrollReveal>

        {railItems.length > 0 ? (
          <ScrollReveal delay={0.1} distance={22} blur={10}>
            <aside className="h-full rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,14,18,0.94),rgba(7,10,16,0.98))] p-5 backdrop-blur-2xl sm:p-6">
              <div className="space-y-3">
                {railItems.map((item) => {
                  const Icon = item.icon;
                  const body = (
                    <div className="flex items-start gap-4 rounded-[1.35rem] border border-white/8 bg-white/[0.03] px-4 py-4 transition hover:border-emerald-300/18 hover:bg-white/[0.05]">
                      <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-[0.95rem] border border-white/10 bg-white/6 text-emerald-200">
                        <Icon className="size-4.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[0.66rem] uppercase tracking-[0.18em] text-white/40">
                          {item.label}
                        </div>
                        <div className="mt-2 break-words text-sm font-medium leading-6 text-white">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  );

                  return item.href ? (
                    <Link key={item.key} href={item.href} className="block">
                      {body}
                    </Link>
                  ) : (
                    <div key={item.key}>{body}</div>
                  );
                })}
              </div>
            </aside>
          </ScrollReveal>
        ) : null}
      </section>
    </div>
  );
}
