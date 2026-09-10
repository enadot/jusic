import Link from "next/link";
import { ForgotPasswordForm } from "@/components/admin/ForgotPasswordForm";
import { site } from "@/content/site";

export const metadata = { title: "איפוס סיסמה" };

export default function ForgotPasswordPage() {
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
        <h1 className="mt-0 mb-1 text-[24px] font-extrabold tracking-[-0.01em]">
          איפוס סיסמה
        </h1>
        <p className="mt-0 mb-7 text-[15px] leading-[1.6] text-[var(--text-secondary)]">
          נשלח קישור לבחירת סיסמה חדשה לכתובת שאיתה נרשמת.
        </p>
        <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
