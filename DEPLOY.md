# Deploy BookNook (about 20 minutes)

Order matters: **database, then server (Render), then client (Vercel), then update the server's CLIENT_URL.**

## 1. MongoDB Atlas
1. Create a free cluster, a Database User (role: *Read and write to any database*).
2. Network Access > Add IP Address > **Allow access from anywhere** (0.0.0.0/0).
3. Copy the connection string. Use the same one for the client and the server.

## 2. Server on Render (booknook-server repo)
1. Push `booknook-server` to GitHub.
2. Render > New > **Blueprint** (it reads `render.yaml`) or New > Web Service with:
   - Build command: `npm install --include=dev && npm run build`
   - Start command: `npm start`
   - Health check path: `/health`
3. Environment variables:
   | Name | Value |
   |---|---|
   | `MONGODB_URI` | your Atlas string |
   | `DB_NAME` | `booknook` |
   | `CLIENT_URL` | your Vercel URL, e.g. `https://booknook.vercel.app` (set it after step 3, then redeploy) |
   | `NODE_ENV` | `production` |
4. Open `https://YOUR-API.onrender.com/health`: it must show `{"status":"ok","database":"connected"}`.
5. Optional sample books: in Render's Shell run `npm run seed` (or run it on your computer with the production `MONGODB_URI`).
Note: the free Render plan sleeps after inactivity, so the first request can take about 30 seconds.

## 3. Client on Vercel (booknook-client repo)
1. Push `booknook-client` to GitHub, then Vercel > Add New Project > import it (framework Next.js is detected).
2. Environment variables (Production):
   | Name | Value |
   |---|---|
   | `MONGODB_URI`, `DB_NAME` | same as the server |
   | `BETTER_AUTH_SECRET` | a long random string (not the local one) |
   | `BETTER_AUTH_URL` | your final Vercel URL, e.g. `https://booknook.vercel.app` |
   | `NEXT_PUBLIC_APP_URL` | the same URL |
   | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | from Google Cloud |
   | `NEXT_PUBLIC_API_URL` | your Render URL |
   | `NEXT_PUBLIC_IMGBB_KEY` | your imgbb key |
   | `NEXT_PUBLIC_USE_MOCK_DATA` | `false` |
3. Deploy. Use your **production domain** (not a preview URL) for `BETTER_AUTH_URL`.

## 4. Google sign-in
Google Cloud Console > Credentials > your OAuth client:
- Authorized JavaScript origin: `https://YOUR-SITE.vercel.app`
- Authorized redirect URI: `https://YOUR-SITE.vercel.app/api/auth/callback/google`
If the consent screen is in Testing mode, add the Gmail accounts that will sign in as Test users (or publish the app).

## 5. Connect the two and test
1. In Render set `CLIENT_URL` to the Vercel URL and redeploy (the server uses it for CORS and to check logins at `<CLIENT_URL>/api/auth/jwks`).
2. On the live site: register, log in, add a book, borrow it, return it.
3. Reload `/my-books`, `/profile` and a book page while logged in: you must stay logged in and see no error.
4. Open a made-up address such as `/nothing`: the custom 404 page appears.
5. Put the live links in the README and in the assignment submission.

## Troubleshooting
| Problem | Fix |
|---|---|
| Register/Login "Something went wrong" | MongoDB blocked or wrong string. Check Atlas Network Access and `MONGODB_URI` in Vercel |
| Pages load but books don't | `NEXT_PUBLIC_API_URL` wrong, or the Render service is asleep (wait 30 s) |
| Books load but "Could not verify your login" (503) | Render's `CLIENT_URL` doesn't match the Vercel URL exactly, or the client is down |
| 401 "Invalid login token" | `BETTER_AUTH_URL` on Vercel differs from `CLIENT_URL` on Render |
| Google "redirect_uri_mismatch" | Add the exact redirect URI above in Google Cloud |
| Changed an env var, no effect | Vercel/Render need a redeploy; `NEXT_PUBLIC_*` values are baked in at build time |
