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
  // Everything under /admin except the two pages a signed-out user must reach.
  matcher: ["/admin((?!/sign-in|/no-access).*)"],
};
