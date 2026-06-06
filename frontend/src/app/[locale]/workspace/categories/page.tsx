import { redirect } from "next/navigation";

import { getLocalizedPath, type Locale } from "@/lib/i18n/config";

type WorkspaceCategoriesPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function WorkspaceCategoriesPage({ params }: WorkspaceCategoriesPageProps) {
  const { locale } = await params;
  redirect(getLocalizedPath(locale, "/workspace/settings"));
}
