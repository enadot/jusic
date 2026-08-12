"use client";

import { createAuthClient } from "@neondatabase/auth/next";

/**
 * Browser-side Neon Auth client. It talks to /api/auth/[...path] on this
 * origin — never to the Neon Auth host directly — so the session cookie is set
 * on jusic.co and the base URL never reaches the bundle.
 *
 * Only OAuth needs it. Email/password and password reset stay in server
 * actions (src/server/actions/admin.ts): a redirect flow has to be started by
 * the browser, and the SDK handles the popup fallback when the page is framed.
 */
export const authClient = createAuthClient();
