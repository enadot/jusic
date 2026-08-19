"use client";

import { useEffect, useState } from "react";
import { buttonClass, ButtonContent } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { detectPlatform } from "@/lib/platform";
import { download } from "@/content/site";

/**
 * Mobile-only download bar. Appears once the hero has scrolled past, respects the
 * safe-area inset, and the page reserves matching bottom padding so it can never
 * cover the footer.
 */
export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-4 bottom-4 z-30 mid:hidden"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <a
        href="/download"
        onClick={() =>
          track("sticky_cta_click", {
            placement: "sticky",
            platform: detectPlatform(),
          })
        }
        className={buttonClass({ size: "lg", block: true })}
      >
        <ButtonContent icon="download" size="lg">
          {download.stickyCta}
        </ButtonContent>
      </a>
    </div>
  );
}
