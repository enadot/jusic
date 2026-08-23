"use client";

import { useEffect, useRef } from "react";

/**
 * The Hero's signal field: interference bands swept by a travelling scan,
 * drawn in one WebGL2 fragment shader.
 *
 * Adapted from React Bits' `Scanner`. What changed on the way in:
 *
 * - **`ogl` is never in the initial bundle.** It is ~30KB gz and this is
 *   decoration behind the page's largest paint, so it arrives in its own chunk
 *   on idle, exactly like the GSAP layer. Until then — and if it never lands,
 *   or WebGL2 is unavailable, or the GPU is blocklisted — the Hero is its own
 *   gradient and nothing is missing.
 * - **It obeys `prefers-reduced-motion`.** The upstream component always
 *   animates. Here the module is not even fetched under `reduce`, and a
 *   mid-session change to the setting stops the loop.
 * - **Brand palette, not the demo's violet/pink.** The design system allows one
 *   accent, so the field is cyan over ink with pale-cyan peaks.
 * - **No CRT scanlines.** They read as a costume; the bands carry the idea on
 *   their own.
 * - **The pointer is read from the section, not the canvas.** The canvas is
 *   `pointer-events: none` under the headline and the CTAs, so it never sees a
 *   `mousemove` of its own.
 *
 * The shader writes premultiplied alpha and its alpha *is* its intensity, so
 * the dark parts of the field are transparent and the Hero's own gradient shows
 * through instead of being covered by a near-black rectangle.
 */

const VERTEX = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uSweepSpeed;
uniform float uSweepWidth;
uniform float uSweepFalloff;
uniform float uScale;
uniform float uFrequency;
uniform float uRipple;
uniform float uBandDensity;
uniform float uLineSharpness;
uniform float uGlow;
uniform float uColorSpread;
uniform float uBrightness;
uniform float uContrast;
uniform float uSoftness;
uniform float uVignette;
uniform float uOpacity;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float uDirection;
uniform vec2 uMouse;
uniform float uMouseRadius;
uniform float uMouseStrength;
uniform float uMouseActive;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;

const float TAU = 6.2831853;

float signalField(vec2 p, float t) {
  float w = sin(p.x * 1.3 + t * 0.7);
  w += sin(p.y * 1.7 - t * 0.52) * 0.8;
  w += sin((p.x + p.y) * 0.9 + t * 0.91) * 0.6;
  w += sin((p.x - p.y) * 1.53 - t * 0.63) * 0.42;
  return w * 0.35;
}

vec3 palette(float f) {
  f = clamp(f, 0.0, 1.0);
  f = pow(f, uContrast);
  vec3 c = mix(uColor1, uColor2, smoothstep(0.08, 0.6, f));
  return mix(c, uColor3, smoothstep(0.68, 1.0, f));
}

float scanBand(float x, float aa, float sharp) {
  float v = mix(0.5, 0.5 + 0.5 * cos(x * TAU), aa);
  return pow(v, sharp);
}

