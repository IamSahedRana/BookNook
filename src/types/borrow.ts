export interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  borrowDate: string; // ISO date
  returnDate: string; // ISO date
}
