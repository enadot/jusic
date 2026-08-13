import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: site.url, lastModified, priority: 1 },
    { url: `${site.url}/download`, lastModified, priority: 0.9 },
    { url: `${site.url}/artists`, lastModified, priority: 0.8 },
    // The legal pages carry real text now, so they are indexable and listed.
    { url: `${site.url}/legal/accessibility`, lastModified, priority: 0.3 },
    { url: `${site.url}/legal/privacy`, lastModified, priority: 0.3 },
    { url: `${site.url}/legal/terms`, lastModified, priority: 0.3 },
    { url: `${site.url}/legal/copyright`, lastModified, priority: 0.3 },
  ];
}
