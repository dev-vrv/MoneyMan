import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteVisitTracker } from "@/components/analytics/site-visit-tracker";
import { SiteFooterShell } from "@/components/layout/site-footer-shell";
import { AppProviders } from "@/components/providers/app-providers";
import { getPublicContactDetails } from "@/lib/api/public-contact";
import {
  defaultLocale,
  isLocale,
  locales,
  type Locale,
} from "@/lib/i18n/config";
import { getLocaleDictionary } from "@/lib/i18n/server";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dictionary = await getLocaleDictionary(locale);

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const dictionary = await getLocaleDictionary(locale);
  const publicContactDetails = await getPublicContactDetails(locale);

  return (
    <AppProviders locale={locale} messages={dictionary}>
      <SiteVisitTracker />
      {children}
      <SiteFooterShell
        fallbackLocale={locale}
        footer={dictionary.footer}
        publicContactDetails={publicContactDetails}
      />
    </AppProviders>
  );
}
