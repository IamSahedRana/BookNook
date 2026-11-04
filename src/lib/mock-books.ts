import type { Book } from "@/types";

/** Demo books used while NEXT_PUBLIC_USE_MOCK_DATA=true (before the Express server exists). */
const base = {
  description:
    "A story shared by a BookNook reader. Borrow it for seven days and return it when you are done.",
};

const rows: Array<Omit<Book, "_id" | "image" | "description" | "addedAt">> = [
  { title: "The Silent Orchard", author: "Maya Rahman", category: "Fiction", totalCopies: 5, availableCopies: 3, userName: "Maya Rahman", userEmail: "maya@example.com" },
  { title: "Quantum Gardens", author: "Imran Hossain", category: "Science", totalCopies: 4, availableCopies: 4, userName: "Imran Hossain", userEmail: "imran@example.com" },
  { title: "Rivers of the Delta", author: "Nusrat Jahan", category: "History", totalCopies: 3, availableCopies: 0, userName: "Nusrat Jahan", userEmail: "nusrat@example.com" },
  { title: "The Little Lantern", author: "Farhan Ali", category: "Kids", totalCopies: 6, availableCopies: 5, userName: "Farhan Ali", userEmail: "farhan@example.com" },
  { title: "Notes from a Rainy City", author: "Tania Akter", category: "Others", totalCopies: 2, availableCopies: 1, userName: "Tania Akter", userEmail: "tania@example.com" },
  { title: "The Cartographer's Daughter", author: "Rafiq Chowdhury", category: "Fiction", totalCopies: 3, availableCopies: 2, userName: "Rafiq Chowdhury", userEmail: "rafiq@example.com" },
  { title: "A Brief Guide to the Stars", author: "Dr. Anika Sultana", category: "Science", totalCopies: 5, availableCopies: 5, userName: "Anika Sultana", userEmail: "anika@example.com" },
  { title: "Empires of Salt", author: "Kamal Uddin", category: "History", totalCopies: 2, availableCopies: 1, userName: "Kamal Uddin", userEmail: "kamal@example.com" },
  { title: "Moon Cake Mondays", author: "Sadia Islam", category: "Kids", totalCopies: 4, availableCopies: 4, userName: "Sadia Islam", userEmail: "sadia@example.com" },
  { title: "Midnight at the Reading Room", author: "Maya Rahman", category: "Fiction", totalCopies: 3, availableCopies: 3, userName: "Maya Rahman", userEmail: "maya@example.com" },
  { title: "The Honest Machine", author: "Imran Hossain", category: "Science", totalCopies: 2, availableCopies: 2, userName: "Imran Hossain", userEmail: "imran@example.com" },
  { title: "Letters from the Old Port", author: "Nusrat Jahan", category: "History", totalCopies: 3, availableCopies: 2, userName: "Nusrat Jahan", userEmail: "nusrat@example.com" },
];

// Newest first: index 0 was added most recently
export const MOCK_BOOKS: Book[] = rows.map((row, i) => ({
  ...row,
  ...base,
  _id: `mock-${i + 1}`,
  image: `/images/mock/cover-${String(i + 1).padStart(2, "0")}.svg`,
  addedAt: new Date(Date.UTC(2026, 9, 30 - i * 2, 9, 0, 0)).toISOString(),
}));
