"use client";

import { Icon } from "@/components/shared/icon";

type CopiesStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
};

/** - 3 + (used by Add Book and Edit Book) */
export function CopiesStepper({ value, onChange, min = 1, max = 99, disabled }: CopiesStepperProps) {
  return (
    <div className="flex h-12 items-center justify-between rounded-full bg-background px-2 shadow-sm">
      <button
        type="button"
        aria-label="Decrease copy count"
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-accent active:scale-95 disabled:opacity-40"
      >
        <Icon name="remove" size={18} />
      </button>
      <div className="flex items-center gap-1.5" aria-live="polite">
        <Icon name="layers" size={18} className="text-muted-foreground" />
        <span data-testid="copies-value" className="w-8 text-center text-base font-bold text-foreground">
          {value}
        </span>
        <span className="text-xs font-medium text-muted-foreground">{value === 1 ? "copy" : "copies"}</span>
      </div>
      <button
        type="button"
        aria-label="Increase copy count"
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-accent active:scale-95 disabled:opacity-40"
      >
        <Icon name="add" size={18} />
      </button>
    </div>
  );
}
