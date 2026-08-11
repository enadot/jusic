import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { requireAdmin } from "@/server/auth";
import { getSubmission } from "@/server/queries/submissions";
import { Shell } from "@/components/admin/Shell";
import { StatusBadge, TypeBadge } from "@/components/admin/Pieces";
import { DbError } from "@/components/admin/DbError";
import { Button, buttonClass } from "@/components/ui/Button";
import { setStatus, saveNotes } from "@/server/actions/admin";
import { SUBMISSION_STATUSES } from "@/server/db/schema";
import {
  catalogSizeLabel,
  formatDate,
  genreLabel,
  STATUS_LABELS,
} from "@/server/admin-labels";
import { cn } from "@/lib/cn";

export const metadata = { title: "פנייה" };

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-b border-[var(--border-subtle)] py-3 last:border-0 sm:grid sm:grid-cols-[160px_1fr] sm:gap-4">
      <dt className="text-[13px] text-text-tertiary">{label}</dt>
      <dd className="m-0 mt-1 text-[15px] break-words text-text-primary sm:mt-0">
        {children}
      </dd>
    </div>
  );
}

const ARTIST_FIELDS: {
  key: string;
  label: string;
  isLink?: boolean;
  format?: (value: unknown) => string | null;
}[] = [
  { key: "stageName", label: "שם במה" },
  { key: "genre", label: "סגנון", format: genreLabel },
  { key: "primaryLink", label: "קישור לחומרים", isLink: true },
  { key: "secondaryLink", label: "קישור נוסף", isLink: true },
  { key: "catalogSize", label: "גודל קטלוג", format: catalogSizeLabel },
];

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAdmin();
  const { id } = await params;

  let row;
  try {
    row = await getSubmission(id);
  } catch (error) {
    return (
      <Shell user={user} active="/admin/submissions" title="פנייה">
        <DbError error={error} />
      </Shell>
    );
  }

  if (!row) notFound();

  const payload = (row.payload ?? {}) as Record<string, unknown>;
  const utm = (row.utm ?? {}) as Record<string, string>;
  const utmEntries = Object.entries(utm);

  return (
    <Shell
      user={user}
      active="/admin/submissions"
      title={row.name}
      actions={
        <a
          href={`mailto:${row.email}?subject=${encodeURIComponent(`תשובה לפנייה שלך ב־Jusic`)}`}
          className={buttonClass({ variant: "outline", size: "sm" })}
        >
          השב במייל
        </a>
      }
    >
      <Link
        href="/admin/submissions"
        className="text-[14px] text-text-tertiary hover:text-text-primary"
      >
        ← חזרה לכל הפניות
      </Link>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <TypeBadge type={row.type} />
            <StatusBadge status={row.status} />
          </div>

          <dl className="m-0">
            <Row label="התקבלה">
              <bdi>{formatDate(row.createdAt)}</bdi>
            </Row>
            <Row label="שם">{row.name}</Row>
            <Row label="אימייל">
              <a href={`mailto:${row.email}`} dir="ltr" className="hover:text-cyan-300">
                {row.email}
              </a>
            </Row>
            {row.phone ? (
              <Row label="טלפון">
                <a href={`tel:${row.phone}`} dir="ltr" className="hover:text-cyan-300">
                  {row.phone}
                </a>
              </Row>
            ) : null}

            {row.type === "artist"
              ? ARTIST_FIELDS.map((field) => {
                  const raw = payload[field.key];
                  if (typeof raw !== "string" || !raw) return null;
                  const value = field.format ? (field.format(raw) ?? raw) : raw;
                  return (
                    <Row key={field.key} label={field.label}>
                      {field.isLink ? (
                        <a
                          href={raw}
                          target="_blank"
                          rel="noopener noreferrer"
                          dir="ltr"
                          className="break-all hover:text-cyan-300"
                        >
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </Row>
                  );
                })
              : null}

            {row.type === "artist" ? (
              <Row label="מופץ דיגיטלית">
                {payload.isDistributed === true ? "כן" : "לא"}
              </Row>
            ) : null}

            <Row label="ההודעה">
              <span className="whitespace-pre-wrap">{row.message}</span>
            </Row>
          </dl>
        </div>

        <div className="flex flex-col gap-5">
          <section className="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5">
            <h2 className="m-0 text-[15px] font-bold">סטטוס</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {SUBMISSION_STATUSES.map((status) => (
                <form key={status} action={setStatus}>
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="status" value={status} />
                  <button
                    type="submit"
                    disabled={row.status === status}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-[13px] font-bold",
                      "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
                      row.status === status
                        ? "border-cyan-500 bg-cyan-500/15 text-cyan-300"
                        : "border-[var(--border)] text-text-secondary hover:bg-white/[0.06] hover:text-text-primary",
                    )}
                  >
                    {STATUS_LABELS[status]}
                  </button>
                </form>
              ))}
            </div>
            {row.handledBy ? (
              <p className="mt-3 mb-0 text-[13px] text-text-tertiary">
                עודכן לאחרונה על ידי <bdi>{row.handledBy}</bdi>
                {row.handledAt ? (
                  <>
                    {" · "}
                    <bdi>{formatDate(row.handledAt)}</bdi>
                  </>
                ) : null}
              </p>
            ) : null}
          </section>

          <section className="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5">
            <h2 className="m-0 text-[15px] font-bold">פתק פנימי</h2>
            <form action={saveNotes} className="mt-3">
              <input type="hidden" name="id" value={row.id} />
              <label htmlFor="adminNotes" className="sr-only">
                פתק פנימי
              </label>
              <textarea
                id="adminNotes"
                name="adminNotes"
                rows={4}
                defaultValue={row.adminNotes ?? ""}
                className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface-input)] p-3 text-[14px] leading-[1.6] text-text-primary"
              />
              <div className="mt-3">
                <Button type="submit" variant="outline" size="sm">
                  שמירה
                </Button>
              </div>
            </form>
          </section>

          <section className="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5">
            <h2 className="m-0 text-[15px] font-bold">מקור</h2>
            <dl className="m-0 mt-2 text-[13px]">
              <Row label="מיקום הכפתור">{row.placement ?? "—"}</Row>
              <Row label="עמוד">
                <bdi>{row.pagePath ?? "—"}</bdi>
              </Row>
              {utmEntries.length > 0 ? (
                utmEntries.map(([key, value]) => (
                  <Row key={key} label={key}>
                    <bdi>{value}</bdi>
                  </Row>
                ))
              ) : (
                <Row label="UTM">—</Row>
              )}
            </dl>
          </section>
        </div>
      </div>
    </Shell>
  );
}
