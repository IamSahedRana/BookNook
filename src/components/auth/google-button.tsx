"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { DEV_HINT } from "@/lib/constants";
import { notify } from "@/lib/toast";

type GoogleButtonProps = {
  /** Where to go after Google sign-in */
  callbackURL?: string;
};

export function GoogleButton({ callbackURL = "/" }: GoogleButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL,
      errorCallbackURL: "/login",
    });

    // On success the browser leaves for Google, so we only get here on failure.
    if (error) {
      console.error("[google] sign-in error:", error);
      setLoading(false);
      notify.error(
        "Google sign-in failed",
        `${error.message || "Google sign-in is not available right now. Please try again."}${DEV_HINT}`
      );
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleClick}
      disabled={loading}
      className="h-12 w-full gap-3 bg-background shadow-sm hover:bg-card"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0">
        <path
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
          fill="#4285F4"
        />
        <path
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
          fill="#34A853"
        />
        <path
          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          fill="#FBBC05"
        />
        <path
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          fill="#EA4335"
        />
      </svg>
      {loading ? "Connecting to Google..." : "Continue with Google"}
    </Button>
  );
}
