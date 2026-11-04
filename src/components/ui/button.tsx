import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-destructive/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Primary: red pill
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-brand-hover active:scale-[0.98]",
        // Secondary: light grey pill
        secondary:
          "bg-muted text-secondary-foreground hover:bg-accent active:scale-[0.98]",
        // Inverted: black pill (white in dark mode)
        inverted:
          "bg-foreground text-background hover:bg-foreground/85 active:scale-[0.98]",
        // Outlined: transparent with a thin border
        outline:
          "border border-border bg-transparent text-foreground hover:bg-muted active:scale-[0.98]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 active:scale-[0.98]",
        ghost: "text-foreground hover:bg-muted",
        link: "text-brand underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
