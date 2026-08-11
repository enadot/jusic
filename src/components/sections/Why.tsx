import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/ui/Reveal";
import { why } from "@/content/site";

export function Why() {
  return (
    <section id="why" className="relative overflow-hidden">
      <Image
        src="/atmos/why.webp"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none object-cover opacity-[0.14]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--bg), rgb(15 20 23 / 0.9), var(--bg))",
        }}
      />
      <Container className="relative py-[110px] text-center">
        <Reveal className="mx-auto max-w-[880px]" sectionId="why" placement="cta">
          <h2 className="mega">
            {why.headingA}
            <br />
            <span className="outline-word outline-word-cyan">{why.headingB}</span>
          </h2>
          <p className="mt-7 text-[clamp(18px,1.6vw,24px)] leading-[1.7] text-text-secondary">
            {why.body}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
