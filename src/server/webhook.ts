import "server-only";

import { createHmac } from "node:crypto";
import type { Submission } from "./db/schema";

/**
 * Forwards a new submission to the Make scenario.
 *
 * Deliberately total: every failure is swallowed and logged. A submission that
 * is safely in the database is a success from the visitor's point of view, and
 * an unreachable webhook must never turn that into an error on their screen.
 */
export async function notifyMake(
  submission: Submission,
  siteUrl: string,
): Promise<void> {
  const url = process.env.MAKE_WEBHOOK_URL;
  if (!url) return;

  const body = JSON.stringify({
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
  });

  const headers: Record<string, string> = {
    "content-type": "application/json",
  };

  const signingSecret = process.env.MAKE_WEBHOOK_SECRET;
  if (signingSecret) {
    headers["x-jusic-signature"] = createHmac("sha256", signingSecret)
      .update(body)
      .digest("hex");
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      console.error(
        `[make] webhook returned ${response.status} for submission ${submission.id}`,
      );
    }
  } catch (error) {
    console.error(`[make] webhook failed for submission ${submission.id}`, error);
  }
}
