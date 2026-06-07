"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const FLAG_COUNTRY_BY_CURRENCY: Record<string, string> = {
  AUD: "AU",
  BYN: "BY",
  CAD: "CA",
  CHF: "CH",
  CNY: "CN",
  EUR: "EU",
  GBP: "GB",
  JPY: "JP",
  KGS: "KG",
  KZT: "KZ",
  RUB: "RU",
  TRY: "TR",
  UAH: "UA",
  USD: "US",
  UZS: "UZ",
};

function FlagFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-4 w-5 shrink-0 overflow-hidden rounded-[0.35rem] border border-white/12 bg-black/20 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 20 16" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        {children}
      </svg>
    </span>
  );
}

function CountryFlag({ countryCode }: { countryCode: string }) {
  switch (countryCode) {
    case "US":
      return (
        <FlagFrame>
          <rect width="20" height="16" fill="#B22234" />
          <g fill="#fff">
            <rect y="2" width="20" height="2" />
            <rect y="6" width="20" height="2" />
            <rect y="10" width="20" height="2" />
            <rect y="14" width="20" height="2" />
          </g>
          <rect width="9" height="8.8" fill="#3C3B6E" />
          <g fill="#fff">
            <circle cx="1.8" cy="1.8" r="0.45" />
            <circle cx="4.5" cy="1.8" r="0.45" />
            <circle cx="7.2" cy="1.8" r="0.45" />
            <circle cx="3.15" cy="3.35" r="0.45" />
            <circle cx="5.85" cy="3.35" r="0.45" />
            <circle cx="1.8" cy="4.9" r="0.45" />
            <circle cx="4.5" cy="4.9" r="0.45" />
            <circle cx="7.2" cy="4.9" r="0.45" />
            <circle cx="3.15" cy="6.45" r="0.45" />
            <circle cx="5.85" cy="6.45" r="0.45" />
          </g>
        </FlagFrame>
      );
    case "EU":
      return (
        <FlagFrame>
          <rect width="20" height="16" fill="#1F4AA8" />
          <g fill="#F6C948">
            <circle cx="10" cy="3" r="0.7" />
            <circle cx="13.5" cy="4" r="0.7" />
            <circle cx="15.5" cy="7" r="0.7" />
            <circle cx="15.5" cy="9" r="0.7" />
            <circle cx="13.5" cy="12" r="0.7" />
            <circle cx="10" cy="13" r="0.7" />
            <circle cx="6.5" cy="12" r="0.7" />
            <circle cx="4.5" cy="9" r="0.7" />
            <circle cx="4.5" cy="7" r="0.7" />
            <circle cx="6.5" cy="4" r="0.7" />
            <circle cx="7.7" cy="2.8" r="0.7" />
            <circle cx="12.3" cy="2.8" r="0.7" />
          </g>
        </FlagFrame>
      );
    case "KG":
      return (
        <FlagFrame>
          <rect width="20" height="16" fill="#D61F26" />
          <circle cx="10" cy="8" r="4.2" fill="#F7C948" />
          <circle cx="10" cy="8" r="2.4" fill="#D61F26" />
          <g stroke="#F7C948" strokeWidth="0.8" strokeLinecap="round">
            <path d="M10 2.2v2.1M10 11.7v2.1M4.2 8h2.1M13.7 8h2.1M5.8 3.8l1.5 1.5M12.7 10.7l1.5 1.5M14.2 3.8l-1.5 1.5M7.3 10.7l-1.5 1.5" />
          </g>
        </FlagFrame>
      );
    case "RU":
      return (
        <FlagFrame>
          <rect width="20" height="16" fill="#fff" />
          <rect y="5.33" width="20" height="5.34" fill="#224C9F" />
          <rect y="10.67" width="20" height="5.33" fill="#D52B1E" />
        </FlagFrame>
      );
    case "KZ":
      return (
        <FlagFrame>
          <rect width="20" height="16" fill="#27B7D8" />
          <rect width="1.8" height="16" fill="#F6C948" />
          <circle cx="11.4" cy="7.2" r="3" fill="#F6C948" />
          <path d="M8.9 11.2c1.3.9 3.7.9 5 0" fill="none" stroke="#F6C948" strokeWidth="0.9" strokeLinecap="round" />
        </FlagFrame>
      );
    default:
      return (
        <FlagFrame>
          <defs>
            <linearGradient id="flag-fallback" x1="0" y1="0" x2="20" y2="16" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34d399" />
              <stop offset="1" stopColor="#0f766e" />
            </linearGradient>
          </defs>
          <rect width="20" height="16" fill="url(#flag-fallback)" />
          <path d="M5 11.5 8.3 4.5h1.6l3.3 7h-1.7l-.7-1.6H7l-.7 1.6Zm2.6-2.9h2.8L9 5.8Z" fill="#04130D" />
        </FlagFrame>
      );
  }
}

export function CurrencyFlag({
  currencyCode,
  className,
}: {
  currencyCode: string;
  className?: string;
}) {
  const countryCode = FLAG_COUNTRY_BY_CURRENCY[currencyCode.toUpperCase()] ?? "";

  return (
    <span className={className}>
      <CountryFlag countryCode={countryCode} />
    </span>
  );
}

export function CurrencyOptionLabel({
  currencyCode,
  text,
}: {
  currencyCode: string;
  text: string;
}) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <CurrencyFlag currencyCode={currencyCode} />
      <span className="truncate">{text}</span>
    </span>
  );
}
