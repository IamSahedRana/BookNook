import type { Metadata } from "next";
import { MyBooksView } from "@/components/my-books/my-books-view";

export const metadata: Metadata = { title: "My Books" };

export default function MyBooksPage() {
  return <MyBooksView />;
}
