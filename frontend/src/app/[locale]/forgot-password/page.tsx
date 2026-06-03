import { PasswordRecoveryExperience } from "@/components/auth/password-recovery-experience";
import { type Locale } from "@/lib/i18n/config";
import { getLocaleDictionary } from "@/lib/i18n/server";

type ForgotPasswordPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function ForgotPasswordPage({
  params,
}: ForgotPasswordPageProps) {
  const { locale } = await params;
  const dictionary = await getLocaleDictionary(locale);

  return (
    <PasswordRecoveryExperience
      locale={locale}
      header={dictionary.header}
      content={dictionary.passwordRecovery}
    />
  );
}
