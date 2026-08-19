import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/ui/Reveal";
import { FaqItem } from "./FaqItem";
import { faq } from "@/content/site";

export function Faq() {
  return (
    <section id="faq">
      <Container className="py-24">
        <Reveal sectionId="faq" placement="faq">
          <h2 className="mega mb-10">
            {faq.headingA} {faq.headingB}
          </h2>
        </Reveal>

        {/* items-start, and h-fit on each card: without both, opening one
            answer stretches every card sharing its grid row. */}
        <Reveal className="grid items-start gap-3.5 mid:grid-cols-2">
          {faq.items.map((item) => (
            <FaqItem
              key={item.id}
              id={item.id}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
