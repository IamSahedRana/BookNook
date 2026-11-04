"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/shared/icon";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLogout } from "@/hooks/use-logout";
import type { NavLinkItem } from "@/lib/constants";
import { isActivePath } from "@/lib/nav";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/types";
import { Logo } from "./logo";
import { NavSearch } from "./nav-search";
import { UserAvatar } from "./user-avatar";

type MobileMenuProps = {
  links: NavLinkItem[];
  user?: SessionUser | null;
};

export function MobileMenu({ links, user }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const logout = useLogout();
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="flex size-10 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-muted hover:text-foreground lg:hidden"
        >
          <Icon name="menu" size={24} />
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="flex w-[320px] flex-col gap-0 p-0">
        <SheetHeader className="border-b border-border p-4 text-left">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetDescription className="sr-only">
            BookNook site navigation
          </SheetDescription>
          <Logo onClick={close} />
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
          {user && (
            <div className="flex items-center gap-3 rounded-2xl bg-muted p-3">
              <UserAvatar name={user.name} image={user.image} />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">
                  {user.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          <NavSearch onSearch={close} />

          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {links.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-3 text-sm transition-colors",
                    active
                      ? "bg-brand-subtle font-bold text-brand"
                      : "font-semibold text-foreground/80 hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            {user && (
              <Link
                href="/profile"
                onClick={close}
                className={cn(
                  "rounded-full px-4 py-3 text-sm transition-colors",
                  isActivePath(pathname, "/profile")
                    ? "bg-brand-subtle font-bold text-brand"
                    : "font-semibold text-foreground/80 hover:bg-muted"
                )}
              >
                My Profile
              </Link>
            )}
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-border p-4">
          {user ? (
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-full font-semibold text-brand"
              onClick={() => {
                close();
                logout();
              }}
            >
              <Icon name="logout" size={18} />
              Logout
            </Button>
          ) : (
            <>
              <Button asChild className="h-11 rounded-full font-semibold">
                <Link href="/register" onClick={close}>
                  Register
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-full font-semibold"
              >
                <Link href="/login" onClick={close}>
                  Login
                </Link>
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
