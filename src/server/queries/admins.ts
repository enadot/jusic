import "server-only";

import { asc } from "drizzle-orm";
import { getDb } from "../db";
import { adminAllowlist, type AdminAllowlistRow } from "../db/schema";

/** Every teammate added from the dashboard, oldest first. */
export async function listAllowlist(): Promise<AdminAllowlistRow[]> {
  return getDb()
    .select()
    .from(adminAllowlist)
    .orderBy(asc(adminAllowlist.createdAt));
}

/**
 * Just the addresses, for the permission check on every dashboard request.
 *
 * Throws if the database is unreachable — auth.ts turns that into "env admins
 * only" rather than letting it through, so an outage narrows access instead of
 * opening or sealing it.
 */
export async function allowlistEmails(): Promise<string[]> {
  const rows = await getDb()
    .select({ email: adminAllowlist.email })
    .from(adminAllowlist);
  return rows.map((row) => row.email);
}
