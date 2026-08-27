import Link from "next/link";
import { redirect } from "next/navigation";
import { SignUpForm } from "@/components/admin/SignUpForm";
import { getAdminUser, isAllowedAdmin } from "@/server/auth";
import { site } from "@/content/site";

export const metadata = { title: "יצירת חשבון" };

/**
 * How a team member gets an account at all.
 *
 * The Neon console can create a user but cannot give it a password, so a user
 * made there cannot sign in. Registering here needs neither the console nor a
 * working project mailbox — only an address already on ADMIN_EMAILS, which the
 * action checks before it creates anything.
 */
export default async function SignUpPage() {
  const user = await getAdminUser();
  if (user && isAllowedAdmin(user.email)) redirect("/admin");

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
          יצירת חשבון לצוות
        </h1>
        <p className="mt-0 mb-7 text-[15px] leading-[1.6] text-[var(--text-secondary)]">
          החשבון נפתח רק לכתובות שהוגדרו מראש כמורשות.
        </p>
        <SignUpForm />
        </div>
      </div>
    </div>
  );
}
