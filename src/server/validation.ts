import "server-only";

import { z } from "zod";
import { SUBMISSION_TYPES } from "./db/schema";

/**
 * Validation lives on the server only. The forms rely on native HTML
 * constraints for instant feedback and render whatever comes back from here,
 * which keeps zod out of the public bundle entirely.
 */

const trimmed = (max: number) => z.string().trim().max(max);

const name = trimmed(120).min(2, "נא למלא שם מלא");
const email = trimmed(200)
  .min(1, "נא למלא כתובת אימייל")
  .pipe(z.email("כתובת האימייל אינה תקינה"));
const phone = trimmed(40)
  .optional()
  .transform((value) => value || undefined);
const message = trimmed(4000).min(10, "נא לכתוב לפחות 10 תווים");
const consent = z.literal("yes", { message: "צריך לאשר את מדיניות הפרטיות" });

/** Fields every form posts alongside the visible ones. */
const meta = {
  website: z.string().max(0, "הטופס נדחה").optional(),
  ts: z.string().optional(),
  placement: z.string().max(40).optional(),
  pagePath: z.string().max(400).optional(),
  utm: z.string().max(2000).optional(),
};

export const contactSchema = z.object({
  type: z.enum(SUBMISSION_TYPES),
  name,
  email,
  phone,
  message,
  consent,
  ...meta,
});

const optionalUrl = trimmed(400)
  .optional()
  .transform((value) => value || undefined)
  .pipe(z.url("נא להזין כתובת אינטרנט מלאה").optional());

export const artistSchema = z.object({
  name,
  email,
  phone,
  stageName: trimmed(120).min(2, "נא למלא שם במה"),
  genre: trimmed(60).optional(),
  primaryLink: trimmed(400)
    .min(1, "נא להוסיף קישור לחומרים")
    .pipe(z.url("נא להזין כתובת אינטרנט מלאה")),
  secondaryLink: optionalUrl,
  catalogSize: trimmed(40).optional(),
  isDistributed: trimmed(10).optional(),
  message: trimmed(4000)
    .optional()
    .transform((value) => value || undefined),
  consent,
  ...meta,
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ArtistInput = z.infer<typeof artistSchema>;

/** Flattens zod issues into the { field: message } shape the forms render. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !result[key]) {
      result[key] = issue.message;
    }
  }
  return result;
}

/**
 * The /admin/team form. Lowercased on the way in so the unique index does the
 * de-duplication and isAllowedAdmin's comparison is exact — Neon Auth reports
 * the address in whatever case the person typed at sign-up.
 */
export const adminAllowlistSchema = z.object({
  email: trimmed(200)
    .min(1, "נא למלא כתובת אימייל")
    .pipe(z.email("כתובת האימייל אינה תקינה"))
    .transform((value) => value.toLowerCase()),
  note: trimmed(120).optional(),
});

/**
 * A webhook destination, typed into /admin/webhooks by an admin.
 *
 * The host rules are an SSRF guard, not pedantry: this URL is fetched by the
 * server, from inside the deployment's network, so an address typed into a
 * browser form would otherwise be able to reach the cloud metadata endpoint or
 * anything else the function can see. https only (the payload carries a name,
 * an email and a phone number), and no loopback, link-local or private-range
 * host. It cannot stop a public hostname that resolves to a private address —
 * that needs resolution-time checking, which fetch does not expose — so this is
 * the cheap 95%, and the screen is behind requireAdmin() for the rest.
 */
const BLOCKED_HOSTS =
  /^(localhost|.*\.local|.*\.internal|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?$|\[?f[cd])/i;

function parsedUrl(value: string): URL | undefined {
  try {
    return new URL(value);
  } catch {
    return undefined;
  }
}

export const webhookSchema = z.object({
  url: trimmed(500)
    .min(1, "נא למלא כתובת webhook")
    .pipe(z.url("הכתובת אינה תקינה"))
    // Both refinements pass an unparseable string through: z.url() above has
    // already rejected it, and its message is the accurate one. Returning
    // false here too would let "not-a-url" be reported as a private address.
    .refine((value) => {
      const parsed = parsedUrl(value);
      return parsed === undefined || parsed.protocol === "https:";
    }, "הכתובת חייבת להיות https")
    .refine((value) => {
      const host = parsedUrl(value)?.hostname;
      return host === undefined || !BLOCKED_HOSTS.test(host);
    }, "אי אפשר לשלוח לכתובת פנימית או מקומית"),
  description: trimmed(120).optional(),
  secret: trimmed(200).optional(),
});
