# Final checklist: every rule in the assignment brief

Legend: **DONE** = built and tested by me. **YOU** = only you can do it (accounts, GitHub, links).

## Key rules
| Rule | Status | Where / how |
|---|---|---|
| 15+ notable client commits | **YOU** | Suggested messages are at the bottom of each `TEST.md` (about 55 in total across the zips). Commit in small steps |
| 8+ notable server commits | **YOU** | Server `TEST.md` has 9 suggested commits |
| README with site name, live URL, 5+ feature bullets (client) | **DONE** / **YOU** | `README.md` has 8 bullets. Replace the live URL placeholders after deploying |
| No Lorem ipsum | **DONE** | Searched the whole source: none |
| No default `alert()` for messages | **DONE** | Searched the source: no `alert()` or `confirm()`. All messages are toasts and custom modals |
| Host with Vercel / Render | **YOU** | `DEPLOY.md`, `vercel.json` (client), `render.yaml` (server) |
| No error on reload from any route | **DONE** | Reloaded `/my-books`, `/my-borrows`, `/profile`, `/add-book`, a book page: no error |
| Logged-in user not sent to Login on reload of a private route | **DONE** | Same test: stays on the page (session cookie kept) |

## 1. Layout
| Rule | Status |
|---|---|
| Navbar: logo + name "BookNook" on the left | DONE |
| Links Home, All Books, Add Book, My Books, My Borrows | DONE |
| Add Book / My Books / My Borrows only when logged in | DONE (hidden when logged out, tested) |
| Logged out: Login and Register buttons | DONE |
| Logged in: user photo, dropdown with name, My Profile, Logout | DONE |
| Footer: logo, short line, contact info, social links, copyright | DONE |
| Navbar and footer on all pages (incl. 404) | DONE |

## 2. Home
| Rule | Status |
|---|---|
| Swiper slider, 3+ slides, title + text + "Browse Books" button to All Books | DONE (3 slides) |
| New Arrivals: latest 6 from the database, newest first (sort + limit in MongoDB) | DONE (`GET /books?sort=latest&limit=6`) |
| Card: image, title, author, category, View Details | DONE |
| "See All Books" button below | DONE |
| 2 extra static sections | DONE (How Borrowing Works, Top Categories) |

## 3. Authentication (BetterAuth + MongoDB adapter)
| Rule | Status |
|---|---|
| Logged-out user opening a private route or clicking Borrow goes to Login, then back | DONE (`?redirect=`, tested) |
| Login: title, email, password, Forgot Password, Login button | DONE (Forgot Password shows a "not available" notice, as the brief says not to build it) |
| Success goes to the wanted page / Home; failure shows an error toast | DONE |
| Link to Register, Google login, then to the wanted page | DONE (Google needs your credentials) |
| Register: name, email, photo URL, password, button; success goes to Login; error toast | DONE |
| Password rules: uppercase, lowercase, 6+ characters, shown in the form, blocks register | DONE (live checklist) |
| Google on Register goes to Home | DONE |
| No email verification / forgot-password flow | DONE (not built) |

## 4. CRUD (MongoDB, imgbb, toasts)
| Rule | Status |
|---|---|
| Add Book `/add-book` (private): title, author, category select (Fiction, Science, History, Kids, Others), image to imgbb, short description, name + email read-only, button; saves the date added; success toast | DONE (+ Total Copies) |
| All Books `/books` (public): grid, 3 per row on desktop, image/title/author/category/View Details | DONE |
| Book Details `/books/:id` (private): image, title, author, category, description, who added it, Borrow button | DONE |
| My Books `/my-books` (private): only your books; Edit opens a pre-filled form + success toast | DONE |
| Delete with a confirm modal (not the browser one), removed from UI and database | DONE |
| Borrow modal: name + email read-only, Confirm Borrow; saves to `borrows`: Book ID, Title, Image, User Email, Borrow Date, Return Date | DONE |
| My Borrows `/my-borrows`: table with Image, Title, Borrow Date, Return Date, Return Book | DONE |

## 5. Server
| Rule | Status |
|---|---|
| Express + MongoDB, only these 8 routes: GET /books, GET /books/:id, POST /books, PATCH /books/:id, DELETE /books/:id, POST /borrows, GET /borrows, DELETE /borrows/:id | DONE (plus `GET /health` for hosting health checks and `GET /` status, which are not data routes) |

## 6. Other
| Rule | Status |
|---|---|
| Loading spinner while data loads | DONE (spinner on route load + skeleton cards and spinner on lists) |
| Custom 404 with "Back to Home" | DONE (this zip) |
| Page title per route, e.g. "BookNook \| All Books" | DONE (all 10 routes checked) |

## UI design requirements
| Rule | Status |
|---|---|
| Unique design, consistent main headings, balanced spacing | DONE |
| Same button style everywhere (pill buttons) | DONE |
| Equal image sizes (3:4), grid layout, equal-height cards | DONE |
| New **X** logo, not the Twitter bird | DONE (footer) |
| Responsive: mobile, tablet, desktop | DONE (checked 500px, tablet and desktop; no sideways scroll on any page) |

## Challenges
| Rule | Status |
|---|---|
| Total Copies field; borrow = `$inc -1`, return = `$inc +1`; 0 copies disables Borrow and shows "Not Available" | DONE |
| No double borrow, error toast | DONE (unique index + toast) |
| JWT protects the APIs | DONE (BetterAuth JWT, verified on the server with `jose`) |

## Optional
| Rule | Status |
|---|---|
| Dark / Light theme button in the navbar | DONE |
| Animation with Framer Motion (Motion) | DONE (this zip) |

## Tech stack
Next.js App Router, shadcn/ui, TypeScript, BetterAuth + MongoDB adapter + JWT, Express + MongoDB + TypeScript: **all DONE**.

## What to submit
1. Client GitHub repo link **YOU**
2. Server GitHub repo link **YOU**
3. Live website link **YOU**

## Your last steps (in order)
1. Replace the placeholders in `README.md` (live URLs) in both repos.
2. Follow `DEPLOY.md`.
3. On the live site: register, add a book, borrow it, return it, edit, delete, then reload `/my-books`.
4. Check the commit counts on GitHub (15+ client, 8+ server).
5. Submit the three links.

## Honest notes
- I tested everything on my own machine with a local MongoDB. Google login, the real imgbb service, Atlas and the live Vercel/Render hosting need your accounts, so test them once on the live site.
- Free Render sleeps when idle: open the API link once before showing the project to someone.
