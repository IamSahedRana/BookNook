import { Icon } from "@/components/shared/icon";

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span role="alert" className="flex items-center gap-1 text-xs font-semibold text-destructive">
      <Icon name="error" size={14} />
      {message}
    </span>
  );
}
