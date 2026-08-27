import Link from "next/link";
import { ResetPasswordForm } from "@/components/admin/ResetPasswordForm";
import { buttonVariants } from "@/components/admin/ui/button";
import { site } from "@/content/site";

export const metadata = { title: "בחירת סיסמה חדשה" };

/**
 * Where the emailed link lands. Neon Auth validates the token first and then
 * redirects here with either ?token= or ?error=INVALID_TOKEN, so this page
 * never sees an unvalidated token — but it still has to handle the failure.
 */
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;

  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-16">
      <div className="w-full max-w-[400px]">
        <Link
          href="/"
          className="font-[var(--font-display)] text-[22px] font-extrabold tracking-[0.02em] text-[var(--text-primary)]"
        >
          {site.wordmark}
        </Link>

        <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-[var(--shadow-card)]">
        {token && !error ? (
          <>
            <h1 className="mt-0 mb-1 text-[24px] font-extrabold tracking-[-0.01em]">
              בחירת סיסמה חדשה
            </h1>
            <p className="mt-0 mb-7 text-[15px] leading-[1.6] text-[var(--text-secondary)]">
              אחרי השמירה אפשר להתחבר עם הסיסמה החדשה.
            </p>
            <ResetPasswordForm token={token} />
          </>
        ) : (
          <>
            <h1 className="mt-0 mb-1 text-[24px] font-extrabold tracking-[-0.01em]">
              הקישור אינו בתוקף
            </h1>
            <p className="mt-0 mb-7 text-[15px] leading-[1.6] text-[var(--text-secondary)]">
              קישורי איפוס תקפים לשעה אחת ולשימוש אחד. אפשר לבקש קישור חדש.
            </p>
            <Link
              href="/admin/forgot-password"
              className={buttonVariants({ size: "lg", block: true })}
            >
              בקשת קישור חדש
            </Link>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
