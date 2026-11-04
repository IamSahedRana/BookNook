"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { clearAuthToken } from "@/lib/auth-token";
import { notify } from "@/lib/toast";

export function useLogout() {
  const router = useRouter();

  return async function logout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          clearAuthToken();
          notify.success("Logged out", "See you again soon!");
          router.push("/");
          router.refresh();
        },
        onError: () => {
          notify.error("Could not log out", "Please try again.");
        },
      },
    });
  };
}
