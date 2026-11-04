"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { revalidateBooks } from "@/hooks/use-books";
import { revalidateBorrows } from "@/hooks/use-borrows";
import { ApiError } from "@/lib/api";
import { borrowBook } from "@/lib/books-api";
import { LOAN_DAYS } from "@/lib/constants";
import { addDays, formatDate } from "@/lib/format";
import { notify } from "@/lib/toast";
import type { Book, SessionUser } from "@/types";
import { BookCover } from "./book-cover";

type BorrowModalProps = {
  book: Book;
  user: SessionUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Turns what the server said into the toasts from the design. */
function toastForError(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  const status = error instanceof ApiError ? error.status : 0;

  if (status === 409 && /already borrowed/i.test(message)) {
    notify.error("Already borrowed this book", "Check your current loans in My Borrows.");
    return "close" as const;
  }
  if (status === 409) {
    notify.error("Book not available right now", "All copies are currently on loan. Please check back soon.");
    return "close" as const;
  }
  if (status === 404) {
    notify.error("Book not found", "This book may have been removed by its owner.");
    return "close" as const;
  }
  if (status === 401) {
    notify.error("Session expired", "Please log in again to borrow this book.");
    return "keep" as const;
  }
  if (status === 0 && /demo mode/i.test(message)) {
    notify.warning("Demo mode is on", message);
    return "keep" as const;
  }
  notify.error("Couldn't borrow this book", message || "Something went wrong. Please try again.");
  return "keep" as const;
}

function ModalBody({ book, user, onOpenChange }: Omit<BorrowModalProps, "open">) {
  const [submitting, setSubmitting] = useState(false);
  // The server decides the real dates; this is the same rule shown up front.
  const [today] = useState(() => new Date());
  const dueDate = addDays(today, LOAN_DAYS);

  async function confirm() {
    setSubmitting(true);
    try {
      const borrow = await borrowBook(book._id);
      onOpenChange(false);
      notify.success("Book borrowed successfully!", `Please return it by ${formatDate(borrow.returnDate)}.`);
    } catch (error) {
      if (toastForError(error) === "close") onOpenChange(false);
    } finally {
      setSubmitting(false);
      // Always refresh: copies and "already borrowed" may have changed
      revalidateBooks();
      revalidateBorrows();
    }
  }

  return (
    <>
      <DialogHeader className="pr-8">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-brand text-white">
            <Icon name="bookmark_add" size={18} />
          </span>
          <DialogTitle>Borrow This Book</DialogTitle>
        </div>
        <DialogDescription className="sr-only">
          Confirm that you want to borrow {book.title} for {LOAN_DAYS} days.
        </DialogDescription>
      </DialogHeader>

      {/* Mini book card */}
      <div className="flex items-center gap-4 rounded-2xl bg-muted p-3.5">
        <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-md bg-background shadow-sm">
          <BookCover src={book.image} title={book.title} sizes="56px" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="rounded-full bg-background px-2 py-0.5 text-xs font-semibold text-foreground">
            {book.category}
          </span>
          <h4 className="mt-1 truncate font-bold text-foreground">{book.title}</h4>
          <p className="truncate text-sm text-muted-foreground">by {book.author}</p>
        </div>
      </div>

      {/* Read-only reader details */}
      <div className="flex flex-col gap-4">
        {(["Reader Name", "Reader Email"] as const).map((label, index) => (
          <div key={label} className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">{label}</Label>
            <div className="relative">
              <Icon name="lock" size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                readOnly
                tabIndex={-1}
                aria-label={label}
                value={index === 0 ? user.name : user.email}
                className="h-12 cursor-not-allowed pl-11 font-medium"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Loan schedule */}
      <div className="flex flex-col gap-2 rounded-2xl bg-muted p-4 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Icon name="calendar_today" size={18} className="text-brand" />
            Borrow Date
          </span>
          <span className="font-semibold text-foreground">Today, {formatDate(today)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2 text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Icon name="event_available" size={18} className="text-emerald-600" />
            Return Date
          </span>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {formatDate(dueDate)} ({LOAN_DAYS} days)
          </span>
        </div>
        <p className="text-xs text-muted-foreground">Set automatically. You can return the book any time before.</p>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="secondary" disabled={submitting} onClick={() => onOpenChange(false)} className="h-11 px-6">
          Cancel
        </Button>
        <Button type="button" disabled={submitting} onClick={confirm} className="h-11 gap-2 px-8 shadow-sm">
          {submitting ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Borrowing...
            </>
          ) : (
            <>
              <Icon name="check" size={18} />
              Confirm Borrow
            </>
          )}
        </Button>
      </div>
    </>
  );
}

export function BorrowModal({ book, user, open, onOpenChange }: BorrowModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* The body mounts when opened, so "today" is always fresh */}
      <DialogContent className="max-w-lg">
        <ModalBody book={book} user={user} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}
