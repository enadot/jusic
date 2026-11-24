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
  return (
    // suppressHydrationWarning: the theme script below sets data-admin-theme
    // before hydration, so the server markup legitimately differs by exactly
    // that attribute — the same deal next-themes makes with <html>.
    <div id="admin-root" className="admin-root min-h-dvh" suppressHydrationWarning>
      {/* Applies the saved theme before anything below paints. First child of
          the scope div so the element exists; dark needs no attribute at all,
          which is also what a failed read falls back to. Key must match
          ADMIN_THEME_KEY in components/admin/ui/ThemeToggle.tsx. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(localStorage.getItem("jusic-admin-theme")==="light")document.getElementById("admin-root").dataset.adminTheme="light"}catch(e){}`,
        }}
      />
      {children}
    </div>
  );
}
