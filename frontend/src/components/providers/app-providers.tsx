"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { AuthProvider } from "@/components/providers/auth-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { TooltipProvider } from "@/components/ui/tooltip";

type AppProvidersProps = {
  children: React.ReactNode;
  locale: Locale;
  messages: Dictionary;
};

export function AppProviders({ children, locale, messages }: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <LocaleProvider locale={locale} messages={messages}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider delay={120}>
            {children}
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </LocaleProvider>
  );
}
