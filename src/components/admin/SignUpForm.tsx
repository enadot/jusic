"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import { FormError, TextField } from "@/components/ui/Field";
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

/** TextField refuses type="password" by design, so passwords are spelled out. */
function PasswordField({
  name,
  label,
  hint,
}: {
  name: string;
  label: string;
  hint?: string;
}) {
  const hintId = hint ? `${name}-hint` : undefined;

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-[14px] font-bold text-text-primary"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="password"
        autoComplete="new-password"
        minLength={MIN_PASSWORD_LENGTH}
        aria-describedby={hintId}
        dir="ltr"
        required
        className="mt-1.5 h-12 w-full rounded-[14px] border border-[var(--border)] bg-[var(--surface-input)] px-4 text-[15px] text-text-primary"
      />
      {hint ? (
        <p id={hintId} className="mt-1.5 mb-0 text-[13px] text-text-tertiary">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function SignUpForm() {
  const [state, formAction] = useActionState<SignUpState, FormData>(signUp, {});

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
          name="name"
          label="שם מלא"
          autoComplete="name"
          defaultValue={state.values?.name}
          required
        />
        <TextField
          name="email"
          label="אימייל"
          type="email"
          inputMode="email"
          autoComplete="username"
          dir="ltr"
          defaultValue={state.values?.email}
          required
        />
        <PasswordField
          name="password"
          label="סיסמה"
          hint={`לפחות ${MIN_PASSWORD_LENGTH} תווים.`}
        />
        <PasswordField name="confirmPassword" label="אימות הסיסמה" />

        <div className="mt-1">
          <SubmitButton />
        </div>
      </form>

      <p className="m-0 text-center text-[14px]">
        <Link
          href="/admin/sign-in"
          className="text-text-secondary underline underline-offset-4 hover:text-text-primary"
        >
          כבר יש לי חשבון
        </Link>
      </p>
    </div>
  );
}
