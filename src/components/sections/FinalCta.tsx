import { Container } from "@/components/shared/Container";
import { CtaLink } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/ui/Reveal";
import { finalCta, links } from "@/content/site";

export function FinalCta() {
  return (
    <section className="border-y border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
      <Container className="py-25 text-center">
        <Reveal sectionId="final-cta" placement="cta">
          <h2 className="kw text-[clamp(44px,6.5vw,100px)]">
            {finalCta.headingA}
            <br />
            <span className="text-cyan-400">{finalCta.headingB}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[560px] text-[var(--text-body-lg)] leading-[var(--lh-body-lg)] text-text-secondary">
            {finalCta.body}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <CtaLink
              href={links.web}
              event="listen_web_click"
              placement="cta"
              size="lg"
              icon="play_arrow"
            >
              {finalCta.ctas.web}
            </CtaLink>
            <CtaLink
              href={links.googlePlay}
              event="google_play_click"
              placement="cta"
              size="lg"
              variant="outline"
              icon="google_play"
            >
              {finalCta.ctas.android}
            </CtaLink>
            <CtaLink
              href={links.appStore}
              event="app_store_click"
              placement="cta"
              size="lg"
              variant="outline"
              icon="app_store"
            >
              {finalCta.ctas.ios}
            </CtaLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
