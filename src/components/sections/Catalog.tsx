import { Container } from "@/components/shared/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { catalog } from "@/content/site";

/**
 * The catalogue: one tile per kind of content in the app.
 *
 * The three feature bands above argue *why* — recommendations, breadth, play.
 * They are the wrong place to answer *what is in it*, and the answer had been
 * living inside their body copy: playlists, lessons, radio and clips were each
 * a single word in a run-on list, and a word in a list reads as an afterthought
 * however true it is. This band is the counterweight, and it is the only place
 * on the site where the content types are addressed one at a time.
 *
 * Flat and uniform on purpose. Ranking the tiles — a hero tile for music, small
 * ones for the rest — would state an editorial priority nobody has approved,
 * and a grid that treats radio like music is exactly the claim the section is
 * making. It stays a server component: eight tiles of text and an icon need no
 * JavaScript.
 */
export function Catalog() {
  return (
    <section id="catalog" className="border-t border-[var(--border-subtle)] bg-ink-800">
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
            {catalog.items.map((item) => (
              <li key={item.title}>
                <div className="flex h-full flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--surface-input)] text-cyan-400">
                    <Icon name={item.icon as IconName} size={22} />
                  </span>
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
        </Reveal>
      </Container>
    </section>
  );
}
