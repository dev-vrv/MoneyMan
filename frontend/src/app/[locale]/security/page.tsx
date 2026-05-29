import { PlaceholderPageShell } from "@/components/layout/placeholder-page-shell";
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

  return (
    <PlaceholderPageShell
      locale={locale}
      title={dictionary.pages.security.title}
      description={dictionary.pages.security.description}
      common={dictionary.pages.common}
    />
  );
}
