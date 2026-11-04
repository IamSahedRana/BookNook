"use client";

import Link from "next/link";
import { useMemo } from "react";
import { UserAvatar } from "@/components/layout/user-avatar";
import { BookCover } from "@/components/books/book-cover";
import { Icon } from "@/components/shared/icon";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyBooks } from "@/hooks/use-books";
import { useMyBorrows } from "@/hooks/use-borrows";
import { useLogout } from "@/hooks/use-logout";
import { useNow } from "@/hooks/use-now";
import { authClient } from "@/lib/auth-client";
import { getDueStatus } from "@/lib/borrow-status";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

export function ProfileView() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const { books, isLoading: booksLoading } = useMyBooks();
  const { borrows, isLoading: borrowsLoading } = useMyBorrows();
  const logout = useLogout();
  const now = useNow();

  const addedStats = useMemo(() => {
    const copies = books.reduce((sum, b) => sum + b.totalCopies, 0);
    const onLoan = books.reduce((sum, b) => sum + (b.totalCopies - b.availableCopies), 0);
    return { copies, onLoan };
  }, [books]);

  const sortedBorrows = useMemo(
    () => [...borrows].sort((a, b) => +new Date(a.returnDate) - +new Date(b.returnDate)),
    [borrows]
  );
  const dueSoon = useMemo(
    () => sortedBorrows.filter((b) => getDueStatus(b.returnDate, now).dueSoon),
    [sortedBorrows, now]
  );

  const memberSince = user?.createdAt ? new Date(user.createdAt) : null;
  const memberSinceText = memberSince && !Number.isNaN(+memberSince) ? formatDate(memberSince) : "-";

  return (
    <div className="mx-auto w-full max-w-[1320px] px-4 pt-8 pb-16 sm:px-8">
      <PageHeader
        title="My Profile"
        description="Your account details and your activity on BookNook."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "My Profile" }]}
        aside={
          <span className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground shadow-sm">
            <span className="size-2.5 animate-pulse rounded-full bg-emerald-500" />
            Account active
          </span>
        }
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* LEFT: identity */}
        <div className="relative flex flex-col gap-6 overflow-hidden rounded-3xl bg-card p-6 shadow-sm sm:p-8 lg:col-span-5">
          <div className="pointer-events-none absolute top-0 right-0 size-36 rounded-bl-full bg-gradient-to-br from-brand/10 to-transparent" />

          <div className="relative z-10 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            {isPending || !user ? (
              <Skeleton className="size-28 shrink-0 rounded-full" />
            ) : (
              <div className="relative shrink-0">
                <UserAvatar name={user.name} image={user.image} className="size-28 ring-4 ring-muted" fallbackClassName="text-3xl" />
                <span
                  title="BookNook reader"
                  className="absolute -right-1 -bottom-1 flex size-8 items-center justify-center rounded-full bg-brand text-white shadow-md"
                >
                  <Icon name="verified" size={18} />
                </span>
              </div>
            )}

            <div className="flex min-w-0 flex-col gap-1 text-center sm:text-left">
              {user ? (
                <>
                  <h2 data-testid="profile-name" className="truncate text-2xl font-bold text-foreground">{user.name}</h2>
                  <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                    <Icon name="mail" size={16} />
                    <span data-testid="profile-email" className="truncate">{user.email}</span>
                  </p>
                </>
              ) : (
                <>
                  <Skeleton className="h-7 w-40" />
                  <Skeleton className="h-5 w-48" />
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl bg-muted p-4">
            <div className="flex items-center justify-between gap-2 py-1">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="calendar_today" size={18} />
                Member since
              </span>
              <span data-testid="member-since" className="text-sm font-semibold text-foreground">{memberSinceText}</span>
            </div>
            <div className="flex items-center justify-between gap-2 py-1">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="local_library" size={18} />
                Borrow period
              </span>
              <span className="text-sm font-semibold text-foreground">7 days, always free</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button asChild className="h-11 gap-2 shadow-sm">
              <Link href="/add-book">
                <Icon name="add" size={20} />
                Add a Book
              </Link>
            </Button>
            <Button asChild variant="secondary" className="h-11 gap-2">
              <Link href="/my-books">
                <Icon name="shelves" size={20} />
                My Books
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 gap-2">
              <Link href="/my-borrows">
                <Icon name="auto_stories" size={20} />
                My Borrows
              </Link>
            </Button>
            <Button type="button" variant="inverted" onClick={() => logout()} className="h-11 gap-2">
              <Icon name="logout" size={20} />
              Logout
            </Button>
          </div>
        </div>

        {/* RIGHT: stats + active borrows */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col justify-between gap-4 rounded-3xl bg-card p-6 shadow-sm transition-transform hover:-translate-y-1">
              <div className="flex items-start justify-between">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-subtle text-brand">
                  <Icon name="library_add_check" size={26} />
                </span>
                <span className="rounded-full bg-brand-subtle px-2.5 py-1 text-xs font-bold tracking-wider text-brand uppercase">
                  Shared by you
                </span>
              </div>
              <div>
                <div data-testid="stat-books-added" className="mb-1 text-5xl leading-none font-bold text-foreground">
                  {booksLoading ? <span className="inline-block h-10 w-14 animate-pulse rounded-xl bg-muted align-middle" /> : books.length}
                </div>
                <h3 className="font-semibold text-foreground">Books Added</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">Titles you have shared with other readers</p>
              </div>
              <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Icon name="layers" size={16} className="text-emerald-600" />
                {addedStats.copies} {plural(addedStats.copies, "copy", "copies")} in total, {addedStats.onLoan} on loan now
              </p>
            </div>

            <div className="flex flex-col justify-between gap-4 rounded-3xl bg-card p-6 shadow-sm transition-transform hover:-translate-y-1">
              <div className="flex items-start justify-between">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-foreground">
                  <Icon name="bookmark_heart" size={26} />
                </span>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold tracking-wider text-foreground uppercase">
                  Reading now
                </span>
              </div>
              <div>
                <div data-testid="stat-borrowed" className="mb-1 text-5xl leading-none font-bold text-foreground">
                  {borrowsLoading ? <span className="inline-block h-10 w-14 animate-pulse rounded-xl bg-muted align-middle" /> : borrows.length}
                </div>
                <h3 className="font-semibold text-foreground">Currently Borrowed</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">Books you have checked out right now</p>
              </div>
              <p
                data-testid="due-summary"
                className={cn("flex items-center gap-2 text-sm font-semibold", dueSoon.length > 0 ? "text-destructive" : "text-muted-foreground")}
              >
                <Icon name="schedule" size={16} />
                {dueSoon.length > 0
                  ? `${dueSoon.length} due soon (${dueSoon[0].bookTitle})`
                  : "Nothing is due soon"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5 rounded-3xl bg-card p-6 shadow-sm sm:p-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">Active Borrows</h3>
                <p className="text-sm text-muted-foreground">Keep an eye on your return dates</p>
              </div>
              {borrows.length > 0 && (
                <Link href="/my-borrows" className="flex shrink-0 items-center gap-1 text-sm font-semibold text-brand hover:underline">
                  View all {borrows.length}
                  <Icon name="arrow_forward" size={16} />
                </Link>
              )}
            </div>

            {borrowsLoading ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
              </div>
            ) : sortedBorrows.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl bg-muted p-8 text-center">
                <p className="font-semibold text-foreground">You haven&apos;t borrowed any books yet</p>
                <Button asChild size="sm" className="gap-1.5">
                  <Link href="/books">
                    <Icon name="menu_book" size={16} />
                    Browse Books
                  </Link>
                </Button>
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {sortedBorrows.slice(0, 3).map((borrow) => {
                  const due = getDueStatus(borrow.returnDate, now);
                  return (
                    <li
                      key={borrow._id}
                      data-testid="profile-borrow"
                      className="flex flex-col items-start justify-between gap-3 rounded-2xl bg-muted/60 p-3.5 transition-colors hover:bg-muted sm:flex-row sm:items-center"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-muted shadow-sm">
                          <BookCover src={borrow.bookImage} title={borrow.bookTitle} sizes="48px" />
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <h4 className="truncate font-semibold text-foreground">{borrow.bookTitle}</h4>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span
                              className={cn(
                                "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold",
                                due.dueSoon ? "bg-red-100 text-destructive dark:bg-red-950" : "bg-background text-foreground"
                              )}
                            >
                              {due.dueSoon && <Icon name="alarm" size={13} />}
                              {due.label}
                            </span>
                            <span className="text-xs text-muted-foreground">Return by {formatDate(borrow.returnDate)}</span>
                          </div>
                        </div>
                      </div>
                      <Button asChild size="sm" variant={due.dueSoon ? "default" : "secondary"} className="shrink-0 self-end sm:self-center">
                        <Link href="/my-borrows">Return</Link>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-muted p-6 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-sm">
                <Icon name="volunteer_activism" size={24} />
              </span>
              <div>
                <h4 className="font-semibold text-foreground">
                  {books.length === 0 ? "Share your first book" : `You have shared ${books.length} ${plural(books.length, "book", "books")}`}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {books.length === 0
                    ? "Add a book you have finished and let other readers enjoy it."
                    : addedStats.onLoan > 0
                      ? `${addedStats.onLoan} ${plural(addedStats.onLoan, "copy is", "copies are")} being read by the community right now.`
                      : "Every copy is on the shelf, ready for readers."}
                </p>
              </div>
            </div>
            <Button asChild variant="inverted" className="shrink-0">
              <Link href={books.length === 0 ? "/add-book" : "/my-books"}>
                {books.length === 0 ? "Add a Book" : "Manage My Books"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
