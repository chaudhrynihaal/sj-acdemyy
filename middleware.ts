import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  /** Only admin routes need session checks — skipping this for `/` cuts a Supabase round-trip per page load (big on LAN / mobile). */
  matcher: ["/admin/:path*"],
};
