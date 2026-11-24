import Link from "next/link";
import { Download, Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";
import { SUBMISSION_STATUSES, SUBMISSION_TYPES } from "@/server/db/schema";
import { STATUS_LABELS, TYPE_LABELS } from "@/server/admin-labels";
import { Button, buttonVariants } from "@/components/admin/ui/button";
import { Input, Label } from "@/components/admin/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";

/**
 * Filters are a plain GET form. Driving them through the URL rather than client
 * state keeps every dashboard list a pure server component, makes any view
 * linkable, and lets the CSV export reuse the same query string verbatim.
 *
 * The selects are Radix (via the admin ui kit) with a `name`, so they submit
 * through the same GET form via Radix's hidden native select. Radix items may
 * not carry an empty value, so "הכול" submits the sentinel "all" — a value
 * parseFilters' whitelist drops, which is exactly what empty meant.
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
        <Label htmlFor="q">חיפוש</Label>
        <div className="relative">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 start-3 my-auto text-[var(--text-tertiary)]"
          />
          <Input
            id="q"
            name="q"
            type="search"
            defaultValue={params.q ?? ""}
            placeholder="שם, אימייל או תוכן"
            className="ps-9"
          />
        </div>
      </div>

      {lockedType ? null : (
        <div className="w-[170px]">
          <Label htmlFor="type">סוג</Label>
          <Select name="type" defaultValue={params.type || "all"}>
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">הכול</SelectItem>
              {SUBMISSION_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="w-[170px]">
        <Label htmlFor="status">סטטוס</Label>
        <Select name="status" defaultValue={params.status || "all"}>
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">הכול</SelectItem>
            {SUBMISSION_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit">
        <SlidersHorizontal size={15} aria-hidden="true" />
        סינון
      </Button>

      <Link
        href={`/admin/submissions/export${exportQuery ? `?${exportQuery}` : ""}`}
        className={buttonVariants({ variant: "outline" })}
        prefetch={false}
      >
        <Download size={16} aria-hidden="true" />
        ייצוא CSV
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
        <Link
          href={link(page - 1)}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          הקודם
        </Link>
      ) : (
        <span />
      )}

      <span className="text-[var(--text-tertiary)]">
        עמוד <bdi>{page}</bdi> מתוך <bdi>{pageCount}</bdi>
      </span>

      {page < pageCount ? (
        <Link
          href={link(page + 1)}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          הבא
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
