"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/shared/icon";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { useBooks } from "@/hooks/use-books";
import { BookFilters, type CategoryFilter } from "./book-filters";
import { BookGrid, BookGridSkeleton } from "./book-grid";

type BooksViewProps = {
  initialQuery?: string;
  initialCategory?: CategoryFilter;
};

export function BooksView({ initialQuery = "", initialCategory = "All" }: BooksViewProps) {
  const { books, isLoading, error, mutate } = useBooks();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<CategoryFilter>(initialCategory);

  // Search and category filtering happen in the browser (the API has no search route)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((book) => {
      const matchesCategory = category === "All" || book.category === category;
      const matchesQuery =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [books, query, category]);

  function clearFilters() {
    setQuery("");
    setCategory("All");
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-16 sm:px-8">
      <PageHeader
        title="All Books"
        description="Browse every book shared by our readers."
        badge="Community Catalog"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "All Books" }]}
        aside={
          !isLoading && !error ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm">
              <Icon name="local_library" size={20} className="text-brand" />
              {filtered.length} {filtered.length === 1 ? "book" : "books"} on the shelves
            </span>
          ) : undefined
        }
      />

      <BookFilters
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
      />

      {isLoading ? (
        <div aria-busy="true">
          <div className="flex flex-col items-center py-8 text-center">
            <Spinner className="mb-4 size-12" />
            <p className="font-semibold text-foreground">Fetching the library shelves...</p>
          </div>
          <BookGridSkeleton count={6} />
        </div>
      ) : error ? (
        <ErrorState
          title="Couldn't load the books"
          message={error.message}
          onRetry={() => mutate()}
        />
      ) : books.length === 0 ? (
        <EmptyState
          title="No books yet"
          description="The shelves are empty. Be the first to add a book to BookNook."
          action={
            <Button asChild>
              <Link href="/add-book">Add a Book</Link>
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="search_off"
          title="No books found"
          description="No books match your search. Try another keyword or reset the filters."
          action={
            <Button variant="secondary" onClick={clearFilters} className="gap-2">
              <Icon name="restart_alt" size={18} />
              Clear Search Filters
            </Button>
          }
        />
      ) : (
        <BookGrid books={filtered} />
      )}

      {/* Invite readers to add their own books */}
      <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-3xl bg-muted p-6 md:flex-row md:p-8">
        <div className="flex items-center gap-5">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-sm">
            <Icon name="library_add" size={28} />
          </span>
          <div>
            <h4 className="text-lg font-bold text-foreground">Got an unread book at home?</h4>
            <p className="text-sm text-muted-foreground">
              Add it to BookNook and let other readers borrow it.
            </p>
          </div>
        </div>
        <Button asChild variant="inverted" className="shrink-0 gap-2">
          <Link href="/add-book">
            Add a Book
            <Icon name="arrow_forward" size={18} />
          </Link>
        </Button>
      </div>
    </div>
  );
}
