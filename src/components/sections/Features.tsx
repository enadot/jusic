import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { cover, features, recoTile } from "@/content/site";

/**
 * The three illustrations beside the feature bands. All three are static and
 * non-interactive on purpose — they suggest the product without pretending to
 * be it, and they stay server components, so the bands cost no JavaScript.
 */

/** Recommendations: a staggered grid of the client-supplied artist photos. */
function RecoDemo() {
  return (
    <div data-anim-demo="reco" className="mx-auto grid max-w-[420px] grid-cols-3 gap-3">
      {[1, 2, 3, 4, 5, 6].map((n, i) => (
        <Image
          key={n}
          src={recoTile(n)}
          alt=""
          width={400}
          height={400}
          sizes="132px"
          className="aspect-square h-auto w-full rounded-[var(--radius-md)] object-cover shadow-[var(--shadow-card)]"
          style={{ transform: `translateY(${(i % 3) * 12}px)` }}
        />
      ))}
    </div>
  );
}

/**
 * Stories: artwork in rings. The rings are a flat cyan rather than the brand
 * gradient the source design used — the gradient is spent on Creators, and the
 * system allows one gradient element per page.
 */
function StoryDemo() {
  return (
    <div data-anim-demo="story" className="flex flex-wrap justify-center gap-3">
      {[3, 4, 5, 6, 7].map((n, i) => (
        <div
          key={n}
          className={`rounded-full p-[3px] ${i < 3 ? "bg-cyan-500" : "bg-[var(--ink-500)]"}`}
        >
          <Image
            src={cover(n)}
            alt=""
            width={84}
            height={84}
            sizes="84px"
            className="block h-21 w-21 rounded-full border-[3px] border-[var(--bg)] object-cover"
          />
        </div>
      ))}
    </div>
  );
}

/** Trivia: the shape of a question, with no invented question inside it. */
function GameDemo() {
  return (
    <div
      data-anim-demo="game"
      className="mx-auto max-w-[400px] rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-[var(--shadow-card)]"
    >
      <div className="mb-3.5 flex items-center gap-2.5">
        <Icon name="gamepad" size={22} className="text-cyan-500" />
        <b>{features.demo.label}</b>
      </div>
      <p className="mt-0 mb-3.5 text-[var(--text-body-lg)] font-bold">
        {features.demo.question}
      </p>
      <ul data-anim-group="game-options" className="m-0 flex list-none flex-col gap-2 p-0">
        {features.demo.options.map((option, i) => (
          <li
            key={option}
            className={
              i === 0
                ? "rounded-full border border-cyan-700 bg-cyan-500/[0.14] px-4 py-3 font-semibold text-cyan-300"
                : "rounded-full border border-transparent bg-[var(--surface-input)] px-4 py-3 font-semibold text-text-secondary"
            }
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
}

const DEMOS = [RecoDemo, StoryDemo, GameDemo];

/** ink-900 / ink-800 / ink-900, so consecutive bands separate without a rule. */
const BAND_BG = ["bg-ink-900", "bg-ink-800", "bg-ink-900"];

/**
 * The first word of a band heading stays white and the rest goes cyan — the
 * source design's rule. A single-word heading therefore carries no accent,
 * which is what the design does and which keeps the cyan area down.
 */
function BandHeading({ title }: { title: string }) {
  const [first, ...rest] = title.split(" ");
  return (
    <h3 className="kw text-[clamp(44px,6.5vw,100px)]" data-anim-lines="">
      <span className="line-mask">
        <span>
          {first}
          {rest.length > 0 ? (
            <>
              {" "}
              <span className="text-cyan-400">{rest.join(" ")}</span>
            </>
          ) : null}
        </span>
      </span>
    </h3>
  );
}

export function Features() {
  const bands = features.items.slice(0, 3);
  const rest = features.items.slice(3);

  return (
    <section id="features">
      <Container className="pt-25">
        <Reveal sectionId="features" placement="cta" visual={false}>
          <h2 className="mega" data-anim-lines="">
            <span className="line-mask">
              <span>
                {features.headingA}{" "}
                <span className="text-cyan-400">{features.headingB}</span>
              </span>
            </span>
          </h2>
        </Reveal>
      </Container>

      {bands.map((item, i) => {
        const Demo = DEMOS[i];
        return (
          <div
            key={item.title}
            data-anim-band=""
            className={`mt-12 border-t border-[var(--border-subtle)] ${BAND_BG[i]}`}
          >
            <Container>
              {/*
               * The columns alternate with `order`, not by flipping `direction`
               * as the source prototype does. Flipping direction would re-resolve
               * every logical property inside the band against the wrong side,
               * and the RTL lint cannot see it. Ordering only applies from `mid`
               * up, so the stack stays in DOM order on phones.
               */}
              <div className="grid items-center gap-14 py-22 mid:grid-cols-2">
                {/* No Reveal in the bands: these carried no analytics, and
                    GSAP animates the heading rows and the demo separately. */}
                <div className={i % 2 ? "mid:order-2" : undefined}>
                  <BandHeading title={item.title} />
                  <p
                    data-anim="band-body"
                    className="mt-5 max-w-[460px] text-[clamp(17px,1.5vw,22px)] leading-[1.65] text-text-secondary"
                  >
                    {item.body}
                  </p>
                </div>
                <div className={i % 2 ? "mid:order-1" : undefined}>
                  <Demo />
                </div>
              </div>
            </Container>
          </div>
        );
      })}

      {/* The two features the three bands have no room for, stated plainly. */}
      <Container className="pb-25">
        <ul className="m-0 grid list-none gap-4 p-0 pt-14 mid:grid-cols-2">
          {rest.map((item) => (
            <li key={item.title}>
              <div
                data-anim-card=""
                className="flex h-full items-start gap-5 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6"
              >
                <Image
                  src={cover(item.cover)}
                  alt=""
                  width={400}
                  height={400}
                  sizes="64px"
                  className="h-16 w-16 shrink-0 rounded-[var(--radius-md)] object-cover"
                />
                <div>
                  <h3 className="m-0 text-[19px] font-extrabold">{item.title}</h3>
                  <p className="mt-2 mb-0 text-[15px] leading-[1.6] text-text-secondary">
                    {item.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
