import type { Metadata } from "next";
import { site } from "@/content/site";

/**
 * Give a page its own share card.
 *
 * The root layout sets `openGraph`/`twitter` for the home page, and Next does
 * not derive them from a child's `title` — a child that sets `openGraph`
 * replaces the parent's object wholesale. So without this every page shared
 * the home page's og:title, og:description and og:url. This reads the page's
 * own title, description and canonical path and fills both cards in full.
 *
 * The image itself is not set here: it is the route's `opengraph-image.jpg`
 * (file convention), which Next attaches with a hashed URL.
 */
export function withSocial(meta: Metadata): Metadata {
  const title = typeof meta.title === "string" ? meta.title : site.title;
  const social = /Jusic|ג׳וזיק/.test(title) ? title : `${title} · ${site.name}`;
  const description = meta.description ?? site.description;
  const canonical = meta.alternates?.canonical;
  const url = typeof canonical === "string" ? canonical : site.url;

  return {
    ...meta,
    openGraph: {
      type: "website",
      locale: "he_IL",
      siteName: site.name,
      url,
      title: social,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: social,
      description,
    },
  };
}
