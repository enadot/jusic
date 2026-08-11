import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Form controls for the contact and artist forms.
 *
 * Inputs are 14px-radius rectangles, not pills: the pill shape is reserved for
 * buttons in this design system. Focus is left to the global :focus-visible ring.
 *
 * These are server components — the forms around them are the client leaves.
 */

const controlClass = cn(
  "w-full rounded-[14px] bg-[var(--surface-input)] px-4 text-[15px] text-text-primary",
  "border border-[var(--border)] placeholder:text-text-tertiary",
  "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
  "hover:border-sage-600",
  "aria-invalid:border-[var(--color-error)]",
  "disabled:opacity-50",
);

function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[14px] font-bold text-text-primary"
    >
      {children}
      {required ? (
        <>
          {" "}
          <span aria-hidden="true" className="text-cyan-400">
            *
          </span>
          <span className="sr-only"> (שדה חובה)</span>
        </>
      ) : null}
    </label>
  );
}

function Error({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p
      id={id}
      // Announced when validation comes back from the server action.
      role="alert"
      className="mt-1.5 mb-0 text-[13px] text-[var(--color-error)]"
    >
      {children}
    </p>
  );
}

function Hint({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 mb-0 text-[13px] text-text-tertiary">
      {children}
    </p>
  );
}

/** Wires label, hint and error to the control via aria-describedby. */
function useFieldIds(name: string, error?: string, hint?: string) {
  const errorId = error ? `${name}-error` : undefined;
  const hintId = hint ? `${name}-hint` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;
  return { errorId, hintId, describedBy };
}

type BaseProps = {
  name: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  defaultValue?: string;
};

export function TextField({
  name,
  label,
  error,
  hint,
  required,
  defaultValue,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
  dir,
}: BaseProps & {
  type?: "text" | "email" | "tel" | "url";
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "url";
  placeholder?: string;
  dir?: "ltr" | "rtl";
}) {
  const { errorId, hintId, describedBy } = useFieldIds(name, error, hint);

  return (
    <div>
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      <input
        id={name}
        name={name}
        type={type}
        dir={dir}
        required={required}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(controlClass, "mt-1.5 h-12")}
      />
      {error ? <Error id={errorId!}>{error}</Error> : null}
      {hint ? <Hint id={hintId!}>{hint}</Hint> : null}
    </div>
  );
}

export function TextareaField({
  name,
  label,
  error,
  hint,
  required,
  defaultValue,
  rows = 4,
  placeholder,
}: BaseProps & { rows?: number; placeholder?: string }) {
  const { errorId, hintId, describedBy } = useFieldIds(name, error, hint);

  return (
    <div>
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(controlClass, "mt-1.5 resize-y py-3 leading-[1.6]")}
      />
      {error ? <Error id={errorId!}>{error}</Error> : null}
      {hint ? <Hint id={hintId!}>{hint}</Hint> : null}
    </div>
  );
}

export function SelectField({
  name,
  label,
  error,
  hint,
  required,
  defaultValue,
  options,
  placeholder,
}: BaseProps & {
  options: readonly { value: string; label: string }[];
  placeholder?: string;
}) {
  const { errorId, hintId, describedBy } = useFieldIds(name, error, hint);

  return (
    <div>
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(controlClass, "mt-1.5 h-12 appearance-none")}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <Error id={errorId!}>{error}</Error> : null}
      {hint ? <Hint id={hintId!}>{hint}</Hint> : null}
    </div>
  );
}

export function CheckboxField({
  name,
  error,
  required,
  defaultChecked,
  children,
}: {
  name: string;
  error?: string;
  required?: boolean;
  defaultChecked?: boolean;
  children: ReactNode;
}) {
  const { errorId, describedBy } = useFieldIds(name, error);

  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={name}
          name={name}
          type="checkbox"
          value="yes"
          required={required}
          defaultChecked={defaultChecked}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "mt-0.5 h-5 w-5 shrink-0 rounded-[6px] accent-cyan-500",
            "border border-[var(--border)] bg-[var(--surface-input)]",
          )}
        />
        <label
          htmlFor={name}
          className="text-[13px] leading-[1.55] text-text-secondary"
        >
          {children}
        </label>
      </div>
      {error ? <Error id={errorId!}>{error}</Error> : null}
    </div>
  );
}

/**
 * Two decoys in one component. Bots fill every field they find, so a filled
 * `website` is a bot; and `ts` carries a signed timestamp so a submission that
 * arrives implausibly fast can be rejected without a captcha.
 */
export function SpamTraps({ stamp }: { stamp: string }) {
  return (
    <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
      <label htmlFor="website">אל תמלאו שדה זה</label>
      <input
        id="website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
      <input type="hidden" name="ts" value={stamp} />
    </div>
  );
}

/** Shown in place of the form once a submission goes through. */
export function FormSuccess({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <div className="py-4 text-center">
      <span
        aria-hidden="true"
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-400"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="m5 12.5 4.5 4.5L19 7.5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <h3 className="mt-4 mb-0 text-[20px] font-extrabold">{title}</h3>
      <p className="mx-auto mt-2 mb-0 max-w-[42ch] text-[15px] leading-[1.6] text-text-secondary">
        {body}
      </p>
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}

/** Server-side failure that is not tied to one field. */
export function FormError({ children }: { children: ReactNode }) {
  return (
    <p
      role="alert"
      className={cn(
        "m-0 rounded-[14px] border px-4 py-3 text-[14px]",
        "border-[var(--color-error)]/40 bg-[var(--color-error)]/10 text-text-primary",
      )}
    >
      {children}
    </p>
  );
}
