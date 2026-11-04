import { Skeleton } from "@/components/ui/skeleton";

export function BookCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex h-full flex-col rounded-2xl border border-border bg-card p-3.5 shadow-sm"
    >
      <Skeleton className="mb-4 aspect-[3/4] w-full rounded-xl" />
      <Skeleton className="h-6 w-3/4 rounded-full" />
      <Skeleton className="mt-2 h-4 w-1/2 rounded-full" />
      <Skeleton className="mt-3 h-3 w-2/5 rounded-full" />
      <Skeleton className="mt-6 h-11 w-full rounded-full" />
    </div>
  );
}
