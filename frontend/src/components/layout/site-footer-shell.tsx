"use client";

import { usePathname } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { PublicContactDetails } from "@/lib/public-contact-details";

type SiteFooterShellProps = {
  fallbackLocale: Locale;
  footer: Dictionary["footer"];
  publicContactDetails: PublicContactDetails | null;
};

function shouldHideFooter(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  const offset = first && isLocale(first) ? 1 : 0;
  const page = segments[offset] ?? "";

  return page === "auth" || page === "login" || page === "forgot-password" || page === "workspace";
}

export function SiteFooterShell({
  fallbackLocale,
  footer,
  publicContactDetails,
}: SiteFooterShellProps) {
  const pathname = usePathname();

  if (shouldHideFooter(pathname)) {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0] && isLocale(segments[0]) ? segments[0] : fallbackLocale ?? defaultLocale;

  return <SiteFooter locale={locale} content={footer} publicContactDetails={publicContactDetails} />;
}
