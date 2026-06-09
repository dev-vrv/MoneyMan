"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLocalePreference } from "@/lib/i18n/client";
import {
  defaultLocale,
  getLocalizedPath,
  locales,
  Locale,
  replacePathLocale,
} from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  locale: Locale;
  messages: Dictionary["header"];
};

type HeaderLinkItem = {
  label: string;
  href: string;
};

function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }

  return path;
}

export function SiteHeader({ locale, messages }: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const setLocalePreference = useLocalePreference();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const hasExplicitDefaultLocalePrefix =
    locale === defaultLocale &&
    (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`));

  const buildHref = (path: string) => {
    if (hasExplicitDefaultLocalePrefix) {
      const normalizedPath = path.startsWith("/") ? path : `/${path}`;
      return `/${defaultLocale}${normalizedPath === "/" ? "" : normalizedPath}`;
    }

    return getLocalizedPath(locale, path);
  };

  const navItems: HeaderLinkItem[] = [
    { label: messages.navigation.pricing, href: buildHref("/pricing") },
    { label: messages.navigation.contacts, href: buildHref("/contacts") },
    { label: messages.infoMenu.about, href: buildHref("/about") },
  ];

  const infoItems: HeaderLinkItem[] = [
    { label: messages.infoMenu.faq, href: buildHref("/faq") },
    { label: messages.navigation.security, href: buildHref("/security") },
    { label: messages.infoMenu.terms, href: buildHref("/terms") },
    { label: messages.infoMenu.offer, href: buildHref("/offer") },
    { label: messages.infoMenu.privacy, href: buildHref("/privacy") },
  ];

  const mobileNavItems = [...navItems, ...infoItems];

  const authHref = buildHref(isAuthenticated ? "/workspace" : "/auth");
  const normalizedPathname = normalizePath(pathname);
  const hasActiveInfoItem = infoItems.some((item) => isActivePath(item.href));
  const authLabel = isAuthenticated ? messages.actions.workspace : messages.actions.auth;
  const AuthIcon = isAuthenticated ? RiLayoutGridLine : RiLoginCircleLine;
  const authButtonIcon = (
    <span className="inline-flex size-7 items-center justify-center rounded-full bg-slate-950/14 ring-1 ring-black/8 transition duration-300 group-hover:bg-slate-950/18">
      <AuthIcon className="size-4" />
    </span>
  );

  useEffect(() => {
    let previousScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > previousScrollY;

      setIsScrolled(currentScrollY > 12);

      if (currentScrollY < 24) {
        setIsHidden(false);
      } else if (scrollingDown && currentScrollY - previousScrollY > 6) {
        setIsHidden(true);
      } else if (!scrollingDown && previousScrollY - currentScrollY > 6) {
        setIsHidden(false);
      }

      previousScrollY = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function isActivePath(href: string) {
    const normalizedHref = normalizePath(href);

    if (normalizedHref === buildHref("/")) {
      return normalizedPathname === normalizedHref;
    }

    return (
      normalizedPathname === normalizedHref ||
      normalizedPathname.startsWith(`${normalizedHref}/`)
    );
  }

  function handleLocaleChange(targetLocale: Locale) {
    setLocalePreference(targetLocale);
    router.push(replacePathLocale(pathname, targetLocale));
  }

  function NavLink({ item }: { item: HeaderLinkItem }) {
    const isActive = isActivePath(item.href);

    return (
      <Link
        href={item.href}
        className={cn(
          "rounded-full px-4 py-2 text-sm font-medium transition",
          isActive
            ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
            : "text-zinc-300 hover:bg-white/6 hover:text-white",
        )}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full px-6 pt-4 transition duration-300 sm:px-10 lg:px-12",
        isHidden && !isMobileMenuOpen
          ? "pointer-events-none -translate-y-[calc(100%+1.5rem)] opacity-0"
          : "translate-y-0 opacity-100",
      )}
    >
      <div
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-[2rem] border px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-2xl transition duration-300 sm:px-5 lg:px-6",
          isScrolled
            ? "border-white/12 bg-[linear-gradient(180deg,rgba(5,10,9,0.9),rgba(5,10,9,0.78))]"
            : "border-white/8 bg-[linear-gradient(180deg,rgba(8,14,12,0.72),rgba(8,14,12,0.55))]",
        )}
      >
        <div className="flex min-w-0 items-center gap-3 lg:gap-6">
          <Link
            href={buildHref("/")}
            className="inline-flex shrink-0 items-center px-1 py-1 text-sm font-semibold text-white transition hover:opacity-88"
          >
            <span className="flex size-11 items-center justify-center overflow-hidden bg-transparent">
              <Image
                src="/images/logo/logo.png"
                alt={messages.logo}
                width={44}
                height={44}
                className="size-10 object-contain"
                priority
              />
            </span>
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
                  hasActiveInfoItem
                    ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                    : "text-zinc-300 hover:bg-white/6 hover:text-white",
                )}
              >
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
                    <DropdownMenuItem key={item.href} onClick={() => router.push(item.href)}>
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-sm font-medium text-zinc-100 transition hover:border-emerald-300/18 hover:bg-white/8 sm:px-4">
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
                    onClick={() => handleLocaleChange(targetLocale)}
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
            href={authHref}
            className="group hidden h-12 items-center gap-2 rounded-full border border-emerald-200/35 bg-[linear-gradient(135deg,#bef264_0%,#6ee7b7_38%,#34d399_72%,#22c55e_100%)] px-2.5 pr-5 text-sm font-semibold whitespace-nowrap text-slate-950 shadow-[0_16px_40px_rgba(52,211,153,0.24),inset_0_1px_0_rgba(255,255,255,0.35)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_52px_rgba(52,211,153,0.3),inset_0_1px_0_rgba(255,255,255,0.42)] sm:inline-flex"
          >
            {authButtonIcon}
            <span className="tracking-[-0.02em]">{authLabel}</span>
          </Link>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger
              render={
                <button
                  type="button"
                  className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-100 transition hover:border-emerald-300/18 hover:bg-white/8 xl:hidden"
                  aria-label="Open navigation"
                />
              }
            >
              <RiMenu3Line className="size-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(92vw,24rem)] border-white/10 bg-[linear-gradient(180deg,rgba(5,10,9,0.98),rgba(6,10,14,0.98))] text-white sm:max-w-none"
            >
              <SheetHeader className="border-b border-white/8 px-6 py-5">
                <SheetTitle className="text-left text-lg font-semibold text-white">
                  {messages.logo}
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
                <div className="space-y-2">
                  {mobileNavItems.map((item) => {
                    const isActive = isActivePath(item.href);

                    return (
                      <SheetClose
                        key={item.href}
                        render={
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center justify-between rounded-[1.2rem] border px-4 py-3 text-sm font-medium transition",
                              isActive
                                ? "border-emerald-300/24 bg-emerald-300/10 text-white"
                                : "border-white/8 bg-white/[0.03] text-zinc-200 hover:border-white/14 hover:bg-white/[0.05]",
                            )}
                          />
                        }
                      >
                        <span>{item.label}</span>
                        <span className="text-white/35">/</span>
                      </SheetClose>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
                  <div className="text-[0.68rem] uppercase tracking-[0.18em] text-white/42">
                    {messages.language.label}
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {locales.map((targetLocale) => (
                      <button
                        key={targetLocale}
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleLocaleChange(targetLocale);
                        }}
                        className={cn(
                          "rounded-full border px-3 py-2 text-sm font-medium uppercase transition",
                          targetLocale === locale
                            ? "border-emerald-300/24 bg-emerald-300/10 text-white"
                            : "border-white/8 bg-white/[0.03] text-zinc-200 hover:border-white/14 hover:bg-white/[0.05]",
                        )}
                      >
                        {targetLocale}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-white/8 p-6">
                <SheetClose
                  render={
                    <Link
                      href={authHref}
                      className="group inline-flex h-13 w-full items-center justify-center gap-2 rounded-full border border-emerald-200/35 bg-[linear-gradient(135deg,#bef264_0%,#6ee7b7_38%,#34d399_72%,#22c55e_100%)] px-3 text-sm font-semibold text-slate-950 shadow-[0_16px_40px_rgba(52,211,153,0.24),inset_0_1px_0_rgba(255,255,255,0.35)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_52px_rgba(52,211,153,0.3),inset_0_1px_0_rgba(255,255,255,0.42)]"
                    />
                  }
                >
                  {authButtonIcon}
                  <span className="tracking-[-0.02em]">{authLabel}</span>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
