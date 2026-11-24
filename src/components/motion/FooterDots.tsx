"use client";

import { useEffect, useRef } from "react";

/**
 * A field of dots behind the footer that leans towards the pointer and ripples
 * away from a click.
 *
 * Adapted from React Bits' `DotGrid`, rebuilt around three problems the
 * original would create here:
 *
 * 1. **It requires GSAP (and its paid InertiaPlugin).** The one GSAP on this
 *    site loads on `/` only, on idle, through HomeMotion — the footer is on
 *    every route. The inertia is a spring; a spring is six lines of maths, so
 *    the dependency is gone and the footer costs no library anywhere.
 * 2. **It renders on a permanent rAF loop** — drawing every frame from mount
 *    to unmount, pointer or no pointer, which is a background tab burning a
 *    core for a decoration. This loop runs only while something is actually
 *    moving — a pointer inside the footer, or dots still springing home — and
 *    stops the moment everything settles.
 * 3. **It listens on `window`**, reacting to clicks and mouse moves anywhere
 *    on the page. Here the listeners live on the footer itself.
 *
 * Under `prefers-reduced-motion` the dots are drawn once and never move — the
 * texture stays, the physics never starts. The canvas is `aria-hidden` and
 * behind the content; without JavaScript there is simply no decoration.
 *
 * Colours are the system's: resting dots in ink-700, waking towards sage-600
 * near the pointer — structure, not accent, so the footer's cyan stays on the
 * contact buttons.
 */
const DOT = 2.5;
const GAP = 26;
const BASE = { r: 0x1b, g: 0x20, b: 0x23 }; // ink-700
const ACTIVE = { r: 0x61, g: 0x72, b: 0x6d }; // sage-600
const PROXIMITY = 130;
const SHOCK_RADIUS = 220;
const SHOCK_PUSH = 0.45;
const SPRING = 90; // 1/s², pull home
const DAMPING = 14; // 1/s

type Dot = { cx: number; cy: number; ox: number; oy: number; vx: number; vy: number };

export function FooterDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dots: Dot[] = [];
    let raf = 0;
    let last = 0;
    const pointer = { x: -1e4, y: -1e4, inside: false };

    const build = () => {
      const { width, height } = host.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cell = DOT + GAP;
      const cols = Math.floor((width + GAP) / cell);
      const rows = Math.floor((height + GAP) / cell);
      const startX = (width - (cell * cols - GAP)) / 2 + DOT / 2;
      const startY = (height - (cell * rows - GAP)) / 2 + DOT / 2;

      dots = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          dots.push({
            cx: startX + x * cell,
            cy: startY + y * cell,
            ox: 0,
            oy: 0,
            vx: 0,
            vy: 0,
          });
        }
      }
      draw();
    };

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      for (const dot of dots) {
        let { r, g, b } = BASE;
        const dx = dot.cx - pointer.x;
        const dy = dot.cy - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < PROXIMITY) {
          const t = 1 - dist / PROXIMITY;
          r = Math.round(BASE.r + (ACTIVE.r - BASE.r) * t);
          g = Math.round(BASE.g + (ACTIVE.g - BASE.g) * t);
          b = Math.round(BASE.b + (ACTIVE.b - BASE.b) * t);
        }
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.beginPath();
        ctx.arc(dot.cx + dot.ox, dot.cy + dot.oy, DOT / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      let moving = pointer.inside;
      for (const dot of dots) {
        dot.vx += (-SPRING * dot.ox - DAMPING * dot.vx) * dt;
        dot.vy += (-SPRING * dot.oy - DAMPING * dot.vy) * dt;
        dot.ox += dot.vx * dt;
        dot.oy += dot.vy * dt;
        if (
          Math.abs(dot.ox) > 0.05 ||
          Math.abs(dot.oy) > 0.05 ||
          Math.abs(dot.vx) > 0.05 ||
          Math.abs(dot.vy) > 0.05
        ) {
          moving = true;
        } else {
          dot.ox = 0;
          dot.oy = 0;
          dot.vx = 0;
          dot.vy = 0;
        }
      }
      draw();
      raf = moving ? requestAnimationFrame(frame) : 0;
    };

    const wake = () => {
      if (raf || reduced) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const toLocal = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const onMove = (event: MouseEvent) => {
      const { x, y } = toLocal(event);
      pointer.x = x;
      pointer.y = y;
      pointer.inside = true;
      wake();
    };

    const onLeave = () => {
      pointer.inside = false;
      pointer.x = -1e4;
      pointer.y = -1e4;
      wake();
      if (reduced) draw();
    };

    const onClick = (event: MouseEvent) => {
      if (reduced) return;
      const { x, y } = toLocal(event);
      for (const dot of dots) {
        const dx = dot.cx - x;
        const dy = dot.cy - y;
        const dist = Math.hypot(dx, dy);
        if (dist >= SHOCK_RADIUS) continue;
        const falloff = 1 - dist / SHOCK_RADIUS;
        dot.vx += dx * SHOCK_PUSH * falloff * 10;
        dot.vy += dy * SHOCK_PUSH * falloff * 10;
      }
      wake();
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(host);
    if (!reduced) host.addEventListener("mousemove", onMove, { passive: true });
    host.addEventListener("mouseleave", onLeave);
    host.addEventListener("click", onClick);

    return () => {
      ro.disconnect();
      host.removeEventListener("mousemove", onMove);
      host.removeEventListener("mouseleave", onLeave);
      host.removeEventListener("click", onClick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
