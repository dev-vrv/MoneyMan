export const locales = ["en", "ru", "kg"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const localeCookieName = "NEXT_LOCALE";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocalizedPath(locale: Locale, path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `/${locale}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function replacePathLocale(pathname: string, targetLocale: Locale) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length > 0 && isLocale(segments[0])) {
    segments[0] = targetLocale;
    return `/${segments.join("/")}`;
  }

  return getLocalizedPath(targetLocale, pathname);
}
