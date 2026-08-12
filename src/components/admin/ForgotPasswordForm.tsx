"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import { FormError, FormSuccess, TextField } from "@/components/ui/Field";
import {
  requestPasswordReset,
  type ResetRequestState,
} from "@/server/actions/admin";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" block disabled={pending}>
      {pending ? "שולח…" : "שליחת קישור לאיפוס"}
    </Button>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState<ResetRequestState, FormData>(
    requestPasswordReset,
    {},
  );

  if (state.sent) {
    return (
      <FormSuccess
        title="הקישור נשלח"
        body="אם קיים חשבון עם הכתובת הזו, ישלח אליה קישור לבחירת סיסמה חדשה. הקישור תקף לשעה אחת."
      >
        <Link
          href="/admin/sign-in"
          className="text-[14px] text-text-secondary underline underline-offset-4 hover:text-text-primary"
        >
          חזרה להתחברות
        </Link>
      </FormSuccess>
    );
  }

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

      <div className="mt-1">
        <SubmitButton />
      </div>

      <p className="m-0 text-center text-[14px]">
        <Link
          href="/admin/sign-in"
          className="text-text-secondary underline underline-offset-4 hover:text-text-primary"
        >
          חזרה להתחברות
        </Link>
      </p>
    </form>
  );
}
