/**
 * Only allow same-site relative paths, so `?redirect=https://evil.com`
 * can never send a user to another website.
 */
export function getSafeRedirect(raw?: string | null): string | null {
  if (!raw) return null;
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) {
    return null;
  }
  if (raw.startsWith("/login") || raw.startsWith("/register")) return null;
  return raw;
}

/** Human-friendly name of the page the user was sent away from. */
export function describeRedirect(path: string): string {
  const pathname = path.split("?")[0];
  if (pathname === "/add-book") return "Add Book";
  if (pathname === "/my-books") return "My Books";
  if (pathname === "/my-borrows") return "My Borrows";
  if (pathname === "/profile") return "My Profile";
  if (pathname.startsWith("/books/")) return "Book Details";
  return "a protected page";
}

export function withRedirect(path: string, redirect: string | null) {
  return redirect ? `${path}?redirect=${encodeURIComponent(redirect)}` : path;
}
