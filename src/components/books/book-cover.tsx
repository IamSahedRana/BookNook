"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@/components/shared/icon";
import { OPTIMIZED_IMAGE_HOSTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type BookCoverProps = {
  src: string;
  title: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** Only hosts listed in next.config.ts can be optimised; anything else loads as-is instead of crashing. */
function canOptimize(src: string) {
  if (src.endsWith(".svg")) return false;
  if (src.startsWith("/")) return true;
  try {
    return OPTIMIZED_IMAGE_HOSTS.includes(new URL(src).hostname);
  } catch {
    return false;
  }
}

/** Fills its (relative, aspect-ratio) parent. Shows a book icon if the image fails to load. */
export function BookCover({ src, title, sizes, priority, className }: BookCoverProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
        <Icon name="menu_book" size={48} />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={`${title} cover`}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={!canOptimize(src)}
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}
