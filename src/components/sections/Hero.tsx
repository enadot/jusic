import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { CtaLink } from "@/components/ui/CtaLink";
import { cover, hero, links } from "@/content/site";

/** Inline circular artwork chip set inside the headline. Decorative. */
function Chip({ n, priority = false }: { n: number; priority?: boolean }) {
  return (
    <Image
      src={cover(n)}
      alt=""
      width={120}
      height={120}
      priority={priority}
      className="inlineart inline-block"
    />
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden">
      {/* Atmosphere: a single ambient field, well under the text scrim. */}
      <Image
        src="/atmos/hero.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover opacity-[0.18]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgb(15 20 23 / 0.72), rgb(15 20 23 / 0.94))",
        }}
      />
      {/* The one permitted lighting effect: a soft cyan radial glow. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-70 h-[820px] w-[820px] rounded-full blur-[30px]"
        style={{
          insetInlineStart: "30%",
          background:
            "radial-gradient(circle, rgb(30 176 213 / 0.26), transparent 62%)",
        }}
      />

      <Container className="relative pt-35 pb-20">
        <h1 className="mega">
          {hero.lines.a} <Chip n={1} priority /> {hero.lines.b}
          <br />
          {hero.lines.c} <Chip n={4} priority /> {hero.lines.d}
          <br />
          <span className="text-cyan-400">
            {hero.lines.e} <Chip n={7} priority /> {hero.lines.f}
          </span>
        </h1>

        <div className="mt-10 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <p className="m-0 max-w-[520px] text-[17px] leading-[1.6] font-bold text-text-secondary">
            {hero.body}
          </p>
          <div className="flex flex-wrap gap-3 md:justify-end">
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
        </div>
      </Container>
    </section>
  );
}
