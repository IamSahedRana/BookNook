"use client";

import useSWR, { mutate } from "swr";
import type { ApiError } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { fetchMyBorrows } from "@/lib/books-api";
import type { Borrow } from "@/types";

const NO_BORROWS: Borrow[] = [];

/** The logged-in reader's borrows (GET /borrows). */
export function useMyBorrows() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id ?? null;

  const { data, error, isLoading, mutate: refresh } = useSWR<Borrow[], ApiError>(
    userId ? ["borrows", userId] : null,
    () => fetchMyBorrows(),
    { revalidateOnFocus: false }
  );

  return { borrows: data ?? NO_BORROWS, isLoading, error, refresh };
}

export function revalidateBorrows() {
  return mutate((key) => Array.isArray(key) && key[0] === "borrows");
}
