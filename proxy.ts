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
export default async function proxy(request: NextRequest) {
  try {
    return await getAuth().middleware({ loginUrl: SIGN_IN_PATH })(request);
  } catch {
    // Auth is not configured in this environment. Let the request through so
    // requireAdmin() can render a real error instead of a blank 500 here.
    return NextResponse.next();
  }
}

export const config = {
  /**
   * Everything under /admin except the pages a signed-out user must reach.
   *
   * Every route that exists to get someone *in* has to be listed here. A route
   * left out is protected, so an anonymous visitor is redirected to sign-in —
   * which for /admin/forgot-password looks exactly like a login that failed,
   * and makes an emailed reset link dead on arrival. Add a route under /admin
   * that a signed-out user needs, and add it here in the same commit.
   *
   * The literal has to stay inline: Next reads this matcher statically, so it
   * cannot be built from a shared constant.
   */
  matcher: [
    "/admin((?!/sign-in|/sign-up|/no-access|/forgot-password|/reset-password).*)",
  ],
};
