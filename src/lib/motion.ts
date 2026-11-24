/**
 * The home page's GSAP timelines.
 *
 * Pure functions: each takes the gsap instance, the ScrollTrigger class and a
 * root to query, and returns nothing. Keeping them out of the component means
 * the client boundary stays a dozen lines and the choreography is readable in
 * one place.
 *
 * Two rules hold everywhere in this file:
 *
 * 1. **`fromTo`, never `from`.** The from-state is already applied in CSS
 *    (`html.js-anim [data-anim] { opacity: 0 }`), so a bare `from()` would read
 *    opacity 0 as the destination and animate nothing.
 * 2. **Only `opacity`, `transform` and `background-position`.** Everything here
 *    stays on the compositor; nothing touches layout during a scroll.
 */

import type { gsap as GsapNamespace } from "gsap";
import type { ScrollTrigger as ScrollTriggerClass } from "gsap/ScrollTrigger";

type Gsap = typeof GsapNamespace;
type ScrollTriggerType = typeof ScrollTriggerClass;

/**
 * The design system's --ease-out is cubic-bezier(0.16, 1, 0.3, 1). CustomEase
 * is the only way to hand GSAP a literal bezier, and it is not worth a plugin
 * for this: power3.out sits within a few milliseconds of it across the curve.
 */
const EASE = "power3.out";

/** --dur-reveal and --dur-base, in the seconds GSAP wants. */
const REVEAL = 0.64;
const BASE = 0.22;

function one(root: ParentNode, selector: string) {
  return root.querySelector<HTMLElement>(selector);
}

function all(root: ParentNode, selector: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

/**
 * Hero, on load.
 *
 * The headline and the phones are absent on purpose — they are the page's two
 * LCP candidates, and both are revealed by CSS in the first frame (FoldText
 * and .phone-back in globals.css). Starting either at opacity 0 here would hold
 * the largest paint back until the dynamic import resolves.
 */
export function heroEntry(g: Gsap, root: ParentNode) {
  const tl = g.timeline({ defaults: { ease: EASE, duration: REVEAL } });

  const bloom = one(root, '[data-anim="hero-bloom"]');
  if (bloom) {
    tl.fromTo(bloom, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.9 }, 0);
  }

  const body = one(root, '[data-anim="hero-body"]');
  if (body) {
    tl.fromTo(body, { opacity: 0, y: 10 }, { opacity: 1, y: 0 }, 0.12);
  }

  const ctas = all(root, '[data-anim-group="hero-ctas"] > *');
  if (ctas.length) {
    // DOM order, which in RTL runs right to left — the reading direction.
    tl.fromTo(ctas, { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.05 }, 0.2);
  }

  const claims = all(root, '[data-anim-group="hero-claims"] > *');
  if (claims.length) {
    tl.fromTo(claims, { opacity: 0 }, { opacity: 1, stagger: 0.04, duration: 0.4 }, 0.34);
  }

  // The phones are deliberately absent: the front one is the LCP element, and
  // any from-state here — even one GSAP clears 300ms later — leaves the largest
  // thing on the screen blank until a dynamic import resolves. Their entry is
  // .phone-back in globals.css: transform only, first frame, no JS.
}

/**
 * The one scroll-scrubbed moment: a luminance wipe across the second half of
 * the Why heading, filling in with the reading direction.
 *
 * Nothing moves in space — this is not parallax. The gradient is clipped to the
 * glyphs and only its position is scrubbed.
 */
export function whyWipe(g: Gsap, root: ParentNode) {
  const el = one(root, ".wipe");
  if (!el) return;

  g.fromTo(
    el,
    { backgroundPosition: "0% 0" },
    {
      backgroundPosition: "100% 0",
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top 78%",
        end: "bottom 55%",
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    },
  );
}

/** A heading pre-split into .line-mask rows, revealed one row at a time. */
function lines(g: Gsap, tl: gsap.core.Timeline, host: HTMLElement | null, at: number) {
  if (!host) return;
  const rows = all(host, ".line-mask > span");
  if (!rows.length) return;
  tl.fromTo(
    rows,
    { yPercent: 108, opacity: 0 },
    { yPercent: 0, opacity: 1, stagger: 0.07, duration: REVEAL },
    at,
  );
}

