import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/admin-auth";

function logout(request: Request) {
  const response = NextResponse.redirect(new URL("/owner/login", request.url), 303);
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}

export const GET = logout;
export const POST = logout;
