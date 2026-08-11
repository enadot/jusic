import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/ui/Reveal";
import { CtaLink } from "@/components/ui/CtaLink";
import { Icon, type IconName } from "@/components/ui/Icon";
import { artists } from "@/content/site";

/**
 * The /artists page sections. Server components throughout — the only client
 * leaf on this page is the form itself.
 */

export function ArtistHero() {
  const copy = artists.hero;

  return (
    <section className="relative pt-36 pb-16">
      <Container>
        <p className="m-0 text-[13px] font-bold tracking-[0.14em] text-cyan-400 uppercase">
          {copy.eyebrow}
        </p>
        <h1 className="mega mt-4 max-w-[900px] text-[clamp(34px,5vw,64px)]">
          {copy.headingA}{" "}
          <span className="outline-word outline-word-cyan">{copy.headingB}</span>
        </h1>
        <p className="mt-6 max-w-[720px] text-[clamp(16px,1.4vw,20px)] leading-[1.7] text-text-secondary">
          {copy.body}
        </p>
        <div className="mt-8">
          <CtaLink
            href="#apply"
            placement="artists"
            variant="primary"
            size="lg"
            icon="mic"
            external={false}
          >
            {copy.cta}
          </CtaLink>
        </div>
      </Container>
    </section>
  );
}

export function ArtistWhy() {
  const copy = artists.why;

  return (
    <section className="py-16">
      <Container>
        <Reveal sectionId="artists-why" placement="artists">
          <h2 className="m-0 font-[var(--font-display)] text-[clamp(26px,2.8vw,44px)] font-extrabold tracking-[-0.02em]">
            {copy.headingA}{" "}
            <span className="text-text-tertiary">{copy.headingB}</span>
          </h2>
          <ul className="mt-9 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3">
            {copy.items.map((item) => (
              <li
                key={item.title}
                className="rounded-[20px] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--surface-input)] text-cyan-400">
                  <Icon name={item.icon as IconName} size={22} />
                </span>
                <h3 className="mt-4 mb-0 text-[20px] font-bold">{item.title}</h3>
                <p className="mt-2 mb-0 text-[15px] leading-[1.6] text-text-secondary">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}

export function ArtistHow() {
  const copy = artists.how;

  return (
    <section className="py-16">
      <Container>
        <Reveal sectionId="artists-how" placement="artists">
          <h2 className="m-0 font-[var(--font-display)] text-[clamp(26px,2.8vw,44px)] font-extrabold tracking-[-0.02em]">
            {copy.headingA}{" "}
            <span className="text-text-tertiary">{copy.headingB}</span>
          </h2>
          <ol className="mt-9 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3">
            {copy.steps.map((step, index) => (
              <li key={step.title} className="border-t border-[var(--border)] pt-5">
                <span
                  aria-hidden="true"
                  className="block font-[var(--font-display)] text-[32px] font-extrabold text-cyan-500"
                >
                  {index + 1}
                </span>
                <h3 className="mt-2 mb-0 text-[19px] font-bold">{step.title}</h3>
                <p className="mt-2 mb-0 text-[15px] leading-[1.6] text-text-secondary">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}

export function ArtistFaq() {
  const copy = artists.faq;

  return (
    <section className="py-16">
      <Container>
        <h2 className="m-0 font-[var(--font-display)] text-[clamp(26px,2.8vw,44px)] font-extrabold tracking-[-0.02em]">
          {copy.headingA}{" "}
          <span className="text-text-tertiary">{copy.headingB}</span>
        </h2>
        <div className="mt-8 max-w-[820px]">
          {copy.items.map((item) => (
            <details
              key={item.id}
              name="jusic-artists-faq"
              className="border-b border-[var(--border)]"
            >
              <summary className="cursor-pointer list-none py-5 text-[17px] font-bold marker:hidden">
                {item.question}
              </summary>
              <p className="mt-0 mb-5 text-[15px] leading-[1.7] text-text-secondary">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
