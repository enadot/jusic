import Link from "next/link";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Inbox,
  Mic,
  Users,
  Webhook,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { signOut } from "@/server/actions/admin";
import type { AdminUser } from "@/server/auth";
import { site } from "@/content/site";
import { ThemeToggle } from "@/components/admin/ui/ThemeToggle";
import { buttonVariants } from "@/components/admin/ui/button";

const NAV = [
  { href: "/admin", label: "סקירה", icon: LayoutDashboard },
  { href: "/admin/submissions", label: "כל הפניות", icon: Inbox },
  { href: "/admin/artists", label: "הצטרפות אמנים", icon: Mic },
  { href: "/admin/team", label: "ניהול גישה", icon: Users },
  { href: "/admin/webhooks", label: "Webhooks", icon: Webhook },
] as const;

/**
 * Sidebar on the start side (right, in RTL), collapsing to a horizontal rail
 * under lg. The shell itself stays a server component — the active state comes
 * from the pathname each page passes, and the only client leaf is the theme
 * toggle in the header.
 *
 * Layout follows the help-desk pattern (Deel/Plain on Mobbin): a quiet darker
 * sidebar, a thin header carrying title → actions → identity, and the content
 * on the room's own background so cards read as cards.
 */
export function Shell({
  user,
  active,
  title,
  actions,
  children,
}: {
  user: AdminUser;
  active: string;
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const initial = (user.email[0] ?? "?").toUpperCase();

  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[248px_1fr]">
      <aside className="border-b border-[var(--border-subtle)] bg-[var(--ink-950)] lg:flex lg:min-h-dvh lg:flex-col lg:border-b-0 lg:border-e">
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <Link
            href="/admin"
            className="font-[var(--font-display)] text-[19px] font-extrabold tracking-[0.02em] text-[var(--text-primary)]"
          >
            {site.wordmark}
            <span className="ms-2 text-[11px] font-bold tracking-[0.08em] text-[var(--cyan-400)] uppercase">
              Admin
            </span>
          </Link>
        </div>

        <nav aria-label="ניווט לוח בקרה" className="px-3 pb-3 lg:flex-1">
          <ul className="flex list-none gap-1 overflow-x-auto p-0 lg:flex-col lg:overflow-visible">
            {NAV.map((item) => {
              const isActive = item.href === active;
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "relative flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-[14px] font-bold whitespace-nowrap",
                      "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
                      isActive
                        ? "bg-[var(--chip-new-bg)] text-[var(--cyan-300)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--ad-hover)] hover:text-[var(--text-primary)]",
                    )}
                  >
                    {/* The active rail: a short bar on the start edge, the
                        pattern every desk tool on Mobbin uses to say "here". */}
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="absolute start-0 top-1/2 hidden h-5 w-[3px] -translate-y-1/2 rounded-full bg-[var(--cyan-500)] lg:block"
                      />
                    ) : null}
                    <Icon size={17} aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden border-t border-[var(--border-subtle)] px-3 py-3 lg:block">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-[13px] font-bold",
              "text-[var(--text-tertiary)] hover:bg-[var(--ad-hover)] hover:text-[var(--text-primary)]",
              "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
            )}
          >
            <ExternalLink size={15} aria-hidden="true" />
            לאתר הציבורי
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="flex flex-wrap items-center gap-3 border-b border-[var(--border-subtle)] bg-[var(--surface-card)] px-5 py-3.5 sm:px-8">
          <h1 className="m-0 flex-1 text-[20px] font-extrabold tracking-[-0.01em]">
            {title}
          </h1>
          {actions}
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <form action={signOut}>
              <button
                type="submit"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                <LogOut size={15} aria-hidden="true" />
                התנתקות
              </button>
            </form>
            <span
              title={user.email}
              className="ms-1 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--cyan-500)] text-[13px] font-extrabold text-[var(--text-on-cyan)]"
            >
              <bdi>{initial}</bdi>
              <span className="sr-only">
                {" "}
                מחובר/ת בתור <bdi>{user.email}</bdi>
              </span>
            </span>
          </div>
        </header>

        <main className="px-5 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
