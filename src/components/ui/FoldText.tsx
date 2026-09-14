import { Fragment, type CSSProperties } from "react";
import { cn } from "@/lib/cn";

/**
 * Text that unfolds into place, one panel at a time, around a 3D hinge.
 *
 * Adapted from React Bits' `FoldText`. Three things changed on the way in, and
 * each of them is load-bearing here:
 *
 * 1. **No GSAP, and no client component.** The original imports gsap at module
 *    scope and registers ScrollTrigger as a side effect, which would put ~47KB
 *    into the initial bundle of every route that touches it — the exact thing
 *    `HomeMotion` exists to avoid. The fold is short, one-shot and entirely
 *    declarative, so it is CSS `@keyframes` with a per-panel `animation-delay`.
 *    That also means it runs in the first frame instead of waiting on a dynamic
 *    import, which matters because the caller is the Hero headline.
 * 2. **Splitting is bidi-aware.** `Array.from(text)` per character detaches
 *    Hebrew combining marks and reverses Latin and numeric runs, because each
 *    panel is its own inline box and bidi reorders boxes, not glyphs. Splitting
 *    here is by grapheme, and any run that is not Hebrew stays in one panel.
 * 3. **The text is still text.** The original hides the visual copy from
 *    assistive tech and mirrors it in a visually-hidden span. Panels are
 *    separated by real spaces here, so the accessibility tree, selection and
 *    find-in-page all see the original string once.
 *
 * Reduced motion is handled in `globals.css`: the keyframes are dropped and the
 * panels are simply text. Without JavaScript it animates exactly the same — the
 * `js-anim` guard is not involved.
 */

/** Hinge geometry. `start`/`end` are resolved for `dir="rtl"`; the site has no LTR. */
const HINGES = {
  top: { origin: "50% 0%", from: "rotateX(-92deg)", shade: "180deg" },
  bottom: { origin: "50% 100%", from: "rotateX(92deg)", shade: "0deg" },
  start: { origin: "100% 50%", from: "rotateY(-92deg)", shade: "270deg" },
  end: { origin: "0% 50%", from: "rotateY(92deg)", shade: "90deg" },
} as const;

/** Anything outside the Hebrew blocks folds as one piece, never per glyph. */
const HEBREW = /[֐-׿יִ-ﭏ]/;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

type Panel = { piece: string; spaceAfter: boolean };

/**
 * One line's worth of panels. Words are split on whitespace; characters are
 * split by grapheme, with non-Hebrew runs coalesced so `19.90 ₪` and `Jusic`
 * survive bidi reordering intact.
 */
function panels(text: string, splitBy: "word" | "char"): Panel[] {
  const words = text.split(/\s+/).filter(Boolean);
  const out: Panel[] = [];

  words.forEach((word, w) => {
    const last = w === words.length - 1;
    if (splitBy === "word") {
      out.push({ piece: word, spaceAfter: !last });
      return;
    }

    const graphemes =
      typeof Intl !== "undefined" && "Segmenter" in Intl
        ? Array.from(
            new Intl.Segmenter("he", { granularity: "grapheme" }).segment(word),
            (s) => s.segment,
          )
        : Array.from(word);

    const pieces: string[] = [];
    let run = "";
    for (const g of graphemes) {
      if (HEBREW.test(g)) {
        if (run) pieces.push(run);
        run = "";
        pieces.push(g);
      } else {
        run += g;
      }
    }
    if (run) pieces.push(run);

    pieces.forEach((piece, i) =>
      out.push({ piece, spaceAfter: !last && i === pieces.length - 1 }),
    );
  });

  return out;
}

export type FoldLine = {
  text: string;
  /** Applied to the line, so a whole line can take the accent colour. */
  className?: string;
};

export function FoldText({
  lines,
  as: Tag = "p",
  splitBy = "word",
  hinge = "top",
  duration = 0.6,
  stagger = 0.045,
  ease = "var(--ease-out)",
  perspective = 760,
  creaseShading = 0.5,
  className,
  style,
}: {
  /** One entry per rendered line — the split is in the markup, never at runtime. */
  lines: readonly FoldLine[];
  as?: "h1" | "h2" | "h3" | "p" | "div" | "span";
  splitBy?: "word" | "char";
  hinge?: keyof typeof HINGES;
  /** Seconds for one panel to unfold. */
  duration?: number;
  /** Seconds between panels. 0.03–0.08 keeps the cascade crisp. */
  stagger?: number;
  /** Any CSS timing function. Defaults to the design system's --ease-out. */
  ease?: string;
  /** Perspective distance in px, shared by every panel on a line so the fold
   *  has one vanishing point instead of one per word. */
  perspective?: number;
  /** 0–1. Strength of the shade on the panel's far edge while it is folded. */
  creaseShading?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const geometry = HINGES[hinge];
  const shade = clamp(creaseShading, 0, 1);

  const rootStyle = {
    "--fold-origin": geometry.origin,
    "--fold-from": geometry.from,
    "--fold-duration": `${duration}s`,
    "--fold-stagger": `${stagger}s`,
    "--fold-ease": ease,
    "--fold-perspective": `${Math.max(120, perspective)}px`,
    "--fold-crease": shade,
    "--fold-crease-image": `linear-gradient(${geometry.shade}, rgb(0 0 0 / 0), rgb(0 0 0 / 0.7))`,
    ...style,
  } as CSSProperties;

  // Continuous across lines, so the cascade reads as one movement.
  let index = 0;

  return (
    <Tag className={cn("fold-text", className)} style={rootStyle}>
      {lines.map((line) => (
        <span key={line.text} className={cn("fold-line", line.className)}>
          {panels(line.text, splitBy).map(({ piece, spaceAfter }, i) => (
            <Fragment key={`${piece}-${i}`}>
              <span className="fold-piece" style={{ "--i": index++ } as CSSProperties}>
                {piece}
              </span>
              {/* The separator is a sibling, not part of the panel: trailing
                  whitespace inside an inline-block is trimmed away. */}
              {spaceAfter ? " " : null}
            </Fragment>
          ))}
        </span>
      ))}
    </Tag>
  );
}
