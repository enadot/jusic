"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ClickSpark } from "@/components/ui/ClickSpark";
import { OptionWheel } from "@/components/ui/OptionWheel";
import { cn } from "@/lib/cn";
import { catalog } from "@/content/site";

const ITEMS = catalog.showcase;
const TITLES = ITEMS.map((item) => item.title);

/**
 * The four content types the site had never shown, one app screen at a time.
 *
 * Two controls for the same choice, split by viewport. From `mid` up the
 * names ride the OptionWheel beside the screen — control and screen share the
 * viewport, so a pick and its effect are seen together. On a phone the wheel
 * was the wrong tool for exactly that reason: control and screen did not fit
 * one viewport, every tap meant a scroll to see what it changed, and 2.5rem
 * names clipped on narrow screens. There the names are tab toggles instead,
 * stuck to the top of the viewport (under the site header) for as long as the
 * section is on screen — the choice stays under the thumb while the screen
 * scrolls into view. Glass, because content genuinely scrolls underneath it.
 *
 * Every screen stays mounted and keeps its own alt text, so what a crawler and
 * a screen reader get does not depend on which one is showing. Only opacity
 * moves between them.
 */
export function CatalogShowcase({
  label,
  hint,
}: {
  label: string;
  hint: string;
}) {
  const [index, setIndex] = useState(0);
  const current = ITEMS[index];

  return (
    <div className="pt-8 mid:pt-12">
      {/*
       * The phones' control. Sticky against this whole showcase, so it holds
       * the top of the viewport exactly while the section is there; top-18
       * clears the fixed h-18 header, z-10 stays under the header's z-20. The
       * negative margins run the glass to the container's edges.
       */}
      <div className="sticky top-18 z-10 -mx-[var(--gutter-mobile)] mb-5 border-y border-[var(--glass-border)] bg-[var(--glass-bg-strong)] backdrop-blur-[var(--blur-glass)] mid:hidden">
        <div
          role="group"
          aria-label={label}
          className="flex gap-2 overflow-x-auto px-[var(--gutter-mobile)] py-3"
        >
          {TITLES.map((title, i) => (
            <button
              key={title}
              type="button"
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-[14px] font-bold whitespace-nowrap",
                "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
                i === index
                  ? "bg-cyan-500 text-text-on-cyan"
                  : "bg-[var(--surface-input)] text-text-secondary",
              )}
            >
              {title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid items-center gap-6 mid:grid-cols-[1fr_0.85fr] mid:gap-14">
        {/* On the phone the screen leads and the caption follows it — the
            toggles above already carry the names. */}
        <div className="order-2 mid:order-none">
          {/* The mice's control. The card is what says "control": floating
              names over the section background read as a headline, the same
              names on their own surface with a hint above and a marker beside
              the live row read as a picker. */}
          <div className="relative hidden overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-[var(--shadow-card)] mid:block">
            <p className="m-0 mb-2 text-[13px] font-bold tracking-[0.1em] text-text-tertiary uppercase">
              {hint}
            </p>
            {/* The spark inherits currentColor, so the wrapper's cyan is the
                one accent — and the burst marks the tap that swaps the screen,
                the only tap on this page that changes what you are looking at. */}
            <ClickSpark className="block w-full text-cyan-400">
              <div className="relative w-full">
                <span
                  aria-hidden="true"
                  className="absolute start-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-full bg-cyan-400"
                />
                <OptionWheel
                  items={TITLES}
                  selected={index}
                  onSelect={setIndex}
                  label={label}
                  className="h-[264px] w-full mid:h-[320px]"
                  fontSize={2.5}
                  inset={20}
                />
              </div>
            </ClickSpark>
          </div>
          <p
            className="m-0 text-[16px] leading-[1.65] text-text-secondary mid:mt-6 mid:max-w-[420px] mid:text-[17px]"
            // The line belongs to the option above it, and both change together.
            aria-live="polite"
          >
            {current.body}
          </p>
        </div>

        <div className="glare relative order-1 mx-auto aspect-[9/16] w-full max-w-[300px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-black mid:order-none">
          {ITEMS.map((item, i) => (
            <Image
              key={item.shot}
              src={item.shot}
              alt={item.alt}
              fill
              sizes="300px"
              className="object-cover object-top transition-opacity duration-[var(--dur-base)] ease-[var(--ease-standard)]"
              style={{ opacity: i === index ? 1 : 0 }}
            />
          ))}
          <span className="absolute bottom-3 end-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(8,11,13,0.72)] text-cyan-400">
            <Icon name={current.icon as IconName} size={18} />
          </span>
        </div>
      </div>
    </div>
  );
}
