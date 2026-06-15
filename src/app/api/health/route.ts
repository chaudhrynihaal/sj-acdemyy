import { NextResponse } from "next/server";

// Lightweight liveness probe. Does not touch the database or any secret —
// safe to expose publicly for uptime monitors / platform health checks.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ status: "ok", time: new Date().toISOString() });
}
