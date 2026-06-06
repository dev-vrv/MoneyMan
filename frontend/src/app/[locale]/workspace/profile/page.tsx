import { redirect } from "next/navigation";

import { getLocalizedPath, type Locale } from "@/lib/i18n/config";

type WorkspaceProfilePageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function WorkspaceProfilePage({ params }: WorkspaceProfilePageProps) {
  const { locale } = await params;
  redirect(getLocalizedPath(locale, "/workspace/settings"));
}
