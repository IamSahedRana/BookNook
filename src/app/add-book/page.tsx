import type { Metadata } from "next";
import { AddBookView } from "@/components/books/add-book-view";

export const metadata: Metadata = { title: "Add Book" };

export default function AddBookPage() {
  return <AddBookView />;
}
