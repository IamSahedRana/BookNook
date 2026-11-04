"use client";

import { useRouter } from "next/navigation";
import { BookForm } from "@/components/forms/book-form";
import { Icon } from "@/components/shared/icon";
import { PageHeader } from "@/components/shared/page-header";
import { revalidateBooks } from "@/hooks/use-books";
import { ApiError } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { USE_MOCK, createBook } from "@/lib/books-api";
import { notify } from "@/lib/toast";
import type { BookValues } from "@/lib/validations";

export function AddBookView() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  async function handleSubmit(values: BookValues) {
    try {
      // name and email are NOT sent: the server takes them from your login token
      const book = await createBook({
        title: values.title,
        author: values.author,
        category: values.category,
        image: values.image,
        description: values.description,
        totalCopies: values.totalCopies,
      });

      await revalidateBooks();
      notify.success(
        "Book added successfully!",
        "Your book is now listed on the shelves and ready for readers."
      );
      router.push(`/books/${book._id}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 0 && USE_MOCK) {
        notify.warning("Demo mode is on", error.message);
      } else if (error instanceof ApiError && error.status === 400) {
        notify.error("Please check the form", error.message);
      } else if (error instanceof ApiError && error.status === 401) {
        notify.error("Session expired", "Please log in again to add a book.");
      } else {
        notify.error(
          "Couldn't add the book",
          error instanceof Error ? error.message : "Something went wrong. Please try again."
        );
      }
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1320px] px-4 pt-8 pb-20 sm:px-8">
      <PageHeader
        title="Add a New Book"
        description="Share a book with the BookNook community."
        badge="COMMUNITY REPOSITORY"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Add Book" }]}
        aside={
          <div className="hidden items-center gap-4 rounded-2xl bg-muted px-5 py-3 lg:flex">
            <span className="flex size-10 items-center justify-center rounded-full bg-background text-brand">
              <Icon name="verified" size={24} />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">Shared by readers</span>
              <span className="text-xs text-muted-foreground">Every book belongs to the reader who added it</span>
            </div>
          </div>
        }
      />

      {USE_MOCK && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
          <Icon name="science" size={20} className="mt-0.5 shrink-0" />
          <p>
            <strong>Demo mode is on:</strong> the form works, but books can&apos;t be saved. Set{" "}
            <code className="rounded bg-black/10 px-1">NEXT_PUBLIC_USE_MOCK_DATA=false</code> in{" "}
            <code className="rounded bg-black/10 px-1">.env.local</code> and start the server.
          </p>
        </div>
      )}

      <div className="rounded-3xl bg-muted p-6 shadow-sm lg:p-10">
        <BookForm
          owner={user ? { name: user.name, email: user.email } : null}
          submitLabel="Add Book to Shelves"
          onSubmit={handleSubmit}
        />
      </div>

      <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl bg-muted p-6 md:flex-row">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-subtle text-brand">
          <Icon name="volunteer_activism" size={26} />
        </span>
        <div className="flex flex-col text-center md:text-left">
          <span className="font-bold text-foreground">Sharing guidelines</span>
          <p className="text-sm text-muted-foreground">
            Keep covers clean, check for missing pages, and use a clear photo of the front cover.
          </p>
        </div>
      </div>
    </div>
  );
}
