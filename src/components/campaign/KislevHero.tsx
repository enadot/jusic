import { Container } from "@/components/shared/Container";
import { CtaLink } from "@/components/ui/CtaLink";
import { FoldText } from "@/components/ui/FoldText";
import { Phone } from "@/components/sections/Hero";
import { KislevWaves } from "@/components/motion/KislevWaves";
import { hero, kislev, links } from "@/content/site";

/**
 * The campaign hero. It says what the banner said, in the order the banner
 * said it: the question, the answer, the four bullets — but in the
 * design system's own voice: ink and cyan, no sticker colours.
 *
 * Beside it, two real screens from the app in its Chanukah season, framed
 * exactly like the home-page hero.
 */
export function KislevHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(200deg, var(--color-ink-800) 0%, var(--color-ink-900) 60%)",
      }}
    >
      {/*
       * Ribbons of light (React Bits' SlicedWaves), loaded on idle and never
       * under reduced motion. Decoration only: the hero is complete without it.
       */}
      <KislevWaves className="kislev-waves pointer-events-none absolute inset-0" />

      {/* The one lighting effect: a cyan bloom behind the phones. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-60 h-[760px] w-[760px] rounded-full blur-[40px] mid:top-1/2 mid:bottom-auto mid:-translate-y-1/2"
        style={{
          insetInlineEnd: "-8%",
          background:
            "radial-gradient(circle, rgb(30 176 213 / 0.28), transparent 62%)",
        }}
      />

      <Container className="relative grid items-center pt-28 pb-16 mid:grid-cols-[1.1fr_0.9fr] mid:gap-10 mid:pt-36 mid:pb-24">
        {/*
         * On phones this column dissolves (display: contents) so the phones
         * can slot in between the sub-headline and the bullets via `order`.
         * From `mid` up it is an ordinary block and the orders do nothing.
         */}
        <div className="contents mid:block">
          <p className="order-1 m-0 text-[clamp(19px,1.8vw,26px)] leading-[1.35] font-bold text-text-secondary">
            {kislev.question}{" "}
            {kislev.tags.map((tag, i) => (
              <span key={tag}>
                <span
                  className="kislev-word text-text-primary"
                  style={{ animationDelay: `${0.7 + i * 0.15}s` }}
                >
                  {tag}
                </span>
                {i < kislev.tags.length - 1 ? " " : ""}
              </span>
            ))}
          </p>

          <FoldText
            as="h1"
            className="mega hero-fold kislev-h1 order-2 mt-4"
            lines={[
              { text: kislev.headline[0] },
              { text: kislev.headline[1] },
              { text: kislev.headline[2], className: "text-cyan-400" },
            ]}
            duration={0.6}
            stagger={0.06}
            perspective={900}
            creaseShading={0.55}
          />

          <p className="order-3 mt-5 mb-0 text-[clamp(24px,2.6vw,38px)] leading-[1.15] font-extrabold tracking-[-0.01em]">
            {kislev.headingA} {kislev.headingB}
          </p>

          <ul className="order-5 mt-7 flex list-none flex-wrap gap-2 p-0">
            {kislev.bullets.map((b) => (
              <li
                key={b}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-[var(--surface-card)] px-4 py-2 text-[15px] font-bold text-text-secondary"
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                {b}
              </li>
            ))}
          </ul>

          {/* Full-width, one per row on phones; a row of pills from `mid` up. */}
          <div className="order-6 mt-9 flex flex-col gap-3 mid:flex-row mid:flex-wrap">
            <CtaLink
              href={links.web}
              event="listen_web_click"
              placement="campaign"
              size="lg"
              className="w-full mid:w-auto"
              icon="play_arrow"
            >
              {hero.ctas.web}
            </CtaLink>
            <CtaLink
              href={links.googlePlay}
              event="google_play_click"
              placement="campaign"
              size="lg"
              className="w-full mid:w-auto"
              variant="outline"
              icon="google_play"
            >
              {hero.ctas.googlePlay}
            </CtaLink>
            <CtaLink
              href={links.appStore}
              event="app_store_click"
              placement="campaign"
              size="lg"
              className="w-full mid:w-auto"
              variant="outline"
              icon="app_store"
            >
              {hero.ctas.appStore}
            </CtaLink>
          </div>
        </div>

        {/*
         * The app itself, dressed for Chanukah: the client's own screens, in
         * the home page's phone frame. min-height is load-bearing for the
         * same reason as on the home page: the back phone is absolute.
         */}
        <div className="relative order-4 mt-10 flex min-h-[500px] justify-center mid:order-none mid:mt-0 mid:rotate-[-4deg]">
          <Phone
            src={kislev.screens.back.src}
            alt={kislev.screens.back.alt}
            imgWidth={1080}
            imgHeight={2104}
            width={240}
            sizes="(max-width: 860px) 45vw, 218px"
            className="phone-back absolute start-0 top-[70px] opacity-85"
          />
          <Phone
            src={kislev.screens.front.src}
            alt={kislev.screens.front.alt}
            imgWidth={1080}
            imgHeight={2104}
            width={270}
            priority
            sizes="(max-width: 860px) 50vw, 248px"
            className="relative z-2"
          />
        </div>
      </Container>
    </section>
  );
}
