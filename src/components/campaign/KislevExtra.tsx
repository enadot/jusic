import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { StoriesStrip } from "@/components/sections/StoriesStrip";
import { kislev } from "@/content/site";

/**
 * The four banner bullets, each proved by something real: a screen from the
 * app, or — for stories — the actual story rings, which open the clips.
 */
export function KislevExtra() {
  return (
    <section className="border-t border-[var(--border-subtle)]">
      <Container className="py-20 mid:py-28">
        <p className="m-0 text-[11px] font-bold tracking-[0.08em] text-cyan-400">
          {kislev.extra.eyebrow}
        </p>
        <h2 className="m-0 mt-3 font-[var(--font-display)] text-[clamp(30px,3.6vw,52px)] leading-[1.1] font-extrabold tracking-[-0.02em]">
          {kislev.extra.heading}
        </h2>

        <ul className="mt-12 grid list-none grid-cols-1 gap-4 p-0 min-[560px]:grid-cols-2 mid:grid-cols-4">
          {kislev.extra.cards.map((card) => (
            <li
              key={card.title}
              className="flex flex-col overflow-hidden rounded-[20px] border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-[var(--shadow-card)]"
            >
              <div className="relative h-[260px] overflow-hidden bg-[var(--bg-elevated)]">
                {card.shot ? (
                  <Image
                    src={card.shot}
                    alt={card.alt}
                    width={720}
                    height={1468}
                    sizes="(max-width: 560px) 70vw, 220px"
                    quality={70}
                    className="absolute inset-x-0 top-8 mx-auto w-[62%] rounded-[22px] border border-white/10 shadow-[var(--shadow-raised)]"
                  />
                ) : (
                  <div className="kislev-stories flex h-full items-center justify-center px-3">
                    <StoriesStrip />
                  </div>
                )}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(to_bottom,transparent,var(--surface-card))]"
                />
              </div>
              <div className="flex flex-1 flex-col p-5 pt-3">
                <h3 className="m-0 text-[21px] font-extrabold">
                  <span aria-hidden="true" className="me-1.5 text-cyan-400">
                    ‹
                  </span>
                  {card.title}
                </h3>
                <p className="mt-2 mb-0 text-[15px] leading-[1.6] text-text-secondary">
                  {card.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
