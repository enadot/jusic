"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/admin/ui/button";
import { AdminField, Alert } from "@/components/admin/ui/field";
import { GoogleButton } from "./GoogleButton";
import { signIn, type SignInState } from "@/server/actions/admin";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" block disabled={pending}>
      {pending ? "מתחבר…" : "התחברות"}
    </Button>
  );
}

export function SignInForm() {
  const [state, formAction] = useActionState<SignInState, FormData>(signIn, {});

  return (
    <div className="flex flex-col gap-5">
      <GoogleButton />

      <div
        className="flex items-center gap-3 text-[13px] text-[var(--text-tertiary)]"
        aria-hidden="true"
      >
        <span className="h-px flex-1 bg-[var(--border)]" />
        או
        <span className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        {state.error ? <Alert>{state.error}</Alert> : null}

        <AdminField
          name="email"
          label="אימייל"
          type="email"
          inputMode="email"
          autoComplete="username"
          dir="ltr"
          required
        />
        <AdminField
          name="password"
          label="סיסמה"
          type="password"
          autoComplete="current-password"
          dir="ltr"
          required
        />

        <div className="mt-1">
          <SubmitButton />
        </div>
      </form>

      <p className="m-0 flex flex-wrap justify-center gap-x-3 gap-y-1 text-center text-[14px]">
        <Link
          href="/admin/forgot-password"
          className="text-[var(--text-secondary)] underline underline-offset-4 hover:text-[var(--text-primary)]"
        >
          שכחתי סיסמה
        </Link>
        <span aria-hidden="true" className="text-[var(--text-tertiary)]">
          ·
        </span>
        <Link
          href="/admin/sign-up"
          className="text-[var(--text-secondary)] underline underline-offset-4 hover:text-[var(--text-primary)]"
        >
          יצירת חשבון
        </Link>
      </p>
    </div>
  );
}
