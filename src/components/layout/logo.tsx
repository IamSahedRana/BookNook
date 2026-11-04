import Link from "next/link";
import { Icon } from "@/components/shared/icon";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

type LogoProps = {
  size?: "md" | "sm";
  textClassName?: string;
  onClick?: () => void;
};

export function Logo({ size = "md", textClassName, onClick }: LogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="group flex shrink-0 items-center gap-2.5"
      aria-label={`${SITE_NAME} home`}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-xl bg-brand text-white shadow-sm transition-transform group-hover:scale-105",
          size === "md" ? "size-10" : "size-9"
        )}
      >
        <Icon name="menu_book" size={size === "md" ? 22 : 20} filled />
      </span>
      <span
        className={cn(
          "text-xl font-bold tracking-tight text-foreground",
          textClassName
        )}
      >
        {SITE_NAME}
      </span>
    </Link>
  );
}
