import { MarketingInfoPageExperience } from "@/components/marketing/marketing-info-page-experience";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { type Locale } from "@/lib/i18n/config";
import { getLocaleDictionary } from "@/lib/i18n/server";

type PrivacyPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  const dictionary = await getLocaleDictionary(locale);
  const page = dictionary.pages.privacy;

  return (
    <MarketingPageShell locale={locale} header={dictionary.header}>
      <MarketingInfoPageExperience
        locale={locale}
        hero={page}
        primarySection={page.summary}
        secondarySection={page.dataUse}
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
