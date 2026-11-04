"use client";

import Link from "next/link";
import { BookCover } from "@/components/books/book-cover";
import { Icon } from "@/components/shared/icon";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDueStatus } from "@/lib/borrow-status";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Book, Borrow } from "@/types";

type BorrowsTableProps = {
  borrows: Borrow[];
  /** Used to show author and category (the borrow record only stores title and cover) */
  bookById: Map<string, Book>;
  now: number;
  onReturn: (borrow: Borrow) => void;
};

function DueBadge({ returnDate, now }: { returnDate: string; now: number }) {
  const due = getDueStatus(returnDate, now);
  return (
    <span
      data-testid="due-badge"
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        due.dueSoon ? "bg-red-100 text-destructive dark:bg-red-950" : "bg-muted text-muted-foreground"
      )}
    >
      <Icon name="timer" size={14} />
      {due.label}
    </span>
  );
}

function ReturnButton({ borrow, onReturn }: { borrow: Borrow; onReturn: (b: Borrow) => void }) {
  return (
    <Button size="sm" onClick={() => onReturn(borrow)} aria-label={`Return ${borrow.bookTitle}`} className="h-10 gap-1.5 px-5">
      <Icon name="keyboard_return" size={18} />
      Return Book
    </Button>
  );
}

export function BorrowsTable({ borrows, bookById, now, onReturn }: BorrowsTableProps) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="w-24 rounded-l-full pl-4">Book</TableHead>
              <TableHead>Title &amp; Author</TableHead>
              <TableHead>Borrowed On</TableHead>
              <TableHead>Return Target</TableHead>
              <TableHead className="rounded-r-full pr-4 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {borrows.map((borrow) => {
              const book = bookById.get(borrow.bookId);
              return (
                <TableRow key={borrow._id} data-testid="borrow-row" className="border-0">
                  <TableCell className="py-4 pl-4">
                    <div className="relative h-[70px] w-[52px] overflow-hidden rounded-lg bg-muted shadow-sm">
                      <BookCover src={borrow.bookImage} title={borrow.bookTitle} sizes="52px" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {book ? (
                        <Link href={`/books/${borrow.bookId}`} className="font-bold text-foreground transition-colors hover:text-brand">
                          {borrow.bookTitle}
                        </Link>
                      ) : (
                        <span className="font-bold text-foreground">{borrow.bookTitle}</span>
                      )}
                      {book && <span className="text-sm text-muted-foreground">{book.author}</span>}
                      {book && (
                        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                          <span className="size-1.5 rounded-full bg-brand" />
                          {book.category}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2 text-sm text-foreground">
                      <Icon name="calendar_month" size={18} className="text-muted-foreground" />
                      {formatDate(borrow.borrowDate)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-foreground">{formatDate(borrow.returnDate)}</span>
                      <DueBadge returnDate={borrow.returnDate} now={now} />
                    </div>
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    <ReturnButton borrow={borrow} onReturn={onReturn} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: equal cards */}
      <div className="flex flex-col gap-4 md:hidden">
        {borrows.map((borrow) => {
          const book = bookById.get(borrow.bookId);
          return (
            <div key={borrow._id} data-testid="borrow-card" className="flex flex-col gap-3 rounded-2xl bg-muted/60 p-4">
              <div className="flex items-start gap-3">
                <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-muted shadow-sm">
                  <BookCover src={borrow.bookImage} title={borrow.bookTitle} sizes="56px" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate font-bold text-foreground">{borrow.bookTitle}</span>
                  {book && <span className="truncate text-sm text-muted-foreground">{book.author}</span>}
                  <span className="mt-1 text-xs text-muted-foreground">Borrowed {formatDate(borrow.borrowDate)}</span>
                  <span className="text-xs font-semibold text-foreground">Return by {formatDate(borrow.returnDate)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <DueBadge returnDate={borrow.returnDate} now={now} />
                <ReturnButton borrow={borrow} onReturn={onReturn} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
