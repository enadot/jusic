"use client";

import { Icon } from "@/components/ui/Icon";
import { track } from "@/lib/analytics";

/**
 * One accordion. A native <details>, so open/close, keyboard and screen-reader
 * semantics cost nothing and the answer is in the initial HTML — which the FAQ
 * JSON-LD in src/lib/schema.ts relies on.
 *
 * This is a client component for one reason only: the faq_open event. Everything
 * around it stays on the server.
 *
 * Deliberately not `name="jusic-faq"`. Exclusive accordions close a sibling when
 * you open one, and in a two-column grid the sibling that collapses is often the
 * one you are not looking at — the column jumps for no visible reason.
 */
export function FaqItem({
  id,
  question,
  answer,
}: {
  id: string;
  question: string;
  answer: string;
}) {
  return (
    <details
      className="group h-fit overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-card)]"
      onToggle={(e) => {
        if (e.currentTarget.open) {
          track("faq_open", { placement: "faq", question_id: id });
        }
      }}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6.5 py-5.5 text-[var(--text-body-lg)] font-bold [&::-webkit-details-marker]:hidden">
        {question}
        <Icon
          name="expand_more"
          size={22}
          className="shrink-0 text-text-tertiary transition-transform duration-[var(--dur-base)] ease-[var(--ease-standard)] group-open:rotate-180"
        />
      </summary>
      <p className="m-0 px-6.5 pb-6 leading-[1.7] text-text-secondary">
        {answer}
      </p>
    </details>
  );
}
