import { MarketingInfoPageExperience } from "@/components/marketing/marketing-info-page-experience";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { type Locale } from "@/lib/i18n/config";
import { getLocaleDictionary } from "@/lib/i18n/server";

type FaqPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function FaqPage({ params }: FaqPageProps) {
  const { locale } = await params;
  const dictionary = await getLocaleDictionary(locale);
  const page = dictionary.pages.faq;

  return (
    <MarketingPageShell locale={locale} header={dictionary.header}>
      <MarketingInfoPageExperience
        locale={locale}
        hero={page}
        primarySection={page.topics}
        faqSection={page.questions}
        cta={{
          ...page.cta,
          primaryHref: "/contacts",
          secondaryHref: "/security",
        }}
      />
    </MarketingPageShell>
  );
}
