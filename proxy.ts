import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin-auth";

// First line of defence for the founders dashboard. Every /owner page and
// /api/owner route also checks the session itself on the server.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/owner/login" || pathname === "/owner/logout") return NextResponse.next();

  if (verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/owner/login", request.url));
}

export const config = {
  matcher: ["/owner/:path*", "/api/owner/:path*"],
};
