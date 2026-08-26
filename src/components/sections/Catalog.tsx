import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { catalog } from "@/content/site";

/**
 * The catalogue: what is actually inside the app, one kind at a time.
 *
 * The three feature bands above argue *why* — recommendations, breadth, play.
 * They are the wrong place to answer *what is in it*, and the answer had been
 * living inside their body copy: playlists, lessons, radio and clips were each
 * a single word in a run-on list, and a word in a list reads as an afterthought
 * however true it is.
 *
 * So the four the site had never shown get a real screen from the app rather
 * than an icon — a screenshot of a radio list settles the question an icon of a
 * radio only raises — and the four that already own a stage further up the page
 * follow as chips, present without competing. Content decides which is which;
 * see `catalog` in src/content/site.ts.
 *
 * A server component: four images and eight labels need no JavaScript.
 */
export function Catalog() {
  return (
    <section
      id="catalog"
      className="border-t border-[var(--border-subtle)] bg-ink-800"
    >
      <Container className="py-22">
        <Reveal sectionId="catalog" placement="cta">
          <h2 className="mega">
            {catalog.headingA}{" "}
            <span className="text-cyan-400">{catalog.headingB}</span>
          </h2>
          <p className="mt-5 max-w-[560px] text-[clamp(17px,1.5vw,22px)] leading-[1.65] text-text-secondary">
            {catalog.body}
          </p>

          {/*
           * Both breakpoints are px on purpose. Tailwind emits its media
           * queries in source order and cannot compare `min-[560px]` against
           * `sm` (40rem), so a rem breakpoint mixed with the project's px
           * `mid` sorts *after* it and quietly wins at every width above it —
           * `sm:grid-cols-2 mid:grid-cols-4` renders two columns on a 27"
           * display. Keep the units matched.
           */}
          <ul className="m-0 grid list-none gap-4 p-0 pt-12 min-[560px]:grid-cols-2 mid:grid-cols-4">
            {catalog.showcase.map((item) => (
              <li key={item.title}>
                <div className="flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-card)]">
                  {/*
                   * 3:4 of a 1:2 screen, anchored to the top: the app's own
                   * header and the first rows of content, cut where a screen
                   * keeps scrolling. The fade is the card's own surface coming
                   * up to meet the crop — the screen itself is never tinted.
                   */}
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={item.shot}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 861px) 25vw, (min-width: 560px) 45vw, 90vw"
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(to_top,var(--surface-card),transparent)]" />
                  </div>

                  <div className="flex flex-1 flex-col gap-2 p-6 pt-4">
                    <h3 className="m-0 flex items-center gap-2 text-[19px] font-extrabold">
                      <Icon
                        name={item.icon as IconName}
                        size={20}
                        className="text-cyan-400"
                      />
                      {item.title}
                    </h3>
                    <p className="m-0 text-[15px] leading-[1.6] text-text-secondary">
                      {item.body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* The four that are already staged elsewhere on the page. */}
          <div className="flex flex-wrap items-center gap-3 pt-8">
            <span className="text-[15px] font-bold text-text-tertiary">
              {catalog.moreLabel}
            </span>
            <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
              {catalog.more.map((item) => (
                <li
                  key={item.title}
                  className="flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] px-4 py-2.5 text-[15px] font-semibold"
                >
                  <Icon
                    name={item.icon as IconName}
                    size={18}
                    className="text-cyan-400"
                  />
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
