import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  /**
   * The old WordPress site served the APP's privacy policy at
   * /privacy-policy-app/, and the app-store listings link to that URL — it
   * has been 404ing since this site replaced it. Until the client supplies
   * the app policy's text (it lives only in the old site; see
   * docs/OPEN_ITEMS.md), the least-wrong target is the site privacy policy.
   * Temporary (307), not permanent: this URL should become its own page
   * again, and a cached 308 would keep pointing at the stand-in.
   */
  redirects: async () => [
    {
      source: "/privacy-policy-app",
      destination: "/legal/privacy",
      permanent: false,
    },
  ],
  // Next 16 appends its own instruction block to CLAUDE.md on every `next dev`.
  // CLAUDE.md here is the project's own authored file, so keep it ours; the
  // Next 16 notes live in docs/ARCHITECTURE.md instead. Flip to true to opt in.
  agentRules: false,
};

export default nextConfig;
