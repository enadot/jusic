import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/ui/Reveal";
import { screens } from "@/content/site";

const SHOTS = [
  { src: "/app/home.jpg", offset: "md:mt-0" },
  { src: "/app/playlist.jpg", offset: "md:mt-8" },
] as const;

export function Screens() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-80 h-[800px] w-[800px] max-w-full -translate-x-1/2 rounded-full blur-[30px]"
        style={{
          insetInlineStart: "50%",
          background:
            "radial-gradient(circle, rgb(30 176 213 / 0.3), transparent 62%)",
        }}
      />
      <Container className="relative pt-22 text-center">
        <Reveal>
          <h2 className="mega">
            {screens.headingA}
            <br />
            <span className="text-cyan-400">{screens.headingB}</span>
          </h2>
        </Reveal>

        <Reveal className="mt-13 grid grid-cols-1 items-end justify-center gap-10 sm:grid-cols-2">
          {SHOTS.map((shot) => (
            <div
              key={shot.src}
              className={`mx-auto w-full max-w-[300px] rounded-t-[44px] border border-white/10 border-b-0 bg-[var(--ink-950)] px-3 pt-3 shadow-[var(--shadow-raised)] ${shot.offset}`}
            >
              <Image
                src={shot.src}
                alt={screens.alt}
                width={1440}
                height={2936}
                sizes="(max-width: 640px) 90vw, 300px"
                className="block w-full rounded-t-[32px]"
              />
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
