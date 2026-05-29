import { cookies, headers } from "next/headers";

import {
  defaultLocale,
  isLocale,
  localeCookieName,
  type Locale,
} from "./config";
import { getDictionary, type Dictionary } from "./dictionaries";

export async function getRequestLocale() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(localeCookieName)?.value;

  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale;
  }

  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language");

  if (acceptLanguage) {
    for (const part of acceptLanguage.split(",")) {
      const normalized = part.trim().split(";")[0]?.toLowerCase();

      if (!normalized) {
        continue;
      }

      const candidate = normalized.split("-")[0];

      if (candidate && isLocale(candidate)) {
        return candidate;
      }
    }
  }

  return defaultLocale;
}

export async function getLocaleDictionary(locale: Locale): Promise<Dictionary> {
  return getDictionary(locale);
}
