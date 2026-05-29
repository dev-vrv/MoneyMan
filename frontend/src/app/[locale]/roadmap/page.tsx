import { PlaceholderPageShell } from "@/components/layout/placeholder-page-shell";
import { type Locale } from "@/lib/i18n/config";
import { getLocaleDictionary } from "@/lib/i18n/server";

type RoadmapPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function RoadmapPage({ params }: RoadmapPageProps) {
  const { locale } = await params;
  const dictionary = await getLocaleDictionary(locale);

  return (
    <PlaceholderPageShell
      locale={locale}
      title={dictionary.pages.roadmap.title}
      description={dictionary.pages.roadmap.description}
      common={dictionary.pages.common}
    />
  );
}
