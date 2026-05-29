import { defaultLocale, type Locale } from "../config";
import { enMessages } from "./en";
import { kgMessages } from "./kg";
import { ruMessages } from "./ru";

export type Dictionary = typeof enMessages;

const dictionaries: Record<Locale, Dictionary> = {
  en: enMessages,
  ru: ruMessages,
  kg: kgMessages,
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}
