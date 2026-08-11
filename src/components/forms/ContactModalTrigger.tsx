"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { buttonClass, ButtonContent } from "@/components/ui/Button";
import type { ButtonSize, ButtonVariant } from "@/components/ui/Button";
import type { IconName } from "@/components/ui/Icon";
import { track, type AnalyticsEvent, type Placement } from "@/lib/analytics";
import { contact, forms } from "@/content/site";

type TopicId = (typeof contact.topics)[number]["id"];

/**
 * The form ships only to visitors who actually open a modal. The trigger is a
 * few hundred bytes; everything else — fields, action wiring, validation
 * rendering — arrives on the first click.
 */
const ContactForm = dynamic(
  () => import("./ContactForm").then((m) => m.ContactForm),
  { ssr: false },
);

export function ContactModalTrigger({
  topic,
  label,
  placement,
  event,
  icon,
  variant = "outline",
  size = "md",
  block,
  className,
}: {
  topic: TopicId;
  label: string;
  placement: Placement;
  event?: AnalyticsEvent;
  icon?: IconName;
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={buttonClass({ variant, size, block, className })}
        onClick={() => {
          setOpen(true);
          // Keep the original per-topic event so the existing funnel survives,
          // and add the generic form_open on top of it.
          if (event) track(event, { placement });
          track("form_open", { placement, form: "contact", topic });
        }}
      >
        <ButtonContent icon={icon} size={size}>
          {label}
        </ButtonContent>
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={label}
        description={forms.contact.intro[topic]}
      >
        {/* Mounted only while open so each visit starts from a clean form. */}
        {open ? (
          <ContactForm
            topic={topic}
            placement={placement}
            onClose={() => setOpen(false)}
          />
        ) : null}
      </Modal>
    </>
  );
}
