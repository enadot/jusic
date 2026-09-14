"use client";

import { useEffect } from "react";
import {
  blockEntry,
  cardBatch,
  featureBands,
  heroEntry,
  whyWipe,
} from "@/lib/motion";

declare global {
  interface Window {
    /** Set by the guard script in app/page.tsx; cleared once GSAP is up. */
    __jusicAnimTimer?: ReturnType<typeof setTimeout>;
  }
}

/**
 * Mounts the home page's motion layer. Renders nothing.
 *
 * GSAP is ~34KB gz and the site is already at its JS budget, so it is never
 * part of the initial bundle: it arrives in its own chunk once the browser is
 * idle, after the first paint. Everything it animates is visible without it —
 * the from-states in globals.css apply only while the `js-anim` guard class is
 * on <html>, and the guard removes itself if the chunk never lands.
 */
export function HomeMotion() {
  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    const start = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      // iOS collapses its URL bar mid-scroll, which otherwise re-measures every
      // trigger and makes pinned starts jump.
      ScrollTrigger.config({ ignoreMobileResize: true });

      // Ploni loads with `swap`. Measuring triggers against the fallback metrics
      // and never refreshing puts every start position a few dozen pixels out.
      await document.fonts?.ready;
      if (cancelled) return;

      // GSAP owns the from-states from here on, so the 2.5s failsafe must not
      // fire and un-hide the sections that have not scrolled into view yet.
      clearTimeout(window.__jusicAnimTimer);

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        // Binding to the query rather than reading it once means a mid-session
        // change to the OS setting reverts every tween instead of stranding it.
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          const root = document;
          heroEntry(gsap, root);
          blockEntry(gsap, root, "#why");
          whyWipe(gsap, root);
          blockEntry(gsap, root, "#features");
          featureBands(gsap, root);
          cardBatch(gsap, ScrollTrigger, root);
          blockEntry(gsap, root, "#creators");
          blockEntry(gsap, root, "[data-anim-final]");
        });
      });

      // next/image finishes after this effect, so the document is still short
      // when the triggers are first measured.
      ScrollTrigger.refresh();
      window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
    };

    const idle = window.requestIdleCallback?.(() => void start(), { timeout: 1200 });
    const fallback = idle === undefined ? setTimeout(() => void start(), 200) : undefined;

    return () => {
      cancelled = true;
      if (idle !== undefined) window.cancelIdleCallback?.(idle);
      if (fallback !== undefined) clearTimeout(fallback);
      ctx?.revert();
    };
  }, []);

  return null;
}
