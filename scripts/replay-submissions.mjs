/**
 * One-time backfill: POSTs submissions that are already in the database to a
 * webhook, exactly as `notifySubmission` would have at the time they arrived.
 * For a destination added after launch — the Make scenario that emails every
 * enquiry — this is how the ones it missed reach the inbox too.
 *
 *   node scripts/replay-submissions.mjs https://hook.eu2.make.com/… [options]
 *
 *   --secret=…      sign the body as x-jusic-signature (HMAC-SHA256, hex), the
 *                   same as the row's secret on /admin/webhooks
 *   --since=DATE    only submissions created on or after this date (ISO)
 *   --include-spam  also replay rows marked spam or archived (skipped by default)
 *   --dry-run       print what would be sent and stop
 *
 * DATABASE_URL is read from .env.local, so it runs against whichever database
 * that file points at. Rows go out one at a time, oldest first, so the emails
 * land in the order the enquiries did. Every request carries `x-jusic-replay:
 * 1` — a scenario that wants to label backfilled mail can key off it.
 *
 * The JSON shape is copied from `submissionPayload` in src/server/webhook.ts
 * and has to stay identical to it: a scenario mapped against a live
 * submission must read a replayed one the same way.
 */
import { createHmac } from "node:crypto";
import { setTimeout as sleep } from "node:timers/promises";
import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

dotenv.config({ path: [".env.local", ".env"], quiet: true });

const args = process.argv.slice(2);
const url = args.find((arg) => !arg.startsWith("--"));
const flag = (name) => args.includes(`--${name}`);
const option = (name) =>
  args.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3);

if (!url) {
  console.error("usage: node scripts/replay-submissions.mjs <webhook-url> [--secret=…] [--since=DATE] [--include-spam] [--dry-run]");
  process.exit(1);
}
if (!url.startsWith("https://")) {
  console.error("the webhook URL must be https — same rule as /admin/webhooks");
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set — copy it into .env.local first");
  process.exit(1);
}

const secret = option("secret") ?? null;
const since = option("since") ?? null;
const includeSpam = flag("include-spam");
const dryRun = flag("dry-run");
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jusic.co";

const SKIPPED_STATUSES = includeSpam ? [] : ["spam", "archived"];
const PAUSE_MS = 400;

const sql = neon(process.env.DATABASE_URL);
const rows = await sql`
  select id, type, status, created_at, name, email, phone, message,
         payload, utm, placement, page_path
  from submissions
  where (${since}::timestamptz is null or created_at >= ${since}::timestamptz)
    and not (status = any(${SKIPPED_STATUSES}::text[]))
  order by created_at asc
`;

console.log(
  `${rows.length} submission${rows.length === 1 ? "" : "s"} to replay → ${url}` +
    (dryRun ? " (dry run)" : ""),
);

let sent = 0;
let failed = 0;

for (const row of rows) {
  const body = JSON.stringify({
    id: row.id,
    type: row.type,
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    payload: row.payload ?? null,
    utm: row.utm ?? null,
    placement: row.placement,
    pagePath: row.page_path,
    adminUrl: `${siteUrl}/admin/submissions/${row.id}`,
  });

  const label = `${row.created_at.toISOString().slice(0, 10)}  ${row.type.padEnd(9)} ${row.name}`;

  if (dryRun) {
    console.log(`  · ${label}`);
    continue;
  }

  const headers = {
    "content-type": "application/json",
    "x-jusic-replay": "1",
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
      signal: AbortSignal.timeout(10_000),
      redirect: "manual",
    });
    if (response.ok) {
      sent += 1;
      console.log(`  ✓ ${label}`);
    } else {
      failed += 1;
      console.log(`  ✗ ${label}  HTTP ${response.status}`);
    }
  } catch (error) {
    failed += 1;
    console.log(`  ✗ ${label}  ${error instanceof Error ? error.message : error}`);
  }

  await sleep(PAUSE_MS);
}

if (!dryRun) {
  console.log(`\n${sent} sent, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}
