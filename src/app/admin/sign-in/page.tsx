import Link from "next/link";
import { SignInForm } from "@/components/admin/SignInForm";
import { getAdminUser, isAllowedAdmin } from "@/server/auth";
import { redirect } from "next/navigation";
import { site } from "@/content/site";
import { Notice } from "@/components/admin/ui/field";

export const metadata = { title: "התחברות" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string }>;
}) {
  // Already signed in and allowed? Skip the form.
  const user = await getAdminUser();
  if (user && (await isAllowedAdmin(user.email))) redirect("/admin");

  const { reset } = await searchParams;

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
          התחברות ללוח הבקרה
        </h1>
        <p className="mt-0 mb-7 text-[15px] text-[var(--text-secondary)]">
          האזור הזה מיועד לצוות בלבד.
        </p>
        {reset ? (
          <div className="mb-6">
            <Notice>הסיסמה עודכנה. אפשר להתחבר.</Notice>
          </div>
        ) : null}
        <SignInForm />
        </div>
      </div>
    </div>
  );
}
