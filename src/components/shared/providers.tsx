"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
      <Toaster
        position="top-right"
        offset={{ top: 88, right: 24 }}
        mobileOffset={{ top: 88, right: 16, left: 16 }}
      />
    </ThemeProvider>
  );
}
