"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { FormError, TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
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
        className="flex items-center gap-3 text-[13px] text-text-tertiary"
        aria-hidden="true"
      >
        <span className="h-px flex-1 bg-[var(--border)]" />
        או
        <span className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        {state.error ? <FormError>{state.error}</FormError> : null}

        <TextField
          name="email"
          label="אימייל"
          type="email"
          inputMode="email"
          autoComplete="username"
          dir="ltr"
          required
        />
        <PasswordField />

        <div className="mt-1">
          <SubmitButton />
        </div>
      </form>

      <p className="m-0 flex flex-wrap justify-center gap-x-3 gap-y-1 text-center text-[14px]">
        <Link
          href="/admin/forgot-password"
          className="text-text-secondary underline underline-offset-4 hover:text-text-primary"
        >
          שכחתי סיסמה
        </Link>
        <span aria-hidden="true" className="text-text-tertiary">
          ·
        </span>
        <Link
          href="/admin/sign-up"
          className="text-text-secondary underline underline-offset-4 hover:text-text-primary"
        >
          יצירת חשבון
        </Link>
      </p>
    </div>
  );
}

/**
 * Not a TextField: that component intentionally does not accept type="password",
 * so that a password can never be introduced into a public marketing form by
 * passing a prop.
 */
function PasswordField() {
  return (
    <div>
      <label
        htmlFor="password"
        className="block text-[14px] font-bold text-text-primary"
      >
        סיסמה
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        dir="ltr"
        required
        className="mt-1.5 h-12 w-full rounded-[14px] border border-[var(--border)] bg-[var(--surface-input)] px-4 text-[15px] text-text-primary"
      />
    </div>
  );
}
