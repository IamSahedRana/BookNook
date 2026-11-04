# Zip 6: Polish and deploy (client)

Replace your `booknook-client` folder contents with this zip (keep `.env.local`). No new packages.

## What changed
- **Designed 404 page** (`src/app/not-found.tsx`): big "4 [book] 4", "Oops! This page has been checked out.", Back to Home and Browse Books buttons, a shelf with a missing book. Works in dark mode and on phones.
- **Motion animations** (`src/components/shared/motion-wrapper.tsx`): cards, sections and page headers fade up as they appear. Turned off automatically for visitors who prefer reduced motion.
- **Dev tools removed**: `/dev/token`, `/dev/components` and `/api/health` are gone (they return the 404 page).
- **Production defaults**: `NEXT_PUBLIC_USE_MOCK_DATA=false` in `.env.local` and `.env.example`.
- **Deployment**: `vercel.json`, `DEPLOY.md` (step by step for Vercel + Render + Google + Atlas).
- **README** finished (name, live-URL placeholders, 8 feature bullets, setup, env table).
- **BRIEF_CHECKLIST.md**: every rule of the assignment brief, line by line.

## Server zip
`render.yaml` (Render blueprint) and a Deploy section in its README. Server code is unchanged.

## Verified before sending
`tsc`, `eslint` and a production build are clean. Browser checks: animated cards become visible (Home 6, All Books), custom 404 (title, buttons, navbar and footer), removed dev pages return 404, reload on `/my-books`, `/my-borrows`, `/profile`, `/add-book` and a book page keeps you logged in with no error, no sideways scrolling on any page at phone width (measured with icons at their real size), dark mode screenshots.
My test machine cannot load the icon font, so icons show as words there. Hosting, Google sign-in, Atlas and imgbb need your accounts.
