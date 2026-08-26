import { Container } from "@/components/shared/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { CatalogShowcase } from "@/components/sections/CatalogShowcase";
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
 * So the four the site had never shown get a wheel of their own and a real
 * screen from the app beside it — a screenshot of a radio list settles the
 * question an icon of a radio only raises — and the four that already own a
 * stage further up the page follow as chips, present without competing.
 * Content decides which is which; see `catalog` in src/content/site.ts.
 *
 * The wheel is the only client component here. Everything else is text.
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

          <CatalogShowcase label={catalog.wheelLabel} />

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
