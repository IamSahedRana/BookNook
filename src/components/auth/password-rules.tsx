import { Icon } from "@/components/shared/icon";
import { PASSWORD_RULES } from "@/lib/validations";
import { cn } from "@/lib/utils";

/** Live checklist: grey while empty, green when met, red when missing. */
export function PasswordRules({ password }: { password: string }) {
  const started = password.length > 0;

  return (
    <ul
      aria-label="Password requirements"
      className="space-y-1.5 rounded-2xl bg-background p-3 shadow-sm"
    >
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(password);
        const state = !started ? "idle" : met ? "met" : "missing";

        return (
          <li key={rule.id} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full",
                state === "met" &&
                  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                state === "missing" &&
                  "bg-red-100 text-destructive dark:bg-red-950",
                state === "idle" && "bg-muted text-muted-foreground"
              )}
            >
              <Icon
                name={state === "met" ? "check" : state === "missing" ? "close" : "remove"}
                size={13}
              />
            </span>
            <span
              className={cn(
                "text-xs",
                state === "missing" && "font-medium text-destructive",
                state === "met" && "text-foreground",
                state === "idle" && "text-muted-foreground"
              )}
            >
              {rule.label}
              <span className="sr-only">
                {state === "met" ? " (done)" : state === "missing" ? " (missing)" : ""}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
