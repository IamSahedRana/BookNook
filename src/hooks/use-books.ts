"use client";

import useSWR, { mutate } from "swr";
import { authClient } from "@/lib/auth-client";
import { fetchBook, fetchBooks, type BooksQuery } from "@/lib/books-api";
import type { ApiError } from "@/lib/api";
import type { Book } from "@/types";

const NO_BOOKS: Book[] = [];

/** Books list. `useBooks()` = all books, `useBooks({ sort: "latest", limit: 6 })` = New Arrivals. */
export function useBooks(query: BooksQuery = {}, options: { enabled?: boolean } = {}) {
  const { enabled = true } = options;
  const { data, error, isLoading, mutate } = useSWR<Book[], ApiError>(
    enabled ? ["books", query.sort ?? "", query.limit ?? 0, query.email ?? ""] : null,
    () => fetchBooks(query),
    { revalidateOnFocus: false }
  );

  return { books: data ?? NO_BOOKS, isLoading, error, mutate };
}

/** One book by id (login required). */
export function useBook(id: string) {
  const { data, error, isLoading, mutate: refresh } = useSWR<Book, ApiError>(
    ["book", id],
    () => fetchBook(id),
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  return { book: data, isLoading, error, refresh };
}

/** Refetch every books list and book page (call after adding, editing, borrowing...). */
export function revalidateBooks() {
  return mutate((key) => Array.isArray(key) && (key[0] === "books" || key[0] === "book"));
}

/** Books added by the logged-in reader (GET /books?email=...). */
export function useMyBooks() {
  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email ?? null;
  const result = useBooks({ email: email ?? undefined }, { enabled: Boolean(email) });

  return { ...result, isLoading: result.isLoading || isPending, email };
}
