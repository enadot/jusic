import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { CtaLink } from "@/components/ui/CtaLink";
import { FoldText } from "@/components/ui/FoldText";
import { hero, links, screens, tickerWords } from "@/content/site";

/**
 * A phone in its frame. The frame is a fixed pixel width and the screenshot
 * fills it, so the 11px bezel is the only thing between the two — which is why
 * the `sizes` below are the frame width minus 22, not the frame width.
 */
function Phone({
  src,
  width,
  priority = false,
  className,
  sizes,
  anim,
}: {
  src: string;
  width: number;
  priority?: boolean;
  className?: string;
  sizes: string;
  anim?: string;
}) {
  return (
    <div
      data-anim={anim}
      className={`rounded-[44px] border border-white/10 bg-[var(--ink-950)] p-[11px] shadow-[var(--shadow-raised)] ${className ?? ""}`}
      style={{ width }}
    >
      <Image
        src={src}
        alt={screens.alt}
        width={1440}
        height={2936}
        priority={priority}
        quality={70}
        sizes={sizes}
        className="block h-auto w-full rounded-[34px]"
      />
    </div>
  );
}

export function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(200deg, var(--color-ink-800) 0%, var(--color-ink-900) 55%)",
      }}
    >
      {/* The one lighting effect: a soft cyan bloom behind the phones. */}
      <div
        aria-hidden="true"
        data-anim="hero-bloom"
        className="pointer-events-none absolute -bottom-90 h-[900px] w-[900px] rounded-full blur-[30px]"
        style={{
          insetInlineEnd: "-12%",
          background:
            "radial-gradient(circle, rgb(30 176 213 / 0.3), transparent 62%)",
        }}
      />

      <Container className="relative grid items-center gap-10 pt-35 pb-22 mid:grid-cols-[1.15fr_0.85fr]">
        <div>
          {/*
           * Split into rows and words in the markup rather than by a runtime
           * splitter: nothing to re-split on resize, and no splitter anywhere
           * near Hebrew. The unfold is CSS, not GSAP — this is an LCP candidate
           * and it cannot wait for a dynamic import.
           */}
          <FoldText
            as="h1"
            className="mega hero-fold"
            lines={[
              { text: `${hero.lines.a} ${hero.lines.b}` },
              { text: `${hero.lines.c} ${hero.lines.d}` },
              { text: `${hero.lines.e} ${hero.lines.f}`, className: "text-cyan-400" },
            ]}
            duration={0.6}
            stagger={0.05}
            perspective={900}
            creaseShading={0.55}
          />

          <p
            data-anim="hero-body"
            className="mt-6 mb-0 max-w-[540px] text-[clamp(17px,1.4vw,22px)] leading-[1.65] font-bold text-text-secondary"
          >
            {hero.body}
          </p>

          <div data-anim-group="hero-ctas" className="mt-8 flex flex-wrap gap-3">
            <CtaLink
              href={links.web}
              event="listen_web_click"
              placement="hero"
              size="lg"
              icon="play_arrow"
            >
              {hero.ctas.web}
            </CtaLink>
            <CtaLink
              href={links.googlePlay}
              event="google_play_click"
              placement="hero"
              size="lg"
              variant="outline"
              icon="google_play"
            >
              {hero.ctas.googlePlay}
            </CtaLink>
            <CtaLink
              href={links.appStore}
              event="app_store_click"
              placement="hero"
              size="lg"
              variant="outline"
              icon="app_store"
            >
              {hero.ctas.appStore}
            </CtaLink>
            <CtaLink
              href={links.apk}
              event="apk_download_click"
              placement="hero"
              size="lg"
              variant="ghost"
              icon="download"
            >
              {hero.ctas.apk}
            </CtaLink>
          </div>

          {/* The four claims the ticker used to carry, now stated once. */}
          <ul
            data-anim-group="hero-claims"
            className="mt-[26px] flex list-none flex-wrap gap-2.5 p-0 text-[13px] text-text-tertiary"
          >
            {tickerWords.slice(0, 4).map((word, i) => (
              <li key={word} className="flex items-center gap-2.5">
                {i > 0 ? (
                  <span aria-hidden="true" className="text-cyan-500">
                    •
                  </span>
                ) : null}
                {word}
              </li>
            ))}
          </ul>
        </div>

        {/*
         * min-height is load-bearing: the back phone is absolutely positioned
         * and contributes no height, so without it the row collapses on first
         * paint and everything below jumps. The tilt is dropped on phones,
         * where there is no room for it.
         */}
        <div className="relative flex min-h-[480px] justify-center mid:rotate-[-4deg]">
          <Phone
            src="/app/playlist.jpg"
            width={240}
            sizes="(max-width: 860px) 45vw, 218px"
            className="phone-back absolute start-0 top-[70px] opacity-85"
          />
          <Phone
            src="/app/home.jpg"
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
