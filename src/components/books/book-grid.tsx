import { Reveal } from "@/components/shared/motion-wrapper";
import type { Book } from "@/types";
import { BookCard } from "./book-card";
import { BookCardSkeleton } from "./book-card-skeleton";

const GRID = "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 sm:gap-8";

/** 3 cards per row on desktop, 2 on tablet, 1 on mobile. */
export function BookGrid({ books }: { books: Book[] }) {
  return (
    <div className={GRID}>
      {books.map((book, index) => (
        <Reveal key={book._id} className="h-full" delay={(index % 3) * 0.08} y={20}>
          <BookCard book={book} priority={index < 3} />
        </Reveal>
      ))}
    </div>
  );
}

export function BookGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className={GRID}>
      {Array.from({ length: count }, (_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}
