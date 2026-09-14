"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/admin/ui/button";
import { AdminField, Alert } from "@/components/admin/ui/field";
import { MIN_PASSWORD_LENGTH } from "@/lib/password";
import { signUp, type SignUpState } from "@/server/actions/admin";
import { GoogleButton } from "./GoogleButton";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" block disabled={pending}>
      {pending ? "יוצר חשבון…" : "יצירת חשבון"}
    </Button>
  );
}

export function SignUpForm() {
  const [state, formAction] = useActionState<SignUpState, FormData>(signUp, {});

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
          name="name"
          label="שם מלא"
          autoComplete="name"
          defaultValue={state.values?.name}
          required
        />
        <AdminField
          name="email"
          label="אימייל"
          type="email"
          inputMode="email"
          autoComplete="username"
          dir="ltr"
          defaultValue={state.values?.email}
          required
        />
        <AdminField
          name="password"
          label="סיסמה"
          type="password"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          dir="ltr"
          required
          hint={`לפחות ${MIN_PASSWORD_LENGTH} תווים.`}
        />
        <AdminField
          name="confirmPassword"
          label="אימות הסיסמה"
          type="password"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          dir="ltr"
          required
        />

        <div className="mt-1">
          <SubmitButton />
        </div>
      </form>

      <p className="m-0 text-center text-[14px]">
        <Link
          href="/admin/sign-in"
          className="text-[var(--text-secondary)] underline underline-offset-4 hover:text-[var(--text-primary)]"
        >
          כבר יש לי חשבון
        </Link>
      </p>
    </div>
  );
}
