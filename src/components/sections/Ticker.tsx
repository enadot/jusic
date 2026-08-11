import { tickerWords } from "@/content/site";

/**
 * Static kinetic-type band. Deliberately not animated: the design system rules
 * out looping animation, so this reads as a typographic rule, not a marquee.
 */
export function Ticker() {
  return (
    <div
      aria-hidden="true"
      className="flex gap-9 overflow-hidden border-y border-[var(--border-subtle)] py-6"
    >
      {tickerWords.map((word, i) => (
        <span
          key={word}
          className={
            i % 2
              ? "outline-word outline-word-cyan shrink-0 text-[clamp(28px,3.4vw,52px)]"
              : "shrink-0 font-[var(--font-display)] text-[clamp(28px,3.4vw,52px)] font-extrabold tracking-[-0.02em] text-cyan-400"
          }
        >
          {word}
        </span>
      ))}
    </div>
  );
}
