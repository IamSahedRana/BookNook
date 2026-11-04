import Link from "next/link";
import { Icon } from "@/components/shared/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Book } from "@/types";
import { BookCover } from "./book-cover";

type BookCardProps = {
  book: Book;
  priority?: boolean;
};

export function BookCard({ book, priority }: BookCardProps) {
  const available = book.availableCopies > 0;
  const href = `/books/${book._id}`;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-3.5 shadow-sm transition-all duration-200 hover:shadow-lg">
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="relative mb-4 block aspect-[3/4] w-full shrink-0 overflow-hidden rounded-xl bg-muted"
      >
        <BookCover
          src={book.image}
          title={book.title}
          priority={priority}
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 95vw"
          className={cn(
            "transition-transform duration-300 group-hover:scale-105",
            !available && "grayscale-[35%]"
          )}
        />
        <span className="absolute top-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur-md">
          {book.category}
        </span>
        {!available && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground shadow-sm">
            <span className="size-2 rounded-full bg-muted-foreground" />
            Not Available
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col">
        <h3 className="line-clamp-1 text-lg leading-snug font-bold text-foreground transition-colors group-hover:text-brand">
          <Link href={href}>{book.title}</Link>
        </h3>
        <p className="mt-0.5 line-clamp-1 text-sm font-medium text-muted-foreground">
          by {book.author}
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <span
            className={cn(
              "size-2 rounded-full",
              available ? "bg-emerald-500" : "bg-muted-foreground/60"
            )}
          />
          {available
            ? `${book.availableCopies} of ${book.totalCopies} copies available`
            : "All copies are borrowed"}
        </p>

        <div className="mt-auto pt-4">
          <Button asChild className="h-11 w-full gap-1.5">
            <Link href={href}>
              View Details
              <Icon name="arrow_forward" size={18} />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
