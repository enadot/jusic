"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/admin/ui/button";
import { AdminField, Alert } from "@/components/admin/ui/field";
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
      <div className="py-4 text-center">
        <h3 className="mt-0 mb-0 text-[20px] font-extrabold">הקישור נשלח</h3>
        <p className="mx-auto mt-2 mb-0 max-w-[42ch] text-[15px] leading-[1.6] text-[var(--text-secondary)]">
          אם קיים חשבון עם הכתובת הזו, ישלח אליה קישור לבחירת סיסמה חדשה.
          הקישור תקף לשעה אחת.
        </p>
        <p className="mt-5 mb-0">
          <Link
            href="/admin/sign-in"
            className="text-[14px] text-[var(--text-secondary)] underline underline-offset-4 hover:text-[var(--text-primary)]"
          >
            חזרה להתחברות
          </Link>
        </p>
      </div>
    );
  }

  return (
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

      <div className="mt-1">
        <SubmitButton />
      </div>

      <p className="m-0 text-center text-[14px]">
        <Link
          href="/admin/sign-in"
          className="text-[var(--text-secondary)] underline underline-offset-4 hover:text-[var(--text-primary)]"
        >
          חזרה להתחברות
        </Link>
      </p>
    </form>
  );
}
