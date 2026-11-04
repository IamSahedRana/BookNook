import Link from "next/link";
import { Icon } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/motion-wrapper";
import { CATEGORIES, CATEGORY_META } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function TopCategories() {
  return (
    <section id="top-categories" className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-8">
      <div className="mb-8 flex flex-col justify-between border-b border-border pb-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Top Categories
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse collections shared by our readers and find your next chapter.
          </p>
        </div>
        <Link
          href="/books"
          className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline sm:mt-0"
        >
          Browse all books
          <Icon name="chevron_right" size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {CATEGORIES.map((category, index) => {
          const meta = CATEGORY_META[category];
          return (
            <Reveal key={category} delay={index * 0.07} className="h-full">
            <Link
              href={`/books?category=${category}`}
              className="group flex h-full flex-col items-center rounded-2xl border border-border bg-surface p-5 text-center transition-all hover:-translate-y-0.5 hover:bg-muted hover:shadow-md"
            >
              <span
                className={cn(
                  "mb-3 flex size-12 items-center justify-center rounded-full transition-transform group-hover:scale-110",
                  meta.tint
                )}
              >
                <Icon name={meta.icon} size={24} />
              </span>
              <h3 className="text-sm font-bold text-foreground">{category}</h3>
              <span className="mt-1 text-xs text-muted-foreground">{meta.blurb}</span>
            </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
