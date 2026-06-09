import { apiClient } from "@/lib/api/client";

export type SiteVisitPayload = {
  tracking_code?: string;
  path?: string;
  landing_url?: string;
  referrer_url?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

export async function trackSiteVisit(payload: SiteVisitPayload) {
  const { data } = await apiClient.post("/site-visits/", payload);
  return data;
}
