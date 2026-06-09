import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { SecurityPageExperience } from "@/components/marketing/security-page-experience";
import { type Locale } from "@/lib/i18n/config";
import { getLocaleDictionary } from "@/lib/i18n/server";

type SecurityPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function SecurityPage({ params }: SecurityPageProps) {
  const { locale } = await params;
  const dictionary = await getLocaleDictionary(locale);
  const page = dictionary.pages.security;

  return (
    <MarketingPageShell locale={locale} header={dictionary.header} pattern="security">
      <SecurityPageExperience locale={locale} page={page} />
    </MarketingPageShell>
  );
}
