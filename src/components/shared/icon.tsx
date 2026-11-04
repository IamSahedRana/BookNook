import { cn } from "@/lib/utils";

type IconProps = {
  /** Material Symbols name, e.g. "menu_book" */
  name: string;
  /** Font size in px. Set inline because the Google font CSS is un-layered and would beat Tailwind sizes. */
  size?: number;
  filled?: boolean;
  className?: string;
};

export function Icon({ name, size = 24, filled = false, className }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("material-symbols-outlined select-none", className)}
      style={{
        fontSize: size,
        fontVariationSettings: filled ? "'FILL' 1" : undefined,
      }}
    >
      {name}
    </span>
  );
}
