import { ContactSection } from "@/components/contact/contact-section";
import { HomeAudienceSection } from "@/components/home/home-audience-section";
import { HomeHeroSection } from "@/components/home/home-hero-section";
import { HomeInsightsSection } from "@/components/home/home-insights-section";
import { HomeUseCasesSection } from "@/components/home/home-use-cases-section";
import { SiteFooter } from "@/components/layout/site-footer";
import { AppProviders } from "@/components/providers/app-providers";
import { getPublicContactDetails } from "@/lib/api/public-contact";
import { defaultLocale } from "@/lib/i18n/config";
import { getLocaleDictionary } from "@/lib/i18n/server";

export default async function RootPage() {
  const locale = defaultLocale;
  const dictionary = await getLocaleDictionary(locale);
  const home = dictionary.home;
  const publicContactDetails = await getPublicContactDetails(locale);

  return (
    <AppProviders locale={locale} messages={dictionary}>
      <main className="relative flex min-h-screen flex-1 flex-col overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.16),_transparent_28%),linear-gradient(180deg,_#040806_0%,_#08110d_42%,_#040705_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.085)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.085)_1px,transparent_1px),linear-gradient(to_right,rgba(34,211,238,0.075)_1px,transparent_1px),linear-gradient(to_bottom,rgba(244,114,182,0.06)_1px,transparent_1px)] bg-[size:72px_72px,72px_72px,216px_216px,216px_216px] opacity-40" />
        <div className="hero-drift-light hero-drift-light-cyan hero-drift-light-one absolute left-[-8%] top-[10%] h-[24rem] w-[24rem] rounded-full" />
        <div className="hero-drift-light hero-drift-light-amber hero-drift-light-two absolute right-[-6%] top-[18%] h-[28rem] w-[28rem] rounded-full" />
        <div className="hero-drift-light hero-drift-light-fuchsia hero-drift-light-three absolute bottom-[-6%] left-[28%] h-[26rem] w-[26rem] rounded-full" />
        <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-400/12 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-lime-400/6 blur-3xl" />

        <HomeHeroSection locale={locale} header={dictionary.header} home={home} />

        <HomeInsightsSection
          section={home.insightsSection}
          beacon={home.beacon}
          widget={home.widget}
        />

        <HomeUseCasesSection section={home.useCasesSection} />

        <HomeAudienceSection section={home.audienceSection} />

        <ContactSection
          eyebrow={home.contactSection.eyebrow}
          title={home.contactSection.title}
          description={home.contactSection.description}
          form={dictionary.contactForm}
        />

        <SiteFooter
          locale={locale}
          content={dictionary.footer}
          publicContactDetails={publicContactDetails}
        />
      </main>
    </AppProviders>
  );
}
