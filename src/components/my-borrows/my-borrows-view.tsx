"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Icon } from "@/components/shared/icon";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBooks } from "@/hooks/use-books";
import { useMyBorrows } from "@/hooks/use-borrows";
import { useNow } from "@/hooks/use-now";
import { getDueStatus } from "@/lib/borrow-status";
import { cn } from "@/lib/utils";
import type { Borrow } from "@/types";
import { BorrowStats } from "./borrow-stats";
import { BorrowsTable } from "./borrows-table";
import { ReturnModal } from "./return-modal";

type Tab = "all" | "due";

export function MyBorrowsView() {
  const { borrows, isLoading, error, refresh } = useMyBorrows();
  const { books } = useBooks(); // for author, category and copy counts
  const now = useNow();

  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [returning, setReturning] = useState<Borrow | null>(null);

  const bookById = useMemo(() => new Map(books.map((b) => [b._id, b])), [books]);

  const sorted = useMemo(
    () => [...borrows].sort((a, b) => +new Date(a.returnDate) - +new Date(b.returnDate)),
    [borrows]
  );
  const dueSoonCount = useMemo(
    () => sorted.filter((b) => getDueStatus(b.returnDate, now).dueSoon).length,
    [sorted, now]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter((b) => {
      if (tab === "due" && !getDueStatus(b.returnDate, now).dueSoon) return false;
      if (!q) return true;
      const author = bookById.get(b.bookId)?.author.toLowerCase() ?? "";
      return b.bookTitle.toLowerCase().includes(q) || author.includes(q);
    });
  }, [sorted, tab, query, now, bookById]);

  const tabClass = (active: boolean) =>
    cn(
      "flex h-10 shrink-0 items-center gap-1.5 rounded-full px-5 text-sm font-semibold transition-all",
      active ? "bg-brand text-white shadow-sm" : "bg-muted text-foreground hover:bg-accent"
    );

  return (
    <div className="mx-auto w-full max-w-[1320px] px-4 pt-8 pb-16 sm:px-8">
      <PageHeader
        title="My Borrows"
        description="Books you've borrowed. Return them when you're done."
        badge="Live Lending"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "My Borrows" }]}
        aside={
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-11 items-center gap-2 rounded-full bg-muted px-5 text-sm font-medium text-foreground shadow-sm">
              <Icon name="history_toggle_off" size={18} className="text-brand" />
              Lending period: <strong className="font-semibold">7 days free</strong>
            </span>
            <Button asChild variant="inverted" className="h-11 gap-2 px-6">
              <Link href="/books">
                Explore Catalog
                <Icon name="arrow_forward" size={18} />
              </Link>
            </Button>
          </div>
        }
      />

      {error ? (
        <ErrorState title="Couldn't load your borrows" message={error.message} onRetry={() => refresh()} />
      ) : !isLoading && borrows.length === 0 ? (
        <>
          <BorrowStats borrowed={0} dueSoon={0} />
          <div className="mt-6">
            <EmptyState
              icon="shelves"
              title="You haven't borrowed any books yet"
              description="Browse the shelves and borrow any book for 7 days, completely free."
              action={
                <Button asChild className="gap-2">
                  <Link href="/books">
                    <Icon name="menu_book" size={18} />
                    Browse Books
                  </Link>
                </Button>
              }
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-6">
          <BorrowStats borrowed={borrows.length} dueSoon={dueSoonCount} loading={isLoading} />

          <section aria-label="Borrowed books" className="flex flex-col gap-4 rounded-3xl bg-card p-5 shadow-sm sm:p-6">
            <div className="flex flex-col items-stretch justify-between gap-4 lg:flex-row lg:items-center">
              <div role="tablist" aria-label="Filter borrows" className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
                <button role="tab" aria-selected={tab === "all"} type="button" onClick={() => setTab("all")} className={tabClass(tab === "all")}>
                  All Borrows ({borrows.length})
                </button>
                <button role="tab" aria-selected={tab === "due"} type="button" onClick={() => setTab("due")} className={tabClass(tab === "due")}>
                  Due Soon
                  {dueSoonCount > 0 && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-white">
                      {dueSoonCount}
                    </span>
                  )}
                </button>
              </div>

              <div className="relative w-full lg:w-80">
                <Icon
                  name="search"
                  size={20}
                  className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search borrowed titles..."
                  aria-label="Search borrowed titles"
                  className="h-11 w-full rounded-full bg-muted pr-4 pl-11 text-sm text-foreground transition-all outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>

            {isLoading ? (
              <div aria-busy="true" className="flex flex-col gap-3">
                {Array.from({ length: 3 }, (_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                ))}
              </div>
            ) : visible.length === 0 ? (
              <div className="py-10 text-center">
                <p className="font-semibold text-foreground">
                  {tab === "due" && !query ? "Nothing is due soon" : "No borrowed books match your search"}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setTab("all");
                    setQuery("");
                  }}
                  className="mt-2 text-sm font-semibold text-brand hover:underline"
                >
                  Show all borrows
                </button>
              </div>
            ) : (
              <BorrowsTable borrows={visible} bookById={bookById} now={now} onReturn={setReturning} />
            )}
          </section>
        </div>
      )}

      <ReturnModal
        borrow={returning}
        book={returning ? bookById.get(returning.bookId) : undefined}
        onClose={() => setReturning(null)}
      />
    </div>
  );
}
