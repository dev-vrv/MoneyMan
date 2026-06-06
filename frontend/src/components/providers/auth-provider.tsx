"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  updateCurrentUser as updateCurrentUserRequest,
  type LoginPayload,
  type RegisterPayload,
  type UpdateCurrentUserPayload,
} from "@/lib/api/auth";
import {
  clearSession,
  getRefreshToken,
  getStoredSession,
  persistSession,
  type AuthUser,
} from "@/lib/auth/session";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  isAuthenticated: boolean;
  signIn: (payload: LoginPayload) => Promise<AuthUser>;
  signUp: (payload: RegisterPayload) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
  updateUser: (payload: UpdateCurrentUserPayload) => Promise<AuthUser>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function extractErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : "Request failed.";
  }

  const payload = error.response?.data;
  if (!payload || typeof payload !== "object") {
    return error.message;
  }

  for (const value of Object.values(payload)) {
    if (Array.isArray(value) && value[0]) {
      return String(value[0]);
    }
    if (typeof value === "string") {
      return value;
    }
  }

  return error.message;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    Promise.resolve().then(() => {
      const session = getStoredSession();
      if (!session) {
        setStatus("unauthenticated");
        return;
      }

      setUser(session.user);
      setStatus("authenticated");

      fetchCurrentUser()
        .then((nextUser) => {
          const current = getStoredSession();
          if (current) {
            persistSession({ ...current, user: nextUser });
          }
          setUser(nextUser);
        })
        .catch(() => {
          clearSession();
          setUser(null);
          setStatus("unauthenticated");
        });
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      isAuthenticated: status === "authenticated" && !!user,
      async signIn(payload) {
        try {
          const session = await loginRequest(payload);
          persistSession(session);
          setUser(session.user);
          setStatus("authenticated");
          return session.user;
        } catch (error) {
          throw new Error(extractErrorMessage(error));
        }
      },
      async signUp(payload) {
        try {
          const session = await registerRequest(payload);
          persistSession(session);
          setUser(session.user);
          setStatus("authenticated");
          return session.user;
        } catch (error) {
          throw new Error(extractErrorMessage(error));
        }
      },
      async signOut() {
        const refreshToken = getRefreshToken();
        try {
          if (refreshToken) {
            await logoutRequest(refreshToken);
          }
        } finally {
          clearSession();
          setUser(null);
          setStatus("unauthenticated");
          router.refresh();
        }
      },
      async refreshUser() {
        try {
          const nextUser = await fetchCurrentUser();
          const current = getStoredSession();
          if (current) {
            persistSession({ ...current, user: nextUser });
          }
          setUser(nextUser);
          setStatus("authenticated");
          return nextUser;
        } catch {
          clearSession();
          setUser(null);
          setStatus("unauthenticated");
          return null;
        }
      },
      async updateUser(payload) {
        try {
          const nextUser = await updateCurrentUserRequest(payload);
          const current = getStoredSession();
          if (current) {
            persistSession({ ...current, user: nextUser });
          }
          setUser(nextUser);
          setStatus("authenticated");
          return nextUser;
        } catch (error) {
          throw new Error(extractErrorMessage(error));
        }
      },
    }),
    [router, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
