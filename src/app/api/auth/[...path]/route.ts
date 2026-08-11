import { getAuth } from "@/server/auth";

type Ctx = { params: Promise<{ path: string[] }> };

/**
 * Proxies the browser's auth calls through to the Neon Auth instance.
 * The handler is resolved per request because getAuth() reads env lazily.
 */
export async function GET(request: Request, ctx: Ctx) {
  return getAuth().handler().GET(request, ctx);
}

export async function POST(request: Request, ctx: Ctx) {
  return getAuth().handler().POST(request, ctx);
}
