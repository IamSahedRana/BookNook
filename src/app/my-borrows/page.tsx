import type { Metadata } from "next";
import { MyBorrowsView } from "@/components/my-borrows/my-borrows-view";

export const metadata: Metadata = { title: "My Borrows" };

export default function MyBorrowsPage() {
  return <MyBorrowsView />;
}
