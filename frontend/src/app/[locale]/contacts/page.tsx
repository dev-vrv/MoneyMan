import { PlaceholderPageShell } from "@/components/layout/placeholder-page-shell";
import { type Locale } from "@/lib/i18n/config";
import { getLocaleDictionary } from "@/lib/i18n/server";

type ContactsPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function ContactsPage({ params }: ContactsPageProps) {
  const { locale } = await params;
  const dictionary = await getLocaleDictionary(locale);

  return (
    <PlaceholderPageShell
      locale={locale}
      title={dictionary.pages.contacts.title}
      description={dictionary.pages.contacts.description}
      common={dictionary.pages.common}
    />
  );
}
