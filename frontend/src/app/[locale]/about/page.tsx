import { AboutPageExperience } from "@/components/marketing/about-page-experience";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { type Locale } from "@/lib/i18n/config";
import { getLocaleDictionary } from "@/lib/i18n/server";

type AboutPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const dictionary = await getLocaleDictionary(locale);
  const page = dictionary.pages.about;

  return (
    <MarketingPageShell locale={locale} header={dictionary.header}>
      <AboutPageExperience locale={locale} page={page} />
    </MarketingPageShell>
  );
}
