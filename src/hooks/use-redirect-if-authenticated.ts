"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

/** Logged-in users have no reason to see Login/Register: send them on. */
export function useRedirectIfAuthenticated(target: string, enabled = true) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const isAuthenticated = Boolean(session?.user);

  useEffect(() => {
    if (enabled && isAuthenticated) router.replace(target);
  }, [enabled, isAuthenticated, router, target]);

  return isAuthenticated;
}
