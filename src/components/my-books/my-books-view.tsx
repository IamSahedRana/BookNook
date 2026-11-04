"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Icon } from "@/components/shared/icon";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyBooks } from "@/hooks/use-books";
import { authClient } from "@/lib/auth-client";
import type { Book } from "@/types";
import { DeleteBookModal } from "./delete-book-modal";
import { EditBookModal } from "./edit-book-modal";
import { MyBooksTable } from "./my-books-table";

type SortKey = "recent" | "title" | "availability";

const SORTS: Array<{ value: SortKey; label: string }> = [
  { value: "recent", label: "Recently Added" },
  { value: "title", label: "Title (A-Z)" },
  { value: "availability", label: "Most on loan" },
];

export function MyBooksView() {
  const { books, isLoading, error, mutate } = useMyBooks();
  const { data: session } = authClient.useSession();
  const owner = session?.user ? { name: session.user.name, email: session.user.email } : null;

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");
  const [editing, setEditing] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState<Book | null>(null);

  const stats = useMemo(() => {
    const copies = books.reduce((sum, b) => sum + b.totalCopies, 0);
    const borrowed = books.reduce((sum, b) => sum + (b.totalCopies - b.availableCopies), 0);
    return { listed: books.length, copies, borrowed };
  }, [books]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = books.filter(
      (b) => !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
    return [...list].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "availability") {
        return b.totalCopies - b.availableCopies - (a.totalCopies - a.availableCopies);
      }
      return +new Date(b.addedAt) - +new Date(a.addedAt);
    });
  }, [books, query, sort]);

  return (
    <div className="mx-auto w-full max-w-[1320px] px-4 pt-8 pb-16 sm:px-8">
      <PageHeader
        title="My Books"
        description="Books you've added to BookNook."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "My Books" }]}
        aside={
          <Button asChild size="lg" className="gap-2 shadow-md">
            <Link href="/add-book">
              <Icon name="add" size={20} />
              Add New Book
            </Link>
          </Button>
        }
      />

      <section aria-label="Catalog summary" className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon="collections_bookmark" tone="brand" label="Books Listed" value={stats.listed} loading={isLoading} />
        <StatCard icon="library_books" label="Total Copies in Circulation" value={stats.copies} loading={isLoading} />
        <StatCard icon="handshake" tone="brand" label="Currently Borrowed" value={stats.borrowed} loading={isLoading} />
      </section>

      {error ? (
        <ErrorState title="Couldn't load your books" message={error.message} onRetry={() => mutate()} />
      ) : !isLoading && books.length === 0 ? (
        <EmptyState
          icon="shelves"
          title="You haven't added any books yet"
          description="Share your favorite reads with the BookNook community to get started."
          action={
            <Button asChild className="gap-2">
              <Link href="/add-book">
                <Icon name="add" size={20} />
                Add Your First Book
              </Link>
            </Button>
          }
        />
      ) : (
        <section className="overflow-hidden rounded-3xl bg-card shadow-sm">
          <div className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-80">
              <Icon
                name="search"
                size={20}
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search my books..."
                aria-label="Search my books"
                className="h-11 w-full rounded-full bg-muted pr-4 pl-11 text-sm text-foreground transition-all outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-brand"
              />
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-sm font-semibold text-muted-foreground">Sort by:</span>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger aria-label="Sort my books" className="h-10 w-44 bg-muted">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORTS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div aria-busy="true" className="flex flex-col gap-3 p-6 pt-0">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="px-6 pb-10 text-center">
              <p className="font-semibold text-foreground">No books match your search</p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-2 text-sm font-semibold text-brand hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <MyBooksTable books={visible} onEdit={setEditing} onDelete={setDeleting} />
          )}
        </section>
      )}

      <EditBookModal book={editing} owner={owner} onClose={() => setEditing(null)} />
      <DeleteBookModal book={deleting} onClose={() => setDeleting(null)} />
    </div>
  );
}
