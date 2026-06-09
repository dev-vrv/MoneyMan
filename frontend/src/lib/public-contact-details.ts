import type { Locale } from "@/lib/i18n/config";

export type PublicContactDetails = {
  requested_locale: string;
  resolved_sources: Record<string, string>;
  phone_primary: string;
  phone_secondary: string;
  email: string;
  address: string;
  working_hours: string;
  telegram_url: string;
  whatsapp_url: string;
  instagram_url: string;
  youtube_url: string;
  facebook_url: string;
  linkedin_url: string;
  tiktok_url: string;
};

export type PublicContactSocialKey =
  | "telegram"
  | "whatsapp"
  | "instagram"
  | "youtube"
  | "facebook"
  | "linkedin"
  | "tiktok";

export type PublicContactSocialLink = {
  key: PublicContactSocialKey;
  label: string;
  url: string;
};

export type PublicContactDirectItem = {
  key: "phone_primary" | "phone_secondary" | "email" | "address" | "working_hours";
  value: string;
};

export const publicContactLocaleOrder: Locale[] = ["en", "ru", "kg"];

function normalizePhoneDigits(value: string) {
  return value.replace(/\D+/g, "");
}

function buildTelegramUrl(phone: string) {
  const digits = normalizePhoneDigits(phone);

  return digits ? `https://t.me/+${digits}` : "";
}

function buildWhatsAppUrl(phone: string) {
  const digits = normalizePhoneDigits(phone);

  return digits ? `https://wa.me/${digits}` : "";
}

export function getPublicContactSocialLinks(
  details: PublicContactDetails | null | undefined,
): PublicContactSocialLink[] {
  if (!details) {
    return [];
  }

  const fallbackPhone = details.phone_primary || details.phone_secondary;
  const telegramUrl = details.telegram_url || buildTelegramUrl(fallbackPhone);
  const whatsappUrl = details.whatsapp_url || buildWhatsAppUrl(fallbackPhone);

  const items: Array<PublicContactSocialLink | null> = [
    telegramUrl ? { key: "telegram", label: "Telegram", url: telegramUrl } : null,
    whatsappUrl ? { key: "whatsapp", label: "WhatsApp", url: whatsappUrl } : null,
    details.instagram_url ? { key: "instagram", label: "Instagram", url: details.instagram_url } : null,
    details.youtube_url ? { key: "youtube", label: "YouTube", url: details.youtube_url } : null,
    details.facebook_url ? { key: "facebook", label: "Facebook", url: details.facebook_url } : null,
    details.linkedin_url ? { key: "linkedin", label: "LinkedIn", url: details.linkedin_url } : null,
    details.tiktok_url ? { key: "tiktok", label: "TikTok", url: details.tiktok_url } : null,
  ];

  return items.filter(Boolean) as PublicContactSocialLink[];
}

export function getPublicContactDirectItems(
  details: PublicContactDetails | null | undefined,
): PublicContactDirectItem[] {
  if (!details) {
    return [];
  }

  const items: Array<PublicContactDirectItem | null> = [
    details.phone_primary ? { key: "phone_primary", value: details.phone_primary } : null,
    details.phone_secondary ? { key: "phone_secondary", value: details.phone_secondary } : null,
    details.email ? { key: "email", value: details.email } : null,
    details.address ? { key: "address", value: details.address } : null,
    details.working_hours ? { key: "working_hours", value: details.working_hours } : null,
  ];

  return items.filter(Boolean) as PublicContactDirectItem[];
}

export function hasPublicContactData(
  details: PublicContactDetails | null | undefined,
) {
  return (
    getPublicContactDirectItems(details).length > 0 ||
    getPublicContactSocialLinks(details).length > 0
  );
}
