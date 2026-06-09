import { MarketingInfoPageExperience } from "@/components/marketing/marketing-info-page-experience";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { type Locale } from "@/lib/i18n/config";
import { getLocaleDictionary } from "@/lib/i18n/server";

type OfferPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function OfferPage({ params }: OfferPageProps) {
  const { locale } = await params;
  const dictionary = await getLocaleDictionary(locale);
  const page = dictionary.pages.offer;

  return (
    <MarketingPageShell locale={locale} header={dictionary.header} pattern="offer">
      <MarketingInfoPageExperience
        locale={locale}
        compactHero
        hero={page}
        primarySection={page.summary}
        secondarySection={page.payments}
        faqSection={page.faq}
        cta={{
          ...page.cta,
          primaryHref: "/contacts",
          secondaryHref: "/terms",
        }}
      />
    </MarketingPageShell>
  );
}
