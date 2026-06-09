import { MarketingInfoPageExperience } from "@/components/marketing/marketing-info-page-experience";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { type Locale } from "@/lib/i18n/config";
import { getLocaleDictionary } from "@/lib/i18n/server";

type TermsPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  const dictionary = await getLocaleDictionary(locale);
  const page = dictionary.pages.terms;

  return (
    <MarketingPageShell locale={locale} header={dictionary.header}>
      <MarketingInfoPageExperience
        locale={locale}
        hero={page}
        primarySection={page.summary}
        secondarySection={page.rules}
        faqSection={page.faq}
        cta={{
          ...page.cta,
          primaryHref: "/contacts",
          secondaryHref: "/security",
        }}
      />
    </MarketingPageShell>
  );
}
