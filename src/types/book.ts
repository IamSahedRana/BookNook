import type { Category } from "@/lib/constants";

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: Category;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  userName: string;
  userEmail: string;
  addedAt: string; // ISO date
}

export type BookInput = Pick<
  Book,
  "title" | "author" | "category" | "image" | "description" | "totalCopies"
>;
