import "server-only";

import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { and, eq, gte, sql } from "drizzle-orm";
import { getDb } from "./db";
import { submissions } from "./db/schema";

/**
 * Three cheap defences instead of a captcha, in increasing cost order:
 * a honeypot field, a signed timestamp, and a per-IP quota in the database.
 * None of them ask anything of a real person.
 */

const MIN_FILL_MS = 1_200;
const MAX_FORM_AGE_MS = 2 * 60 * 60 * 1000;
const MAX_PER_IP_PER_HOUR = 5;

function secret(): string {
  // Falls back to the cookie secret so the stamp still works in environments
  // that set up auth but not the salt. Never falls back to a constant.
  const value = process.env.IP_HASH_SALT || process.env.NEON_AUTH_COOKIE_SECRET;
  if (!value) {
    throw new Error("IP_HASH_SALT must be set (see .env.example).");
  }
  return value;
}

/** Signed "the form was rendered at" marker, handed to the client as a field. */
export function createStamp(now = Date.now()): string {
  const issued = String(now);
  const signature = createHmac("sha256", secret()).update(issued).digest("hex");
  return `${issued}.${signature}`;
}

type StampVerdict = "ok" | "invalid" | "too_fast";

/**
 * Separates the two failures the stamp can produce. A bad signature or an
 * expired form is a hard reject; "too fast" is only weak evidence, so it gets
 * its own retryable outcome rather than a dead end — a real person who submits
 * within the first second simply presses send again, and the second attempt is
 * old enough to pass because the stamp is minted once per mounted form.
 */
function verifyStamp(stamp: string | undefined, now = Date.now()): StampVerdict {
  if (!stamp) return "invalid";
  const [issued, signature] = stamp.split(".");
  if (!issued || !signature) return "invalid";

  const expected = createHmac("sha256", secret()).update(issued).digest("hex");
  const a = Buffer.from(signature, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return "invalid";

  const age = now - Number(issued);
  if (!Number.isFinite(age) || age > MAX_FORM_AGE_MS) return "invalid";
  return age >= MIN_FILL_MS ? "ok" : "too_fast";
}

/** The raw IP never reaches the database. */
export function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  return createHash("sha256").update(`${ip}:${secret()}`).digest("hex");
}

export type SpamVerdict =
  | { ok: true }
  | { ok: false; reason: "honeypot" | "stamp" | "too_fast" | "rate_limit" };

export async function checkSubmission({
  website,
  stamp,
  ipHash,
}: {
  website?: string;
  stamp?: string;
  ipHash: string | null;
}): Promise<SpamVerdict> {
  // A human never sees this field, so anything in it is a bot.
  if (website) return { ok: false, reason: "honeypot" };

  const stampVerdict = verifyStamp(stamp);
  if (stampVerdict === "invalid") return { ok: false, reason: "stamp" };
  if (stampVerdict === "too_fast") return { ok: false, reason: "too_fast" };

  if (ipHash) {
    const since = new Date(Date.now() - 60 * 60 * 1000);
    const [row] = await getDb()
      .select({ count: sql<number>`count(*)::int` })
      .from(submissions)
      .where(and(eq(submissions.ipHash, ipHash), gte(submissions.createdAt, since)));

    if ((row?.count ?? 0) >= MAX_PER_IP_PER_HOUR) {
      return { ok: false, reason: "rate_limit" };
    }
  }

  return { ok: true };
}
