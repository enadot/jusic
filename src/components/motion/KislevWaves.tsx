"use client";

import { useEffect, useState, type ComponentType } from "react";
import type { SlicedWavesProps } from "./SlicedWaves";

/**
 * The /lp/2026/hanukkah hero's light ribbons, loaded the way the home page loads its
 * Scanner field: the module arrives on idle in its own chunk, after the first
 * paint; under `prefers-reduced-motion` it is never fetched at all, and a
 * mid-session change to the setting removes it. Until it lands, or if WebGL2
 * is missing, the hero is simply its own gradient.
 *
 * Brand palette (pale cyan → cyan → deep cyan), not the demo's peach/pink.
 * `opacity` is a measured value: the hero text that sits on the ribbons has
 * to keep its contrast. Re-measure if you raise it.
 */
export function KislevWaves({ className }: { className?: string }) {
  const [Waves, setWaves] = useState<ComponentType<SlicedWavesProps> | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancelled = false;
    let idle = 0;

    const load = () => {
      if (media.matches) return;
      const run = () =>
        import("./SlicedWaves").then((m) => {
          if (!cancelled && !media.matches) setWaves(() => m.default);
        });
      // Safari has no requestIdleCallback; a short timeout stands in for it.
      if (typeof window.requestIdleCallback === "function") {
        idle = window.requestIdleCallback(run, { timeout: 2500 });
      } else {
        idle = setTimeout(run, 1200) as unknown as number;
      }
    };

    const onChange = () => {
      if (media.matches) setWaves(null);
      else load();
    };

    load();
    media.addEventListener("change", onChange);
    return () => {
      cancelled = true;
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      clearTimeout(idle);
      media.removeEventListener("change", onChange);
    };
  }, []);

  if (!Waves) return null;

  return (
    <div aria-hidden="true" className={className}>
      <Waves
        color1="#95dfef"
        color2="#1eb0d5"
        color3="#14738d"
        ribbons={3}
        spacing={28}
        perspective={0.45}
        blur={0.6}
        glow={1}
        brightness={1}
        position={0.62}
        fade={0.35}
        opacity={0.55}
        grain={0.06}
        mouseInteraction
      />
    </div>
  );
}
