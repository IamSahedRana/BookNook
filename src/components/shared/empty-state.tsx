import { Icon } from "@/components/shared/icon";

type EmptyStateProps = {
  icon?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({ icon = "menu_book", title, description, action }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
      <span className="mb-4 flex size-20 items-center justify-center rounded-full bg-muted">
        <Icon name={icon} size={40} className="text-brand" />
      </span>
      <h3 className="mb-1.5 text-2xl font-bold text-foreground">{title}</h3>
      <p className="mb-6 text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}
