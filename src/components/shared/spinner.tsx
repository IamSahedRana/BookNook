import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block size-10 animate-spin rounded-full border-4 border-muted border-t-brand",
        className
      )}
    />
  );
}
