"use server";

import { after } from "next/server";
import { headers } from "next/headers";
import { getDb } from "../db";
import { submissions, type NewSubmission } from "../db/schema";
import { artistSchema, contactSchema, fieldErrors } from "../validation";
import { checkSubmission, hashIp } from "../spam";
import { notifyMake } from "../webhook";
import type { FormState } from "@/lib/formState";
import { site } from "@/content/site";

/**
 * The visible fields, echoed back on failure so React's post-action form reset
 * lands on what the visitor typed rather than on empty inputs. The honeypot and
 * the signed stamp are deliberately not echoed.
 */
const ECHOED_FIELDS = [
  "name",
  "email",
  "phone",
  "message",
  "consent",
  "stageName",
  "genre",
  "primaryLink",
  "secondaryLink",
  "catalogSize",
  "isDistributed",
] as const;

function echo(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const field of ECHOED_FIELDS) {
    const value = formData.get(field);
    if (typeof value === "string" && value) values[field] = value.slice(0, 4000);
  }
  return values;
}

const GENERIC_ERROR =
  "משהו השתבש בשליחה. אפשר לנסות שוב, או לכתוב לנו ישירות לכתובת שבתחתית העמוד.";
const RATE_LIMITED =
  "קיבלנו כמה פניות מהמכשיר הזה בשעה האחרונה. אפשר לנסות שוב בעוד זמן קצר.";
const TOO_FAST = "רק רגע — נסו לשלוח שוב.";

/** Client IP as seen through Vercel's proxy. */
async function clientIp(): Promise<string | null> {
  const list = await headers();
  const forwarded = list.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return list.get("x-real-ip");
}

function parseUtm(raw: string | undefined): Record<string, string> | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const entries = Object.entries(parsed as Record<string, unknown>)
      .filter(([, value]) => typeof value === "string")
      .slice(0, 10) as [string, string][];
    return entries.length ? Object.fromEntries(entries) : null;
  } catch {
    return null;
  }
}

/** Shared tail: spam gate → insert → hand off to Make. */
async function persist(
  row: Omit<NewSubmission, "ipHash">,
  guards: { website?: string; ts?: string },
  formData: FormData,
): Promise<FormState> {
  const list = await headers();
  const ipHash = hashIp(await clientIp());

  const verdict = await checkSubmission({
    website: guards.website,
    stamp: guards.ts,
    ipHash,
  });

  if (!verdict.ok) {
    if (verdict.reason === "rate_limit") {
      return { status: "error", message: RATE_LIMITED, values: echo(formData) };
    }
    if (verdict.reason === "too_fast") {
      return { status: "error", message: TOO_FAST, values: echo(formData) };
    }
    // A bot gets the same generic wording as any other failure — no hints.
    return { status: "error", message: GENERIC_ERROR, values: echo(formData) };
  }

  const [inserted] = await getDb()
    .insert(submissions)
    .values({
      ...row,
      ipHash,
      userAgent: list.get("user-agent")?.slice(0, 500) ?? null,
    })
    .returning();

  if (!inserted) {
    return { status: "error", message: GENERIC_ERROR, values: echo(formData) };
  }

  // after() runs once the response is already on its way, so a slow Make
  // scenario never shows up as latency on the submit button.
  after(() => notifyMake(inserted, site.url));

  return { status: "success" };
}

export async function submitContact(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: fieldErrors(parsed.error),
      values: echo(formData),
    };
  }
  const input = parsed.data;

  try {
    return await persist(
      {
        type: input.type,
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        message: input.message,
        utm: parseUtm(input.utm),
        placement: input.placement ?? null,
        pagePath: input.pagePath ?? null,
      },
      { website: input.website, ts: input.ts },
      formData,
    );
  } catch (error) {
    console.error("[submitContact]", error);
    return { status: "error", message: GENERIC_ERROR, values: echo(formData) };
  }
}

export async function submitArtist(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = artistSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: fieldErrors(parsed.error),
      values: echo(formData),
    };
  }
  const input = parsed.data;

  try {
    return await persist(
      {
        type: "artist",
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        // The application is the structured payload; the free-text note is
        // optional, so keep the column non-empty with a readable stand-in.
        message: input.message ?? "—",
        payload: {
          stageName: input.stageName,
          genre: input.genre ?? null,
          primaryLink: input.primaryLink,
          secondaryLink: input.secondaryLink ?? null,
          catalogSize: input.catalogSize ?? null,
          isDistributed: input.isDistributed === "yes",
        },
        utm: parseUtm(input.utm),
        placement: input.placement ?? "artists",
        pagePath: input.pagePath ?? "/artists",
      },
      { website: input.website, ts: input.ts },
      formData,
    );
  } catch (error) {
    console.error("[submitArtist]", error);
    return { status: "error", message: GENERIC_ERROR, values: echo(formData) };
  }
}
