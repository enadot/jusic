"use client";

import { Plus } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/ui/Reveal";
import { track } from "@/lib/analytics";
import { faq } from "@/content/site";

export function Faq() {
  return (
    <section id="faq">
      <Container className="py-25">
        <Reveal className="grid grid-cols-1 items-start gap-12 md:grid-cols-[0.65fr_1.35fr]">
          <h2 className="mega text-[clamp(38px,4.6vw,72px)]">
            {faq.headingA}
            <br />
            <span className="outline-word outline-word-cyan">{faq.headingB}</span>
          </h2>

          <div className="border-t border-[var(--border)]">
            {faq.items.map((item) => (
              <details
                key={item.id}
                name="jusic-faq"
                className="group border-b border-[var(--border)]"
                onToggle={(e) => {
                  if (e.currentTarget.open) {
                    track("faq_open", { placement: "faq", question_id: item.id });
                  }
                }}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-6 text-[clamp(18px,2vw,24px)] font-bold [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <Plus
                    size={22}
                    aria-hidden="true"
                    className="shrink-0 text-text-tertiary transition-transform duration-[var(--dur-base)] ease-[var(--ease-standard)] group-open:rotate-45"
                  />
                </summary>
                <p className="m-0 max-w-[680px] px-1 pb-6 text-[17px] leading-[1.7] text-text-secondary">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
