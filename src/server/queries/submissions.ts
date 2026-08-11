import "server-only";

import { and, count, desc, eq, gte, ilike, or, sql, type SQL } from "drizzle-orm";
import { getDb } from "../db";
import {
  submissions,
  type Submission,
  type SubmissionStatus,
  type SubmissionType,
} from "../db/schema";

export const PAGE_SIZE = 25;

export type SubmissionFilters = {
  type?: SubmissionType;
  status?: SubmissionStatus;
  q?: string;
  page?: number;
};

function whereClause(filters: SubmissionFilters): SQL | undefined {
  const parts: SQL[] = [];

  if (filters.type) parts.push(eq(submissions.type, filters.type));
  if (filters.status) parts.push(eq(submissions.status, filters.status));

  if (filters.q) {
    const needle = `%${filters.q}%`;
    const match = or(
      ilike(submissions.name, needle),
      ilike(submissions.email, needle),
      ilike(submissions.message, needle),
    );
    if (match) parts.push(match);
  }

  if (parts.length === 0) return undefined;
  return parts.length === 1 ? parts[0] : and(...parts);
}

export async function listSubmissions(filters: SubmissionFilters): Promise<{
  rows: Submission[];
  total: number;
  page: number;
  pageCount: number;
}> {
  const db = getDb();
  const where = whereClause(filters);
  const page = Math.max(1, filters.page ?? 1);

  const [rows, [totals]] = await Promise.all([
    db
      .select()
      .from(submissions)
      .where(where)
      .orderBy(desc(submissions.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ value: count() }).from(submissions).where(where),
  ]);

  const total = totals?.value ?? 0;
  return {
    rows,
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

/** Unpaginated, for the CSV export. Capped so one click cannot pull a million rows. */
export async function allSubmissions(
  filters: SubmissionFilters,
  limit = 5000,
): Promise<Submission[]> {
  return getDb()
    .select()
    .from(submissions)
    .where(whereClause(filters))
    .orderBy(desc(submissions.createdAt))
    .limit(limit);
}

export async function getSubmission(id: string): Promise<Submission | null> {
  const [row] = await getDb()
    .select()
    .from(submissions)
    .where(eq(submissions.id, id))
    .limit(1);
  return row ?? null;
}

export type Overview = {
  total: number;
  new: number;
  lastWeek: number;
  handledShare: number;
  byType: { type: string; count: number }[];
  recent: Submission[];
};

export async function getOverview(): Promise<Overview> {
  const db = getDb();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [[totals], [fresh], [week], [handled], byType, recent] =
    await Promise.all([
      db.select({ value: count() }).from(submissions),
      db
        .select({ value: count() })
        .from(submissions)
        .where(eq(submissions.status, "new")),
      db
        .select({ value: count() })
        .from(submissions)
        .where(gte(submissions.createdAt, weekAgo)),
      db
        .select({ value: count() })
        .from(submissions)
        .where(eq(submissions.status, "done")),
      db
        .select({ type: submissions.type, count: count() })
        .from(submissions)
        .groupBy(submissions.type)
        .orderBy(sql`count(*) desc`),
      db
        .select()
        .from(submissions)
        .orderBy(desc(submissions.createdAt))
        .limit(8),
    ]);

  const total = totals?.value ?? 0;
  return {
    total,
    new: fresh?.value ?? 0,
    lastWeek: week?.value ?? 0,
    handledShare: total ? Math.round(((handled?.value ?? 0) / total) * 100) : 0,
    byType: byType.map((row) => ({ type: row.type, count: row.count })),
    recent,
  };
}
