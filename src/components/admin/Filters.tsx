import Link from "next/link";
import { Download, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { buttonClass } from "@/components/ui/Button";
import { SUBMISSION_STATUSES, SUBMISSION_TYPES } from "@/server/db/schema";
import { STATUS_LABELS, TYPE_LABELS } from "@/server/admin-labels";

/**
 * Filters are a plain GET form. Driving them through the URL rather than client
 * state keeps every dashboard list a pure server component, makes any view
 * linkable, and lets the CSV export reuse the same query string verbatim.
 */
export function Filters({
  action,
  params,
  lockedType = false,
}: {
  action: string;
  params: { type?: string; status?: string; q?: string };
  lockedType?: boolean;
}) {
  const controlClass = cn(
    "h-10 rounded-[10px] border border-[var(--border)] bg-[var(--surface-input)] px-3 text-[14px]",
    "text-text-primary",
  );

  const exportQuery = new URLSearchParams(
    Object.entries(params).filter(([, value]) => Boolean(value)) as [
      string,
      string,
    ][],
  ).toString();

  return (
    <form
      action={action}
      method="get"
      className="mb-5 flex flex-wrap items-end gap-3"
    >
      <div className="flex-1 basis-[220px]">
        <label htmlFor="q" className="mb-1.5 block text-[13px] text-text-tertiary">
          חיפוש
        </label>
        <div className="relative">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 start-3 my-auto text-text-tertiary"
          />
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={params.q ?? ""}
            placeholder="שם, אימייל או תוכן"
            className={cn(controlClass, "w-full ps-9")}
          />
        </div>
      </div>

      {lockedType ? null : (
        <div>
          <label
            htmlFor="type"
            className="mb-1.5 block text-[13px] text-text-tertiary"
          >
            סוג
          </label>
          <select
            id="type"
            name="type"
            defaultValue={params.type ?? ""}
            className={controlClass}
          >
            <option value="">הכול</option>
            {SUBMISSION_TYPES.map((type) => (
              <option key={type} value={type}>
                {TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label
          htmlFor="status"
          className="mb-1.5 block text-[13px] text-text-tertiary"
        >
          סטטוס
        </label>
        <select
          id="status"
          name="status"
          defaultValue={params.status ?? ""}
          className={controlClass}
        >
          <option value="">הכול</option>
          {SUBMISSION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className={buttonClass({ size: "md" })}>
        סינון
      </button>

      <Link
        href={`/admin/submissions/export${exportQuery ? `?${exportQuery}` : ""}`}
        className={buttonClass({ variant: "outline", size: "md" })}
        prefetch={false}
      >
        <Download size={16} aria-hidden="true" />
        <span className="ms-1.5">ייצוא CSV</span>
      </Link>
    </form>
  );
}

export function Pagination({
  page,
  pageCount,
  params,
  basePath,
}: {
  page: number;
  pageCount: number;
  params: Record<string, string | undefined>;
  basePath: string;
}) {
  if (pageCount <= 1) return null;

  const link = (target: number) => {
    const query = new URLSearchParams(
      Object.entries({ ...params, page: String(target) }).filter(
        ([, value]) => Boolean(value),
      ) as [string, string][],
    );
    return `${basePath}?${query.toString()}`;
  };

  return (
    <nav
      aria-label="עימוד"
      className="mt-5 flex items-center justify-between gap-3 text-[14px]"
    >
      {page > 1 ? (
        <Link href={link(page - 1)} className={buttonClass({ variant: "outline", size: "sm" })}>
          הקודם
        </Link>
      ) : (
        <span />
      )}

      <span className="text-text-tertiary">
        עמוד <bdi>{page}</bdi> מתוך <bdi>{pageCount}</bdi>
      </span>

      {page < pageCount ? (
        <Link href={link(page + 1)} className={buttonClass({ variant: "outline", size: "sm" })}>
          הבא
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
