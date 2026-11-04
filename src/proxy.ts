import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Optimistic guard for private routes (cookie check only).
 * Real authorization happens on the Express API through the JWT.
 * Logged-in users keep their cookie on reload, so they are never sent to /login.
 *
 * (Next.js 16 renamed `middleware.ts` to `proxy.ts`. On Next 15 or older, name it `middleware.ts` and the function `middleware`.)
 */
export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const { pathname, search } = request.nextUrl;
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // /books (list) stays public; /books/<id> is private.
  matcher: ["/add-book", "/my-books", "/my-borrows", "/profile", "/books/:id"],
};
