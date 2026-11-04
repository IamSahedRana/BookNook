"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategorySelect } from "@/components/forms/category-select";
import { CopiesStepper } from "@/components/forms/copies-stepper";
import { FieldError } from "@/components/forms/field-error";
import { ImageUpload } from "@/components/forms/image-upload";
import { Icon } from "@/components/shared/icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { revalidateBooks } from "@/hooks/use-books";
import { ApiError } from "@/lib/api";
import { updateBook } from "@/lib/books-api";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { bookSchema, type BookValues } from "@/lib/validations";
import type { Book, BookInput } from "@/types";

type EditBookModalProps = {
  /** The book being edited. null = closed */
  book: Book | null;
  owner: { name: string; email: string } | null;
  onClose: () => void;
};

function EditForm({ book, owner, onClose }: { book: Book; owner: EditBookModalProps["owner"]; onClose: () => void }) {
  const [uploading, setUploading] = useState(false);
  // Copies that readers hold right now can't be removed
  const borrowed = book.totalCopies - book.availableCopies;
  const minCopies = Math.max(1, borrowed);

  const initial: BookValues = {
    title: book.title,
    author: book.author,
    category: book.category,
    totalCopies: book.totalCopies,
    description: book.description,
    image: book.image,
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookValues>({
    resolver: zodResolver(bookSchema),
    mode: "onTouched",
    defaultValues: initial,
  });

  async function onSubmit(values: BookValues) {
    // Send only what changed
    const changes: Partial<BookInput> = {};
    (Object.keys(initial) as Array<keyof BookValues>).forEach((key) => {
      if (values[key] !== initial[key]) (changes as Record<string, unknown>)[key] = values[key];
    });

    if (Object.keys(changes).length === 0) {
      notify.info("No changes to save", "Edit something first, or press Cancel.");
      return;
    }

    try {
      await updateBook(book._id, changes);
      notify.success("Book updated successfully!", "Your changes are now live on the shelf.");
      onClose();
    } catch (error) {
      const status = error instanceof ApiError ? error.status : 0;
      const message = error instanceof Error ? error.message : "";
      if (status === 409) {
        notify.warning("This book just changed", message);
      } else if (status === 400) {
        notify.error("Please check the form", message);
      } else if (status === 403) {
        notify.error("Not allowed", "You can only edit books that you added.");
        onClose();
      } else if (status === 404) {
        notify.error("Book not found", "This book was removed.");
        onClose();
      } else if (status === 0 && /demo mode/i.test(message)) {
        notify.warning("Demo mode is on", message);
      } else {
        notify.error("Couldn't save the changes", message || "Please try again.");
      }
    } finally {
      revalidateBooks();
    }
  }

  const busy = isSubmitting || uploading;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-title">
            Book Title <span className="text-brand">*</span>
          </Label>
          <Input
            id="edit-title"
            aria-invalid={errors.title ? true : undefined}
            className="h-12 bg-background shadow-sm"
            {...register("title")}
          />
          <FieldError message={errors.title?.message} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-author">
            Author Name <span className="text-brand">*</span>
          </Label>
          <Input
            id="edit-author"
            aria-invalid={errors.author ? true : undefined}
            className="h-12 bg-background shadow-sm"
            {...register("author")}
          />
          <FieldError message={errors.author?.message} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-category">
            Category <span className="text-brand">*</span>
          </Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => <CategorySelect id="edit-category" value={field.value} onChange={field.onChange} />}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>
            Total Copies <span className="text-brand">*</span>
          </Label>
          <Controller
            control={control}
            name="totalCopies"
            render={({ field }) => (
              <CopiesStepper value={field.value} onChange={field.onChange} min={minCopies} />
            )}
          />
          {borrowed > 0 ? (
            <p className="text-xs text-muted-foreground">
              {borrowed} {borrowed === 1 ? "copy is" : "copies are"} borrowed, so you can&apos;t go below {minCopies}.
            </p>
          ) : (
            <FieldError message={errors.totalCopies?.message} />
          )}
        </div>
      </div>

      <Controller
        control={control}
        name="image"
        render={({ field }) => (
          <ImageUpload
            replaceable
            value={field.value}
            onChange={field.onChange}
            onUploadingChange={setUploading}
            error={errors.image?.message}
            disabled={isSubmitting}
          />
        )}
      />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="edit-description">
            Short Description <span className="text-brand">*</span>
          </Label>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <span
                className={cn(
                  "text-xs font-semibold",
                  field.value.length > 500 ? "text-destructive" : "text-muted-foreground"
                )}
              >
                {field.value.length} / 500
              </span>
            )}
          />
        </div>
        <Textarea
          id="edit-description"
          rows={4}
          aria-invalid={errors.description ? true : undefined}
          className="resize-none bg-background shadow-sm"
          {...register("description")}
        />
        <FieldError message={errors.description?.message} />
      </div>

      {/* Locked owner */}
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-muted p-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <Icon name="lock" size={20} className="shrink-0 text-muted-foreground" />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold text-foreground">
              Owner: {owner?.name ?? book.userName}
            </span>
            <span className="truncate text-xs text-muted-foreground">{owner?.email ?? book.userEmail}</span>
          </div>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground italic">Locked record</span>
      </div>

      <div className="flex items-center justify-end gap-3 pt-1">
        <Button type="button" variant="secondary" disabled={isSubmitting} onClick={onClose} className="h-11 px-6">
          Cancel
        </Button>
        <Button type="submit" disabled={busy} className="h-11 gap-2 px-8 shadow-sm">
          {isSubmitting ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Saving...
            </>
          ) : uploading ? (
            "Uploading cover..."
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}

/** Edit modal: the form opens with the book's current data already filled in. */
export function EditBookModal({ book, owner, onClose }: EditBookModalProps) {
  return (
    <Dialog open={book !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="pr-8">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-brand-subtle text-brand">
              <Icon name="edit" size={18} />
            </span>
            <DialogTitle>Edit Book</DialogTitle>
          </div>
          <DialogDescription className="sr-only">Change the details of {book?.title}</DialogDescription>
        </DialogHeader>
        {/* Mounted per book, so the form always starts from that book's data */}
        {book && <EditForm key={book._id} book={book} owner={owner} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}
