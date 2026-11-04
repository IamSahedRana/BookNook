"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Icon } from "@/components/shared/icon";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex size-10 items-center justify-center rounded-full text-foreground/70">
        <div className="size-[22px]" />
      </div>
    );
  }

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="relative flex size-10 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
    >
      {/* Light Mode Icon with rotation/scale exit animation */}
      <Icon
        name="light_mode"
        size={22}
        className="absolute transition-all duration-300 rotate-0 scale-100 dark:-rotate-90 dark:scale-0"
      />
      {/* Dark Mode Icon with rotation/scale entry animation */}
      <Icon
        name="dark_mode"
        size={22}
        className="absolute transition-all duration-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100"
      />
    </button>
  );
}