"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Icon } from "@/components/shared/icon";
import { FadeIn } from "@/components/shared/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useBook } from "@/hooks/use-books";
import { useMyBorrows } from "@/hooks/use-borrows";
import { authClient } from "@/lib/auth-client";
import { withRedirect } from "@/lib/auth-redirect";
import { LOAN_DAYS } from "@/lib/constants";
import { formatDate, initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Book } from "@/types";
import { BookCover } from "./book-cover";
import { BorrowModal } from "./borrow-modal";
import { RelatedBooks } from "./related-books";

function DetailsSkeleton() {
  return (
    <div aria-busy="true" className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <Skeleton className="aspect-[3/4] w-full rounded-3xl" />
      </div>
      <div className="flex flex-col gap-5 lg:col-span-7">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-12 w-3/4 rounded-xl" />
        <Skeleton className="h-6 w-1/3 rounded-full" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-11 w-48 rounded-full" />
      </div>
    </div>
  );
}

export function BookDetails({ id }: { id: string }) {
  const router = useRouter();
  const { book, isLoading, error, refresh } = useBook(id);
  const { borrows } = useMyBorrows();
  const { data: session } = authClient.useSession();
  const user = session?.user ?? null;
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1320px] px-4 py-8 sm:px-8">
        <DetailsSkeleton />
      </div>
    );
  }

  if (error || !book) {
    const notFound = error?.status === 404 || error?.status === 400;
    return (
      <div className="mx-auto w-full max-w-[1320px] px-4 py-16 sm:px-8">
        {notFound ? (
          <EmptyState
            icon="search_off"
            title="Book not found"
            description="This book doesn't exist or was removed by the reader who added it."
            action={
              <Button asChild>
                <Link href="/books">Back to All Books</Link>
              </Button>
            }
          />
        ) : (
          <ErrorState
            title="Couldn't load this book"
            message={error?.message ?? "Please try again."}
            onRetry={() => refresh()}
          />
        )}
      </div>
    );
  }

  return <Loaded book={book} user={user} borrowed={borrows.find((b) => b.bookId === book._id)} modalOpen={modalOpen} setModalOpen={setModalOpen} onLogin={() => router.push(withRedirect("/login", `/books/${book._id}`))} />;
}

type LoadedProps = {
  book: Book;
  user: { name: string; email: string; image?: string | null } | null;
  borrowed?: { returnDate: string };
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  onLogin: () => void;
};

