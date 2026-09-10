import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, isAllowedAdmin } from "@/server/auth";
import { allSubmissions } from "@/server/queries/submissions";
import { parseFilters } from "@/server/queries/params";
import {
  catalogSizeLabel,
  genreLabel,
  STATUS_LABELS,
  TYPE_LABELS,
} from "@/server/admin-labels";
import type { SubmissionStatus, SubmissionType } from "@/server/db/schema";

export const dynamic = "force-dynamic";

const COLUMNS = [
  "תאריך",
  "סוג",
  "סטטוס",
  "שם",
  "אימייל",
  "טלפון",
  "הודעה",
  "שם במה",
  "סגנון",
  "קישור",
  "גודל קטלוג",
  "מקור",
  "עמוד",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "פתק פנימי",
];

/** RFC 4180 quoting: double the quotes, wrap anything with a separator. */
function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export async function GET(request: NextRequest) {
  // A route handler is not covered by requireAdmin()'s redirect contract, so
  // check both halves here explicitly.
  const user = await getAdminUser();
  if (!user || !(await isAllowedAdmin(user.email))) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const filters = parseFilters(
    Object.fromEntries(request.nextUrl.searchParams.entries()),
  );

  let rows;
  try {
    rows = await allSubmissions(filters);
  } catch (error) {
    console.error("[export]", error);
    return new NextResponse("Export failed", { status: 500 });
  }

  const lines = [COLUMNS.join(",")];

  for (const row of rows) {
    const payload = (row.payload ?? {}) as Record<string, unknown>;
    const utm = (row.utm ?? {}) as Record<string, string>;

    lines.push(
      [
        row.createdAt.toISOString(),
        TYPE_LABELS[row.type as SubmissionType] ?? row.type,
        STATUS_LABELS[row.status as SubmissionStatus] ?? row.status,
        row.name,
        row.email,
        row.phone,
        row.message,
        payload.stageName,
        genreLabel(payload.genre),
        payload.primaryLink,
        catalogSizeLabel(payload.catalogSize),
        row.placement,
        row.pagePath,
        utm.utm_source,
        utm.utm_medium,
        utm.utm_campaign,
        row.adminNotes,
      ]
        .map(cell)
        .join(","),
    );
  }

  // The BOM is what makes Excel read the file as UTF-8; without it the Hebrew
  // columns open as mojibake.
  const body = `﻿${lines.join("\r\n")}`;
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(body, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="jusic-submissions-${stamp}.csv"`,
      "cache-control": "no-store",
    },
  });
}
