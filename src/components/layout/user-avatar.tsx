import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  name: string;
  image?: string | null;
  className?: string;
  /** e.g. "text-3xl" for a big avatar */
  fallbackClassName?: string;
};

export function UserAvatar({ name, image, className, fallbackClassName }: UserAvatarProps) {
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";

  return (
    <Avatar className={cn("size-10 ring-2 ring-border", className)}>
      <AvatarImage src={image ?? undefined} alt={name} />
      <AvatarFallback className={cn("bg-brand-subtle font-bold text-brand", fallbackClassName)}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
