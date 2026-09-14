"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import type { Placement } from "@/lib/analytics";

/**
 * Scroll-in reveal: fade + 16px rise, 640ms, once. The animation itself lives in
 * CSS (.rv / .rv.in) so it is removed wholesale under prefers-reduced-motion —
 * this component only toggles the class.
 *
 * Doubles as the section_view analytics trigger so we do not need a second
 * observer over the same elements — which is why `visual={false}` exists: on
 * the home page GSAP animates the contents of some of these sections itself,
 * and the wrapper has to keep observing without also fading them.
 */
export function Reveal({
  children,
  className,
  sectionId,
  placement,
  visual = true,
}: {
  children: ReactNode;
  className?: string;
  sectionId?: string;
  placement?: Placement;
  /** Set false to keep the observer but drop the fade — see above. */
  visual?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver (or reduced motion) → show it immediately.
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.classList.add("in");
          if (sectionId && placement) {
            track("section_view", { placement, section_id: sectionId });
          }
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [sectionId, placement]);

  return (
    <div ref={ref} className={cn(visual && "rv", className)}>
      {children}
    </div>
  );
}
