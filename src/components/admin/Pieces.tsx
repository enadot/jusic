import Link from "next/link";
import { cn } from "@/lib/cn";
import type {
  Submission,
  SubmissionStatus,
  SubmissionType,
} from "@/server/db/schema";
import {
  formatDate,
  STATUS_LABELS,
  TYPE_LABELS,
} from "@/server/admin-labels";
import { Badge, type BadgeProps } from "@/components/admin/ui/badge";
import { Card } from "@/components/admin/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";

const STATUS_VARIANTS = new Set<SubmissionStatus>([
  "new",
  "in_progress",
  "done",
  "spam",
  "archived",
]);
const TYPE_VARIANTS = new Set<SubmissionType>([
  "bug",
  "idea",
  "artist",
  "copyright",
]);

export function StatusBadge({ status }: { status: string }) {
  const key = status as SubmissionStatus;
  const variant: BadgeProps["variant"] = STATUS_VARIANTS.has(key)
    ? key
    : "neutral";
  return (
    <Badge variant={variant} dot>
      {STATUS_LABELS[key] ?? status}
    </Badge>
  );
}

export function TypeBadge({ type }: { type: string }) {
  const key = type as SubmissionType;
  const variant: BadgeProps["variant"] = TYPE_VARIANTS.has(key)
    ? key
    : "neutral";
  return <Badge variant={variant}>{TYPE_LABELS[key] ?? type}</Badge>;
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
    <Card className="p-5">
      <p className="m-0 text-[13px] font-bold text-[var(--text-tertiary)]">
        {label}
      </p>
      <p className="mt-2 mb-0 font-[var(--font-display)] text-[30px] leading-none font-extrabold">
        <bdi>{value}</bdi>
        {suffix ? (
          <span className="ms-1 text-[17px] text-[var(--text-tertiary)]">
            {suffix}
          </span>
        ) : null}
      </p>
    </Card>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--border)] px-6 py-14 text-center">
      <p className="m-0 text-[15px] text-[var(--text-tertiary)]">{message}</p>
    </div>
  );
}

/**
 * Server-rendered table on the shadcn Table family. The name cell carries the
 * identity two-line pattern (initial circle, name over email) so the email
 * column disappears into it — one less column to scan, the layout Deel and
 * Plain use for people rows. Latin values stay wrapped in <bdi> so an email or
 * a timestamp cannot reorder the Hebrew around it.
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
    <Table className="min-w-[720px]">
      <TableHeader>
        <TableRow className="border-b border-[var(--border-subtle)]">
          <TableHead>פונה</TableHead>
          <TableHead>סוג</TableHead>
          <TableHead>{showCatalog ? "שם במה" : "תקציר"}</TableHead>
          <TableHead>סטטוס</TableHead>
          <TableHead>תאריך</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => {
          const payload = (row.payload ?? {}) as Record<string, unknown>;
          const stageName =
            typeof payload.stageName === "string" ? payload.stageName : "—";
          const initial = (row.name.trim()[0] ?? "?").toUpperCase();

          return (
            <TableRow key={row.id} className="hover:bg-[var(--ad-hover)]">
              <TableCell>
                <Link
                  href={`/admin/submissions/${row.id}`}
                  className="group flex items-center gap-3"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-input)] text-[13px] font-extrabold text-[var(--text-secondary)]"
                  >
                    <bdi>{initial}</bdi>
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-bold text-[var(--text-primary)] group-hover:text-[var(--cyan-300)]">
                      {row.name}
                    </span>
                    <span
                      dir="ltr"
                      className="block truncate text-[13px] text-[var(--text-tertiary)]"
                    >
                      {row.email}
                    </span>
                  </span>
                </Link>
              </TableCell>
              <TableCell>
                <TypeBadge type={row.type} />
              </TableCell>
              <TableCell
                className={cn("max-w-[320px] text-[var(--text-secondary)]")}
              >
                <span className="line-clamp-2">
                  {showCatalog ? stageName : row.message}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={row.status} />
              </TableCell>
              <TableCell className="whitespace-nowrap text-[13px] text-[var(--text-tertiary)]">
                <bdi>{formatDate(row.createdAt)}</bdi>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
