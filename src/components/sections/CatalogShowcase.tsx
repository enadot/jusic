"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ClickSpark } from "@/components/ui/ClickSpark";
import { OptionWheel } from "@/components/ui/OptionWheel";
import { catalog } from "@/content/site";

const ITEMS = catalog.showcase;
const TITLES = ITEMS.map((item) => item.title);

/**
 * The four content types the site had never shown, as a wheel of names beside
 * the screen each one names.
 *
 * A grid of four screenshots says the same thing, and said it here until this
 * replaced it — but four screens at once is four thumbnails nobody looks into,
 * and on a phone it was three thousand pixels of scrolling. One screen at a
 * time is bigger than any of the four were, and picking which one is the
 * closest this marketing page gets to the act the app is for: choosing what to
 * listen to.
 *
 * Every screen stays mounted and keeps its own alt text, so what a crawler and
 * a screen reader get does not depend on which one is showing. Only opacity
 * moves between them.
 */
export function CatalogShowcase({ label }: { label: string }) {
  const [index, setIndex] = useState(0);
  const current = ITEMS[index];

  return (
    <div className="grid items-center gap-8 pt-12 mid:grid-cols-[1fr_0.85fr] mid:gap-14">
      <div>
        {/* The spark inherits currentColor, so the wrapper's cyan is the one
            accent — and the burst marks the tap that swaps the screen, the
            only tap on this page that changes what you are looking at. */}
        <ClickSpark className="block w-full text-cyan-400">
          <OptionWheel
            items={TITLES}
            selected={index}
            onSelect={setIndex}
            label={label}
            className="h-[240px] w-full mid:h-[300px]"
            fontSize={2}
          />
        </ClickSpark>
        <p
          className="mt-6 max-w-[420px] text-[16px] leading-[1.65] text-text-secondary mid:text-[17px]"
          // The line belongs to the option above it, and both change together.
          aria-live="polite"
        >
          {current.body}
        </p>
      </div>

      <div className="glare relative mx-auto aspect-[9/16] w-full max-w-[300px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-black">
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
  );
}
