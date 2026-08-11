import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cover, features } from "@/content/site";

export function Features() {
  return (
    <section
      id="features"
      className="border-y border-[var(--border-subtle)] bg-[var(--bg-elevated)]"
    >
      <Container className="py-25">
        <Reveal sectionId="features" placement="cta">
          <h2 className="mega mb-12">
            {features.headingA}{" "}
            <span className="outline-word outline-word-cyan">
              {features.headingB}
            </span>
          </h2>
        </Reveal>

        <ul className="m-0 list-none p-0">
          {features.items.map((item) => (
            <li key={item.title} className="border-t border-[var(--border)]">
              <Reveal className="flex flex-wrap items-center gap-7 py-7">
                <Image
                  src={cover(item.cover)}
                  alt=""
                  width={76}
                  height={76}
                  className="h-19 w-19 shrink-0 rounded-2xl object-cover"
                />
                <h3 className="m-0 min-w-70 shrink-0 grow-0 font-[var(--font-display)] text-[clamp(30px,3.8vw,58px)] leading-none font-extrabold tracking-[-0.02em]">
                  {item.title}
                </h3>
                <p className="m-0 flex-[1_1_320px] text-[17px] leading-[1.6] text-text-secondary">
                  {item.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
        <div className="border-t border-[var(--border)]" />
      </Container>
    </section>
  );
}
