import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { CtaLink } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/ui/Reveal";
import { cover, finalCta, links } from "@/content/site";

export function FinalCta() {
  return (
    <section className="border-y border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
      <Container className="py-[110px] text-center">
        <Reveal sectionId="final-cta" placement="cta">
          <h2 className="mega">
            {finalCta.headingA}{" "}
            <Image
              src={cover(6)}
              alt=""
              width={120}
              height={120}
              className="inlineart inline-block"
            />
            <br />
            <span className="text-cyan-400">{finalCta.headingB}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[560px] text-[17px] leading-[1.6] text-text-secondary">
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
