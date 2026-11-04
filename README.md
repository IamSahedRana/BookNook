# BookNook

**A small online library: add a book, borrow a book, return a book.**

- **Live site:** https://YOUR-BOOKNOOK-SITE.vercel.app  *(replace after deploying)*
- **Client repo:** https://github.com/YOUR-USERNAME/booknook-client
- **Server repo:** https://github.com/YOUR-USERNAME/booknook-server
- **Server API:** https://YOUR-BOOKNOOK-API.onrender.com

## Features

- Browse every book on the shelves, with search by title or author and category filters (Fiction, Science, History, Kids, Others)
- Add your own books with a cover photo (uploaded to imgbb) and a number of copies
- Borrow a book for 7 days: the copy count updates instantly and a book with no copies left shows **Not Available**
- One borrow per reader per book: borrowing the same book twice is blocked with a clear message
- Edit or delete your own books, and return borrowed books with a live view of copies before and after
- Profile page with your stats and active borrows, plus "due soon" reminders (no late fees)
- Email/password and Google sign-in (BetterAuth with MongoDB), with protected pages and JWT-secured API routes
- Light and dark theme, smooth Motion animations, fully responsive on phone, tablet and desktop

## Tech stack

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, BetterAuth (MongoDB adapter, JWT plugin), SWR, Swiper, Motion, React Hook Form + Zod.
Server (separate repo): Express, TypeScript, MongoDB, jose.

## Run locally

```bash
npm install
cp .env.example .env.local     # fill in the values (see below)
npm run dev                    # http://localhost:3000
```

Start the server too (see the server README), then open the site.

## Environment variables (`.env.local`)

| Name | What it is |
|---|---|
| `MONGODB_URI`, `DB_NAME` | MongoDB connection (the same database the server uses) |
| `BETTER_AUTH_SECRET` | Long random string (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL` | The site's own address, e.g. `http://localhost:3000` |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google sign-in (redirect URI: `<site>/api/auth/callback/google`) |
| `NEXT_PUBLIC_API_URL` | The Express server, e.g. `http://localhost:5000` |
| `NEXT_PUBLIC_IMGBB_KEY` | imgbb API key for cover uploads |
| `NEXT_PUBLIC_USE_MOCK_DATA` | Keep `false` (demo books without a server only for development) |

## Deploy

See `DEPLOY.md` (Vercel for the client, Render for the server).

## Project notes

- `src/proxy.ts` guards the private pages (Add Book, My Books, My Borrows, Profile, Book Details). Next.js 16 names this file `proxy.ts` (older versions: `middleware.ts`).
- Each page sets its own title, e.g. `BookNook | All Books`.
