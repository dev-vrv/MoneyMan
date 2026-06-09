"use client";

import { useEffect, useMemo, useState } from "react";
import { RiArrowUpLine } from "react-icons/ri";

import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type ScrollToTopButtonProps = {
  locale: Locale;
};

export function ScrollToTopButton({ locale }: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPulseActive, setIsPulseActive] = useState(false);

  const copy = useMemo(() => {
    switch (locale) {
      case "ru":
        return {
          label: "Наверх",
          eyebrow: "Переход",
        };
      case "kg":
        return {
          label: "Жогору",
          eyebrow: "Багыт",
        };
      default:
        return {
          label: "Back to top",
          eyebrow: "Navigate",
        };
    }
  }, [locale]);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.9);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setIsPulseActive(true);
      window.setTimeout(() => setIsPulseActive(false), 1400);
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      aria-label={copy.label}
      title={copy.label}
      onClick={handleClick}
      className={cn(
        "group fixed bottom-5 right-5 z-[70] inline-flex items-center gap-2 rounded-full border border-white/10 bg-[rgba(8,13,17,0.82)] px-2 py-2 text-white shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl transition duration-400 sm:bottom-7 sm:right-7",
        "before:absolute before:inset-0 before:rounded-full before:bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_44%)] before:content-['']",
        isVisible
          ? "pointer-events-auto translate-y-0 scale-100 opacity-100 hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(0,0,0,0.24)]"
          : "pointer-events-none translate-y-5 scale-90 opacity-0",
      )}
    >
      <span className="pointer-events-none absolute inset-0 rounded-full border border-cyan-300/12" />
      <span className="pointer-events-none absolute inset-x-3 inset-y-1 rounded-full bg-[radial-gradient(circle_at_18%_50%,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_82%_50%,rgba(74,222,128,0.1),transparent_28%)]" />
      <span className="relative z-10 inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-300 group-hover:border-cyan-300/24 group-hover:bg-white/10">
        <span className="pointer-events-none absolute inset-1 rounded-full bg-cyan-300/8 blur-md" />
        <span
          className={cn(
            "pointer-events-none absolute left-1/2 top-1/2 size-11 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/18 opacity-0 transition duration-300",
            "group-hover:opacity-100 group-hover:animate-[ping_1.4s_ease-out_1]",
            isPulseActive ? "animate-[ping_1.4s_ease-out_1] opacity-100" : "",
          )}
        />
        <RiArrowUpLine className="size-[1.125rem] transition duration-300 group-hover:-translate-y-0.5" />
      </span>
      <span className="relative z-10 hidden pr-2 text-left sm:block">
        <span className="block text-sm font-medium text-white/78 transition duration-300 group-hover:text-white">
          {copy.label}
        </span>
      </span>
    </button>
  );
}
