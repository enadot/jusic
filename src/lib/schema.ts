import { faq, links, site } from "@/content/site";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  alternateName: "ג׳וזיק",
  legalName: site.legalCompanyName,
  url: site.url,
  logo: `${site.url}/brand/logo-white.png`,
  email: site.contactEmail,
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  inLanguage: "he-IL",
  description: site.description,
};

/**
 * Two listings, one per store. Ratings, install counts and prices are
 * deliberately absent — none of them are verified.
 */
export const softwareAppSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    applicationCategory: "MusicApplication",
    operatingSystem: "Android",
    inLanguage: "he-IL",
    url: links.googlePlay,
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    applicationCategory: "MusicApplication",
    operatingSystem: "iOS",
    inLanguage: "he-IL",
    url: links.appStore,
  },
];

/** Only valid on a page that actually renders these questions. */
export const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};
