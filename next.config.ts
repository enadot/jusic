import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  /**
   * No redirects. The privacy policy IS /privacy-policy-app and the terms ARE
   * /useragreement — the URLs the app-store listings and the apps link to — so
   * each is served by its own page rather than forwarded from one. The former
   * /privacy-policy-app → /legal/privacy redirect was removed with that move:
   * left in place it would have shadowed the real page, since a redirect is
   * matched before the route.
   */
  // Next 16 appends its own instruction block to CLAUDE.md on every `next dev`.
  // CLAUDE.md here is the project's own authored file, so keep it ours; the
  // Next 16 notes live in docs/ARCHITECTURE.md instead. Flip to true to opt in.
  agentRules: false,
};

export default nextConfig;
