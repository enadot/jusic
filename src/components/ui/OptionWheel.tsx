"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

/**
 * A vertical picker whose options curve around the edge they are anchored to.
 *
 * Adapted from React Bits' `OptionWheel`. The easing loop and the curve maths
 * are theirs — options sit on a circle whose radius keeps the arc between two
 * neighbours equal to one row, so `tilt` controls how tightly it curls. Five
 * things changed on the way in, and each is load-bearing on this site:
 *
 * 1. **It does not take the page's scroll.** The original listens for `wheel`
 *    non-passively and calls `preventDefault()`, so a visitor scrolling past
 *    the section stops dead on it. On a marketing page that is worse than any
 *    animation this design system bans. Selection is by tap, drag or arrow key;
 *    the page always scrolls.
 * 2. **Dragging is for mice.** `touch-action: none` on a full-width element is
 *    the same trap by another route — a thumb swipe over the wheel would not
 *    scroll the page. Touch selects by tapping an option.
 * 3. **No tick sound.** A marketing page does not make noise.
 * 4. **RTL by construction.** The original's `side` prop resolves to physical
 *    `left`/`right`; here the wheel always hangs off the start edge, which the
 *    logical properties in globals.css resolve for `dir="rtl"`.
 * 5. **It is a list before it is a wheel.** The curve is applied only once the
 *    component knows it is on a client and `data-wheel="on"` is set. Before
 *    that — and if JavaScript never arrives — the options are an ordinary
 *    vertical list, so a crawler gets plain text. Under
 *    `prefers-reduced-motion` the easing drops to a snap: the selection still
 *    moves, there is simply no travel to watch.
 *
 * Each option is a real `<button>` in a `role="listbox"`, so it is reachable by
 * keyboard and announced with its selected state — the original renders
 * unfocusable divs.
 */
export type OptionWheelProps = {
  items: readonly string[];
  selected: number;
  onSelect: (index: number) => void;
  /** Names the listbox. Hebrew — it is read aloud. */
  label: string;
  /** Font size of an option, in rem. Drives the row height with `spacing`. */
  fontSize?: number;
  /** Row height as a multiple of the font size. */
  spacing?: number;
  /** Depth of the curve. 0 flattens the wheel into a straight column. */
  curve?: number;
  /** Degrees between neighbouring options; higher curls it tighter. */
  tilt?: number;
  /** Blur in px added per step away from the middle. */
  blur?: number;
  /** Opacity lost per step away from the middle. */
  fade?: number;
  minOpacity?: number;
  /** Easing time constant in ms. Dropped to a snap under reduced motion. */
  smoothing?: number;
  /** Padding between the start edge and the centred option, in px. */
  inset?: number;
  className?: string;
};

/* The client-only flag, as the rest of this codebase writes it: a store that
   never changes, with different snapshots per side. An effect that called
   setState would cascade a render on mount instead. */
const neverChanges = () => () => {};
const onClient = () => true;
const onServer = () => false;

