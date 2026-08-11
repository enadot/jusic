import Link from "next/link";
import type { ReactNode } from "react";
import { LayoutDashboard, Inbox, Mic, LogOut } from "lucide-react";
import { cn } from "@/lib/cn";
import { signOut } from "@/server/actions/admin";
import type { AdminUser } from "@/server/auth";
import { site } from "@/content/site";

const NAV = [
  { href: "/admin", label: "סקירה", icon: LayoutDashboard },
  { href: "/admin/submissions", label: "כל הפניות", icon: Inbox },
  { href: "/admin/artists", label: "הצטרפות אמנים", icon: Mic },
] as const;

/**
 * Sidebar on the start side (right, in RTL), collapsing to a horizontal rail
 * under lg. Nothing here is a client component: the active state comes from the
 * pathname passed by each page, so the shell ships no JS at all.
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
  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[240px_1fr]">
      <aside className="border-[var(--border)] bg-[var(--ink-950)] lg:border-e lg:min-h-dvh">
        <div className="flex items-center justify-between gap-3 px-5 py-4 lg:block">
          <Link
            href="/"
            className="font-[var(--font-display)] text-[19px] font-extrabold tracking-[0.02em] text-text-primary"
          >
            {site.wordmark}
            <span className="ms-2 text-[12px] font-bold text-cyan-400">
              לוח בקרה
            </span>
          </Link>
        </div>

        <nav aria-label="ניווט לוח בקרה" className="px-3 pb-4 lg:mt-2">
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
                      "flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[14px] font-bold whitespace-nowrap",
                      "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
                      isActive
                        ? "bg-cyan-500/12 text-cyan-300"
                        : "text-text-secondary hover:bg-white/[0.05] hover:text-text-primary",
                    )}
                  >
                    <Icon size={17} aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="min-w-0">
        <header className="flex flex-wrap items-center gap-3 border-b border-[var(--border)] px-5 py-4 sm:px-8">
          <h1 className="m-0 flex-1 text-[22px] font-extrabold tracking-[-0.01em]">
            {title}
          </h1>
          {actions}
          <div className="flex items-center gap-3">
            <span className="hidden text-[13px] text-text-tertiary sm:inline">
              <bdi>{user.email}</bdi>
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-bold",
                  "text-text-secondary hover:bg-white/[0.06] hover:text-text-primary",
                  "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
                )}
              >
                <LogOut size={16} aria-hidden="true" />
                התנתקות
              </button>
            </form>
          </div>
        </header>

        <main className="px-5 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
