import { Container } from "@/components/shared/Container";
import { CtaLink } from "@/components/ui/CtaLink";
import { FoldText } from "@/components/ui/FoldText";
import { hero, kislev, links } from "@/content/site";

/**
 * The campaign hero. It says what the banner said, in the order the banner
 * said it: the question, the stop, the answer, the four bullets — but in the
 * design system's own voice: ink and cyan, no sticker colours.
 *
 * The dreidel is the banner's own 12-frame sprite. It spins on arrival,
 * winds down and comes to rest on frame 0, the one with the logo facing out,
 * so "stop spinning!" happens on the page instead of looping forever. It is
 * CSS only (no client JS), and under reduced motion it simply stands still.
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
      {/* The one lighting effect: a cyan bloom behind the dreidel. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 h-[760px] w-[760px] rounded-full blur-[40px] mid:top-1/2 mid:-translate-y-1/2"
        style={{
          insetInlineEnd: "-8%",
          background:
            "radial-gradient(circle, rgb(30 176 213 / 0.28), transparent 62%)",
        }}
      />

      <Container className="relative grid items-center gap-6 pt-28 pb-16 mid:grid-cols-[1.1fr_0.9fr] mid:gap-10 mid:pt-36 mid:pb-24">
        <div>
          <p className="m-0 text-[clamp(19px,1.8vw,26px)] leading-[1.35] font-bold text-text-secondary">
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
            className="kw hero-fold mt-4"
            lines={[
              { text: kislev.stopA },
              { text: kislev.stopB, className: "text-cyan-400" },
            ]}
            duration={0.6}
            stagger={0.06}
            perspective={900}
            creaseShading={0.55}
          />

          <p className="mt-5 mb-0 text-[clamp(24px,2.6vw,38px)] leading-[1.15] font-extrabold tracking-[-0.01em]">
            {kislev.headingA} {kislev.headingB}
          </p>

          <ul className="mt-7 flex list-none flex-wrap gap-2 p-0">
            {kislev.bullets.map((b) => (
              <li
                key={b}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[15px] font-bold text-text-secondary"
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <CtaLink
              href={links.web}
              event="listen_web_click"
              placement="campaign"
              size="lg"
              icon="play_arrow"
            >
              {hero.ctas.web}
            </CtaLink>
            <CtaLink
              href={links.googlePlay}
              event="google_play_click"
              placement="campaign"
              size="lg"
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
              variant="outline"
              icon="app_store"
            >
              {hero.ctas.appStore}
            </CtaLink>
          </div>
        </div>

        {/* First on phones, so the dreidel is part of the first screen. */}
        <div className="relative order-first mx-auto w-[min(42vw,170px)] mid:order-none mid:w-[min(100%,420px)]">
          {/* Sound-wave rings: the stage the dreidel stops on. */}
          <div aria-hidden="true" className="kislev-waves">
            <i />
            <i />
            <i />
          </div>
          <div aria-hidden="true" className="kislev-floor">
            <i />
            <i />
            <i />
          </div>
          <div
            role="img"
            aria-label={kislev.dreidelAlt}
            className="kislev-dreidel relative aspect-[235/290] w-full"
          />
        </div>
      </Container>
    </section>
  );
}
