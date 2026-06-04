import { apiClient } from "@/lib/api/client";
import type { AuthSession, AuthUser } from "@/lib/auth/session";

export type RegisterPayload = {
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export async function register(payload: RegisterPayload) {
  const { data } = await apiClient.post<AuthSession>("/auth/register/", payload);
  return data;
}

export async function login(payload: LoginPayload) {
  const { data } = await apiClient.post<AuthSession>("/auth/login/", payload);
  return data;
}

export async function logout(refresh: string) {
  await apiClient.post("/auth/logout/", { refresh });
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get<AuthUser>("/auth/me/");
  return data;
}
