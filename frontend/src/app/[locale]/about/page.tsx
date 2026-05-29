import { PlaceholderPageShell } from "@/components/layout/placeholder-page-shell";
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

  return (
    <PlaceholderPageShell
      locale={locale}
      title={dictionary.pages.about.title}
      description={dictionary.pages.about.description}
      common={dictionary.pages.common}
    />
  );
}
