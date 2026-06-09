import { ContactPageExperience } from "@/components/contact/contact-page-experience";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { getPublicContactDetails } from "@/lib/api/public-contact";
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
  const page = dictionary.pages.contacts;
  const publicContactDetails = await getPublicContactDetails(locale);

  return (
    <MarketingPageShell locale={locale} header={dictionary.header} pattern="contacts">
      <ContactPageExperience
        page={page}
        form={dictionary.contactForm}
        publicContactDetails={publicContactDetails}
      />
    </MarketingPageShell>
  );
}
