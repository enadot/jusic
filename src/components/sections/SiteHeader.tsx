"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/shared/Container";
import { CtaLink } from "@/components/ui/CtaLink";
import { header, links, nav, site } from "@/content/site";

/**
 * Sticky header. Transparent over the hero, glass once the page scrolls —
 * glass is used here because content genuinely moves underneath it.
 */
export function SiteHeader() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-20 border-b transition-colors duration-[var(--dur-base)] ease-[var(--ease-standard)]"
      style={{
        background: solid ? "var(--glass-bg-strong)" : "transparent",
        backdropFilter: solid ? "blur(var(--blur-glass))" : undefined,
        WebkitBackdropFilter: solid ? "blur(var(--blur-glass))" : undefined,
        borderBottomColor: solid ? "var(--glass-border)" : "transparent",
      }}
    >
      <Container className="flex h-18 items-center justify-between gap-6">
        <Link href="/" aria-label={`${site.name} — לעמוד הבית`} className="flex items-center">
          <Image
            src="/brand/logo-white.png"
            alt={site.wordmark}
            width={80}
            height={32}
            priority
            className="h-8 w-auto"
          />
        </Link>

        <nav aria-label="ניווט ראשי" className="hidden gap-6.5 mid:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] font-semibold text-text-secondary transition-colors duration-[var(--dur-fast)] hover:text-text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <CtaLink
          href={links.web}
          event="listen_web_click"
          placement="header"
          size="sm"
          icon="play_arrow"
        >
          {header.cta}
        </CtaLink>
      </Container>
    </header>
  );
}
