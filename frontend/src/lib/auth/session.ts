export type AuthUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  display_name: string;
};

export type AuthSession = {
  access: string;
  refresh: string;
  user: AuthUser;
};

const storageKey = "fin-man-auth-session";

let accessTokenCache: string | null = null;

function isBrowser() {
  return typeof window !== "undefined";
}

export function getStoredSession(): AuthSession | null {
  if (!isBrowser()) {
    return null;
  }

  const rawValue = window.localStorage.getItem(storageKey);
  if (!rawValue) {
    return null;
  }

  try {
    const session = JSON.parse(rawValue) as AuthSession;
    accessTokenCache = session.access;
    return session;
  } catch {
    window.localStorage.removeItem(storageKey);
    accessTokenCache = null;
    return null;
  }
}

export function persistSession(session: AuthSession) {
  accessTokenCache = session.access;
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(storageKey, JSON.stringify(session));
}

export function clearSession() {
  accessTokenCache = null;
  if (!isBrowser()) {
    return;
  }
  window.localStorage.removeItem(storageKey);
}

export function updateAccessToken(access: string) {
  updateSessionTokens({ access });
}

export function updateSessionTokens({
  access,
  refresh,
}: {
  access: string;
  refresh?: string;
}) {
  accessTokenCache = access;

  if (!isBrowser()) {
    return;
  }

  const session = getStoredSession();
  if (!session) {
    return;
  }

  window.localStorage.setItem(
    storageKey,
    JSON.stringify({
      ...session,
      access,
      refresh: refresh ?? session.refresh,
    }),
  );
}

export function getAccessToken() {
  if (accessTokenCache) {
    return accessTokenCache;
  }

  const session = getStoredSession();
  return session?.access ?? null;
}

export function getRefreshToken() {
  return getStoredSession()?.refresh ?? null;
}
