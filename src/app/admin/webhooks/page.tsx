import { Pause, Play, Send, Trash2 } from "lucide-react";
import { requireAdmin } from "@/server/auth";
import { listWebhooks } from "@/server/queries/webhooks";
import { formatDate } from "@/server/admin-labels";
import { removeWebhook, testWebhook, toggleWebhook } from "@/server/actions/admin";
import { Shell } from "@/components/admin/Shell";
import { DbError } from "@/components/admin/DbError";
import { EmptyState } from "@/components/admin/Pieces";
import { WebhookForm } from "@/components/admin/WebhookForm";
import { Badge } from "@/components/admin/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { cn } from "@/lib/cn";

export const metadata = { title: "Webhooks" };

const iconButton = cn(
  "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full",
  "text-[var(--text-tertiary)] hover:bg-[var(--ad-hover)] hover:text-[var(--text-primary)]",
  "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
);

/**
 * Where new submissions are pushed. Each row is POSTed the same JSON the Make
 * integration receives, so a scenario written against one works against any.
 *
 * The last attempt is shown per row because the only question anyone brings to
 * this screen is whether the endpoint is answering — and the test button makes
 * that answerable without waiting for a real visitor.
 */
export default async function WebhooksPage() {
  const user = await requireAdmin();

  let rows;
  try {
    rows = await listWebhooks();
  } catch (error) {
    return (
      <Shell user={user} active="/admin/webhooks" title="Webhooks">
        <DbError error={error} />
      </Shell>
    );
  }

  const envDestination = Boolean(process.env.MAKE_WEBHOOK_URL);

  return (
    <Shell user={user} active="/admin/webhooks" title="Webhooks">
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle>הוספת יעד</CardTitle>
              <CardDescription>
                כל פנייה חדשה תישלח בבקשת <bdi>POST</bdi> לכל היעדים הפעילים,
                מיד עם השמירה ובלי להאט את הטופס.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WebhookForm />
            </CardContent>
          </Card>

          <section>
            <h2 className="mt-0 mb-3 text-[15px] font-bold">
              יעדים{" "}
              <span className="font-normal text-[var(--text-tertiary)]">
                (<bdi>{rows.length}</bdi>)
              </span>
            </h2>

            {rows.length === 0 ? (
              <EmptyState message="עוד לא הוגדר יעד. הוסיפו כתובת למעלה כדי לקבל כל פנייה חדשה." />
            ) : (
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {rows.map((row) => {
                  const ok =
                    row.lastStatus !== null &&
                    row.lastStatus >= 200 &&
                    row.lastStatus < 300;
                  return (
                    <li key={row.id}>
                      <Card className="p-4">
                        <div className="flex flex-wrap items-start gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="mb-1.5 flex flex-wrap items-center gap-2">
                              <Badge
                                variant={row.enabled ? "done" : "archived"}
                                dot
                              >
                                {row.enabled ? "פעיל" : "מושהה"}
                              </Badge>
                              {row.secret ? (
                                <Badge variant="neutral">חתום</Badge>
                              ) : null}
                              {row.description ? (
                                <span className="text-[14px] font-bold">
                                  {row.description}
                                </span>
                              ) : null}
                            </div>
                            <p
                              dir="ltr"
                              className="m-0 truncate text-start font-mono text-[13px] text-[var(--text-secondary)]"
                            >
                              {row.url}
                            </p>
                            <p className="mt-1.5 mb-0 text-[13px] text-[var(--text-tertiary)]">
                              {row.lastAttemptAt ? (
                                <>
                                  שליחה אחרונה:{" "}
                                  <span
                                    className={
                                      ok
                                        ? "text-[var(--chip-done-fg)]"
                                        : "text-[var(--chip-spam-fg)]"
                                    }
                                  >
                                    {ok ? "הצליחה" : (row.lastError ?? "נכשלה")}
                                  </span>{" "}
                                  · <bdi>{formatDate(row.lastAttemptAt)}</bdi>
                                </>
                              ) : (
                                "עוד לא נשלחה אליו אף פנייה."
                              )}
                            </p>
                          </div>

                          <div className="flex items-center gap-1">
                            <form action={testWebhook}>
                              <input type="hidden" name="id" value={row.id} />
                              <button
                                type="submit"
                                aria-label={`שליחת בדיקה אל ${row.url}`}
                                title="שליחת פנייה לדוגמה"
                                className={iconButton}
                              >
                                <Send size={16} aria-hidden="true" />
                              </button>
                            </form>
                            <form action={toggleWebhook}>
                              <input type="hidden" name="id" value={row.id} />
                              <button
                                type="submit"
                                aria-label={
                                  row.enabled
                                    ? `השהיית ${row.url}`
                                    : `הפעלת ${row.url}`
                                }
                                title={row.enabled ? "השהיה" : "הפעלה"}
                                className={iconButton}
                              >
                                {row.enabled ? (
                                  <Pause size={16} aria-hidden="true" />
                                ) : (
                                  <Play size={16} aria-hidden="true" />
                                )}
                              </button>
                            </form>
                            <form action={removeWebhook}>
                              <input type="hidden" name="id" value={row.id} />
                              <button
                                type="submit"
                                aria-label={`מחיקת ${row.url}`}
                                title="מחיקה"
                                className={cn(
                                  iconButton,
                                  "hover:bg-[var(--chip-spam-bg)] hover:text-[var(--chip-spam-fg)]",
                                )}
                              >
                                <Trash2 size={16} aria-hidden="true" />
                              </button>
                            </form>
                          </div>
                        </div>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <div className="flex flex-col gap-5 self-start">
          <Card>
            <CardHeader>
              <CardTitle>מה נשלח</CardTitle>
              <CardDescription>
                גוף הבקשה זהה לכל היעדים. תאריך בתקן <bdi>ISO 8601</bdi>.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-3">
              <pre
                dir="ltr"
                className="m-0 overflow-x-auto rounded-[var(--radius-sm)] bg-[var(--ad-code-bg)] p-3 text-start font-mono text-[12px] leading-[1.6] text-[var(--text-secondary)]"
              >{`{
  "id": "…",
  "type": "bug | idea | artist | copyright",
  "status": "new",
  "createdAt": "2026-08-28T09:00:00.000Z",
  "name": "…",
  "email": "…",
  "phone": null,
  "message": "…",
  "payload": null,
  "utm": null,
  "placement": "footer",
  "pagePath": "/",
  "adminUrl": "…/admin/submissions/…"
}`}</pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>יעד קבוע</CardTitle>
              <CardDescription>
                מוגדר במשתנה הסביבה <bdi>MAKE_WEBHOOK_URL</bdi> ואי אפשר לנהל
                אותו מכאן.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-3">
              <p className="m-0 text-[13px] text-[var(--text-secondary)]">
                {envDestination
                  ? "מוגדר ופעיל. הוא מקבל כל פנייה בנוסף ליעדים שלמעלה."
                  : "לא מוגדר. כרגע נשלחות פניות רק ליעדים שלמעלה."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
