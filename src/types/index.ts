export * from "./book";
export * from "./borrow";

export interface SessionUser {
  name: string;
  email: string;
  image?: string | null;
}
