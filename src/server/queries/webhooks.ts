import "server-only";

import { asc } from "drizzle-orm";
import { getDb } from "../db";
import { webhooks, type Webhook } from "../db/schema";

/**
 * Every destination, enabled or not, oldest first. The id breaks ties: rows
 * created in the same statement share a timestamp, and without it they would
 * swap places between renders.
 */
export async function listWebhooks(): Promise<Webhook[]> {
  return getDb()
    .select()
    .from(webhooks)
    .orderBy(asc(webhooks.createdAt), asc(webhooks.id));
}
