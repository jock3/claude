import { NextRequest, NextResponse } from "next/server";
import { computeAdminToken } from "@/lib/auth/token";

export async function middleware(request: NextRequest) {
  const secret = process.env.ADMIN_COOKIE_SECRET;

  if (!secret) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const cookie = request.cookies.get("admin_session")?.value ?? "";
  const expected = await computeAdminToken(secret);

  if (cookie !== expected) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|share|_next|favicon.ico|api/auth).*)"],
};
