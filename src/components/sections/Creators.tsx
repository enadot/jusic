import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { CtaLink } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/ui/Reveal";
import { creators } from "@/content/site";

/** The one element on the page allowed to carry the brand gradient. */
export function Creators() {
  return (
    <section
      id="creators"
      className="relative overflow-hidden"
      style={{ background: "var(--gradient-brand)" }}
    >
      <Image
        src="/atmos/creators.webp"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none object-cover opacity-20 mix-blend-overlay"
      />
      <Container className="relative py-22">
        <Reveal
          className="mx-auto max-w-[860px] text-center"
          sectionId="creators"
          placement="cta"
          visual={false}
        >
          <h2 className="mega text-white" data-anim-lines="">
            <span className="line-mask">
              <span>
                {creators.headingA}{" "}
                <span className="opacity-75">{creators.headingB}</span>
              </span>
            </span>
          </h2>
          <p
            data-anim-step=""
            className="mt-6 text-[clamp(17px,1.5vw,22px)] leading-[1.7] text-white/90"
          >
            {creators.body}
          </p>
          <div data-anim-step="" className="mt-8">
            <CtaLink
              href="/artists"
              event="artist_contact_click"
              placement="cta"
              variant="secondary"
              size="lg"
              icon="mic"
              external={false}
            >
              {creators.cta}
            </CtaLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
