import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri && process.env.NODE_ENV === "development") {
  console.warn("[BookNook] MONGODB_URI is not set. Add it to .env.local");
}

// Re-use one client across hot reloads in development
const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };

export const client: MongoClient =
  globalForMongo._mongoClient ??
  new MongoClient(uri || "mongodb://127.0.0.1:27017", {
    serverSelectionTimeoutMS: 8000, // fail fast with a clear error instead of hanging for 30s
  });

if (process.env.NODE_ENV !== "production") {
  globalForMongo._mongoClient = client;
}

export const db = client.db(process.env.DB_NAME ?? "booknook");
