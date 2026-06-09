import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PricingPageExperience } from "@/components/marketing/pricing-page-experience";
import { type Locale } from "@/lib/i18n/config";
import { getLocaleDictionary } from "@/lib/i18n/server";

type PricingPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function PricingPage({ params }: PricingPageProps) {
  const { locale } = await params;
  const dictionary = await getLocaleDictionary(locale);
  const page = dictionary.pages.pricing;

  return (
    <MarketingPageShell locale={locale} header={dictionary.header}>
      <PricingPageExperience
        locale={locale}
        page={page}
      />
    </MarketingPageShell>
  );
}
