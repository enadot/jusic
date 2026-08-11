"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { FormError, TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
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
