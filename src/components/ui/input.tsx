import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-full border border-transparent bg-muted px-4 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-brand focus-visible:bg-background focus-visible:ring-[3px] focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-destructive/20 read-only:cursor-not-allowed read-only:opacity-70",
        className
      )}
      {...props}
    />
  );
}

export { Input };
