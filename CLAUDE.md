# CLAUDE.md — jusic.co

The brand site for **JUSIC** (ג׳וזיק), a Jewish music and content platform by
לומדעת. This site is marketing, trust and user acquisition. **It is not the
product** — the player lives at `jusic.app` and in the mobile apps.

Before adding any component, ask: *is this marketing/information, or does it
belong to the product?* If it belongs to the product, do not build it here.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), TypeScript `strict`, RSC by default |
| Styling | Tailwind CSS v4, CSS-first `@theme` in `src/styles/globals.css` |
| Icons | `lucide-react` |
| Content | `src/content/site.ts` (typed module; Sanity is a later milestone) |
| Data | Neon Postgres + Drizzle — contact form submissions only |
| Admin auth | Neon Auth (`@neondatabase/auth`, pinned beta) + `ADMIN_EMAILS` allowlist |
| Validation | `zod`, server-side only |
| Motion | CSS + `IntersectionObserver` everywhere; `gsap` on the home page only |
| Package manager | npm |
| Deploy | Vercel |

Not used: WordPress, jQuery, runtime CSS-in-JS, extra UI kits.

**`gsap` is the one animation library, and it is conditional.** It is loaded by
`src/components/motion/HomeMotion.tsx` through a dynamic `import()` on idle,
after the first paint, on `/` and nowhere else — the initial JS of every route
is unchanged by it. Anything it animates has to be legible without it: the
from-states in `globals.css` apply only while the guard script in
`src/app/page.tsx` has put `js-anim` on `<html>`, and that guard removes itself
if the chunk never lands. Never animate an LCP candidate from `opacity: 0` —
the hero headline and the phones are revealed by CSS in the first frame for
exactly that reason. Do not reach for GSAP on another route without measuring
the route's JS first.

**Everything under `src/server/` is server-only** and must never reach a client
component — `drizzle`, `zod`, and the Neon SDKs stay out of the public bundle.
Import server actions by name; import types from `src/lib/`, not from a
`"use server"` module (it may only export async functions).

## Structure

```
src/
├── app/                  routes, sitemap.ts, robots.ts, opengraph-image.tsx
├── components/
│   ├── ui/               Button, CtaLink, Icon, Reveal, Modal, Field
│   ├── sections/         one file per home-page section
│   ├── download/         /download-only components
│   ├── forms/            contact modal trigger + form
│   ├── artists/          /artists sections + application form
│   ├── admin/            dashboard chrome (never imported by the public site)
│   └── shared/           Container, StickyCta, JsonLd, LegalLayout, UtmCapture
├── content/site.ts       every user-facing string
├── lib/                  analytics, platform, schema, cn, formState, formToken
├── server/               server-only: db, queries, actions, auth, validation, spam, webhook
├── styles/globals.css    design tokens + base
└── proxy.ts              guards /admin (Next 16's middleware)
drizzle/                  generated migrations, committed
```

`proxy.ts` belongs **inside `src/`**, beside `app/` — that is where Next looks
for it. At the repository root nothing loads it and nothing complains, so the
OAuth return silently stops working. `npm run lint` fails if it moves.

Each home section is self-contained so it can move to its own route without a
refactor.

## RTL — non-negotiable

`<html lang="he" dir="rtl">`. **Logical properties only:** `ms-* me-* ps-* pe-*
start-* end-* text-start text-end border-s border-e`.

Never `ml- mr- pl- pr- left- right- text-left text-right`. `npm run lint` runs
`scripts/check-rtl.mjs`, which fails the build on any of them. The only escape
hatch is a trailing `rtl-allow` comment on the line, and it needs a reason.

Wrap Latin/numeric runs in `<bdi>` or `dir="ltr"`: `19.90 ₪`, `Jusic`,
`Google Play`, `App Store`, `APK`, email addresses, version strings.

## Design system

Ported from the Claude Design project `jusic-design-system-bd48b83e`. The rules
that matter:

