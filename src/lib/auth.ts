import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { client, db } from "./mongodb";

export const auth = betterAuth({
  // transaction: false so it also works on a local standalone MongoDB
  // (transactions need a replica set, which only Atlas/replica-set setups have)
  database: mongodbAdapter(db, { client, transaction: false }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    // autoSignIn stays ON on purpose: with autoSignIn:false BetterAuth hides duplicate
    // emails (always answers "success"), so we couldn't show "email already exists".
    // The Register form signs the new user out again and sends them to Login.
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },
  // Issues a JWT for the Express API (verified there through /api/auth/jwks)
  plugins: [jwt()],
});
