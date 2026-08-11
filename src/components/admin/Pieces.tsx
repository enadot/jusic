import Link from "next/link";
import { cn } from "@/lib/cn";
import type {
  Submission,
  SubmissionStatus,
  SubmissionType,
} from "@/server/db/schema";
import {
  formatDate,
  STATUS_CLASSES,
  STATUS_LABELS,
  TYPE_LABELS,
} from "@/server/admin-labels";

export function StatusBadge({ status }: { status: string }) {
  const key = status as SubmissionStatus;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[12px] font-bold whitespace-nowrap",
        STATUS_CLASSES[key] ?? STATUS_CLASSES.archived,
      )}
    >
      {STATUS_LABELS[key] ?? status}
    </span>
  );
}

export function TypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-white/[0.04] px-2.5 py-1 text-[12px] font-bold whitespace-nowrap text-text-secondary">
      {TYPE_LABELS[type as SubmissionType] ?? type}
    </span>
  );
}

export function StatTile({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5">
      <p className="m-0 text-[13px] text-text-tertiary">{label}</p>
      <p className="mt-1.5 mb-0 font-[var(--font-display)] text-[30px] leading-none font-extrabold">
        <bdi>{value}</bdi>
        {suffix ? (
          <span className="ms-1 text-[17px] text-text-tertiary">{suffix}</span>
        ) : null}
      </p>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-[14px] border border-dashed border-[var(--border)] px-6 py-14 text-center">
      <p className="m-0 text-[15px] text-text-tertiary">{message}</p>
    </div>
  );
}

const cellClass = "px-4 py-3 text-start align-top";

/**
 * Server-rendered table. Latin values are wrapped in <bdi> so an email or a
 * timestamp cannot reorder the Hebrew around it.
 */
export function SubmissionsTable({
  rows,
  showCatalog = false,
}: {
  rows: Submission[];
  showCatalog?: boolean;
}) {
  if (rows.length === 0) {
    return <EmptyState message="אין פניות שתואמות את הסינון." />;
  }

  return (
    <div className="overflow-x-auto rounded-[14px] border border-[var(--border-subtle)]">
      <table className="w-full min-w-[760px] border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-[var(--border)] bg-white/[0.02] text-[12px] tracking-[0.04em] text-text-tertiary uppercase">
            <th scope="col" className={cellClass}>
              תאריך
            </th>
            <th scope="col" className={cellClass}>
              סוג
            </th>
            <th scope="col" className={cellClass}>
              שם
            </th>
            <th scope="col" className={cellClass}>
              אימייל
            </th>
            {showCatalog ? (
              <th scope="col" className={cellClass}>
                שם במה
              </th>
            ) : (
              <th scope="col" className={cellClass}>
                תקציר
              </th>
            )}
            <th scope="col" className={cellClass}>
              סטטוס
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const payload = (row.payload ?? {}) as Record<string, unknown>;
            const stageName =
              typeof payload.stageName === "string" ? payload.stageName : "—";

            return (
              <tr
                key={row.id}
                className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-white/[0.03]"
              >
                <td className={cn(cellClass, "whitespace-nowrap text-text-tertiary")}>
                  <Link
                    href={`/admin/submissions/${row.id}`}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    <bdi>{formatDate(row.createdAt)}</bdi>
                  </Link>
                </td>
                <td className={cellClass}>
                  <TypeBadge type={row.type} />
                </td>
                <td className={cn(cellClass, "font-bold")}>
                  <Link
                    href={`/admin/submissions/${row.id}`}
                    className="text-text-primary hover:text-cyan-300"
                  >
                    {row.name}
                  </Link>
                </td>
                <td className={cellClass}>
                  <a
                    href={`mailto:${row.email}`}
                    dir="ltr"
                    className="text-text-secondary hover:text-cyan-300"
                  >
                    {row.email}
                  </a>
                </td>
                <td className={cn(cellClass, "max-w-[320px] text-text-secondary")}>
                  <span className="line-clamp-2">
                    {showCatalog ? stageName : row.message}
                  </span>
                </td>
                <td className={cellClass}>
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
