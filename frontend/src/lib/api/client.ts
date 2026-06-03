import axios from "axios";

import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  updateSessionTokens,
} from "@/lib/auth/session";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshRequest: Promise<string> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };
    const refreshToken = getRefreshToken();

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      !refreshToken ||
      originalRequest?.url?.includes("/auth/login/") ||
      originalRequest?.url?.includes("/auth/register/") ||
      originalRequest?.url?.includes("/auth/jwt/refresh/")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshRequest ??= apiClient
        .post<{ access: string; refresh: string }>("/auth/jwt/refresh/", {
          refresh: refreshToken,
        })
        .then((response) => {
          updateSessionTokens({
            access: response.data.access,
            refresh: response.data.refresh,
          });
          return response.data.access;
        })
        .finally(() => {
          refreshRequest = null;
        });

      const nextAccessToken = await refreshRequest;
      originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      clearSession();
      return Promise.reject(refreshError);
    }
  },
);
