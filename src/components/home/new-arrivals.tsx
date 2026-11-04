"use client";

import Link from "next/link";
import { BookGrid, BookGridSkeleton } from "@/components/books/book-grid";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Icon } from "@/components/shared/icon";
import { Button } from "@/components/ui/button";
import { useBooks } from "@/hooks/use-books";

export function NewArrivals() {
  // Server does the work: sort by newest first, limit 6
  const { books, isLoading, error, mutate } = useBooks({ sort: "latest", limit: 6 });

  return (
    <section id="new-arrivals" className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-8">
      <div className="mb-8 flex flex-col justify-between border-b border-border pb-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            New Arrivals
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The latest 6 books added by our community readers.
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2 sm:mt-0">
          <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Sorted by:
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">
            Newest First
          </span>
        </div>
      </div>

      {isLoading ? (
        <div aria-busy="true">
          <BookGridSkeleton count={6} />
        </div>
      ) : error ? (
        <ErrorState
          title="Couldn't load new arrivals"
          message={error.message}
          onRetry={() => mutate()}
        />
      ) : books.length === 0 ? (
        <EmptyState
          title="No books yet"
          description="Be the first to add a book to BookNook."
          action={
            <Button asChild>
              <Link href="/add-book">Add a Book</Link>
            </Button>
          }
        />
      ) : (
        <BookGrid books={books} />
      )}

      <div className="mt-12 text-center">
        <Button asChild variant="inverted" size="lg" className="group gap-2.5 px-8 hover:bg-brand hover:text-white">
          <Link href="/books">
            See All Books
            <Icon
              name="arrow_forward"
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </Button>
      </div>
    </section>
  );
}
