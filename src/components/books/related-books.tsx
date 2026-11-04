"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Icon } from "@/components/shared/icon";
import { useBooks } from "@/hooks/use-books";
import type { Book } from "@/types";
import { BookGrid, BookGridSkeleton } from "./book-grid";

/** 3 other books: same category first, then the newest ones. */
export function RelatedBooks({ book }: { book: Book }) {
  const { books, isLoading, error } = useBooks();

  const related = useMemo(() => {
    const others = books.filter((b) => b._id !== book._id);
    const sameCategory = others.filter((b) => b.category === book.category);
    const rest = others.filter((b) => b.category !== book.category);
    return [...sameCategory, ...rest].slice(0, 3);
  }, [books, book]);

  if (error || (!isLoading && related.length === 0)) return null;

  return (
    <section className="mt-12 flex flex-col gap-6 pt-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">You May Also Like</h2>
          <Link
            href="/books"
            className="flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
          >
            Explore catalog
            <Icon name="arrow_forward" size={18} />
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          More reads from the shelves, starting with {book.category.toLowerCase()} books.
        </p>
      </div>

      {isLoading ? <BookGridSkeleton count={3} /> : <BookGrid books={related} />}
    </section>
  );
}
