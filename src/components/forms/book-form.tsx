"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@/components/shared/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { bookSchema, type BookValues } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { CategorySelect } from "./category-select";
import { CopiesStepper } from "./copies-stepper";
import { FieldError } from "./field-error";
import { ImageUpload } from "./image-upload";

type BookFormProps = {
  owner: { name: string; email: string } | null;
  initialValues?: Partial<BookValues>;
  submitLabel: string;
  onSubmit: (values: BookValues) => Promise<void>;
};

const EMPTY: BookValues = {
  title: "",
  author: "",
  category: "Fiction",
  totalCopies: 1,
  description: "",
  image: "",
};

/** Shared by Add Book and (later) Edit Book. */
export function BookForm({ owner, initialValues, submitLabel, onSubmit }: BookFormProps) {
  const [uploading, setUploading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookValues>({
    resolver: zodResolver(bookSchema),
    mode: "onTouched",
    defaultValues: { ...EMPTY, ...initialValues },
  });

  const busy = isSubmitting || uploading;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12"
    >
      {/* LEFT: book details */}
      <div className="flex flex-col gap-6 lg:col-span-7">
        <div className="flex items-center justify-between pb-2">
          <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Icon name="menu_book" size={24} className="text-brand" />
            Book Details
          </h2>
          <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Step 1 of 2</span>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="title">
              Book Title <span className="text-brand">*</span>
            </Label>
            <FieldError message={errors.title?.message} />
          </div>
          <div className="relative flex items-center">
            <Icon name="auto_stories" size={20} className="pointer-events-none absolute left-4 text-muted-foreground" />
            <Input
              id="title"
              placeholder="e.g. The Midnight Library"
              aria-invalid={errors.title ? true : undefined}
              className="h-12 bg-background pl-12 shadow-sm"
              {...register("title")}
            />
          </div>
        </div>

        {/* Author */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="author">
              Author Name <span className="text-brand">*</span>
            </Label>
            <FieldError message={errors.author?.message} />
          </div>
          <div className="relative flex items-center">
            <Icon name="draw" size={20} className="pointer-events-none absolute left-4 text-muted-foreground" />
            <Input
              id="author"
              placeholder="e.g. Matt Haig"
              aria-invalid={errors.author ? true : undefined}
              className="h-12 bg-background pl-12 shadow-sm"
              {...register("author")}
            />
          </div>
        </div>

        {/* Category + Total copies */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category">
              Category <span className="text-brand">*</span>
            </Label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <CategorySelect id="category" value={field.value} onChange={field.onChange} />
              )}
            />
            <FieldError message={errors.category?.message} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Total Copies</Label>
            <Controller
              control={control}
              name="totalCopies"
              render={({ field }) => <CopiesStepper value={field.value} onChange={field.onChange} />}
            />
            <FieldError message={errors.totalCopies?.message} />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="description">
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
                  {field.value.length} / 500 characters
                </span>
              )}
            />
          </div>
          <Textarea
            id="description"
            rows={5}
            placeholder="Write a brief description to help readers discover this book..."
            aria-invalid={errors.description ? true : undefined}
            className="resize-none bg-background shadow-sm"
            {...register("description")}
          />
          <FieldError message={errors.description?.message} />
        </div>
      </div>

      {/* RIGHT: cover + owner */}
      <div className="flex flex-col gap-6 lg:col-span-5">
        <div className="flex items-center justify-between pb-2">
          <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Icon name="image" size={24} className="text-brand" />
            Cover Art &amp; Lender
          </h2>
          <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Step 2 of 2</span>
        </div>

        <Controller
          control={control}
          name="image"
          render={({ field }) => (
            <ImageUpload
              value={field.value}
              onChange={field.onChange}
              onUploadingChange={setUploading}
              error={errors.image?.message}
              disabled={isSubmitting}
            />
          )}
        />

        <div className="flex flex-col gap-4 rounded-2xl bg-background p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Icon name="badge" size={16} />
            </span>
            <span className="text-sm font-bold text-foreground">Lender Information (auto-filled)</span>
          </div>

          {(["Registered Patron", "Patron Contact"] as const).map((label, index) => (
            <div key={label} className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">{label}</Label>
              <div className="relative flex items-center">
                <Icon name="lock" size={18} className="pointer-events-none absolute left-3.5 text-muted-foreground" />
                <Input
                  readOnly
                  tabIndex={-1}
                  aria-label={index === 0 ? "Your name" : "Your email"}
                  value={owner ? (index === 0 ? owner.name : owner.email) : "Loading..."}
                  className="h-11 cursor-not-allowed pl-10 text-muted-foreground"
                />
              </div>
            </div>
          ))}

          <div className="flex items-start gap-2 pt-1 text-xs leading-relaxed text-muted-foreground">
            <Icon name="info" size={16} className="mt-0.5 shrink-0" />
            <p>Your name and email will be shown on this book so readers know who shared it.</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse items-center justify-end gap-3 pt-2 sm:flex-row lg:col-span-12">
        <Button
          type="button"
          variant="secondary"
          disabled={busy}
          onClick={() => reset({ ...EMPTY, ...initialValues })}
          className="h-11 w-full px-8 sm:w-auto"
        >
          Reset Form
        </Button>
        <Button type="submit" disabled={busy || !owner} className="h-11 w-full gap-2 px-10 shadow-md sm:w-auto">
          {isSubmitting ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Saving...
            </>
          ) : uploading ? (
            "Uploading cover..."
          ) : (
            <>
              {submitLabel}
              <Icon name="arrow_forward" size={18} />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
