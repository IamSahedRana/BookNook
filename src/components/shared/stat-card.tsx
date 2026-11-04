import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";

type StatCardProps = {
  icon: string;
  label: string;
  value: number | string;
  /** "brand" colors the number red; "danger" is for warnings */
  tone?: "default" | "brand" | "danger";
  hint?: string;
  loading?: boolean;
};

const TONES = {
  default: { circle: "bg-muted text-foreground", value: "text-foreground" },
  brand: { circle: "bg-brand-subtle text-brand", value: "text-brand" },
  danger: { circle: "bg-red-100 text-destructive dark:bg-red-950", value: "text-destructive" },
};

export function StatCard({ icon, label, value, tone = "default", hint, loading }: StatCardProps) {
  const t = TONES[tone];
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-card p-6 shadow-sm">
      <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-full", t.circle)}>
        <Icon name={icon} size={24} />
      </span>
      <div className="flex min-w-0 flex-col">
        <span data-testid="stat-value" className={cn("text-3xl leading-none font-bold", t.value)}>
          {loading ? <span className="inline-block h-7 w-10 animate-pulse rounded-lg bg-muted align-middle" /> : value}
        </span>
        <span className="mt-1 text-sm text-muted-foreground">{label}</span>
        {hint && <span className="mt-0.5 text-xs text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}
