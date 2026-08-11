"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import {
  CheckboxField,
  FormError,
  FormSuccess,
  SpamTraps,
  TextField,
  TextareaField,
} from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { submitContact } from "@/server/actions/submissions";
import { IDLE_STATE, type FormState } from "@/lib/formState";
import { track, readUtm, type Placement } from "@/lib/analytics";
import { useFormToken } from "@/lib/formToken";
import { contact, forms } from "@/content/site";

type TopicId = (typeof contact.topics)[number]["id"];

const copy = forms.contact;

/** Label and disabled state come from the pending state of the enclosing form. */
function SubmitButton({ ready }: { ready: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" block disabled={pending || !ready}>
      {pending ? copy.submitting : copy.submit}
    </Button>
  );
}

export function ContactForm({
  topic,
  placement,
  onClose,
}: {
  topic: TopicId;
  placement: Placement;
  onClose?: () => void;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(
    submitContact,
    IDLE_STATE,
  );
  const stamp = useFormToken();

  useEffect(() => {
    if (state.status === "success") {
      track("form_success", { placement, form: "contact", topic });
    } else if (state.status === "error") {
      track("form_error", { placement, form: "contact", topic });
    }
  }, [state.status, placement, topic]);

  if (state.status === "success") {
    return (
      <FormSuccess title={copy.success.title} body={copy.success.body}>
        {onClose ? (
          <Button type="button" variant="outline" onClick={onClose}>
            {copy.success.close}
          </Button>
        ) : null}
      </FormSuccess>
    );
  }

  const errors = state.fieldErrors ?? {};
  // React 19 resets the form once the action resolves; these put the visitor's
  // own answers back where they were.
  const kept = state.values ?? {};

  return (
    <form
      action={formAction}
      onSubmit={() => track("form_submit", { placement, form: "contact", topic })}
      className="relative flex flex-col gap-4"
    >
      <input type="hidden" name="type" value={topic} />
      <input type="hidden" name="placement" value={placement} />
      <input
        type="hidden"
        name="pagePath"
        value={typeof window === "undefined" ? "" : window.location.pathname}
      />
      <input type="hidden" name="utm" value={JSON.stringify(readUtm())} />
      <SpamTraps stamp={stamp ?? ""} />

      {state.message ? <FormError>{state.message}</FormError> : null}

      <TextField
        name="name"
        label={copy.fields.name}
        defaultValue={kept.name}
        autoComplete="name"
        required
        error={errors.name}
      />
      <TextField
        name="email"
        label={copy.fields.email}
        defaultValue={kept.email}
        type="email"
        inputMode="email"
        autoComplete="email"
        dir="ltr"
        required
        error={errors.email}
      />
      <TextField
        name="phone"
        label={copy.fields.phone}
        defaultValue={kept.phone}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        dir="ltr"
        hint={copy.fields.phoneHint}
        error={errors.phone}
      />
      <TextareaField
        name="message"
        label={copy.fields.message}
        defaultValue={kept.message}
        rows={4}
        required
        error={errors.message}
      />

      <CheckboxField
        name="consent"
        required
        defaultChecked={kept.consent === "yes"}
        error={errors.consent}
      >
        {copy.consent}{" "}
        <Link href="/legal/privacy" className="underline">
          {copy.consentLink}
        </Link>
      </CheckboxField>

      <div className="mt-1">
        <SubmitButton ready={stamp !== null} />
      </div>
    </form>
  );
}
