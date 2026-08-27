"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/admin/ui/button";
import { AdminField, Alert } from "@/components/admin/ui/field";
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

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction] = useActionState<ResetState, FormData>(
    resetPassword,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error ? <Alert>{state.error}</Alert> : null}

      <input type="hidden" name="token" value={token} />
      <AdminField
        name="password"
        label="סיסמה חדשה"
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
  );
}
