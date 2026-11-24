"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { AdminField, Alert, Notice } from "@/components/admin/ui/field";
import { addWebhook, type WebhookState } from "@/server/actions/admin";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="h-11">
      <Plus size={16} aria-hidden="true" />
      {pending ? "מוסיף…" : "הוספת יעד"}
    </Button>
  );
}

/** Adding a destination. The list and its row actions are server-rendered. */
export function WebhookForm() {
  const [state, formAction] = useActionState<WebhookState, FormData>(
    addWebhook,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error ? <Alert>{state.error}</Alert> : null}
      {state.added ? (
        <Notice>
          היעד נוסף. מכאן כל פנייה חדשה תישלח גם אליו — כדאי ללחוץ על ״בדיקה״
          כדי לוודא שהוא עונה.
        </Notice>
      ) : null}

      <AdminField
        name="url"
        label="כתובת ה־webhook"
        type="url"
        dir="ltr"
        placeholder="https://hook.example.com/..."
        defaultValue={state.values?.url}
        required
        hint="חייבת להיות https. הבקשה היא POST עם גוף JSON."
      />

      <div className="flex flex-wrap gap-3">
        <div className="flex-1 basis-[200px]">
          <AdminField
            name="description"
            label="שם היעד (לא חובה)"
            placeholder="למשל: תרחיש Make"
            defaultValue={state.values?.description}
          />
        </div>
        <div className="flex-1 basis-[200px]">
          <AdminField
            name="secret"
            label="מפתח חתימה (לא חובה)"
            dir="ltr"
            autoComplete="off"
            defaultValue={state.values?.secret}
            hint="אם ימולא, כל בקשה תישא חתימת HMAC-SHA256 בכותרת x-jusic-signature."
          />
        </div>
      </div>

      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
