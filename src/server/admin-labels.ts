import type { SubmissionStatus, SubmissionType } from "./db/schema";
import { artists } from "@/content/site";

/**
 * Dashboard vocabulary. Internal tool copy, kept out of src/content/site.ts —
 * that module is the public site's copy and its Sanity migration target.
 */
export const TYPE_LABELS: Record<SubmissionType, string> = {
  bug: "באג",
  idea: "רעיון",
  artist: "הצטרפות אמנים",
  copyright: "זכויות יוצרים",
};

export const STATUS_LABELS: Record<SubmissionStatus, string> = {
  new: "חדשה",
  in_progress: "בטיפול",
  done: "טופלה",
  spam: "ספאם",
  archived: "בארכיון",
};

/** Uses the semantic tokens declared in globals.css that had no consumer yet. */
export const STATUS_CLASSES: Record<SubmissionStatus, string> = {
  new: "border-cyan-500/40 bg-cyan-500/12 text-cyan-300",
  in_progress:
    "border-[var(--color-warning)]/40 bg-[var(--color-warning)]/12 text-[var(--color-warning)]",
  done: "border-[var(--color-success)]/40 bg-[var(--color-success)]/12 text-[var(--color-success)]",
  spam: "border-[var(--color-error)]/40 bg-[var(--color-error)]/12 text-[var(--color-error)]",
  archived: "border-[var(--border)] bg-white/[0.04] text-text-tertiary",
};

/**
 * The artist form stores option values, not labels, so the dashboard has to
 * translate them back. Reading the lists straight from the content module keeps
 * the two in step when an option is added there.
 */
function optionLabels(options: readonly { value: string; label: string }[]) {
  return new Map(options.map((option) => [option.value, option.label]));
}

const GENRES = optionLabels(artists.form.genres);
const CATALOG_SIZES = optionLabels(artists.form.catalogSizes);

export function genreLabel(value: unknown): string | null {
  if (typeof value !== "string" || !value) return null;
  return GENRES.get(value) ?? value;
}

export function catalogSizeLabel(value: unknown): string | null {
  if (typeof value !== "string" || !value) return null;
  return CATALOG_SIZES.get(value) ?? value;
}

const dateFormatter = new Intl.DateTimeFormat("he-IL", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jerusalem",
});

export function formatDate(value: Date): string {
  return dateFormatter.format(value);
}
