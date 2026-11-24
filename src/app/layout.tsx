import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/content/site";
import { UtmCapture } from "@/components/shared/UtmCapture";
import "@/styles/globals.css";

/**
 * Ploni (Fontef) — the brand typeface, self-hosted. Four real weights so nothing
 * ever falls back to a synthesised one.
 */
const ploni = localFont({
  src: [
    { path: "../../public/fonts/ploni-light-aaa.woff", weight: "300", style: "normal" },
    { path: "../../public/fonts/ploni-regular-aaa.woff", weight: "400", style: "normal" },
    { path: "../../public/fonts/ploni-bold-aaa.woff", weight: "700", style: "normal" },
    { path: "../../public/fonts/ploni-black-aaa.woff", weight: "800", style: "normal" },
  ],
  variable: "--font-ploni",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/brand/favicon-light.svg", media: "(prefers-color-scheme: dark)" },
      { url: "/brand/favicon-dark.svg", media: "(prefers-color-scheme: light)" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: site.name,
    url: site.url,
    title: site.title,
    description: site.description,
    // the image comes from src/app/opengraph-image.jpg (file convention);
    // listing it here as well would override the generated, hashed URL.
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0F1417",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={ploni.variable}>
      <head>
        {/* Reveals start at opacity 0 and are turned on by an observer. Without
            JS there is no observer, so the content must be visible outright. */}
        <noscript>
          <style>{`.rv{opacity:1;transform:none}`}</style>
        </noscript>
      </head>
      <body>
        <a href="#main" className="skip-link">
          דילוג לתוכן הראשי
        </a>
        <UtmCapture />
        {children}
      </body>
    </html>
  );
}
