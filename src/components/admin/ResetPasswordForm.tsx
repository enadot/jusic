"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/Field";
import { MIN_PASSWORD_LENGTH } from "@/lib/password";
import { resetPassword, type ResetState } from "@/server/actions/admin";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" block disabled={pending}>
      {pending ? "שומר…" : "שמירת הסיסמה"}
    </Button>
  );
}

/** Same shape as the sign-in field: TextField deliberately refuses passwords. */
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

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction] = useActionState<ResetState, FormData>(
    resetPassword,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error ? <FormError>{state.error}</FormError> : null}

      <input type="hidden" name="token" value={token} />
      <PasswordField
        name="password"
        label="סיסמה חדשה"
        hint={`לפחות ${MIN_PASSWORD_LENGTH} תווים.`}
      />
      <PasswordField name="confirmPassword" label="אימות הסיסמה" />

      <div className="mt-1">
        <SubmitButton />
      </div>
    </form>
  );
}
