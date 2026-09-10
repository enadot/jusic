import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

/**
 * shadcn Input/Textarea/Label on the themed variables. Focus is the global
 * :focus-visible ring from globals.css; radius is the system's 10px — inputs
 * are rectangles, pills are for buttons.
 */
const fieldClass = cn(
  "w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-input)]",
  "px-3 text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]",
  "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
  "hover:border-[var(--text-disabled)] disabled:opacity-50",
  "aria-invalid:border-[var(--color-error)]",
);

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClass, "h-10", className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(fieldClass, "resize-y py-2.5 leading-[1.6]", className)}
      {...props}
    />
  );
}

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-[13px] font-bold text-[var(--text-secondary)]",
        className,
      )}
      {...props}
    />
  );
}
