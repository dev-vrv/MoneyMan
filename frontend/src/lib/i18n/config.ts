export const locales = ["en", "ru", "kg"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru";
export const localeCookieName = "NEXT_LOCALE";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocalizedPath(locale: Locale, path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (locale === defaultLocale && normalizedPath === "/") {
    return "/";
  }

  return `/${locale}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function replacePathLocale(pathname: string, targetLocale: Locale) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length > 0 && isLocale(segments[0])) {
    if (targetLocale === defaultLocale) {
      const [, ...rest] = segments;
      return rest.length > 0 ? `/${defaultLocale}/${rest.join("/")}` : "/";
    }

    segments[0] = targetLocale;
    return `/${segments.join("/")}`;
  }

  return getLocalizedPath(targetLocale, pathname);
}
