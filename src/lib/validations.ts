import { z } from "zod";
import { CATEGORIES } from "@/lib/constants";

/** Password rules shared by the zod schema and the live checklist. */
export const PASSWORD_RULES = [
  { id: "length", label: "At least 6 characters", test: (v: string) => v.length >= 6 },
  { id: "upper", label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { id: "lower", label: "One lowercase letter", test: (v: string) => /[a-z]/.test(v) },
] as const;

export const PASSWORD_ERROR =
  "Password must have an uppercase letter, a lowercase letter and at least 6 characters";

export const isValidPassword = (v: string) =>
  PASSWORD_RULES.every((rule) => rule.test(v));

const emailField = z
  .string()
  .trim()
  .min(1, "Email is required")
  .pipe(z.email("Enter a valid email address"));

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: emailField,
  // Optional. Empty = the avatar falls back to the user's initials.
  photoUrl: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^https?:\/\/\S+$/i.test(v),
      "Enter a valid link that starts with http:// or https://"
    ),
  password: z.string().refine(isValidPassword, PASSWORD_ERROR),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;

export const bookSchema = z.object({
  title: z.string().trim().min(1, "Book title is required").max(120, "Title is too long (max 120 characters)"),
  author: z.string().trim().min(1, "Author name is required").max(80, "Author name is too long (max 80 characters)"),
  category: z.enum(CATEGORIES, { error: "Please choose a category" }),
  totalCopies: z
    .number({ error: "Total copies must be a number" })
    .int("Total copies must be a whole number")
    .min(1, "There must be at least 1 copy")
    .max(99, "Total copies can't be more than 99"),
  description: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters")
    .max(500, "The description can't be longer than 500 characters"),
  // filled by the imgbb upload
  image: z.string().min(1, "Please upload a book cover"),
});

export type BookValues = z.infer<typeof bookSchema>;
