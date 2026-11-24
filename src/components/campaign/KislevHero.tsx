import { Container } from "@/components/shared/Container";
import { CtaLink } from "@/components/ui/CtaLink";
import { hero, kislev, links } from "@/content/site";

const TAG_TONES = ["kislev-tag-yellow", "kislev-tag-cyan", "kislev-tag-black"];

/**
 * The campaign hero. It says what the banner said, in the order the banner
 * said it: the question, the stop, the answer, the four bullets.
 *
 * The dreidel is the banner's own 12-frame sprite. It spins on arrival,
 * winds down and comes to rest on frame 0, the one with the logo facing out,
 * so "stop spinning!" happens on the page instead of looping forever. It is
 * CSS only (no client JS), and under reduced motion it simply stands still.
 */
export function KislevHero() {
  return (
    <section className="kislev-hero relative overflow-hidden">
      <Container className="relative grid items-center gap-8 pt-32 pb-16 mid:grid-cols-[1.15fr_0.85fr] mid:pt-36 mid:pb-24">
        <div>
          <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-2 text-[clamp(20px,2.1vw,30px)] leading-none font-extrabold">
            <span>{kislev.question}</span>
            {kislev.tags.map((tag, i) => (
              <span
                key={tag}
                className={`kislev-tag ${TAG_TONES[i]}`}
                style={{ animationDelay: `${0.15 + i * 0.12}s` }}
              >
                {tag}
              </span>
            ))}
          </p>

          <p className="kislev-stop m-0 mt-7 inline-block text-[clamp(26px,3vw,44px)] leading-none font-extrabold">
            {kislev.stop}
          </p>

          <h1 className="mega mt-5">
            {kislev.headingA}
            <br />
            <span className="text-cyan-400">{kislev.headingB}</span>
          </h1>

          <ul className="mt-7 grid list-none grid-cols-2 gap-x-6 gap-y-3 p-0 text-[clamp(16px,1.3vw,19px)] font-bold text-text-secondary min-[560px]:max-w-[460px]">
            {kislev.bullets.map((b) => (
              <li key={b} className="flex items-center gap-2">
                <span aria-hidden="true" className="text-cyan-400">
                  ‹
                </span>
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <CtaLink
              href={links.web}
              event="listen_web_click"
              placement="campaign"
              size="lg"
              icon="play_arrow"
            >
              {hero.ctas.web}
            </CtaLink>
            <CtaLink
              href={links.googlePlay}
              event="google_play_click"
              placement="campaign"
              size="lg"
              variant="outline"
              icon="google_play"
            >
              {hero.ctas.googlePlay}
            </CtaLink>
            <CtaLink
              href={links.appStore}
              event="app_store_click"
              placement="campaign"
              size="lg"
              variant="outline"
              icon="app_store"
            >
              {hero.ctas.appStore}
            </CtaLink>
          </div>
        </div>

        <div className="relative mx-auto w-[min(58vw,300px)] mid:w-[min(100%,400px)]">
          <div aria-hidden="true" className="kislev-floor">
            <i />
            <i />
            <i />
          </div>
          <div
            role="img"
            aria-label={kislev.dreidelAlt}
            className="kislev-dreidel relative aspect-[235/290] w-full"
          />
        </div>
      </Container>
    </section>
  );
}