function Loaded({ book, user, borrowed, modalOpen, setModalOpen, onLogin }: LoadedProps) {
  const available = book.availableCopies > 0;
  const onLoan = book.totalCopies - book.availableCopies;
  const percent = Math.round((book.availableCopies / book.totalCopies) * 100);

  function handleBorrowClick() {
    // Brief: not logged in + Borrow -> Login, then back to this page
    if (!user) return onLogin();
    setModalOpen(true);
  }

  return (
    <div className="mx-auto w-full max-w-[1320px] px-4 py-8 sm:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
        <Icon name="chevron_right" size={14} />
        <Link href="/books" className="font-medium text-brand hover:underline">All Books</Link>
        <Icon name="chevron_right" size={14} />
        <span className="truncate font-medium text-foreground">{book.title}</span>
      </nav>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* LEFT: cover */}
        <FadeIn className="flex flex-col gap-6 lg:col-span-5">
          <div className="rounded-3xl bg-card p-5 shadow-sm">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-muted shadow-md">
              <BookCover
                src={book.image}
                title={book.title}
                priority
                sizes="(min-width: 1024px) 40vw, 95vw"
                className={cn(!available && "grayscale-[35%]")}
              />
              {!available && (
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground shadow-sm">
                  <span className="size-2 rounded-full bg-muted-foreground" />
                  Not Available
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl bg-muted p-6">
            <h4 className="flex items-center gap-2 font-semibold text-foreground">
              <Icon name="verified" size={20} className="text-brand" />
              The BookNook promise
            </h4>
            {[
              { icon: "calendar_today", text: `${LOAN_DAYS}-day free borrow period` },
              { icon: "assignment_return", text: "Return it any time from My Borrows" },
              { icon: "savings", text: "Zero late fees, ever" },
            ].map((perk) => (
              <div key={perk.text} className="flex items-center gap-3 rounded-full bg-card px-4 py-2.5 shadow-sm">
                <Icon name={perk.icon} size={18} className="text-brand" />
                <span className="text-sm font-medium text-foreground">{perk.text}</span>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* RIGHT: information */}
        <FadeIn delay={0.1} className="flex flex-col gap-6 lg:col-span-7">
          <div className="flex flex-col gap-6 rounded-3xl bg-card p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-2">
              <span className="w-fit rounded-full bg-secondary px-3.5 py-1 text-sm font-medium text-secondary-foreground">
                {book.category}
              </span>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{book.title}</h1>
              <p className="text-lg text-muted-foreground">
                by <span className="font-semibold text-foreground">{book.author}</span>
              </p>
            </div>

            {/* Who added it */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl bg-muted p-4 md:flex-row md:items-center">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-brand-subtle text-sm font-bold text-brand shadow-sm">
                  {initials(book.userName)}
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Added by</p>
                  <p className="font-semibold text-foreground">{book.userName}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Icon name="calendar_month" size={16} />
                Added {formatDate(book.addedAt)}
              </div>
            </div>

            {/* Copies */}
            <div className="flex flex-col gap-2 rounded-2xl bg-muted/60 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn("size-2.5 rounded-full", available ? "animate-pulse bg-emerald-500" : "bg-muted-foreground")} />
                  <span data-testid="copies-text" className="font-semibold text-foreground">
                    {book.availableCopies} of {book.totalCopies} {book.totalCopies === 1 ? "copy" : "copies"} available
                  </span>
                </div>
                <span className="text-xs font-semibold text-brand">{percent}% remaining</span>
              </div>
              <Progress value={percent} aria-label="Copies remaining" />
              <p className="mt-1 text-sm text-muted-foreground">
                {available
                  ? "Ready to borrow right now."
                  : "All copies are currently on loan. Please check back soon."}
              </p>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-semibold text-foreground">Overview</h3>
              <p className="leading-relaxed whitespace-pre-line text-muted-foreground">{book.description}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 pt-1">
              <div className="flex flex-wrap items-center gap-3">
                {available ? (
                  <Button size="lg" onClick={handleBorrowClick} className="gap-2 px-8 shadow-sm">
                    <Icon name="auto_stories" size={20} />
                    Borrow This Book
                  </Button>
                ) : (
                  <Button size="lg" disabled className="gap-2 px-8">
                    <Icon name="do_not_disturb_on" size={20} />
                    Not Available
                  </Button>
                )}
                <Button asChild size="lg" variant="secondary" className="gap-2 px-6">
                  <Link href="/books">
                    <Icon name="arrow_back" size={18} />
                    Back to All Books
                  </Link>
                </Button>
              </div>

              {borrowed && (
                <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Icon name="bookmark_added" size={18} className="text-brand" />
                  You borrowed this book. Return it by {formatDate(borrowed.returnDate)}.
                </p>
              )}
            </div>
          </div>

          {/* Lending activity */}
          <div className="flex items-center gap-4 rounded-3xl bg-card p-5 shadow-sm">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Icon name="history_edu" size={24} />
            </span>
            <div>
              <p className="font-semibold text-foreground">Lending activity</p>
              <p className="text-sm text-muted-foreground">
                {onLoan === 0
                  ? "No one is reading this book right now."
                  : `${onLoan} ${onLoan === 1 ? "reader is" : "readers are"} reading ${onLoan === 1 ? "a copy" : "copies"} of this book right now.`}
              </p>
            </div>
          </div>
        </FadeIn>
      </div>

      <RelatedBooks book={book} />

      {user && <BorrowModal book={book} user={user} open={modalOpen} onOpenChange={setModalOpen} />}
    </div>
  );
}
