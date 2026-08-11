"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import {
  CheckboxField,
  FormError,
  FormSuccess,
  SelectField,
  SpamTraps,
  TextField,
  TextareaField,
} from "@/components/ui/Field";
import { Button, buttonClass } from "@/components/ui/Button";
import { submitArtist } from "@/server/actions/submissions";
import { IDLE_STATE, type FormState } from "@/lib/formState";
import { track, readUtm } from "@/lib/analytics";
import { useFormToken } from "@/lib/formToken";
import { artists, forms } from "@/content/site";

const copy = artists.form;
const shared = forms.contact;

function SubmitButton({ ready }: { ready: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" block disabled={pending || !ready}>
      {pending ? shared.submitting : copy.submit}
    </Button>
  );
}

/** Groups the form into three labelled fieldsets rather than one long column. */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="mb-4 text-[13px] font-bold tracking-[0.08em] text-cyan-400 uppercase">
        {title}
      </legend>
      <div className="flex flex-col gap-4">{children}</div>
    </fieldset>
  );
}

export function ArtistForm() {
  const [state, formAction] = useActionState<FormState, FormData>(
    submitArtist,
    IDLE_STATE,
  );
  const stamp = useFormToken();

  useEffect(() => {
    if (state.status === "success") {
      track("form_success", { placement: "artists", form: "artist" });
    } else if (state.status === "error") {
      track("form_error", { placement: "artists", form: "artist" });
    }
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div className="rounded-[20px] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 sm:p-8">
        <FormSuccess title={copy.success.title} body={copy.success.body}>
          <Link href="/" className={buttonClass({ variant: "outline" })}>
            {copy.success.back}
          </Link>
        </FormSuccess>
      </div>
    );
  }

  const errors = state.fieldErrors ?? {};
  // React 19 resets the form once the action resolves; these put the applicant's
  // own answers back where they were.
  const kept = state.values ?? {};

  return (
    <form
      action={formAction}
      onSubmit={() => track("form_submit", { placement: "artists", form: "artist" })}
      className="relative flex flex-col gap-8 rounded-[20px] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 sm:p-8"
    >
      <input type="hidden" name="placement" value="artists" />
      <input type="hidden" name="pagePath" value="/artists" />
      <input type="hidden" name="utm" value={JSON.stringify(readUtm())} />
      <SpamTraps stamp={stamp ?? ""} />

      {state.message ? <FormError>{state.message}</FormError> : null}

      <Section title={copy.sections.contact}>
        <TextField
          name="name"
          label={shared.fields.name}
          defaultValue={kept.name}
          autoComplete="name"
          required
          error={errors.name}
        />
        <TextField
          name="email"
          label={shared.fields.email}
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
          label={shared.fields.phone}
          defaultValue={kept.phone}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
          error={errors.phone}
        />
      </Section>

      <Section title={copy.sections.artist}>
        <TextField
          name="stageName"
          label={copy.fields.stageName}
          defaultValue={kept.stageName}
          required
          error={errors.stageName}
        />
        <SelectField
          name="genre"
          label={copy.fields.genre}
          defaultValue={kept.genre}
          options={copy.genres}
          placeholder={copy.fields.genrePlaceholder}
          error={errors.genre}
        />
        <TextField
          name="primaryLink"
          label={copy.fields.primaryLink}
          defaultValue={kept.primaryLink}
          type="url"
          inputMode="url"
          dir="ltr"
          placeholder="https://"
          hint={copy.fields.primaryLinkHint}
          required
          error={errors.primaryLink}
        />
        <TextField
          name="secondaryLink"
          label={copy.fields.secondaryLink}
          defaultValue={kept.secondaryLink}
          type="url"
          inputMode="url"
          dir="ltr"
          placeholder="https://"
          error={errors.secondaryLink}
        />
      </Section>

      <Section title={copy.sections.catalog}>
        <SelectField
          name="catalogSize"
          label={copy.fields.catalogSize}
          defaultValue={kept.catalogSize}
          options={copy.catalogSizes}
          placeholder={copy.fields.catalogSizePlaceholder}
          error={errors.catalogSize}
        />
        <SelectField
          name="isDistributed"
          label={copy.fields.isDistributed}
          defaultValue={kept.isDistributed}
          options={copy.distribution}
          placeholder={copy.fields.catalogSizePlaceholder}
          error={errors.isDistributed}
        />
        <TextareaField
          name="message"
          label={copy.fields.message}
          defaultValue={kept.message}
          rows={4}
          error={errors.message}
        />
      </Section>

      <CheckboxField
        name="consent"
        required
        defaultChecked={kept.consent === "yes"}
        error={errors.consent}
      >
        {shared.consent}{" "}
        <Link href="/legal/privacy" className="underline">
          {shared.consentLink}
        </Link>
      </CheckboxField>

      <SubmitButton ready={stamp !== null} />
    </form>
  );
}
