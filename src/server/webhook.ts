import "server-only";

import { createHmac } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { webhooks, type Submission, type Webhook } from "./db/schema";

const TIMEOUT_MS = 10_000;

/**
 * The JSON every destination receives. One shape for the Make scenario and for
 * every endpoint added from the dashboard, so a scenario built against one
 * works against the other.
 */
export function submissionPayload(submission: Submission, siteUrl: string) {
  return {
    id: submission.id,
    type: submission.type,
    status: submission.status,
    createdAt: submission.createdAt.toISOString(),
    name: submission.name,
    email: submission.email,
    phone: submission.phone,
    message: submission.message,
    payload: submission.payload ?? null,
    utm: submission.utm ?? null,
    placement: submission.placement,
    pagePath: submission.pagePath,
    adminUrl: `${siteUrl}/admin/submissions/${submission.id}`,
  };
}

export type DeliveryResult = {
  status: number | null;
  error: string | null;
};

/**
 * One POST. Never throws: a destination that is down is a fact to record, not
 * an error to propagate — the submission is already safely in the database and
 * the visitor's screen must not depend on anyone else's uptime.
 */
export async function deliver(
  url: string,
  body: string,
  secret: string | null,
): Promise<DeliveryResult> {
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  if (secret) {
    headers["x-jusic-signature"] = createHmac("sha256", secret)
      .update(body)
      .digest("hex");
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      redirect: "manual",
    });
    return {
      status: response.status,
      error: response.ok ? null : `HTTP ${response.status}`,
    };
  } catch (caught) {
    const error = caught instanceof Error ? caught.message : String(caught);
    return { status: null, error: error.slice(0, 300) };
  }
}

/**
 * Fans a new submission out to every destination: the env-configured Make
 * endpoint plus every enabled row in `webhooks`.
 *
 * All of them go at once — one slow endpoint must not delay the others — and
 * every failure is swallowed and logged, including a failure to read the table
 * at all (in which case the env destination still fires).
 *
 * Called from `after()`, so none of this is on the visitor's response path.
 */
export async function notifySubmission(
  submission: Submission,
  siteUrl: string,
): Promise<void> {
  const body = JSON.stringify(submissionPayload(submission, siteUrl));
  const jobs: Promise<unknown>[] = [];

  const makeUrl = process.env.MAKE_WEBHOOK_URL;
  if (makeUrl) {
    jobs.push(
      deliver(makeUrl, body, process.env.MAKE_WEBHOOK_SECRET ?? null).then(
        (result) => {
          if (result.error) {
            console.error(
              `[webhook] make failed for submission ${submission.id}: ${result.error}`,
            );
          }
        },
      ),
    );
  }

  let rows: Webhook[] = [];
  try {
    rows = await getDb().select().from(webhooks).where(eq(webhooks.enabled, true));
  } catch (error) {
    console.error("[webhook] could not read destinations", error);
  }

  for (const row of rows) {
    jobs.push(
      deliver(row.url, body, row.secret).then(async (result) => {
        if (result.error) {
          console.error(
            `[webhook] ${row.url} failed for submission ${submission.id}: ${result.error}`,
          );
        }
        await recordAttempt(row.id, result);
      }),
    );
  }

  await Promise.allSettled(jobs);
}

/** Stamps the outcome on the row so the dashboard can show it. */
export async function recordAttempt(
  id: string,
  result: DeliveryResult,
): Promise<void> {
  try {
    await getDb()
      .update(webhooks)
      .set({
        lastStatus: result.status,
        lastError: result.error,
        lastAttemptAt: new Date(),
      })
      .where(eq(webhooks.id, id));
  } catch (error) {
    console.error("[webhook] could not record attempt", error);
  }
}
