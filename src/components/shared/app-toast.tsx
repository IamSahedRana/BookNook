"use client";

import { toast } from "sonner";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "info" | "warning";

const VARIANTS: Record<
  ToastVariant,
  { icon: string; circle: string; bar: string }
> = {
  success: { icon: "check_circle", circle: "bg-emerald-500 text-white", bar: "bg-emerald-500" },
  error: {
    icon: "error",
    circle: "bg-red-100 text-destructive dark:bg-red-950",
    bar: "bg-brand",
  },
  info: { icon: "info", circle: "bg-brand-subtle text-brand", bar: "bg-brand" },
  warning: {
    icon: "warning",
    circle: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    bar: "bg-amber-500",
  },
};

type AppToastProps = {
  id: string | number;
  variant: ToastVariant;
  title: string;
  message?: string;
  duration: number;
};

export function AppToast({ id, variant, title, message, duration }: AppToastProps) {
  const v = VARIANTS[variant];

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className="pointer-events-auto w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xl sm:w-[356px]"
    >
      <div className="flex items-start gap-3 p-4">
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full",
            v.circle
          )}
        >
          <Icon name={v.icon} size={18} filled />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold leading-snug">{title}</p>
          {message && (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {message}
            </p>
          )}
        </div>

        <button
          type="button"
          aria-label="Close notification"
          onClick={() => toast.dismiss(id)}
          className="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Icon name="close" size={16} />
        </button>
      </div>

      <div className="h-1 bg-muted">
        <div
          className={cn("toast-progress h-full", v.bar)}
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
}
