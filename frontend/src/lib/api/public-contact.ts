import "server-only";

import type { Locale } from "@/lib/i18n/config";
import type { PublicContactDetails } from "@/lib/public-contact-details";

function getApiTargets() {
  const configuredTarget = process.env.API_PROXY_TARGET?.trim();
  const fallbacks = [
    "http://127.0.0.1:8000",
    "http://localhost:8000",
    "http://backend:8000",
  ];

  const candidates = configuredTarget
    ? [configuredTarget, ...fallbacks]
    : fallbacks;

  return Array.from(new Set(candidates.map((target) => target.replace(/\/$/, ""))));
}

export async function getPublicContactDetails(
  locale: Locale,
): Promise<PublicContactDetails | null> {
  for (const target of getApiTargets()) {
    try {
      const response = await fetch(`${target}/api/v1/public-contact-details/`, {
        method: "GET",
        headers: {
          "X-Locale": locale,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        continue;
      }

      return (await response.json()) as PublicContactDetails;
    } catch {
      continue;
    }
  }

  return null;
}
