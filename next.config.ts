import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Next 16 appends its own instruction block to CLAUDE.md on every `next dev`.
  // CLAUDE.md here is the project's own authored file, so keep it ours; the
  // Next 16 notes live in docs/ARCHITECTURE.md instead. Flip to true to opt in.
  agentRules: false,
};

export default nextConfig;
