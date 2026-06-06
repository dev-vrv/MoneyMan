"use client";

import { createContext, useContext } from "react";

import { localeCookieName, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type LocaleContextValue = {
  locale: Locale;
  messages: Dictionary;
  setLocalePreference: (nextLocale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

type LocaleProviderProps = {
  locale: Locale;
  messages: Dictionary;
  children: React.ReactNode;
};

export function LocaleProvider({
  locale,
  messages,
  children,
}: LocaleProviderProps) {
  const setLocalePreference = (nextLocale: Locale) => {
    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
  };

  return (
    <LocaleContext.Provider value={{ locale, messages, setLocalePreference }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocaleContext must be used within LocaleProvider");
  }

  return context;
}
