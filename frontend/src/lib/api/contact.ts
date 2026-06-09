import { apiClient } from "@/lib/api/client";

export type ContactMessagePayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

export async function submitContactMessage(payload: ContactMessagePayload) {
  const { data } = await apiClient.post("/contact-messages/", payload);
  return data;
}
