import { Trash2 } from "lucide-react";
import { requireAdmin, envAdminEmails, isRootAdmin } from "@/server/auth";
import { listAllowlist } from "@/server/queries/admins";
import { formatDate } from "@/server/admin-labels";
import { removeAdmin } from "@/server/actions/admin";
import { Shell } from "@/components/admin/Shell";
import { DbError } from "@/components/admin/DbError";
import { EmptyState } from "@/components/admin/Pieces";
import { TeamForm } from "@/components/admin/TeamForm";
import { Badge } from "@/components/admin/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";

export const metadata = { title: "ניהול גישה" };

/**
 * Who may open the dashboard. Two lists, shown as two sections because they
 * behave differently and hiding that would be a trap:
 *
 * - Root admins come from the ADMIN_EMAILS environment variable. Listed but
 *   not removable — the screen cannot revoke what it does not own, and this is
 *   deliberately the one way in that surviving an emptied table.
 * - Everyone else is a row in admin_allowlist, added and removed here, live.
 */
export default async function TeamPage() {
  const user = await requireAdmin();

  let rows;
  try {
    rows = await listAllowlist();
  } catch (error) {
    return (
      <Shell user={user} active="/admin/team" title="ניהול גישה">
        <DbError error={error} />
      </Shell>
    );
  }

  const roots = envAdminEmails();
  const viewerIsRoot = isRootAdmin(user.email);

  return (
    <Shell user={user} active="/admin/team" title="ניהול גישה">
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle>הוספת איש צוות</CardTitle>
              <CardDescription>
                הכתובת חייבת להיות זהה לזו שאיתה הוא מתחבר ל־Google או נרשם עם
                סיסמה. ההרשאה נכנסת לתוקף מיד.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TeamForm />
            </CardContent>
          </Card>

          <section>
            <h2 className="mt-0 mb-3 text-[15px] font-bold">
              מורשים מהדשבורד{" "}
              <span className="font-normal text-[var(--text-tertiary)]">
                (<bdi>{rows.length}</bdi>)
              </span>
            </h2>
            {rows.length === 0 ? (
              <EmptyState message="עוד לא הוספתם אף אחד כאן. כרגע נכנסים רק המורשים הקבועים." />
            ) : (
              <Table className="min-w-[560px]">
                <TableHeader>
                  <TableRow className="border-b border-[var(--border-subtle)]">
                    <TableHead>אימייל</TableHead>
                    <TableHead>שם או תפקיד</TableHead>
                    <TableHead>נוסף</TableHead>
                    <TableHead>
                      <span className="sr-only">הסרה</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => {
                    // Removing your own row locks you out of the screen you
                    // are on — the action refuses it, so the button says so
                    // rather than failing silently.
                    const isSelf =
                      row.email === user.email.toLowerCase() && !viewerIsRoot;
                    return (
                      <TableRow key={row.id} className="hover:bg-[var(--ad-hover)]">
                        <TableCell dir="ltr" className="font-bold">
                          {row.email}
                        </TableCell>
                        <TableCell className="text-[var(--text-secondary)]">
                          {row.note ?? "—"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-[13px] text-[var(--text-tertiary)]">
                          <bdi>{formatDate(row.createdAt)}</bdi>
                          {row.addedBy ? (
                            <span className="block">
                              על ידי <bdi>{row.addedBy}</bdi>
                            </span>
                          ) : null}
                        </TableCell>
                        <TableCell className="text-end">
                          {isSelf ? (
                            <span className="text-[13px] text-[var(--text-tertiary)]">
                              זה אתם
                            </span>
                          ) : (
                            <form action={removeAdmin}>
                              <input type="hidden" name="id" value={row.id} />
                              <button
                                type="submit"
                                aria-label={`הסרת ההרשאה של ${row.email}`}
                                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[var(--text-tertiary)] transition-colors duration-[var(--dur-fast)] ease-[var(--ease-standard)] hover:bg-[var(--chip-spam-bg)] hover:text-[var(--chip-spam-fg)]"
                              >
                                <Trash2 size={16} aria-hidden="true" />
                              </button>
                            </form>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </section>
        </div>

        <Card className="self-start">
          <CardHeader>
            <CardTitle>מורשים קבועים</CardTitle>
            <CardDescription>
              מוגדרים במשתנה הסביבה <bdi>ADMIN_EMAILS</bdi> ואי אפשר להסיר אותם
              מכאן. הם הדרך חזרה פנימה אם הרשימה למעלה תתרוקן.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-3">
            {roots.length === 0 ? (
              <p className="m-0 text-[13px] text-[var(--chip-spam-fg)]">
                אין אף מורשה קבוע. הוסיפו לפחות כתובת אחת ל־
                <bdi>ADMIN_EMAILS</bdi> — בלעדיה, רשימה ריקה נועלת את כולם.
              </p>
            ) : (
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {roots.map((email) => (
                  <li key={email} className="flex items-center gap-2">
                    <Badge variant="new">קבוע</Badge>
                    <bdi className="truncate text-[13px] text-[var(--text-secondary)]">
                      {email}
                    </bdi>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
