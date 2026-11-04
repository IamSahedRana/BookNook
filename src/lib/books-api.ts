import { ApiError, apiFetch, authFetch } from "@/lib/api";
import { MOCK_BOOKS } from "@/lib/mock-books";
import type { Book, BookInput, Borrow } from "@/types";

/** true = use built-in demo books (no server needed). Set NEXT_PUBLIC_USE_MOCK_DATA=false for the real API. */
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export type BooksQuery = {
  /** "latest" = newest first (MongoDB sort on addedAt) */
  sort?: "latest";
  limit?: number;
  /** Only books added by this user (used by My Books) */
  email?: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function queryMock({ sort, limit, email }: BooksQuery): Book[] {
  let list = [...MOCK_BOOKS];
  if (email) list = list.filter((book) => book.userEmail === email);
  if (sort === "latest") {
    list.sort((a, b) => +new Date(b.addedAt) - +new Date(a.addedAt));
  }
  return limit ? list.slice(0, limit) : list;
}

/** GET /books (public) */
export async function fetchBooks(query: BooksQuery = {}): Promise<Book[]> {
  if (USE_MOCK) {
    await sleep(600); // so the loading state is visible while you test
    return queryMock(query);
  }

  const params = new URLSearchParams();
  if (query.sort) params.set("sort", query.sort);
  if (query.limit) params.set("limit", String(query.limit));
  if (query.email) params.set("email", query.email);
  const qs = params.toString();

  return apiFetch<Book[]>(`/books${qs ? `?${qs}` : ""}`);
}

const DEMO_MESSAGE =
  "Demo mode is on, so nothing can be saved. Set NEXT_PUBLIC_USE_MOCK_DATA=false in .env.local and start the server.";

/** GET /books/:id (login required) */
export async function fetchBook(id: string): Promise<Book> {
  if (USE_MOCK) {
    await sleep(400);
    const book = MOCK_BOOKS.find((b) => b._id === id);
    if (!book) throw new ApiError("Book not found.", 404);
    return book;
  }
  return authFetch<Book>(`/books/${id}`);
}

/** POST /books (login required) */
export async function createBook(input: BookInput): Promise<Book> {
  if (USE_MOCK) throw new ApiError(DEMO_MESSAGE, 0);
  return authFetch<Book>("/books", { method: "POST", body: input });
}

/** POST /borrows (login required) */
export async function borrowBook(bookId: string): Promise<Borrow> {
  if (USE_MOCK) throw new ApiError(DEMO_MESSAGE, 0);
  return authFetch<Borrow>("/borrows", { method: "POST", body: { bookId } });
}

/** GET /borrows (login required): only the logged-in reader's borrows */
export async function fetchMyBorrows(): Promise<Borrow[]> {
  if (USE_MOCK) return [];
  return authFetch<Borrow[]>("/borrows");
}

/** PATCH /books/:id (owner only). Send only what changed. */
export async function updateBook(id: string, changes: Partial<BookInput>): Promise<Book> {
  if (USE_MOCK) throw new ApiError(DEMO_MESSAGE, 0);
  return authFetch<Book>(`/books/${id}`, { method: "PATCH", body: changes });
}

/** DELETE /books/:id (owner only, and only when no copy is borrowed) */
export async function deleteBook(id: string): Promise<{ message: string; id: string }> {
  if (USE_MOCK) throw new ApiError(DEMO_MESSAGE, 0);
  return authFetch<{ message: string; id: string }>(`/books/${id}`, { method: "DELETE" });
}

/** DELETE /borrows/:id: returns the book (the server adds the copy back) */
export async function returnBook(borrowId: string): Promise<{ message: string; id: string }> {
  if (USE_MOCK) throw new ApiError(DEMO_MESSAGE, 0);
  return authFetch<{ message: string; id: string }>(`/borrows/${borrowId}`, { method: "DELETE" });
}
