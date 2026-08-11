import { NextResponse } from "next/server";
import { createStamp } from "@/server/spam";

/**
 * Mints the signed "form was rendered at" marker.
 *
 * It cannot be produced during render: the pages carrying these forms are
 * statically prerendered, so a build-time stamp would be hours stale by the
 * time anyone saw it. Fetching on mount keeps the marketing pages static and
 * costs one small request, only for visitors who actually open a form.
 */
export const dynamic = "force-dynamic";

export function GET() {
  try {
    return NextResponse.json(
      { stamp: createStamp() },
      { headers: { "cache-control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ stamp: null }, { status: 503 });
  }
}
