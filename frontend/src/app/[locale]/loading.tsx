import { FinancialLoader } from "@/components/feedback/financial-loader";
import { getRequestLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function Loading() {
  const locale = await getRequestLocale();
  const dictionary = await getDictionary(locale);

  return <FinancialLoader messages={dictionary.loading} />;
}
