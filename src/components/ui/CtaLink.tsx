"use client";

import type { ReactNode } from "react";
import {
  buttonClass,
  ButtonContent,
  type ButtonSize,
  type ButtonVariant,
} from "./Button";
import type { IconName } from "./Icon";
import { track, type AnalyticsEvent, type Placement } from "@/lib/analytics";

/**
 * A call to action that navigates. It stays a real anchor so it keeps link
 * semantics, middle-click and "open in new tab"; the analytics event fires on
 * click without blocking navigation.
 */
export function CtaLink({
  href,
  event,
  placement,
  eventParams,
  variant,
  size = "md",
  block,
  icon,
  external = true,
  className,
  ariaLabel,
  children,
}: {
  href: string;
  event?: AnalyticsEvent;
  placement: Placement;
  eventParams?: Record<string, string | number | boolean>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  icon?: IconName;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  const isExternal = external && /^https?:/.test(href);

  return (
    <a
      href={href}
      aria-label={ariaLabel}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={() => {
        if (event) track(event, { placement, ...eventParams });
      }}
      className={buttonClass({ variant, size, block, className })}
    >
      <ButtonContent icon={icon} size={size}>
        {children}
      </ButtonContent>
    </a>
  );
}
