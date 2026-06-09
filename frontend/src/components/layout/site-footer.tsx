import Link from "next/link";
import {
  RiArrowRightUpLine,
  RiFacebookCircleFill,
  RiInstagramLine,
  RiLinkedinBoxFill,
  RiMailLine,
  RiMapPinLine,
  RiPhoneLine,
  RiTelegram2Fill,
  RiTimeLine,
  RiTiktokFill,
  RiWhatsappFill,
  RiYoutubeFill,
} from "react-icons/ri";

import { getLocalizedPath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import {
  getPublicContactDirectItems,
  getPublicContactSocialLinks,
  type PublicContactDetails,
} from "@/lib/public-contact-details";

type SiteFooterProps = {
  locale: Locale;
  content: Dictionary["footer"];
  publicContactDetails: PublicContactDetails | null;
};

const socialIconMap = {
  telegram: RiTelegram2Fill,
  whatsapp: RiWhatsappFill,
  instagram: RiInstagramLine,
  youtube: RiYoutubeFill,
  facebook: RiFacebookCircleFill,
  linkedin: RiLinkedinBoxFill,
  tiktok: RiTiktokFill,
} as const;

const directIconMap = {
  phone_primary: RiPhoneLine,
  phone_secondary: RiPhoneLine,
  email: RiMailLine,
  address: RiMapPinLine,
  working_hours: RiTimeLine,
} as const;

export function SiteFooter({ locale, content, publicContactDetails }: SiteFooterProps) {
  const [primarySection, secondarySection, tertiarySection] = content.sections;
  const socialLinks = getPublicContactSocialLinks(publicContactDetails);
  const directItems = getPublicContactDirectItems(publicContactDetails).slice(0, 3);
  const iconOnlyDirectItems = directItems.filter(
    (item) =>
      item.key === "email" ||
      item.key === "phone_primary" ||
      item.key === "phone_secondary",
  );
  const textDirectItems = directItems.filter(
    (item) =>
      item.key !== "email" &&
      item.key !== "phone_primary" &&
      item.key !== "phone_secondary",
  );

  return (
    <footer className="relative z-10 mt-auto overflow-hidden border-t border-white/8 bg-[linear-gradient(180deg,rgba(4,8,9,0.94),rgba(3,5,7,0.99))]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_24%,rgba(34,211,238,0.1),transparent_22%),radial-gradient(circle_at_82%_18%,rgba(74,222,128,0.1),transparent_24%),linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:auto,auto,72px_72px] opacity-35" />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-14 sm:px-10 lg:px-12 lg:py-16">
        <div className="grid gap-12 border-b border-white/8 pb-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
          <div className="max-w-2xl">
            <div className="text-[0.72rem] uppercase tracking-[0.24em] text-emerald-100/72">
              {content.badge}
            </div>
            <div className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
              {content.title}
            </div>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-[0.97rem]">
              {content.description}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={getLocalizedPath(locale, content.primaryCta.href)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200"
              >
                {content.primaryCta.label}
                <RiArrowRightUpLine className="size-4 shrink-0" />
              </Link>
              <Link
                href={getLocalizedPath(locale, content.secondaryCta.href)}
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white/88 transition hover:border-white/20 hover:bg-white/[0.05]"
              >
                {content.secondaryCta.label}
              </Link>
            </div>

            {socialLinks.length > 0 || directItems.length > 0 ? (
              <div className="mt-7 flex flex-col gap-4">
                {socialLinks.length > 0 || iconOnlyDirectItems.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((item) => {
                      const Icon = socialIconMap[item.key];

                      return (
                        <Link
                          key={item.key}
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={item.label}
                          className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/84 transition hover:border-emerald-300/20 hover:bg-white/[0.08] hover:text-white"
                        >
                          <Icon className="size-5" />
                        </Link>
                      );
                    })}

                    {iconOnlyDirectItems.map((item) => {
                      const Icon = directIconMap[item.key];
                      const href =
                        item.key === "email"
                          ? `mailto:${item.value}`
                          : item.key === "phone_primary" || item.key === "phone_secondary"
                            ? `tel:${item.value.replace(/\s+/g, "")}`
                            : null;

                      const contentNode = (
                        <span className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/84 transition hover:border-emerald-300/20 hover:bg-white/[0.08] hover:text-white">
                          <Icon className="size-5 text-emerald-200" />
                        </span>
                      );

                      return href ? (
                        <Link
                          key={`${item.key}-${item.value}`}
                          href={href}
                          aria-label={item.value}
                          className="inline-flex"
                        >
                          {contentNode}
                        </Link>
                      ) : (
                        <div
                          key={`${item.key}-${item.value}`}
                          className="inline-flex"
                        >
                          {contentNode}
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                {textDirectItems.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {textDirectItems.map((item) => {
                      const Icon = directIconMap[item.key];

                      return (
                        <div
                          key={`${item.key}-${item.value}`}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/78"
                        >
                          <span className="inline-flex items-center gap-2">
                            <Icon className="size-4 shrink-0 text-emerald-200" />
                            <span>{item.value}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {[primarySection, secondarySection, tertiarySection].map((section) => (
              <nav key={section.title} aria-label={section.title}>
                <div className="text-[0.72rem] uppercase tracking-[0.22em] text-white/42">
                  {section.title}
                </div>
                <div className="mt-4 space-y-3">
                  {section.links
                    .filter((link) => link.href !== "/roadmap")
                    .map((link) => (
                    <Link
                      key={`${section.title}-${link.href}`}
                      href={getLocalizedPath(locale, link.href)}
                      className="block text-sm leading-6 text-slate-300 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                    ))}
                </div>
              </nav>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-sm text-slate-400 sm:gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl text-sm leading-6 text-slate-300/88">
            {content.bottom.note}
          </div>
          <div className="flex flex-col gap-2 text-sm text-white/46 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <span>{content.bottom.location}</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/18 sm:block" />
            <span>{content.bottom.copyright}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
