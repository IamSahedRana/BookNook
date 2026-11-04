import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/shared/motion-wrapper";
import { Icon } from "@/components/shared/icon";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page Not Found" };

/** A shelf with one book missing: "4 [gap] 4" */
function MissingBookShelf() {
  const books = [
    "h-24 w-5 bg-neutral-500",
    "h-28 w-6 bg-neutral-700",
    "h-20 w-5 bg-neutral-400",
    "h-32 w-7 bg-neutral-900 dark:bg-neutral-300",
    null, // the missing book
    "h-24 w-5 bg-neutral-600",
    "h-28 w-6 bg-neutral-800 dark:bg-neutral-300",
    "h-20 w-5 bg-neutral-500",
  ];
  return (
    <div aria-hidden="true" className="mx-auto mt-10 w-full max-w-md">
      <div className="flex items-end justify-center gap-1.5 px-4">
        {books.map((cls, i) =>
          cls ? (
            <span key={i} className={`${cls} rounded-t-sm`} />
          ) : (
            <span
              key={i}
              className="flex h-28 w-8 items-center justify-center rounded-t-sm border-2 border-dashed border-brand/50"
            >
              <Icon name="question_mark" size={18} className="text-brand" />
            </span>
          )
        )}
      </div>
      <div className="h-2.5 w-full rounded-full bg-neutral-300 shadow-md dark:bg-neutral-700" />
    </div>
  );
}

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
      <FadeIn className="flex flex-col items-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          <Icon name="search_off" size={16} className="text-brand" />
          Error 404
        </span>

        <h1 className="flex items-center justify-center gap-2 text-8xl font-extrabold tracking-tighter text-brand sm:text-9xl">
          4
          <span className="flex size-20 items-center justify-center rounded-full bg-brand-subtle sm:size-28">
            <Icon name="menu_book" size={56} filled className="text-brand" />
          </span>
          4
        </h1>

        <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Oops! This page has been checked out.
        </h2>
        <p className="mt-3 max-w-md text-base text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s find you another good read.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="gap-2 px-8 shadow-md">
            <Link href="/">
              <Icon name="home" size={20} />
              Back to Home
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2 px-8">
            <Link href="/books">
              <Icon name="menu_book" size={20} />
              Browse Books
            </Link>
          </Button>
        </div>
      </FadeIn>

      <MissingBookShelf />
    </section>
  );
}
