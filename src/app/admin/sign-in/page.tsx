import Link from "next/link";
import { SignInForm } from "@/components/admin/SignInForm";
import { getAdminUser, isAllowedAdmin } from "@/server/auth";
import { redirect } from "next/navigation";
import { site } from "@/content/site";

export const metadata = { title: "התחברות" };

export default async function SignInPage() {
  // Already signed in and allowed? Skip the form.
  const user = await getAdminUser();
  if (user && isAllowedAdmin(user.email)) redirect("/admin");

  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-16">
      <div className="w-full max-w-[400px]">
        <Link
          href="/"
          className="font-[var(--font-display)] text-[22px] font-extrabold tracking-[0.02em] text-text-primary"
        >
          {site.wordmark}
        </Link>
        <h1 className="mt-6 mb-1 text-[26px] font-extrabold tracking-[-0.01em]">
          התחברות ללוח הבקרה
        </h1>
        <p className="mt-0 mb-7 text-[15px] text-text-secondary">
          האזור הזה מיועד לצוות בלבד.
        </p>
        <SignInForm />
      </div>
    </div>
  );
}
