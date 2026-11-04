"use client";

import { Icon } from "@/components/shared/icon";
import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-border bg-card p-8 text-center shadow-sm"
    >
      <span className="mb-4 flex size-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
        <Icon name="cloud_off" size={40} className="text-destructive" />
      </span>
      <h3 className="mb-1.5 text-2xl font-bold text-foreground">{title}</h3>
      <p className="mb-6 text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="gap-2">
          <Icon name="refresh" size={18} />
          Try again
        </Button>
      )}
    </div>
  );
}
