"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  RiArrowDownSLine,
  RiGlobalLine,
  RiInformationLine,
  RiLoginCircleLine,
  RiLayoutGridLine,
  RiMenu3Line,
} from "react-icons/ri";

import { useAuth } from "@/components/providers/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocalePreference } from "@/lib/i18n/client";
import { Locale, defaultLocale, locales, getLocalizedPath, replacePathLocale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type SiteHeaderProps = {
  locale: Locale;
  messages: Dictionary["header"];
};

export function SiteHeader({ locale, messages }: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const setLocalePreference = useLocalePreference();
  const hasExplicitDefaultLocalePrefix = locale === defaultLocale && (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`));
  const buildHref = (path: string) => {
    if (hasExplicitDefaultLocalePrefix) {
      const normalizedPath = path.startsWith("/") ? path : `/${path}`;
      return `/${defaultLocale}${normalizedPath === "/" ? "" : normalizedPath}`;
    }

    return getLocalizedPath(locale, path);
  };

  const navItems = [
    { label: messages.navigation.pricing, href: buildHref("/pricing") },
    { label: messages.navigation.contacts, href: buildHref("/contacts") },
    { label: messages.navigation.security, href: buildHref("/security") },
  ];

  const infoItems = [
    { label: messages.infoMenu.about, href: buildHref("/about") },
    { label: messages.infoMenu.faq, href: buildHref("/faq") },
    { label: messages.infoMenu.roadmap, href: buildHref("/roadmap") },
  ];

  return (
    <header className="sticky top-0 z-40 px-6 pt-6 sm:px-10 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 rounded-[2rem] border border-white/8 bg-black/25 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-2xl sm:px-6">
        <div className="flex items-center gap-4 lg:gap-8">
          <Link
            href={buildHref("/")}
            className="inline-flex items-center gap-3 rounded-full border border-emerald-300/18 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-50 transition hover:border-emerald-300/28 hover:bg-emerald-300/14"
          >
            <span className="flex size-9 items-center justify-center overflow-hidden rounded-full border border-emerald-300/20 bg-white/95">
              <Image
                src="/images/logo/fin.png"
                alt={messages.logo}
                width={36}
                height={36}
                className="size-8 object-contain"
                priority
              />
            </span>
            <span className="whitespace-nowrap">{messages.logo}</span>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/6 hover:text-white"
              >
                {item.label}
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/6 hover:text-white">
                <RiInformationLine className="size-4 text-emerald-200" />
                {messages.navigation.info}
                <RiArrowDownSLine className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="surface-floating min-w-52 rounded-2xl text-zinc-100">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{messages.navigation.info}</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {infoItems.map((item) => (
                    <DropdownMenuItem
                      key={item.href}
                      onClick={() => router.push(item.href)}
                    >
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-100 transition hover:border-emerald-300/18 hover:bg-white/8 lg:hidden">
              <RiMenu3Line className="size-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="surface-floating min-w-56 rounded-2xl text-zinc-100">
              <DropdownMenuGroup>
                <DropdownMenuLabel>{messages.logo}</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {navItems.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    onClick={() => router.push(item.href)}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {infoItems.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    onClick={() => router.push(item.href)}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-medium text-zinc-100 transition hover:border-emerald-300/18 hover:bg-white/8">
              <RiGlobalLine className="size-4 text-emerald-200" />
              <span className="hidden sm:inline">{messages.language.label}</span>
              <span className="uppercase">{locale}</span>
              <RiArrowDownSLine className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="surface-floating min-w-48 rounded-2xl text-zinc-100">
              <DropdownMenuGroup>
                <DropdownMenuLabel>{messages.language.label}</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {locales.map((targetLocale) => (
                  <DropdownMenuItem
                    key={targetLocale}
                    onClick={() => {
                      setLocalePreference(targetLocale);
                      router.push(replacePathLocale(pathname, targetLocale));
                    }}
                  >
                    {{
                      en: messages.language.en,
                      ru: messages.language.ru,
                      kg: messages.language.kg,
                    }[targetLocale]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href={buildHref(isAuthenticated ? "/workspace" : "/auth")}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-emerald-300/20 bg-linear-to-r from-emerald-300 via-emerald-400 to-lime-300 px-5 text-sm font-semibold whitespace-nowrap text-slate-950 shadow-[0_12px_32px_rgba(74,222,128,0.16)] transition hover:brightness-105"
          >
            {isAuthenticated ? (
              <RiLayoutGridLine className="size-4" />
            ) : (
              <RiLoginCircleLine className="size-4" />
            )}
            {isAuthenticated ? messages.actions.workspace : messages.actions.auth}
          </Link>
        </div>
      </div>
    </header>
  );
}
