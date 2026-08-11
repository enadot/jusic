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
