"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { AdminField, Alert, Notice } from "@/components/admin/ui/field";
import { addAdmin, type AllowlistState } from "@/server/actions/admin";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="h-11">
      <UserPlus size={16} aria-hidden="true" />
      {pending ? "מוסיף…" : "הוספה"}
    </Button>
  );
}

/**
 * Adding a teammate. The only client component on the screen — the list and
 * its remove buttons are plain server-rendered forms.
 */
export function TeamForm() {
  const [state, formAction] = useActionState<AllowlistState, FormData>(
    addAdmin,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error ? <Alert>{state.error}</Alert> : null}
      {state.added ? (
        <Notice>
          <bdi>{state.added}</bdi> נוסף/ה לרשימה. אפשר להתחבר עכשיו — בלי פריסה
          מחדש.
        </Notice>
      ) : null}

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 basis-[260px]">
          <AdminField
            name="email"
            label="אימייל"
            type="email"
            inputMode="email"
            dir="ltr"
            placeholder="name@example.com"
            defaultValue={state.values?.email}
            required
          />
        </div>
        <div className="flex-1 basis-[200px]">
          <AdminField
            name="note"
            label="שם או תפקיד (לא חובה)"
            defaultValue={state.values?.note}
            placeholder="למשל: עורכת תוכן"
          />
        </div>
        <SubmitButton />
      </div>
    </form>
  );
}
