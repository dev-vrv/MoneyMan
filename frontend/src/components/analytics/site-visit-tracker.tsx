"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { trackSiteVisit } from "@/lib/api/traffic";
import { locales } from "@/lib/i18n/config";

const EXCLUDED_SEGMENTS = new Set(["workspace", "login", "auth", "forgot-password"]);
const LANDING_STORAGE_KEY = "finman-tracked-landings";

export function SiteVisitTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const segments = pathname.split("/").filter(Boolean);
    const firstContentSegment = locales.includes((segments[0] ?? "") as (typeof locales)[number])
      ? segments[1] ?? ""
      : segments[0] ?? "";

    if (EXCLUDED_SEGMENTS.has(firstContentSegment)) {
      return;
    }

    const query = searchParams.toString();
    const landingKey = `${pathname}${query ? `?${query}` : ""}`;
    const trackedLandings = new Set(
      (window.sessionStorage.getItem(LANDING_STORAGE_KEY) || "")
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean),
    );

    if (trackedLandings.has(landingKey)) {
      return;
    }

    trackedLandings.add(landingKey);
    window.sessionStorage.setItem(LANDING_STORAGE_KEY, Array.from(trackedLandings).join("|"));

    void trackSiteVisit({
      tracking_code: searchParams.get("trk") ?? "",
      path: pathname,
      landing_url: window.location.href,
      referrer_url: document.referrer || "",
      utm_source: searchParams.get("utm_source") ?? "",
      utm_medium: searchParams.get("utm_medium") ?? "",
      utm_campaign: searchParams.get("utm_campaign") ?? "",
      utm_content: searchParams.get("utm_content") ?? "",
      utm_term: searchParams.get("utm_term") ?? "",
    }).catch(() => undefined);
  }, [pathname, searchParams]);

  return null;
}
