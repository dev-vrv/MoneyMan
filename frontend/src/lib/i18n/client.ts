"use client";

import { useLocaleContext } from "@/components/providers/locale-provider";

export function useLocale() {
  return useLocaleContext().locale;
}

export function useTranslations() {
  return useLocaleContext().messages;
}

export function useLocalePreference() {
  return useLocaleContext().setLocalePreference;
}
