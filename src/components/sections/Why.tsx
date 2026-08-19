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
        <Reveal
          className="grid items-start gap-11 mid:grid-cols-2"
          sectionId="why"
          placement="cta"
        >
          <h2 className="kw text-[clamp(44px,6.5vw,100px)]">
            {why.headingA}
            <br />
            <span className="text-text-tertiary">{why.headingB}</span>
          </h2>
          <p className="m-0 self-center text-[clamp(18px,1.6vw,24px)] leading-[1.7] text-text-secondary">
            {why.body}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
