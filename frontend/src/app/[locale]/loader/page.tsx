import { notFound } from "next/navigation";

import { FinancialLoader } from "@/components/feedback/financial-loader";
import { isDebugModeEnabled } from "@/lib/debug";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getLocaleDictionary } from "@/lib/i18n/server";

type LoaderPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function LoaderPage({ params }: LoaderPageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale) || !isDebugModeEnabled()) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const dictionary = await getLocaleDictionary(locale);

  return <FinancialLoader messages={dictionary.loading} />;
}
