"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/icon";
import { describeRedirect } from "@/lib/auth-redirect";

/** "Log in to continue where you left off" (shown when ?redirect= is present). */
export function LoginRequiredBanner({ redirectTo }: { redirectTo: string }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="mb-6 flex flex-col gap-2 rounded-2xl bg-accent p-3.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Icon name="bookmark_added" size={20} className="text-brand" />
          Log in to continue where you left off
        </div>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setDismissed(true)}
          className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
        >
          <Icon name="close" size={16} />
        </button>
      </div>
      <span className="inline-flex w-fit items-center gap-1 rounded-full bg-brand-subtle px-2.5 py-0.5 text-xs font-semibold text-brand">
        <Icon name="arrow_forward" size={14} />
        Redirected from: {describeRedirect(redirectTo)}
      </span>
    </div>
  );
}
