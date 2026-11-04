"use client";

import Link from "next/link";
import { BookCover } from "@/components/books/book-cover";
import { Icon } from "@/components/shared/icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Book } from "@/types";

type MyBooksTableProps = {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
};

function Inventory({ book, compact }: { book: Book; compact?: boolean }) {
  const loaned = book.totalCopies - book.availableCopies;
  const percent = Math.round((book.availableCopies / book.totalCopies) * 100);

  return (
    <div className={cn("flex flex-col gap-1.5", !compact && "max-w-[150px]")}>
      <div className="flex items-center justify-between text-sm">
        <span data-testid="inventory" className="font-semibold text-foreground">
          {book.availableCopies} / {book.totalCopies}
          <span className="ml-1 text-xs font-medium text-muted-foreground">available</span>
        </span>
        <span className={cn("text-xs font-medium", loaned > 0 ? "text-brand" : "text-muted-foreground")}>
          {loaned > 0 ? `${loaned} loaned` : "all free"}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function ActionButtons({ book, onEdit, onDelete, size = 36 }: { book: Book } & Omit<MyBooksTableProps, "books"> & { size?: number }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        aria-label={`Edit ${book.title}`}
        title="Edit book"
        onClick={() => onEdit(book)}
        style={{ width: size, height: size }}
        className="flex items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-accent"
      >
        <Icon name="edit" size={18} />
      </button>
      <button
        type="button"
        aria-label={`Delete ${book.title}`}
        title="Delete book"
        onClick={() => onDelete(book)}
        style={{ width: size, height: size }}
        className="flex items-center justify-center rounded-full bg-brand-subtle text-brand transition-colors hover:bg-red-200 dark:hover:bg-red-900"
      >
        <Icon name="delete" size={18} />
      </button>
    </div>
  );
}

export function MyBooksTable({ books, onEdit, onDelete }: MyBooksTableProps) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="pl-6">Book</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Inventory &amp; Copies</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book._id} data-testid="book-row" className="group border-0">
                <TableCell className="py-4 pl-6">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-muted shadow-sm">
                      <BookCover src={book.image} title={book.title} sizes="48px" />
                    </div>
                    <Link
                      href={`/books/${book._id}`}
                      className="min-w-0 max-w-[260px] truncate font-semibold text-foreground transition-colors hover:text-brand"
                    >
                      {book.title}
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-medium text-muted-foreground">{book.author}</TableCell>
                <TableCell>
                  <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
                    {book.category}
                  </span>
                </TableCell>
                <TableCell>
                  <Inventory book={book} />
                </TableCell>
                <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
                  {formatDate(book.addedAt)}
                </TableCell>
                <TableCell className="pr-6">
                  <ActionButtons book={book} onEdit={onEdit} onDelete={onDelete} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile and tablet: equal cards */}
      <div className="flex flex-col gap-4 p-4 lg:hidden">
        {books.map((book) => (
          <div key={book._id} data-testid="book-card" className="flex flex-col gap-3 rounded-2xl bg-muted/60 p-4">
            <div className="flex items-start gap-3">
              <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-muted shadow-sm">
                <BookCover src={book.image} title={book.title} sizes="56px" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/books/${book._id}`} className="truncate font-semibold text-foreground">
                    {book.title}
                  </Link>
                  <span className="shrink-0 rounded-full bg-background px-2 py-0.5 text-xs font-medium text-foreground">
                    {book.category}
                  </span>
                </div>
                <span className="truncate text-sm text-muted-foreground">{book.author}</span>
                <span className="mt-1 text-xs text-muted-foreground">Added {formatDate(book.addedAt)}</span>
              </div>
            </div>
            <div className="flex items-end justify-between gap-4 pt-1">
              <div className="flex-1">
                <Inventory book={book} compact />
              </div>
              <ActionButtons book={book} onEdit={onEdit} onDelete={onDelete} size={32} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
