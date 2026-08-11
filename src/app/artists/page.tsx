import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { SiteFooter } from "@/components/sections/SiteFooter";
import {
  ArtistFaq,
  ArtistHero,
  ArtistHow,
  ArtistWhy,
} from "@/components/artists/ArtistSections";
import { ArtistForm } from "@/components/artists/ArtistForm";
import { artists } from "@/content/site";

export const metadata: Metadata = {
  title: artists.meta.title,
  description: artists.meta.description,
  alternates: { canonical: "/artists" },
};

export default function ArtistsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <ArtistHero />
        <ArtistWhy />
        <ArtistHow />

        <section id="apply" className="scroll-mt-24 py-16">
          <Container>
            <div className="max-w-[720px]">
              <h2 className="m-0 font-[var(--font-display)] text-[clamp(26px,2.8vw,44px)] font-extrabold tracking-[-0.02em]">
                {artists.form.headingA}{" "}
                <span className="text-text-tertiary">
                  {artists.form.headingB}
                </span>
              </h2>
              <p className="mt-3 mb-8 text-[16px] leading-[1.7] text-text-secondary">
                {artists.form.body}
              </p>
              <ArtistForm />
            </div>
          </Container>
        </section>

        <ArtistFaq />
      </main>
      <SiteFooter />
    </>
  );
}
