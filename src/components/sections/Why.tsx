import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/ui/Reveal";
import { why } from "@/content/site";

/**
 * Two columns of pure type: the claim at display size on one side, the
 * substantiation at reading size on the other. The second half of the heading
 * drops to tertiary so the pair reads as one sentence losing volume, not as two
 * headings.
 */
export function Why() {
  return (
    <section id="why">
      <Container className="py-25">
        {/* visual={false}: the wrapper still fires section_view, but the
            contents are GSAP's now — see src/lib/motion.ts. */}
        <Reveal
          className="grid items-start gap-11 mid:grid-cols-2"
          sectionId="why"
          placement="cta"
          visual={false}
        >
          <h2 className="kw text-[clamp(44px,6.5vw,100px)]" data-anim-lines="">
            <span className="line-mask">
              <span>{why.headingA}</span>
            </span>
            <span className="line-mask">
              {/* The scrubbed wipe. text-text-tertiary stays as the colour for
                  everyone who never gets the gradient. */}
              <span className="wipe text-text-tertiary">{why.headingB}</span>
            </span>
          </h2>
          <p
            data-anim-step=""
            className="m-0 self-center text-[clamp(18px,1.6vw,24px)] leading-[1.7] text-text-secondary"
          >
            {why.body}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
