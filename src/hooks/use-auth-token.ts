"use client";

import useSWR from "swr";
import { authClient } from "@/lib/auth-client";
import { getAuthToken } from "@/lib/auth-token";

/** The current user's JWT (for display/debugging). API calls use authFetch() instead. */
export function useAuthToken() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id ?? null;

  const { data, error, isLoading, mutate } = useSWR(
    userId ? ["auth-token", userId] : null,
    () => getAuthToken({ forceRefresh: true }),
    { revalidateOnFocus: false, refreshInterval: 10 * 60 * 1000 }
  );

  return {
    token: data ?? null,
    isLoggedIn: Boolean(userId),
    isLoading,
    error,
    refresh: () => mutate(),
  };
}
