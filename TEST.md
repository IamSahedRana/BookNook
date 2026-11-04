# Zip 6: final test checklist

## Before deploying (local)
- [ ] `/nothing-here` shows the designed 404 with **Back to Home** (goes to Home) and **Browse Books**. Tab title `BookNook | Page Not Found`. Navbar and footer are there
- [ ] `/dev/token`, `/dev/components` and `/api/health` show the 404 page
- [ ] Home, All Books: cards and sections fade/slide in as you scroll (nothing stays invisible)
- [ ] Dark theme: Home, 404, details, My Books, Profile all readable
- [ ] Phone width (about 400px): no sideways scrolling on Home, All Books, Login, Register, Add Book, My Books, My Borrows, Profile, 404
- [ ] Logged in: reload `/my-books`, `/my-borrows`, `/profile`, `/add-book` and a book page. You stay logged in and see no error
- [ ] Open `BRIEF_CHECKLIST.md` and tick every row

## After deploying (live site, see DEPLOY.md)
- [ ] Server `/health` shows `{"status":"ok","database":"connected"}`
- [ ] Register, log in, add a book (cover uploads), borrow it, return it, edit it, delete it
- [ ] Google sign-in works
- [ ] Reload private pages while logged in: no error, no login redirect
- [ ] Made-up address gives the 404 page
- [ ] README live links updated in both repos

## Suggested commits
1. `feat: designed 404 page`
2. `feat: motion animations with reduced-motion support`
3. `chore: remove dev token and component preview pages`
4. `chore: deployment config for vercel and render`
5. `docs: finalize readme and deployment guide`
