import { AuthExperience } from "@/components/auth/auth-experience";
import { type Locale } from "@/lib/i18n/config";
import { getLocaleDictionary } from "@/lib/i18n/server";

type AuthPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function AuthPage({ params }: AuthPageProps) {
  const { locale } = await params;
  const dictionary = await getLocaleDictionary(locale);

  return (
    <AuthExperience
      locale={locale}
      header={dictionary.header}
      content={dictionary.auth}
    />
  );
}
