import { SiteHeader } from "@/components/sections/SiteHeader";
import { Hero } from "@/components/sections/Hero";
import { Why } from "@/components/sections/Why";
import { Features } from "@/components/sections/Features";
import { Creators } from "@/components/sections/Creators";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { StickyCta } from "@/components/shared/StickyCta";
import { HomeMotion } from "@/components/motion/HomeMotion";
import { JsonLd } from "@/components/shared/JsonLd";
import { faqPageSchema, organizationSchema, softwareAppSchemas, websiteSchema } from "@/lib/schema";

/**
 * The motion guard, inline so it runs before the hero parses.
 *
 * It adds the class that switches on every `[data-anim]` from-state in
 * globals.css — and it adds it only when JS is running and reduced motion is
 * off. The 2.5s timeout is the failsafe for the case JS runs but the GSAP
 * chunk never arrives: HomeMotion clears it the moment GSAP is in charge.
 * Without the class the page renders as its own finished frame, which is what
 * a crawler, a reduced-motion visitor and a failed chunk all get.
 */
const ANIM_GUARD = `(function(){try{if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;var d=document.documentElement;d.classList.add("js-anim");window.__jusicAnimTimer=setTimeout(function(){d.classList.remove("js-anim")},2500)}catch(e){}})()`;

export default function HomePage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: ANIM_GUARD }} />
      <JsonLd
        data={[
          organizationSchema,
          websiteSchema,
          ...softwareAppSchemas,
          faqPageSchema,
        ]}
      />
      <SiteHeader />
      <main id="main" className="pb-24 mid:pb-0">
        <Hero />
        <Why />
        <Features />
        <Creators />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
      <StickyCta />
      <HomeMotion />
    </>
  );
}
