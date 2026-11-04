"use client";

import Link from "next/link";
import { Icon } from "@/components/shared/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/use-logout";
import type { SessionUser } from "@/types";
import { UserAvatar } from "./user-avatar";

export function UserMenu({ user }: { user: SessionUser }) {
  const logout = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open user menu"
          className="flex items-center gap-1 rounded-full p-1 transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <UserAvatar name={user.name} image={user.image} />
          <Icon
            name="expand_more"
            size={18}
            className="hidden text-muted-foreground sm:inline-block"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 rounded-2xl p-0 py-2.5">
        <div className="flex items-center gap-3 px-4 py-3">
          <UserAvatar name={user.name} image={user.image} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold leading-tight text-foreground">
              {user.name}
            </p>
            <p className="mt-0.5 truncate text-xs font-medium text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="px-2 py-1">
          <DropdownMenuItem asChild className="cursor-pointer rounded-xl px-3 py-2">
            <Link href="/profile">
              <Icon name="person" size={18} />
              <span>My Profile</span>
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        <div className="px-2 pt-1">
          <DropdownMenuItem
            onSelect={() => logout()}
            className="cursor-pointer rounded-xl px-3 py-2 font-semibold text-brand focus:bg-brand-subtle focus:text-brand"
          >
            <Icon name="logout" size={18} />
            <span>Logout</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
