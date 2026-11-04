"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";

type NavSearchProps = {
  className?: string;
  /** Called after submit (used to close the mobile menu). */
  onSearch?: () => void;
};

export function NavSearch({ className, onSearch }: NavSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/books?q=${encodeURIComponent(q)}` : "/books");
    onSearch?.();
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn("relative flex w-full items-center", className)}
    >
      <Icon
        name="search"
        size={20}
        className="pointer-events-none absolute left-4 text-muted-foreground"
      />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search titles or authors"
        aria-label="Search books"
        className="h-11 w-full rounded-full border-none bg-muted pl-11 pr-4 text-sm font-medium text-foreground transition-all placeholder:text-muted-foreground hover:bg-accent focus:bg-background focus:outline-none focus:ring-2 focus:ring-brand"
      />
    </form>
  );
}