- **Dark only.** `#0F1417` background. Cyan looks weak on white; there is no
  light theme.
- **Artwork is the colour.** The frame is near-black and low-chroma so covers
  can be loud. Never colour-grade or tint artwork.
- **One accent.** Cyan `#1EB0D5` is action; sage `#778A84` is structure. No
  third brand colour.
- **White on cyan is 2.6:1 and fails.** A filled cyan button always carries
  `#0F1417` (`--text-on-cyan`).
- Cyan over roughly 15% of a screen is too loud.
- Pills only — JUSIC has no square buttons. Radius scale 6/10/14/20/28/pill.
- Glass only where content actually scrolls underneath (header, sticky bar).
- One brand-gradient element per page, at most.
- Motion: 140ms taps, 220ms surfaces, 640ms reveals. No bounce, no parallax, no
  looping animation, nothing at all under `prefers-reduced-motion`.
- No decorative Jewish symbolism. The identity comes from the content.
- Type is **Ploni** (Fontef), self-hosted, four real weights (300/400/700/800).

**AI atmosphere imagery** (`public/atmos/`) is a deliberate, client-approved
extension of the system. It stays abstract — dark fields and cyan light, always
under a scrim, always `alt=""`, never people, symbols, text or fake album art.

## Content rules

`src/content/site.ts` is the source of truth. Copy comes from the approved
design and the content brief — **do not rewrite it in passing**; put concerns in
`docs/COPY_SUGGESTIONS.md`.

Never invent: user counts, song counts, artist counts, ratings, testimonials,
partner logos, prices.

Claims that are approved as-worded and must not be expanded: "נקייה ב־100%",
"פלטפורמת התוכן היהודית המובילה", "מודל התגמול דואג ליוצרים מהשקל הראשון",
19.90 ₪. Offline download and parental controls are **future** features and must
never be presented as available. AI is not presented as a product feature.

## Analytics

Everything goes through `track()` in `src/lib/analytics.ts` — no provider calls
in components. Every event carries a `placement`
(`hero | platforms | cta | footer | sticky | header | download | faq | artists |
legal`).
UTM params are captured once per session, attached automatically, and posted
along with every form submission so a lead can be traced to a campaign.

No third-party script before LCP or before user interaction. No non-essential
cookies without consent.

## Accessibility

ת"י 5568 at WCAG 2.1 AA. Contrast ≥ 4.5:1 (≥ 3:1 large/UI), visible
`:focus-visible` everywhere, full keyboard navigation, skip link, Hebrew
`aria-label` on every icon-only control, and a real accessibility statement at
`/legal/accessibility`.

## Performance budgets

LCP < 2.0s · INP < 200ms · CLS < 0.05 · initial JS < 150KB gz. `"use client"`
only on genuinely interactive leaves. `next/image` everywhere; `priority` on the
hero only.

## Commands

```bash
npm run dev          # local
npm run build        # production build
npm run lint         # RTL check + eslint
npm run typecheck    # tsc --noEmit
npm run db:generate  # new migration from src/server/db/schema.ts
npm run db:migrate   # apply migrations to DATABASE_URL
```

Copy `.env.example` to `.env.local` before running the dashboard locally.

## Forms

Every contact CTA opens a form; nothing is a `mailto:` any more except the
placeholder text on the unfinished legal pages. Two rules worth knowing before
touching them:

- A `"use server"` module may only export async functions. Shared constants and
  types live in `src/lib/formState.ts`.
- React 19 resets an uncontrolled form after its action resolves, so every form
  echoes the submitted values back through `FormState.values` and feeds them to
  `defaultValue`. Drop that and a validation error wipes the user's input.

Spam is handled by a honeypot, an HMAC-signed render timestamp and a per-IP
quota — no captcha, and the raw IP is never stored. The signed stamp comes from
`/api/form-token` rather than from render, because the pages carrying the forms
are statically prerendered.

**Forms must not go live in production until `/legal/privacy` has real text** —
see `docs/OPEN_ITEMS.md` #3א.