void main() {
  float aspect = iResolution.x / iResolution.y;
  vec2 uv0 = (gl_FragCoord.xy * 2.0 - iResolution.xy) / iResolution.y;
  vec2 p = uv0 / max(uScale, 0.001);

  float t = iTime * uSpeed;

  vec2 mUv = vec2((uMouse.x * 2.0 - 1.0) * aspect, uMouse.y * 2.0 - 1.0);
  vec2 md = uv0 - mUv;
  float r = max(uMouseRadius, 0.001);
  float mouseBoost = exp(-dot(md, md) / (r * r)) * uMouseStrength * uMouseActive;

  float axis;
  if (uDirection < 0.5) axis = p.y;
  else if (uDirection < 1.5) axis = p.x;
  else axis = (p.x + p.y) * 0.70710678;

  float sig = signalField(p * uFrequency, t);
  float coord = axis + sig * uRipple;

  float phase = coord / max(uSweepWidth, 0.05) - t * uSweepSpeed;
  float sweep = pow(0.5 + 0.5 * cos(phase * TAU), max(uSweepFalloff, 0.1));

  float lc = coord * uBandDensity;
  float aa = 1.0 / (1.0 + uSoftness * fwidth(lc) * 3.0);
  aa = clamp(aa * (1.0 + mouseBoost * 0.6), 0.0, 1.0);

  float bodyBase = clamp(0.5 + 0.5 * sig, 0.0, 1.0);
  float body = bodyBase * bodyBase * uGlow * sweep;

  float sharp = max(uLineSharpness, 0.1);
  float split = uColorSpread * 0.16;
  float fr = clamp(scanBand(lc + split, aa, sharp) * sweep + body, 0.0, 1.0);
  float fg = clamp(scanBand(lc, aa, sharp) * sweep + body, 0.0, 1.0);
  float fb = clamp(scanBand(lc - split, aa, sharp) * sweep + body, 0.0, 1.0);

  vec3 col = vec3(palette(fr).r, palette(fg).g, palette(fb).b);

  float inten = (fr + fg + fb) * 0.3333333 * uBrightness;
  inten *= 1.0 + mouseBoost * 0.9;

  if (uGrain > 0.5) {
    float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453);
    inten += (g - 0.5) * uGrainIntensity;
  }

  inten *= clamp(1.0 - uVignette * smoothstep(0.55, 1.65, length(uv0)), 0.0, 1.0);
  inten = clamp(inten, 0.0, 1.0);

  float a = clamp(inten * uOpacity, 0.0, 1.0);
  fragColor = vec4(clamp(col, 0.0, 1.0) * a, a);
}
`;

const DIRECTION = { vertical: 0, horizontal: 1, diagonal: 2 } as const;

function rgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return [1, 1, 1];
  return [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255];
}

/**
 * Defaults are the tuned Hero values, not the upstream demo's. They are on the
 * quiet side on purpose: cyan over more than roughly 15% of a screen stops
 * reading as an accent, and this sits behind text that has to clear AA.
 *
 * `opacity` in particular is a measured number, not a taste one. The headline's
 * third line is cyan-400 on this field, which as large text needs 3:1; at the
 * upstream-ish 0.55 the brightest band put it at 2.44:1. 0.3 is what brings
 * every run of Hero text back over its floor with room to spare. Raising it
 * means re-measuring, not eyeballing.
 */
export type ScannerConfig = {
  /** The dim field — near the page background, so most of it is transparent. */
  color1?: string;
  /** The bands. Brand cyan. */
  color2?: string;
  /** The brightest peaks. */
  color3?: string;
  /**
   * Chromatic separation between the r/g/b band samples. Zero here, and that is
   * deliberate: any spread at all samples three different palette positions per
   * pixel, and the violet-to-pink demo palette hides that while a cyan one turns
   * it into green and yellow fringes — a third brand colour the system forbids.
   * At 0 every channel reads the same intensity, so the field is exactly the
   * ramp between color1, color2 and color3.
   */
  speed?: number;
  sweepSpeed?: number;
  sweepWidth?: number;
  sweepFalloff?: number;
  scale?: number;
  frequency?: number;
  ripple?: number;
  bandDensity?: number;
  lineSharpness?: number;
  glow?: number;
  scanDirection?: keyof typeof DIRECTION;
  colorSpread?: number;
  brightness?: number;
  contrast?: number;
  softness?: number;
  vignette?: number;
  grain?: boolean;
  grainIntensity?: number;
  opacity?: number;
  mouseRadius?: number;
  mouseStrength?: number;
  className?: string;
};

export function HeroScanner({
  color1 = "#0E2A33",
  color2 = "#1EB0D5",
  color3 = "#CDEEF7",
  speed = 0.34,
  sweepSpeed = 0.16,
  sweepWidth = 1.9,
  sweepFalloff = 5,
  scale = 1.8,
  frequency = 1.7,
  ripple = 0.26,
  bandDensity = 9,
  lineSharpness = 6,
  glow = 0.16,
  scanDirection = "vertical",
  colorSpread = 0,
  brightness = 0.9,
  contrast = 1.2,
  softness = 1.6,
  vignette = 0.62,
  grain = true,
  grainIntensity = 0.03,
  opacity = 0.3,
  mouseRadius = 0.55,
  mouseStrength = 0.45,
  className,
}: ScannerConfig = {}) {
  const ref = useRef<HTMLDivElement>(null);

  // Read once, at mount: the uniforms are uploaded when the program is built
  // and the call site passes constants. Re-tuning means a remount, which is the
  // honest trade for never tearing down a GL context on a re-render.
  const config = useRef({
    color1,
    color2,
    color3,
    speed,
    sweepSpeed,
    sweepWidth,
    sweepFalloff,
    scale,
    frequency,
    ripple,
    bandDensity,
    lineSharpness,
    glow,
    scanDirection,
    colorSpread,
    brightness,
    contrast,
    softness,
    vignette,
    grain,
    grainIntensity,
    opacity,
    mouseRadius,
    mouseStrength,
  });

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    let disposed = false;
    let teardown: (() => void) | undefined;

    const start = async () => {
      const { Renderer, Program, Mesh, Triangle } = await import("ogl");
      if (disposed) return;

      const c = config.current;

      let renderer;
      try {
        renderer = new Renderer({
          webgl: 2,
          alpha: true,
          premultipliedAlpha: true,
          antialias: false,
          // The field is low-frequency; a retina buffer costs fill rate and
          // shows nothing extra.
          dpr: Math.min(window.devicePixelRatio || 1, 1.5),
        });
      } catch {
        // No WebGL2, or the GPU is blocklisted. The gradient stands alone.
        return;
      }

      const gl = renderer.gl;
      if (disposed) {
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return;
      }

      gl.clearColor(0, 0, 0, 0);
      const canvas = gl.canvas as HTMLCanvasElement;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      container.appendChild(canvas);

      const [c1, c2, c3] = [rgb(c.color1), rgb(c.color2), rgb(c.color3)];
      const program = new Program(gl, {
        vertex: VERTEX,
        fragment: FRAGMENT,
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new Float32Array([1, 1]) },
          uSpeed: { value: c.speed },
          uSweepSpeed: { value: c.sweepSpeed },
          uSweepWidth: { value: c.sweepWidth },
          uSweepFalloff: { value: c.sweepFalloff },
          uScale: { value: c.scale },
          uFrequency: { value: c.frequency },
          uRipple: { value: c.ripple },
          uBandDensity: { value: c.bandDensity },
          uLineSharpness: { value: c.lineSharpness },
          uGlow: { value: c.glow },
          uColorSpread: { value: c.colorSpread },
          uBrightness: { value: c.brightness },
          uContrast: { value: c.contrast },
          uSoftness: { value: c.softness },
          uVignette: { value: c.vignette },
          uOpacity: { value: c.opacity },
          uGrain: { value: c.grain ? 1 : 0 },
          uGrainIntensity: { value: c.grainIntensity },
          uDirection: { value: DIRECTION[c.scanDirection] },
          uMouse: { value: new Float32Array([0.5, 0.5]) },
          uMouseRadius: { value: c.mouseRadius },
          uMouseStrength: { value: c.mouseStrength },
          uMouseActive: { value: 0 },
          uColor1: { value: new Float32Array(c1) },
          uColor2: { value: new Float32Array(c2) },
          uColor3: { value: new Float32Array(c3) },
        },
      });
      const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

      const setSize = () => {
        const rect = container.getBoundingClientRect();
        renderer.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)));
        const res = program.uniforms.iResolution.value as Float32Array;
        res[0] = gl.drawingBufferWidth;
        res[1] = gl.drawingBufferHeight;
        renderer.render({ scene: mesh });
      };
      const ro = new ResizeObserver(setSize);
      ro.observe(container);
      setSize();

      // The canvas cannot receive the pointer — it sits under the headline and
      // the CTAs — so the section it decorates is the source.
      const surface = container.parentElement ?? container;
      const mouse = [0.5, 0.5];
      const target = [0.5, 0.5];
      let active = 0;
      let targetActive = 0;

      const onMove = (e: MouseEvent) => {
        const r = container.getBoundingClientRect();
        target[0] = (e.clientX - r.left) / r.width; // rtl-allow: viewport geometry, not layout
        target[1] = 1 - (e.clientY - r.top) / r.height;
        targetActive = 1;
      };
      const onLeave = () => {
        targetActive = 0;
      };
      surface.addEventListener("mousemove", onMove);
      surface.addEventListener("mouseleave", onLeave);

      let raf = 0;
      let onScreen = true;
      let pageVisible = !document.hidden;
      let allowed = true;
      const t0 = performance.now();

      const loop = (t: number) => {
        program.uniforms.iTime.value = (t - t0) * 0.001;
        mouse[0] += 0.05 * (target[0] - mouse[0]);
        mouse[1] += 0.05 * (target[1] - mouse[1]);
        const u = program.uniforms.uMouse.value as Float32Array;
        u[0] = mouse[0];
        u[1] = mouse[1];
        active += 0.05 * (targetActive - active);
        program.uniforms.uMouseActive.value = active;
        renderer.render({ scene: mesh });
        raf = requestAnimationFrame(loop);
      };

      const play = () => {
        if (allowed && onScreen && pageVisible && raf === 0) raf = requestAnimationFrame(loop);
      };
      const pause = () => {
        if (raf !== 0) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      };

      // Scrolled past, backgrounded, or reduced motion switched on mid-session:
      // three separate reasons to stop burning a frame budget on decoration.
      const io = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry.isIntersecting;
          if (onScreen) play();
          else pause();
        },
        { threshold: 0 },
      );
      io.observe(container);

      const onVisibility = () => {
        pageVisible = !document.hidden;
        if (pageVisible) play();
        else pause();
      };
      const onReduce = (e: MediaQueryListEvent) => {
        allowed = !e.matches;
        if (allowed) play();
        else pause();
      };
      document.addEventListener("visibilitychange", onVisibility);
      reduce.addEventListener("change", onReduce);
      play();

      teardown = () => {
        pause();
        ro.disconnect();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        reduce.removeEventListener("change", onReduce);
        surface.removeEventListener("mousemove", onMove);
        surface.removeEventListener("mouseleave", onLeave);
        canvas.remove();
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    };

    const idle = window.requestIdleCallback?.(() => void start(), { timeout: 1500 });
    const fallback = idle === undefined ? setTimeout(() => void start(), 300) : undefined;

    return () => {
      disposed = true;
      if (idle !== undefined) window.cancelIdleCallback?.(idle);
      if (fallback !== undefined) clearTimeout(fallback);
      teardown?.();
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className={className} />;
}
