import { PlaceholderPageShell } from "@/components/layout/placeholder-page-shell";
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

  return (
    <PlaceholderPageShell
      locale={locale}
      title={dictionary.pages.pricing.title}
      description={dictionary.pages.pricing.description}
      common={dictionary.pages.common}
    />
  );
}
