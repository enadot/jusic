import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Status/type chips, Deel-style: soft themed fill, a colour dot, quiet border.
 * Every colour is a --chip-* variable pair defined per theme in globals.css,
 * so a chip that reads on ink also reads on white.
 *
 * The four submission types each own a hue (bug red, idea amber, artist
 * violet, copyright blue) so the inbox sorts itself visually before anyone
 * reads a word.
 */
export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-bold whitespace-nowrap",
  {
    variants: {
      variant: {
        // submission types
        bug: "border-[var(--chip-bug-bd)] bg-[var(--chip-bug-bg)] text-[var(--chip-bug-fg)]",
        idea: "border-[var(--chip-idea-bd)] bg-[var(--chip-idea-bg)] text-[var(--chip-idea-fg)]",
        artist:
          "border-[var(--chip-artist-bd)] bg-[var(--chip-artist-bg)] text-[var(--chip-artist-fg)]",
        copyright:
          "border-[var(--chip-copyright-bd)] bg-[var(--chip-copyright-bg)] text-[var(--chip-copyright-fg)]",
        // statuses
        new: "border-[var(--chip-new-bd)] bg-[var(--chip-new-bg)] text-[var(--chip-new-fg)]",
        in_progress:
          "border-[var(--chip-progress-bd)] bg-[var(--chip-progress-bg)] text-[var(--chip-progress-fg)]",
        done: "border-[var(--chip-done-bd)] bg-[var(--chip-done-bg)] text-[var(--chip-done-fg)]",
        spam: "border-[var(--chip-spam-bd)] bg-[var(--chip-spam-bg)] text-[var(--chip-spam-fg)]",
        archived:
          "border-[var(--chip-muted-bd)] bg-[var(--chip-muted-bg)] text-[var(--chip-muted-fg)]",
        neutral:
          "border-[var(--chip-muted-bd)] bg-[var(--chip-muted-bg)] text-[var(--chip-muted-fg)]",
      },
      dot: {
        true: "",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot ? (
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-current"
        />
      ) : null}
      {children}
    </span>
  );
}
