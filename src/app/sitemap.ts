import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: site.url, lastModified, priority: 1 },
    { url: `${site.url}/download`, lastModified, priority: 0.9 },
    { url: `${site.url}/artists`, lastModified, priority: 0.8 },
    { url: `${site.url}/legal/accessibility`, lastModified, priority: 0.3 },
  ];
}
