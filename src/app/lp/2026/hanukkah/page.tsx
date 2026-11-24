import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { StickyCta } from "@/components/shared/StickyCta";
import { DownloadOptions } from "@/components/download/DownloadOptions";
import { KislevHero } from "@/components/campaign/KislevHero";
import { KislevExtra } from "@/components/campaign/KislevExtra";
import { kislev } from "@/content/site";

/**
 * Landing page for the Kislev dreidel display campaign.
 * Served at /lp/2026/hanukkah. Paid traffic only:
 * kept out of the index and the sitemap so it never competes with the home
 * page for organic search.
 */
export const metadata: Metadata = {
  title: kislev.meta.title,
  description: kislev.meta.description,
  alternates: { canonical: kislev.path },
  robots: { index: false, follow: true },
};

export default function KislevPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="pb-24 mid:pb-0">
        <KislevHero />
        <KislevExtra />

        <section
          id="download"
          className="border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]"
        >
          <Container className="py-20 mid:py-28">
            <h2 className="m-0 font-[var(--font-display)] text-[clamp(30px,3.6vw,52px)] leading-[1.1] font-extrabold tracking-[-0.02em]">
              {kislev.download.heading}
            </h2>
            <p className="mt-3 mb-10 text-[17px] text-text-secondary">
              {kislev.download.body}
            </p>
            <DownloadOptions />
          </Container>
        </section>
      </main>
      <SiteFooter />
      <StickyCta />
    </>
  );
}
