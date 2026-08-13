import "server-only";

import { createNeonAuth, type NeonAuth } from "@neondatabase/auth/next/server";
import { redirect } from "next/navigation";

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
 */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowed = adminEmails();
  // An empty allowlist locks everyone out rather than letting everyone in.
  if (allowed.length === 0) return false;
  return allowed.includes(email.toLowerCase());
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
  if (!isAllowedAdmin(user.email)) redirect(NO_ACCESS_PATH);
  return user;
}
