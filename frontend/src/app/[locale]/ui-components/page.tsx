import { notFound } from "next/navigation";

import { UiCatalog } from "@/components/finance-ui/ui-catalog";
import { isDebugModeEnabled } from "@/lib/debug";
import { isLocale } from "@/lib/i18n/config";

type UiComponentsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function UiComponentsPage({ params }: UiComponentsPageProps) {
  const { locale } = await params;

  if (!isLocale(locale) || !isDebugModeEnabled()) {
    notFound();
  }

  return <UiCatalog />;
}
