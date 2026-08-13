import { NextResponse, type NextRequest } from "next/server";
import { getAuth, SIGN_IN_PATH } from "@/server/auth";

/**
 * Keeps the dashboard session fresh and bounces anonymous requests to sign-in
 * before a page renders. It is a first gate, not the only one: requireAdmin()
 * on every page and action still checks the allowlist, which the middleware
 * cannot see.
 *
 * Next 16 calls this file proxy.ts (formerly middleware.ts).
 */

/**
 * Neon appends this to the return URL after an OAuth round trip, and the SDK's
 * middleware trades it — together with the challenge cookie — for the real
 * session. Both names are internal to @neondatabase/auth and not exported, so
 * they are repeated here; if a major version renames them, Google sign-in goes
 * quiet and this is the place to look.
 */
const SESSION_VERIFIER_PARAM = "neon_auth_session_verifier";
const SESSION_TOKEN_COOKIE = "__Secure-neon-auth.session_token";

export default async function proxy(request: NextRequest) {
  const isOAuthReturn = request.nextUrl.searchParams.has(SESSION_VERIFIER_PARAM);

  try {
    const response = await getAuth().middleware({ loginUrl: SIGN_IN_PATH })(
      request,
    );

    /**
     * Neon returns from Google to the site root rather than to the callbackURL
     * it was handed, so a successful sign-in would otherwise deposit the admin
     * on the marketing home page — signed in, with no sign of it. When the
     * exchange has just issued a session token, finish the journey.
     *
     * Gated on the token actually being set: a failed exchange must fall
     * through to the SDK's own response instead of being sent to /admin, which
     * would only bounce back to sign-in.
     */
    if (isOAuthReturn) {
      const cookies = response.headers.getSetCookie();
      const signedIn = cookies.some((cookie) =>
        cookie.startsWith(`${SESSION_TOKEN_COOKIE}=`),
      );
      if (signedIn) {
        const dashboard = NextResponse.redirect(new URL("/admin", request.url));
        for (const cookie of cookies) {
          dashboard.headers.append("Set-Cookie", cookie);
        }
        return dashboard;
      }
    }

    return response;
  } catch {
    // Auth is not configured in this environment. Let the request through so
    // requireAdmin() can render a real error instead of a blank 500 here.
    return NextResponse.next();
  }
}

export const config = {
  /**
   * Two jobs.
   *
   * The first entry guards the dashboard: everything under /admin except the
   * pages a signed-out user must reach. Every route that exists to get someone
   * *in* has to be listed. A route left out is protected, so an anonymous
   * visitor is redirected to sign-in — which for /admin/forgot-password looks
   * exactly like a login that failed, and makes an emailed reset link dead on
   * arrival. Add a route under /admin that a signed-out user needs, and add it
   * here in the same commit.
   *
   * The second entry catches the OAuth return, which Neon delivers to the site
   * root instead of the callback URL it was given. It is deliberately narrow:
   * the verifier parameter alone is a query string anyone can type, and acting
   * on it would let a crafted link bounce ordinary visitors off the marketing
   * site. Requiring the challenge cookie as well means the middleware wakes up
   * only for a browser genuinely mid-sign-in — conditions are ANDed.
   *
   * The literals have to stay inline: Next reads this matcher statically, so it
   * cannot be built from the constants above.
   */
  matcher: [
    "/admin((?!/sign-in|/sign-up|/no-access|/forgot-password|/reset-password).*)",
    {
      source: "/((?!_next/static|_next/image|favicon.ico).*)",
      has: [
        { type: "query", key: "neon_auth_session_verifier" },
        { type: "cookie", key: "__Secure-neon-auth.session_challange" },
      ],
    },
  ],
};
