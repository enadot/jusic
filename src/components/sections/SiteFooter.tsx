import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { CtaLink } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/ui/Reveal";
import type { IconName } from "@/components/ui/Icon";
import {
  contact,
  copyrightLine,
  legalLinks,
  mailto,
} from "@/content/site";

export function SiteFooter() {
  return (
    <footer id="contact" className="bg-[var(--ink-950)]">
      <Container className="pt-16 pb-10">
        <Reveal sectionId="contact" placement="footer">
          <h2 className="m-0 max-w-[760px] font-[var(--font-display)] text-[clamp(26px,2.6vw,40px)] font-extrabold tracking-[-0.02em]">
            {contact.heading}
          </h2>
          <div className="mt-7 flex flex-wrap gap-3">
            {contact.topics.map((topic) => (
              <CtaLink
                key={topic.label}
                href={mailto(topic.label)}
                event={topic.event}
                placement="footer"
                variant="outline"
                icon={topic.icon as IconName}
                external={false}
              >
                {topic.label}
              </CtaLink>
            ))}
          </div>
        </Reveal>

        <nav
          aria-label="קישורים משפטיים"
          className="mt-13 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]"
        >
          {legalLinks.map((item, i) => (
            <span key={item.href} className="flex items-center gap-4">
              {i > 0 ? (
                <span aria-hidden="true" className="text-text-tertiary">
                  |
                </span>
              ) : null}
              <Link
                href={item.href}
                className="text-text-tertiary hover:text-text-secondary"
              >
                {item.label}
              </Link>
            </span>
          ))}
        </nav>

        {/* text-tertiary, not text-disabled: #8A9391 clears 4.5:1 on ink-950, #61726D does not. */}
        <p className="mt-4 text-[12px] text-text-tertiary">{copyrightLine}</p>
      </Container>
    </footer>
  );
}
