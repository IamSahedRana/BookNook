"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { NAV_LINKS } from "@/lib/constants";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";
import { NavSearch } from "./nav-search";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;

  // Add Book / My Books / My Borrows are private: only shown when logged in
  const links = NAV_LINKS.filter((link) => !link.private || user);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-8">
        <div className="flex shrink-0 items-center gap-6">
          <Logo />
          <NavLinks links={links} className="hidden lg:flex" />
        </div>

        <NavSearch className="mx-3 hidden max-w-xl flex-1 xl:flex" />

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {isPending ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <UserMenu user={user} />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-full px-5 font-semibold"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="h-10 rounded-full px-6 font-semibold">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}

          <MobileMenu links={links} user={user} />
        </div>
      </div>
    </header>
  );
}