/**
 * The three feature bands. Each one is its own timeline so a band that is
 * already past the fold on load does not replay the ones below it.
 *
 * The demos deliberately do not share a stagger: a grid wants a diagonal, a row
 * of circles wants to open from the middle, and a list of answers wants to
 * arrive in reading order and then resolve.
 */
export function featureBands(g: Gsap, root: ParentNode) {
  for (const band of all(root, "[data-anim-band]")) {
    const tl = g.timeline({
      defaults: { ease: EASE, duration: REVEAL },
      scrollTrigger: { trigger: band, start: "top 72%", once: true },
    });

    lines(g, tl, band.querySelector<HTMLElement>("[data-anim-lines]"), 0);

    const body = band.querySelector<HTMLElement>('[data-anim="band-body"]');
    if (body) tl.fromTo(body, { opacity: 0, y: 12 }, { opacity: 1, y: 0 }, 0.14);

    const demo = band.querySelector<HTMLElement>("[data-anim-demo]");
    if (!demo) continue;

    switch (demo.dataset.animDemo) {
      case "reco": {
        // yPercent, not y: the covers already carry an inline translateY for
        // the staggered layout, and GSAP composes yPercent on top of it rather
        // than overwriting the parsed y.
        const covers = all(demo, ":scope > *");
        tl.fromTo(
          covers,
          { opacity: 0, yPercent: 14, scale: 0.96 },
          {
            opacity: 1,
            yPercent: 0,
            scale: 1,
            stagger: { each: 0.05, grid: [2, 3], from: "end" },
          },
          0.2,
        );
        break;
      }

      case "story": {
        const rings = all(demo, ":scope > *");
        tl.fromTo(
          rings,
          { opacity: 0, scale: 0.86 },
          { opacity: 1, scale: 1, stagger: { each: 0.06, from: "center" } },
          0.2,
        );
        break;
      }

      case "game": {
        tl.fromTo(demo, { opacity: 0, y: 16 }, { opacity: 1, y: 0 }, 0.16);

        const options = all(demo, '[data-anim-group="game-options"] > *');
        if (options.length) {
          tl.fromTo(
            options,
            { opacity: 0, x: 10 },
            { opacity: 1, x: 0, stagger: 0.05, duration: 0.4 },
            0.34,
          );

          // The question resolves: one 220ms out-and-back on the right answer.
          // Colour only — no scale, so nothing bounces.
          tl.to(
            options[0],
            {
              backgroundColor: "rgba(30, 176, 213, 0.3)",
              duration: BASE,
              repeat: 1,
              yoyo: true,
            },
            ">0.1",
          );
        }
        break;
      }
    }
  }
}

/** A section that reveals as one block: heading, body, then the CTA row. */
export function blockEntry(g: Gsap, root: ParentNode, selector: string) {
  const host = one(root, selector);
  if (!host) return;

  const tl = g.timeline({
    defaults: { ease: EASE, duration: REVEAL },
    scrollTrigger: { trigger: host, start: "top 76%", once: true },
  });

  lines(g, tl, host.querySelector<HTMLElement>("[data-anim-lines]"), 0);

  const items = all(host, "[data-anim-step]");
  if (items.length) {
    tl.fromTo(items, { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.06 }, 0.16);
  }
}

/**
 * The two feature cards the bands have no room for. ScrollTrigger.batch is the
 * right tool here: it groups whatever enters in the same frame into one
 * stagger instead of firing two unrelated tweens.
 */
export function cardBatch(g: Gsap, ScrollTrigger: ScrollTriggerType, root: ParentNode) {
  const cards = all(root, "[data-anim-card]");
  if (!cards.length) return;

  g.set(cards, { opacity: 0, y: 18 });
  ScrollTrigger.batch(cards, {
    start: "top 88%",
    once: true,
    onEnter: (batch) =>
      g.to(batch, { opacity: 1, y: 0, duration: REVEAL, ease: EASE, stagger: 0.08 }),
  });
}
