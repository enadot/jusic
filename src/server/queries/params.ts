import {
  SUBMISSION_STATUSES,
  SUBMISSION_TYPES,
  type SubmissionStatus,
  type SubmissionType,
} from "../db/schema";
import type { SubmissionFilters } from "./submissions";

export type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

/**
 * Whitelists the query string before it reaches a query. Anything unrecognised
 * is dropped rather than passed through, so a hand-edited URL can only ever
 * narrow the result set.
 */
export function parseFilters(params: SearchParams): SubmissionFilters {
  const type = first(params.type);
  const status = first(params.status);
  const q = first(params.q)?.trim();
  const page = Number(first(params.page));

  return {
    type: (SUBMISSION_TYPES as readonly string[]).includes(type ?? "")
      ? (type as SubmissionType)
      : undefined,
    status: (SUBMISSION_STATUSES as readonly string[]).includes(status ?? "")
      ? (status as SubmissionStatus)
      : undefined,
    q: q ? q.slice(0, 120) : undefined,
    page: Number.isFinite(page) && page > 0 ? Math.floor(page) : 1,
  };
}
