import { NextResponse, type NextRequest } from "next/server";

import {
  defaultLocale,
  isLocale,
  localeCookieName,
  locales,
} from "@/lib/i18n/config";

function detectLocale(request: NextRequest) {
  const cookieLocale = request.cookies.get(localeCookieName)?.value;

  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get("accept-language");

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasLocale) {
    const locale = pathname.split("/")[1];
    const response = NextResponse.next();

    if (isLocale(locale)) {
      response.cookies.set(localeCookieName, locale);
    }

    return response;
  }

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  const response = NextResponse.redirect(url);
  response.cookies.set(localeCookieName, locale);

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|robots.txt|sitemap.xml).*)"],
};
