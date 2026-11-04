"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/shared/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type AuthFieldProps = React.ComponentProps<"input"> & {
  label: string;
  icon: string;
  error?: string;
  hint?: string;
  /** Shown on the right of the label row (e.g. "Forgot Password?") */
  labelRight?: React.ReactNode;
};

/** Label + icon input + inline error. Password inputs get a show/hide button. */
export function AuthField({
  label,
  icon,
  error,
  hint,
  labelRight,
  type = "text",
  className,
  ...inputProps
}: AuthFieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const messageId = `${id}-message`;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        {labelRight}
      </div>

      <div className="relative flex items-center">
        <Icon
          name={icon}
          size={20}
          className={cn(
            "pointer-events-none absolute left-4",
            error ? "text-destructive" : "text-muted-foreground"
          )}
        />
        <Input
          id={id}
          type={isPassword && visible ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          className={cn(
            "h-12 bg-background pl-12 shadow-sm",
            isPassword && "pr-12",
            error && "border-destructive/60",
            className
          )}
          {...inputProps}
        />
        {isPassword && (
          <button
            type="button"
            aria-label={visible ? "Hide password" : "Show password"}
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Icon name={visible ? "visibility_off" : "visibility"} size={20} />
          </button>
        )}
      </div>

      {error ? (
        <p
          id={messageId}
          role="alert"
          className="flex items-start gap-1.5 pt-0.5 text-xs font-semibold text-destructive"
        >
          <Icon name="error" size={16} className="mt-px shrink-0" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p id={messageId} className="pl-2 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
