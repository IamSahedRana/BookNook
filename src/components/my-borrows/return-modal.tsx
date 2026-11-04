"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/icon";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { revalidateBooks } from "@/hooks/use-books";
import { revalidateBorrows } from "@/hooks/use-borrows";
import { ApiError } from "@/lib/api";
import { returnBook } from "@/lib/books-api";
import { notify } from "@/lib/toast";
import type { Book, Borrow } from "@/types";

type ReturnModalProps = {
  /** The borrow being returned. null = closed */
  borrow: Borrow | null;
  /** The book it belongs to (for author and copy counts), if it still exists */
  book?: Book;
  onClose: () => void;
};

/** Custom "Return this book?" confirm, with the copy counts before and after. */
export function ReturnModal({ borrow, book, onClose }: ReturnModalProps) {
  const [returning, setReturning] = useState(false);

  async function confirm() {
    if (!borrow) return;
    setReturning(true);
    try {
      await returnBook(borrow._id);
      const after = book ? Math.min(book.totalCopies, book.availableCopies + 1) : null;
      notify.success(
        "Book returned successfully!",
        book && after !== null
          ? `Thank you! "${borrow.bookTitle}" is back on the shelf: ${after} of ${book.totalCopies} copies available.`
          : `Thank you! "${borrow.bookTitle}" is back on the shelf.`
      );
      onClose();
    } catch (error) {
      const status = error instanceof ApiError ? error.status : 0;
      const message = error instanceof Error ? error.message : "";
      if (status === 404) {
        notify.info("Already returned", "This book was already returned.");
        onClose();
      } else if (status === 0 && /demo mode/i.test(message)) {
        notify.warning("Demo mode is on", message);
      } else {
        notify.error("Couldn't return the book", message || "Please try again.");
      }
    } finally {
      setReturning(false);
      revalidateBorrows();
      revalidateBooks(); // copy counts everywhere
    }
  }

  const available = book?.availableCopies;
  const total = book?.totalCopies;

  return (
    <AlertDialog open={borrow !== null} onOpenChange={(open) => !open && !returning && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-destructive dark:bg-red-950">
              <Icon name="assignment_return" size={26} />
            </span>
            <div className="text-left">
              <AlertDialogTitle>Return this book?</AlertDialogTitle>
              <span className="mt-0.5 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Reader action
              </span>
            </div>
          </div>
          <AlertDialogDescription asChild>
            <div className="flex flex-col gap-3 rounded-2xl bg-muted p-4 text-left text-sm">
              <p className="text-foreground">
                Are you ready to return <strong className="font-semibold text-brand">{borrow?.bookTitle}</strong>
                {book ? <> by {book.author}</> : null}?
              </p>
              <div className="flex items-start gap-2 border-t border-border pt-3 text-muted-foreground">
                <Icon name="inventory_2" size={18} className="mt-0.5 shrink-0 text-brand" />
                <span>
                  This puts the copy straight back on the shelf for the next reader.
                  {available !== undefined && total !== undefined && (
                    <>
                      {" "}
                      Copies available:{" "}
                      <strong className="text-foreground" data-testid="copies-before-after">
                        {available} of {total}
                      </strong>{" "}
                      now, <strong className="text-foreground">{Math.min(total, available + 1)} of {total}</strong> after
                      you return it.
                    </>
                  )}
                </span>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={returning} className="h-11 px-6">
            Cancel
          </AlertDialogCancel>
          <Button type="button" onClick={confirm} disabled={returning} className="h-11 gap-2 px-7 shadow-md">
            {returning ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Returning...
              </>
            ) : (
              <>
                Yes, Return
                <Icon name="done" size={18} />
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
