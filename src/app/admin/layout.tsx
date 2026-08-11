import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * The dashboard is a separate surface from the marketing site: no sticky CTA,
 * no marketing footer, no reveal animations. It only shares the design tokens.
 *
 * Every /admin route is dynamic — it reads a session and live rows, so there is
 * nothing here worth prerendering.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "לוח בקרה", template: "%s · לוח בקרה" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh bg-[var(--bg)]">{children}</div>;
}
