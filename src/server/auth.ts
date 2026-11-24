import "server-only";

import { createNeonAuth, type NeonAuth } from "@neondatabase/auth/next/server";
import { redirect } from "next/navigation";
import { cache } from "react";
import { allowlistEmails } from "./queries/admins";

/**
 * Neon Auth (Managed Better Auth) guards the dashboard. Users live in Neon's
 * managed `neon_auth` schema; this app never writes to it.
 *
 * The SDK is still published as a beta. It is confined to /admin — an internal
 * tool — and no marketing route imports it.
 *
 * Built lazily: createNeonAuth throws when the cookie secret is shorter than 32
 * characters, and the marketing pages are prerendered in environments that have
 * no auth env vars at all. Constructing at module scope would fail those builds.
 */
let instance: NeonAuth | undefined;

export function getAuth(): NeonAuth {
  if (!instance) {
    const baseUrl = process.env.NEON_AUTH_BASE_URL;
    const secret = process.env.NEON_AUTH_COOKIE_SECRET;
    if (!baseUrl || !secret) {
      throw new Error(
        "NEON_AUTH_BASE_URL and NEON_AUTH_COOKIE_SECRET must be set to use the dashboard (see .env.example).",
      );
    }
    instance = createNeonAuth({
      baseUrl,
      cookies: {
        secret,
        /**
         * Required for Google sign-in — do not drop back to the default.
         *
         * The SDK defaults to sameSite: "strict". The OAuth session is not
         * established by the API route but by the middleware in proxy.ts: Neon
         * sends the browser back to the callback URL carrying a verifier query
         * param, and the middleware trades it plus a `session_challange` cookie
         * for the real session cookie.
         *
         * That return trip is a top-level cross-site navigation, and a strict
         * cookie is not sent on one. The challenge never arrives, the exchange
         * is skipped, /admin sees no session and bounces to the sign-in page —
         * which looks exactly like a rejected login rather than a dropped
         * cookie. Password sign-in is unaffected because it never leaves the
         * origin, so this breaks Google alone.
         *
         * "lax" still withholds the cookie from cross-site POSTs, which is the
         * CSRF case that matters here.
         */
        sameSite: "lax",
      },
      logLevel: "warn",
    });
  }
  return instance;
}

export const SIGN_IN_PATH = "/admin/sign-in";
export const NO_ACCESS_PATH = "/admin/no-access";
export const FORGOT_PASSWORD_PATH = "/admin/forgot-password";
/** Where Neon Auth sends the admin back once the emailed token is validated. */
export const RESET_PASSWORD_PATH = "/admin/reset-password";

/**
 * Neon Auth will happily let a stranger sign themselves up. Signing in is
 * therefore only half the check — the address also has to be on the allowlist,
 * or the whole contact inbox is public. Keep both halves.
 *
 * The allowlist has two halves of its own:
 *
 * - **ADMIN_EMAILS** (here) is the root list. It needs no database, cannot be
 *   edited from the browser, and is what gets the first person in — and back
 *   in if the table below is emptied or the database is unreachable. Keep at
 *   least one address in it.
 * - **admin_allowlist** (the table) is everyone added since, from /admin/team.
 *   Adding a teammate is a click rather than an env var and a redeploy.
 *
 * A row can never *remove* an env address: the two lists are unioned, and the
 * root list is the one that cannot lock itself out.
 */
export function envAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isRootAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return envAdminEmails().includes(email.toLowerCase());
}

/**
 * Deduped per request: every dashboard page calls requireAdmin(), and several
 * render server components that check again. React's cache() collapses those
 * into one round trip without any of them knowing about each other.
 */
const cachedAllowlist = cache(async (): Promise<string[]> => {
  try {
    const rows = await allowlistEmails();
    return rows.map((row) => row.toLowerCase());
  } catch (error) {
    /**
     * The database is down or unconfigured. An empty result here means the
     * env list alone decides (it is checked before this runs) — never
     * "everyone", which would open the inbox, and never a hard throw, which
     * would take down the dashboard whose own DbError panel explains the
     * outage. Root admins keep working; teammates wait for the database.
     */
    console.error("[auth] allowlist read failed, falling back to ADMIN_EMAILS", error);
    return [];
  }
});

export async function isAllowedAdmin(
  email: string | null | undefined,
): Promise<boolean> {
  if (!email) return false;
  const address = email.toLowerCase();
  // Checked first, so a root admin is let in without touching the database.
  if (envAdminEmails().includes(address)) return true;
  return (await cachedAllowlist()).includes(address);
}

export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
};

/** The signed-in user, or null. Never throws — use it for optional chrome. */
export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const { data } = await getAuth().getSession();
    const user = data?.user;
    if (!user?.email) return null;
    return { id: user.id, email: user.email, name: user.name ?? null };
  } catch {
    return null;
  }
}

/**
 * Gate for every dashboard page and mutating action. Redirects rather than
 * returning null so a caller cannot forget to handle the unauthenticated case.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) redirect(SIGN_IN_PATH);
  if (!(await isAllowedAdmin(user.email))) redirect(NO_ACCESS_PATH);
  return user;
}
