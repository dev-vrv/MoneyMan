import { PlaceholderPageShell } from "@/components/layout/placeholder-page-shell";
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

  return (
    <PlaceholderPageShell
      locale={locale}
      title={dictionary.pages.terms.title}
      description={dictionary.pages.terms.description}
      common={dictionary.pages.common}
    />
  );
}
