"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";
import { buttonVariants } from "./button";

export const ADMIN_THEME_KEY = "jusic-admin-theme";

/**
 * The dashboard's light/dark switch. The attribute lives on #admin-root and is
 * set before paint by the inline script in src/app/admin/layout.tsx; this
 * button only flips it and remembers the choice. Dark is the default — it is
 * the brand — so only "light" is ever persisted, and removing the attribute is
 * going home.
 *
 * Deliberately stateless: the visible icon is chosen by CSS on the attribute
 * (see .admin-icon-* in globals.css), so nothing here has to know the theme,
 * the server render can never disagree with localStorage, and there is no
 * setState-on-mount. The label names the action generically for the same
 * reason.
 */
export function ThemeToggle() {
  const toggle = () => {
    const root = document.getElementById("admin-root");
    if (!root) return;
    const next = root.dataset.adminTheme !== "light";
    if (next) {
      root.dataset.adminTheme = "light";
    } else {
      delete root.dataset.adminTheme;
    }
    try {
      if (next) {
        localStorage.setItem(ADMIN_THEME_KEY, "light");
      } else {
        localStorage.removeItem(ADMIN_THEME_KEY);
      }
    } catch {
      // Private mode: the choice still applies until the tab closes.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="החלפה בין מצב בהיר לכהה"
      className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
    >
      <Sun size={17} aria-hidden="true" className="admin-icon-sun" />
      <Moon size={17} aria-hidden="true" className="admin-icon-moon" />
    </button>
  );
}
