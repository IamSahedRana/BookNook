"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActivePath } from "@/lib/nav";
import type { NavLinkItem } from "@/lib/constants";
import { cn } from "@/lib/utils";

type NavLinksProps = {
  links: NavLinkItem[];
  className?: string;
};

export function NavLinks({ links, className }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className={cn("items-center gap-1", className)}>
      {links.map((link) => {
        const active = isActivePath(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full border-b-2 px-3 py-2 text-sm transition-colors",
              active
                ? "border-brand font-bold text-brand"
                : "border-transparent font-semibold text-foreground/70 hover:bg-muted hover:text-foreground"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
