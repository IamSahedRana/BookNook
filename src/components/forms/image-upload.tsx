"use client";

import { useId, useRef, useState } from "react";
import { BookCover } from "@/components/books/book-cover";
import { Icon } from "@/components/shared/icon";
import { MAX_IMAGE_MB, uploadToImgbb, validateImageFile } from "@/lib/imgbb";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";

type ImageUploadProps = {
  /** Link of the uploaded image ("" = nothing uploaded yet) */
  value: string;
  onChange: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
  error?: string;
  disabled?: boolean;
  /** Edit mode: shows a "Change Image" button instead of a trash button */
  replaceable?: boolean;
};

type UploadInfo = { name: string; size: number };

const formatSize = (bytes: number) =>
  bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/** Drag and drop (or click) a cover. It is uploaded to imgbb right away and we keep its link. */
export function ImageUpload({ value, onChange, onUploadingChange, error, disabled, replaceable }: ImageUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [info, setInfo] = useState<UploadInfo | null>(null);
  const [dragging, setDragging] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file || disabled) return;

    const problem = validateImageFile(file);
    if (problem) {
      notify.error("Can't use that image", problem);
      return;
    }

    setInfo({ name: file.name, size: file.size });
    setProgress(0);
    setUploading(true);
    onUploadingChange?.(true);

    try {
      const url = await uploadToImgbb(file, setProgress);
      onChange(url);
    } catch (e) {
      setInfo(null);
      if (!replaceable) onChange(""); // when replacing, the old cover stays
      notify.error("Upload failed", e instanceof Error ? e.message : "Please try again.");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
      if (inputRef.current) inputRef.current.value = ""; // allow choosing the same file again
    }
  }

  function remove() {
    setInfo(null);
    onChange("");
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">
          Book Cover Art <span className="text-brand">*</span>
        </span>
        {error && (
          <span role="alert" className="flex items-center gap-1 text-xs font-semibold text-destructive">
            <Icon name="error" size={14} />
            {error}
          </span>
        )}
      </div>

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="peer sr-only"
        aria-label="Upload book cover"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {!value && !uploading && (
        <label
          htmlFor={inputId}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            "group relative flex min-h-[170px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed bg-background p-6 text-center transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand hover:bg-muted",
            dragging ? "border-brand bg-brand-subtle" : error ? "border-destructive/60" : "border-border",
            disabled && "pointer-events-none opacity-60"
          )}
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-brand-subtle group-hover:text-brand">
            <Icon name="cloud_upload" size={26} />
          </span>
          <span className="flex flex-col items-center">
            <span className="font-semibold text-foreground">Click to upload (JPG, PNG)</span>
            <span className="mt-0.5 text-xs text-muted-foreground">
              or drag and drop your book cover here, up to {MAX_IMAGE_MB}MB
            </span>
          </span>
        </label>
      )}

      {uploading && (
        <div role="status" className="flex flex-col gap-2 rounded-2xl bg-background p-4 shadow-sm">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-semibold text-foreground">
              <Icon name="progress_activity" size={18} className="animate-spin text-brand" />
              Uploading cover art...
            </span>
            <span className="font-bold text-brand">{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-brand transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {info && (
            <p className="truncate text-xs text-muted-foreground">
              {info.name} ({formatSize(info.size)})
            </p>
          )}
        </div>
      )}

      {value && !uploading && (
        <div className="flex items-center gap-3 rounded-2xl bg-background p-3 shadow-sm">
          <div className="relative h-[85px] w-16 shrink-0 overflow-hidden rounded-xl bg-muted shadow-sm">
            <BookCover src={value} title="Uploaded cover" sizes="64px" />
            <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-brand text-white">
              <Icon name="check" size={11} />
            </span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-semibold text-foreground">
                {info?.name ?? "Book cover"}
              </span>
              {info && (
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                  Uploaded
                </span>
              )}
            </div>
            {info && <span className="text-xs text-muted-foreground">{formatSize(info.size)}</span>}
            <span className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-brand">
              <Icon name="verified" size={13} />
              {info ? "Saved to imgbb" : "Current cover"}
            </span>
          </div>
          {replaceable ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
              className="h-9 shrink-0 rounded-full bg-muted px-4 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
            >
              Change Image
            </button>
          ) : (
            <button
              type="button"
              aria-label="Remove uploaded book cover"
              onClick={remove}
              disabled={disabled}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-red-100 hover:text-destructive dark:hover:bg-red-950"
            >
              <Icon name="delete" size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
