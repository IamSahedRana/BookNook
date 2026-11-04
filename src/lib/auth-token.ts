import { authClient } from "@/lib/auth-client";

/**
 * The Express API wants a JWT (not the session cookie).
 * BetterAuth hands one out for the logged-in user; it lasts about 15 minutes,
 * so we keep it in memory and ask for a new one shortly before it expires.
 */
type CachedToken = { token: string; expiresAt: number };

let cached: CachedToken | null = null;
let inflight: Promise<string | null> | null = null;

const REFRESH_MARGIN_MS = 30_000;

export type TokenPayload = {
  sub?: string;
  email?: string;
  name?: string;
  image?: string | null;
  iss?: string;
  aud?: string | string[];
  iat?: number;
  exp?: number;
  [key: string]: unknown;
};

/** Reads the (public) payload of a JWT. It does NOT verify it; the server does that. */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const part = token.split(".")[1];
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as TokenPayload;
  } catch {
    return null;
  }
}

async function requestToken(): Promise<string | null> {
  const { data, error } = await authClient.token();
  if (error || !data?.token) {
    cached = null;
    return null;
  }
  const exp = decodeToken(data.token)?.exp;
  cached = {
    token: data.token,
    expiresAt: exp ? exp * 1000 : Date.now() + 5 * 60_000,
  };
  return cached.token;
}

/** Returns a valid JWT for the logged-in user, or null when logged out. */
export async function getAuthToken(options: { forceRefresh?: boolean } = {}) {
  if (!options.forceRefresh && cached && cached.expiresAt - Date.now() > REFRESH_MARGIN_MS) {
    return cached.token;
  }
  // Many components may ask at once: share one request
  inflight ??= requestToken().finally(() => {
    inflight = null;
  });
  return inflight;
}

/** Call on logout so the next user never gets the previous user's token. */
export function clearAuthToken() {
  cached = null;
  inflight = null;
}
