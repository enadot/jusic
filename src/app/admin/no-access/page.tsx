import Link from "next/link";
import { buttonVariants } from "@/components/admin/ui/button";
import { signOut } from "@/server/actions/admin";
import { getAdminUser } from "@/server/auth";
import { site } from "@/content/site";

export const metadata = { title: "אין הרשאה" };

/**
 * Signed in, but not on ADMIN_EMAILS. Anyone can create a Neon Auth account,
 * so this is the wall between "has an account" and "may read the inbox".
 */
export default async function NoAccessPage() {
  const user = await getAdminUser();

  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-16">
      <div className="w-full max-w-[440px] text-center">
        <h1 className="m-0 text-[26px] font-extrabold tracking-[-0.01em]">
          אין לך הרשאה לאזור הזה
        </h1>
        <p className="mt-3 mb-0 text-[15px] leading-[1.6] text-[var(--text-secondary)]">
          {user ? (
            <>
              החשבון <bdi className="text-[var(--text-primary)]">{user.email}</bdi> אינו
              מורשה לגשת ללוח הבקרה. אם זו טעות, פנו למנהל המערכת בכתובת{" "}
              <a href={`mailto:${site.contactEmail}`} dir="ltr">
                {site.contactEmail}
              </a>
              .
            </>
          ) : (
            "צריך להתחבר עם חשבון מורשה."
          )}
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <form action={signOut}>
            <button type="submit" className={buttonVariants({ variant: "outline" })}>
              התנתקות
            </button>
          </form>
          <Link href="/" className={buttonVariants({ variant: "ghost" })}>
            חזרה לאתר
          </Link>
        </div>
      </div>
    </div>
  );
}
