import { FinanceWorkspace } from "@/components/workspace/finance-workspace";
import { type Locale } from "@/lib/i18n/config";
import { getLocaleDictionary } from "@/lib/i18n/server";

type WorkspaceAnalyticsPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function WorkspaceAnalyticsPage({ params }: WorkspaceAnalyticsPageProps) {
  const { locale } = await params;
  const dictionary = await getLocaleDictionary(locale);

  return <FinanceWorkspace locale={locale} content={dictionary.workspace} section="analytics" />;
}
