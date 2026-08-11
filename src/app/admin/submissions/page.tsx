import { requireAdmin } from "@/server/auth";
import { listSubmissions } from "@/server/queries/submissions";
import { Shell } from "@/components/admin/Shell";
import { SubmissionsTable } from "@/components/admin/Pieces";
import { Filters, Pagination } from "@/components/admin/Filters";
import { DbError } from "@/components/admin/DbError";
import { parseFilters, type SearchParams } from "@/server/queries/params";

export const metadata = { title: "כל הפניות" };

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const user = await requireAdmin();
  const raw = await searchParams;
  const filters = parseFilters(raw);

  let data;
  try {
    data = await listSubmissions(filters);
  } catch (error) {
    return (
      <Shell user={user} active="/admin/submissions" title="כל הפניות">
        <DbError error={error} />
      </Shell>
    );
  }

  return (
    <Shell
      user={user}
      active="/admin/submissions"
      title={`כל הפניות (${data.total})`}
    >
      <Filters
        action="/admin/submissions"
        params={{ type: filters.type, status: filters.status, q: filters.q }}
      />
      <SubmissionsTable rows={data.rows} />
      <Pagination
        page={data.page}
        pageCount={data.pageCount}
        basePath="/admin/submissions"
        params={{ type: filters.type, status: filters.status, q: filters.q }}
      />
    </Shell>
  );
}
