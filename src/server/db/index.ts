import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Everything the dashboard knows about a broken DATABASE_URL, without ever
 * naming the password.
 *
 * `neon()` rejects a malformed string with "…is not a valid URL. Connection
 * string: " followed by the string itself — password included — and /admin
 * renders that message on the page. So the value is checked here first and
 * described rather than quoted.
 *
 * The three faults below are the ones that actually happen, and they all look
 * identical coming out of the driver. Each is a way of copying the string out
 * of a console rather than out of the clipboard: the displayed value with its
 * middle elided, the surrounding quotes of a shell snippet, or the whole
 * `psql '…'` command line.
 */
function describeUrlFault(url: string): string | null {
  if (/^\s*psql\b/i.test(url)) {
    return "it starts with `psql`, so the whole command line was copied rather than the connection string inside it";
  }
  if (/^["']|["']$/.test(url.trim())) {
    return "it is wrapped in quotes — Vercel stores the value verbatim, so the quotes become part of the string";
  }
  const foreign = [...url].find((char) => char.charCodeAt(0) > 0x7e);
  if (foreign) {
    const point = foreign.codePointAt(0)?.toString(16).padStart(4, "0");
    return `it contains the character U+${point} (${foreign}), which cannot appear in a URL — a value shown truncated in a console was copied instead of the real one`;
  }
  if (!/^postgres(ql)?:\/\//.test(url)) {
    return "it does not begin with postgresql://";
  }
  if (!/^postgres(ql)?:\/\/[^@/]+@/.test(url)) {
    return "it carries no user:password before the host";
  }
  return null;
}

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
  const fault = describeUrlFault(url);
  if (fault) {
    throw new Error(
      `DATABASE_URL is not a usable connection string: ${fault}. Re-copy it from the Neon console with the copy button — it should read postgresql://user:password@ep-<id>-pooler.<region>.aws.neon.tech/neondb?sslmode=require.`,
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
