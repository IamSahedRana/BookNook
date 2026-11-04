import type { Metadata } from "next";
import { BooksView } from "@/components/books/books-view";
import type { CategoryFilter } from "@/components/books/book-filters";
import { CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = { title: "All Books" };

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q = "", category = "All" } = await searchParams;

  const initialCategory: CategoryFilter = (CATEGORIES as readonly string[]).includes(category)
    ? (category as CategoryFilter)
    : "All";

  // `key` remounts the view when the URL changes (navbar search, category links)
  return (
    <BooksView
      key={`${q}|${initialCategory}`}
      initialQuery={q}
      initialCategory={initialCategory}
    />
  );
}
