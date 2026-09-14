"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A short burst of light where a control was tapped.
 *
 * Adapted from React Bits' `ClickSpark`. Three things changed:
 *
 * 1. **No canvas, and no permanent loop.** The original mounts a `<canvas>`
 *    and drives it with a `requestAnimationFrame` loop that never stops —
 *    every wrapped element burns a frame callback forever, whether anyone has
 *    clicked or not. Here a click appends a handful of spans, one CSS keyframe
 *    plays them out, and `animationend` removes them: nothing exists between
 *    clicks. It is also how `FoldText` earns its place in this codebase.
 * 2. **It inherits its colour.** `currentColor`, so a spark off a filled cyan
 *    button is the button's own ink and a spark off an outline button is its
 *    text — never a fifth colour on a palette that allows one accent.
 * 3. **Reduced motion means none.** The global rule in `globals.css` collapses
 *    the keyframe, and the spans are skipped outright.
 *
 * Wrap a control, do not wrap a region: the burst is a reward for the tap that
 * matters, and it stops being one the moment every click on the page has it.
 */
const SPARKS = 8;
/** px. Where a spark begins and ends, measured from the tap. */
const NEAR = 6;
const FAR = 26;
const LENGTH = 10;

export function ClickSpark({
  children,
  className = "inline-flex",
}: {
  children: ReactNode;
  /** Must include a display class; defaults to inline-flex. */
  className?: string;
}) {
  const hostRef = useRef<HTMLSpanElement>(null);

  const burst = useCallback((event: React.MouseEvent<HTMLSpanElement>) => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = host.getBoundingClientRect();
    // The host is RTL, and `inset-inline-start` measures from its start edge —
    // the right one — so the x offset is measured the same way.
    const x = rect.right - event.clientX;
    const y = event.clientY - rect.top;

    for (let i = 0; i < SPARKS; i++) {
      const spark = document.createElement("span");
      spark.className = "spark";
      spark.style.setProperty("--spark-x", `${x}px`);
      spark.style.setProperty("--spark-y", `${y}px`);
      spark.style.setProperty("--spark-angle", `${(360 / SPARKS) * i}deg`);
      spark.style.setProperty("--spark-near", `${NEAR}px`);
      spark.style.setProperty("--spark-far", `${FAR}px`);
      spark.style.setProperty("--spark-len", `${LENGTH}px`);
      spark.addEventListener("animationend", () => spark.remove(), {
        once: true,
      });
      host.append(spark);
    }
  }, []);

  return (
    <span
      ref={hostRef}
      onClick={burst}
      // Display is the caller's: a default here would fight the layout class
      // callers pass (block vs inline-flex resolves by stylesheet order, not
      // by which was written last).
      className={cn("relative isolate", className)}
    >
      {children}
    </span>
  );
}
