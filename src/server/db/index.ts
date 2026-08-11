import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * The HTTP driver, not the WebSocket pool: every query here is a short,
 * independent statement from a serverless function, which is exactly the shape
 * the HTTP driver is for. It also means there is no connection pool to exhaust
 * across Vercel invocations.
 */
function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add the Neon connection string to .env.local (see .env.example).",
    );
  }
  return drizzle(neon(url), { schema });
}

let client: ReturnType<typeof createClient> | undefined;

/**
 * Lazy so that importing this module never throws at build time — the marketing
 * pages are statically generated in environments that have no database.
 */
export function getDb() {
  client ??= createClient();
  return client;
}

export { schema };
