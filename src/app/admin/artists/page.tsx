import { requireAdmin } from "@/server/auth";
import { listSubmissions } from "@/server/queries/submissions";
import { Shell } from "@/components/admin/Shell";
import { SubmissionsTable } from "@/components/admin/Pieces";
import { Filters, Pagination } from "@/components/admin/Filters";
import { DbError } from "@/components/admin/DbError";
import { parseFilters, type SearchParams } from "@/server/queries/params";

export const metadata = { title: "הצטרפות אמנים" };

/** The submissions list pinned to type=artist, with the stage name column on. */
export default async function AdminArtistsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const user = await requireAdmin();
  const raw = await searchParams;
  const filters = { ...parseFilters(raw), type: "artist" as const };

  let data;
  try {
    data = await listSubmissions(filters);
  } catch (error) {
    return (
      <Shell user={user} active="/admin/artists" title="הצטרפות אמנים">
        <DbError error={error} />
      </Shell>
    );
  }

  return (
    <Shell
      user={user}
      active="/admin/artists"
      title={`הצטרפות אמנים (${data.total})`}
    >
      <Filters
        action="/admin/artists"
        params={{ type: "artist", status: filters.status, q: filters.q }}
        lockedType
      />
      <SubmissionsTable rows={data.rows} showCatalog />
      <Pagination
        page={data.page}
        pageCount={data.pageCount}
        basePath="/admin/artists"
        params={{ status: filters.status, q: filters.q }}
      />
    </Shell>
  );
}
