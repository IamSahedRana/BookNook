import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";

type BorrowStatsProps = {
  borrowed: number;
  dueSoon: number;
  loading?: boolean;
};

function Num({ children, className, loading }: { children: React.ReactNode; className?: string; loading?: boolean }) {
  return (
    <span data-testid="stat-value" className={cn("text-5xl leading-none font-extrabold", className)}>
      {loading ? <span className="inline-block h-10 w-12 animate-pulse rounded-xl bg-muted align-middle" /> : children}
    </span>
  );
}

/** "Currently Borrowed" and "Due Soon" */
export function BorrowStats({ borrowed, dueSoon, loading }: BorrowStatsProps) {
  return (
    <section aria-label="Borrowing overview" className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="flex items-center justify-between gap-4 rounded-3xl bg-muted p-6 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Currently Borrowed
          </span>
          <div className="flex items-baseline gap-2">
            <Num loading={loading} className="text-foreground">{borrowed}</Num>
            <span className="text-sm text-muted-foreground">{borrowed === 1 ? "book" : "books"} in your hands</span>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Icon name="schedule" size={16} className="text-brand" />
            Every book is free for 7 days
          </p>
        </div>
        <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-card text-brand shadow-inner">
          <Icon name="auto_stories" size={32} />
        </span>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-3xl bg-muted p-6 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-xs font-semibold tracking-wider uppercase",
                dueSoon > 0 ? "text-destructive" : "text-muted-foreground"
              )}
            >
              Due Soon
            </span>
            {dueSoon > 0 && <span className="size-2 animate-ping rounded-full bg-destructive" />}
          </div>
          <div className="flex items-baseline gap-2">
            <Num loading={loading} className={dueSoon > 0 ? "text-destructive" : "text-foreground"}>{dueSoon}</Num>
            <span className="text-sm text-muted-foreground">
              {dueSoon === 1 ? "book needs" : "books need"} a return soon
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Icon
              name="notification_important"
              size={16}
              className={dueSoon > 0 ? "text-destructive" : "text-muted-foreground"}
            />
            {dueSoon > 0 ? "Due within 2 days. No late fees, just a friendly reminder" : "Nothing is due in the next 2 days"}
          </p>
        </div>
        <span
          className={cn(
            "flex size-16 shrink-0 items-center justify-center rounded-full shadow-inner",
            dueSoon > 0 ? "bg-red-100 text-destructive dark:bg-red-950" : "bg-card text-muted-foreground"
          )}
        >
          <Icon name="alarm" size={32} />
        </span>
      </div>
    </section>
  );
}
