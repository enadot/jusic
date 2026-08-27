import type { InputHTMLAttributes, ReactNode } from "react";
import { Input, Label } from "./input";

/**
 * A labelled input for the dashboard's own forms. Unlike the public site's
 * TextField this one does accept type="password" — the guard there exists so a
 * password field can never be smuggled into a marketing form, and nothing
 * under /admin is a marketing form.
 */
export function AdminField({
  name,
  label,
  hint,
  ...inputProps
}: InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  hint?: string;
}) {
  const hintId = hint ? `${name}-hint` : undefined;

  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        aria-describedby={hintId}
        className="h-11"
        {...inputProps}
      />
      {hint ? (
        <p
          id={hintId}
          className="mt-1.5 mb-0 text-[13px] text-[var(--text-tertiary)]"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Server-side failure that is not tied to one field. */
export function Alert({ children }: { children: ReactNode }) {
  return (
    <p
      role="alert"
      className="m-0 rounded-[var(--radius-sm)] border border-[var(--chip-spam-bd)] bg-[var(--chip-spam-bg)] px-4 py-3 text-[14px] text-[var(--text-primary)]"
    >
      {children}
    </p>
  );
}

/** Quiet confirmation, the counterpart of Alert. */
export function Notice({ children }: { children: ReactNode }) {
  return (
    <p
      role="status"
      className="m-0 rounded-[var(--radius-sm)] border border-[var(--chip-new-bd)] bg-[var(--chip-new-bg)] px-4 py-3 text-[14px] text-[var(--text-primary)]"
    >
      {children}
    </p>
  );
}
