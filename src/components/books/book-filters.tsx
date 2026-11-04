"use client";

import { Icon } from "@/components/shared/icon";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type CategoryFilter = "All" | (typeof CATEGORIES)[number];

type BookFiltersProps = {
  query: string;
  onQueryChange: (value: string) => void;
  category: CategoryFilter;
  onCategoryChange: (value: CategoryFilter) => void;
};

const CHIPS: CategoryFilter[] = ["All", ...CATEGORIES];

export function BookFilters({
  query,
  onQueryChange,
  category,
  onCategoryChange,
}: BookFiltersProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="relative max-w-xl">
        <Icon
          name="search"
          size={20}
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by title or author..."
          aria-label="Search by title or author"
          className="h-12 w-full rounded-full bg-muted pr-11 pl-12 text-sm text-foreground transition-all outline-none placeholder:text-muted-foreground focus:bg-background focus:shadow-md focus:ring-2 focus:ring-brand"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onQueryChange("")}
            className="absolute top-1/2 right-3 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Icon name="close" size={18} />
          </button>
        )}
      </div>

      <div
        role="group"
        aria-label="Filter by category"
        className="flex items-center gap-2 overflow-x-auto pb-1"
      >
        {CHIPS.map((chip) => {
          const active = chip === category;
          return (
            <button
              key={chip}
              type="button"
              aria-pressed={active}
              onClick={() => onCategoryChange(chip)}
              className={cn(
                "h-9 shrink-0 rounded-full px-5 text-sm font-semibold transition-all active:scale-95",
                active
                  ? "bg-brand text-white shadow-sm"
                  : "bg-muted text-foreground hover:bg-accent"
              )}
            >
              {chip}
            </button>
          );
        })}
      </div>
    </div>
  );
}
