import Link from "next/link";
import { requireAdmin } from "@/server/auth";
import { getOverview } from "@/server/queries/submissions";
import { Shell } from "@/components/admin/Shell";
import {
  EmptyState,
  StatTile,
  SubmissionsTable,
} from "@/components/admin/Pieces";
import { TYPE_LABELS } from "@/server/admin-labels";
import type { SubmissionType } from "@/server/db/schema";
import { badgeVariants } from "@/components/admin/ui/badge";
import { buttonVariants } from "@/components/admin/ui/button";
import { DbError } from "@/components/admin/DbError";
import { cn } from "@/lib/cn";

export default async function AdminOverviewPage() {
  const user = await requireAdmin();

  let overview;
  try {
    overview = await getOverview();
  } catch (error) {
    return (
      <Shell user={user} active="/admin" title="סקירה">
        <DbError error={error} />
      </Shell>
    );
  }

  return (
    <Shell user={user} active="/admin" title="סקירה">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="סך הפניות" value={overview.total} />
        <StatTile label="ממתינות לטיפול" value={overview.new} />
        <StatTile label="בשבוע האחרון" value={overview.lastWeek} />
        <StatTile label="טופלו" value={overview.handledShare} suffix="%" />
      </div>

      {overview.byType.length > 0 ? (
        <ul className="mt-4 flex list-none flex-wrap gap-2 p-0">
          {overview.byType.map((row) => (
            <li key={row.type}>
              {/* The type chip doubles as a filter link — same colours as the
                  table badges, so the legend and the data agree. */}
              <Link
                href={`/admin/submissions?type=${row.type}`}
                className={cn(
                  badgeVariants({ variant: row.type as SubmissionType }),
                  "px-3.5 py-2 text-[13px] transition-opacity hover:opacity-80",
                )}
              >
                {TYPE_LABELS[row.type as SubmissionType] ?? row.type}
                <bdi className="font-extrabold">{row.count}</bdi>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <section className="mt-9">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="m-0 text-[18px] font-bold">הפניות האחרונות</h2>
          <Link
            href="/admin/submissions"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            לכל הפניות
          </Link>
        </div>

        {overview.recent.length > 0 ? (
          <SubmissionsTable rows={overview.recent} />
        ) : (
          <EmptyState message="עוד לא התקבלו פניות. ברגע שמישהו ישלח טופס באתר, הוא יופיע כאן." />
        )}
      </section>
    </Shell>
  );
}
