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
import { ApiError } from "@/lib/api";
import { deleteBook } from "@/lib/books-api";
import { notify } from "@/lib/toast";
import type { Book } from "@/types";

type DeleteBookModalProps = {
  /** The book to delete. null = closed */
  book: Book | null;
  onClose: () => void;
};

/** Custom confirm modal (not the browser's confirm()). */
export function DeleteBookModal({ book, onClose }: DeleteBookModalProps) {
  const [deleting, setDeleting] = useState(false);
  const borrowed = book ? book.totalCopies - book.availableCopies : 0;
  const blocked = borrowed > 0;

  async function confirm() {
    if (!book) return;
    setDeleting(true);
    try {
      await deleteBook(book._id);
      notify.success("Book deleted successfully!", `"${book.title}" was removed from BookNook.`);
      onClose();
    } catch (error) {
      const status = error instanceof ApiError ? error.status : 0;
      if (status === 404) {
        notify.info("Already removed", "This book was already deleted.");
        onClose();
      } else if (status === 409) {
        notify.error("Can't delete this book yet", error instanceof Error ? error.message : undefined);
      } else if (status === 0 && error instanceof Error && /demo mode/i.test(error.message)) {
        notify.warning("Demo mode is on", error.message);
      } else {
        notify.error("Couldn't delete the book", error instanceof Error ? error.message : "Please try again.");
      }
    } finally {
      setDeleting(false);
      revalidateBooks(); // the list (and copy counts) reflect the real database
    }
  }

  return (
    <AlertDialog open={book !== null} onOpenChange={(open) => !open && !deleting && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center">
          <span className="mb-2 flex size-14 items-center justify-center rounded-full bg-red-100 text-destructive dark:bg-red-950">
            <Icon name="warning" size={32} />
          </span>
          <AlertDialogTitle className="text-center">Delete this book?</AlertDialogTitle>
          <AlertDialogDescription className="text-center leading-relaxed">
            This will permanently remove{" "}
            <span className="font-semibold text-foreground">&quot;{book?.title}&quot;</span> from BookNook. This
            action can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {blocked && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-2xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200"
          >
            <Icon name="info" size={18} className="mt-0.5 shrink-0" />
            <p>
              <strong>
                {borrowed} {borrowed === 1 ? "copy is" : "copies are"} borrowed right now.
              </strong>{" "}
              You can delete this book after {borrowed === 1 ? "it is" : "they are"} returned.
            </p>
          </div>
        )}

        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel disabled={deleting} className="h-11 flex-1 sm:max-w-40">
            Cancel
          </AlertDialogCancel>
          <Button
            type="button"
            onClick={confirm}
            disabled={deleting || blocked}
            className="h-11 flex-1 gap-2 sm:max-w-40"
          >
            {deleting ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Deleting...
              </>
            ) : (
              "Yes, Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
