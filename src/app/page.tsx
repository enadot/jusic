import { SiteHeader } from "@/components/sections/SiteHeader";
import { Hero } from "@/components/sections/Hero";
import { Why } from "@/components/sections/Why";
import { Features } from "@/components/sections/Features";
import { Creators } from "@/components/sections/Creators";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { StickyCta } from "@/components/shared/StickyCta";
import { JsonLd } from "@/components/shared/JsonLd";
import { faqPageSchema, organizationSchema, softwareAppSchemas, websiteSchema } from "@/lib/schema";

export default function HomePage() {
  return (
    <>
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
    </>
  );
}