export function OptionWheel({
  items,
  selected,
  onSelect,
  label,
  fontSize = 2,
  spacing = 1.5,
  curve = 1,
  tilt = 7,
  blur = 0.75,
  fade = 0.2,
  minOpacity = 0.4,
  smoothing = 220,
  inset = 8,
  className,
}: OptionWheelProps) {
  const ready = useSyncExternalStore(neverChanges, onClient, onServer);

  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const posRef = useRef(selected);
  const targetRef = useRef(selected);
  const kickRef = useRef<(() => void) | null>(null);
  const dragRef = useRef<{ y: number; start: number; id: number } | null>(null);
  const dragMovedRef = useRef(false);

  const cfg = {
    count: items.length,
    fontSize,
    spacing,
    curve,
    tilt,
    blur,
    fade,
    minOpacity,
    smoothing,
  };
  const cfgRef = useRef(cfg);

  /**
   * The whole animation lives inside one effect, which owns its frame handle
   * and hands back a `kick`. Nothing here is called during render, and the
   * frame function can refer to itself because it is a declaration.
   */
  useEffect(() => {
    let raf = 0;
    let last = 0;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // The transforms are in px, so the row height has to come from the root
    // font size rather than assume 16.
    const rem =
      parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

    function frame(now: number) {
      const c = cfgRef.current;
      const rowH = Math.max(c.fontSize * c.spacing * rem, 1);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      // 1ms is "arrive next frame": no travel to watch, one code path.
      const tau = Math.max(reduced ? 1 : c.smoothing, 1) / 1000;
      const k = 1 - Math.exp(-dt / tau);

      const target = targetRef.current;
      let next = posRef.current + (target - posRef.current) * k;
      const settled = Math.abs(target - next) < 0.001;
      if (settled) next = target;
      posRef.current = next;

      // The wheel hangs off the start edge, so the curve bulges towards the
      // end one — the mirror the original applies for `side="right"`, which is
      // what the start edge is in RTL.
      const tiltRad = (c.tilt * Math.PI) / 180;
      const radius = tiltRad > 0.0005 ? rowH / tiltRad : 0;

      for (let i = 0; i < c.count; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const d = i - next;
        const dist = Math.abs(d);
        let x = 0;
        let y = d * rowH;
        let rot = 0;
        if (radius > 0) {
          const ang = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, d * tiltRad));
          y = radius * Math.sin(ang);
          x = radius * (1 - Math.cos(ang)) * c.curve;
          rot = (-ang * 180) / Math.PI;
        }
        el.style.transform = `translate(${x.toFixed(2)}px, calc(${y.toFixed(2)}px - 50%)) rotate(${rot.toFixed(3)}deg)`;
        el.style.opacity = String(Math.max(c.minOpacity, 1 - dist * c.fade));
        el.style.filter =
          c.blur > 0 ? `blur(${(dist * c.blur).toFixed(2)}px)` : "none";
        el.style.setProperty(
          "--ow-p",
          Math.max(0, 1 - Math.min(dist, 1)).toFixed(4),
        );
      }

      raf = settled ? 0 : requestAnimationFrame(frame);
    }

    kickRef.current = () => {
      if (raf) cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    kickRef.current();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      kickRef.current = null;
    };
  }, []);

  /** Keeps the loop's view of the props current without re-creating it. */
  useEffect(() => {
    cfgRef.current = cfg;
    kickRef.current?.();
  });

  /** Drives the wheel from the selection the parent owns. */
  useEffect(() => {
    targetRef.current = selected;
    kickRef.current?.();
  }, [selected]);

  const commit = useCallback(
    (value: number) => {
      const clamped = Math.min(Math.max(Math.round(value), 0), items.length - 1);
      targetRef.current = clamped;
      if (clamped !== selected) onSelect(clamped);
      kickRef.current?.();
    },
    [items.length, onSelect, selected],
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    dragRef.current = {
      y: event.clientY,
      start: targetRef.current,
      id: event.pointerId,
    };
    dragMovedRef.current = false;
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dy = event.clientY - drag.y;
    if (!dragMovedRef.current && Math.abs(dy) > 4) {
      dragMovedRef.current = true;
      // Captured only once a real drag starts, so a plain click still lands on
      // the option under the cursor.
      rootRef.current?.setPointerCapture(drag.id);
    }
    if (!dragMovedRef.current) return;
    const c = cfgRef.current;
    const rem =
      parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    // Free travel while the pointer is down; the parent only hears the value
    // the wheel settles on, so nothing downstream re-renders per frame.
    targetRef.current = drag.start - dy / Math.max(c.fontSize * c.spacing * rem, 1);
    kickRef.current?.();
  };

  const onPointerEnd = () => {
    if (!dragRef.current) return;
    dragRef.current = null;
    if (dragMovedRef.current) commit(targetRef.current);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // RTL: the next option is below, and to the left of, the current one.
    const delta =
      event.key === "ArrowDown" || event.key === "ArrowLeft"
        ? 1
        : event.key === "ArrowUp" || event.key === "ArrowRight"
          ? -1
          : 0;
    if (delta === 0) return;
    event.preventDefault();
    commit(selected + delta);
  };

  return (
    <div
      ref={rootRef}
      role="listbox"
      aria-label={label}
      data-wheel={ready ? "on" : undefined}
      className={cn("ow", className)}
      style={
        {
          "--ow-font-size": `${fontSize}rem`,
          "--ow-inset": `${inset}px`,
        } as React.CSSProperties
      }
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onKeyDown={onKeyDown}
    >
      {items.map((item, index) => (
        <button
          key={item}
          type="button"
          role="option"
          aria-selected={index === selected}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          onClick={() => {
            if (dragMovedRef.current) return;
            commit(index);
          }}
          className={cn("ow__item", index === selected && "ow__item--on")}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
