import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { computeAdminToken } from "@/lib/auth/token";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const cookieSecret = process.env.ADMIN_COOKIE_SECRET;

  const formData = await request.formData();
  const submitted = String(formData.get("password") ?? "").trim();

  if (!submitted) {
    return NextResponse.redirect(new URL("/login?error=1", request.url), { status: 303 });
  }

  // 1. Check admin password
  if (adminPassword && cookieSecret) {
    let passwordMatch = false;
    try {
      const a = Buffer.from(submitted);
      const b = Buffer.from(adminPassword);
      passwordMatch = a.length === b.length && timingSafeEqual(a, b);
    } catch {
      passwordMatch = false;
    }

    if (passwordMatch) {
      const token = await computeAdminToken(cookieSecret);
      const response = NextResponse.redirect(new URL("/mediaplan", request.url), { status: 303 });
      response.cookies.set("admin_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
      return response;
    }
  }

  // 2. Check client ID — look up matching media plan's share_token
  try {
    const sb = getSupabaseServerClient();
    const { data } = await sb
      .from("media_plans")
      .select("share_token")
      .eq("client_id", submitted)
      .eq("archived", false)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (data && data.length > 0 && data[0].share_token) {
      return NextResponse.redirect(
        new URL(`/share/${data[0].share_token}`, request.url),
        { status: 303 }
      );
    }
  } catch {
    // Supabase env vars not set or query failed — fall through to next check
  }

  // 3. Check client ID — look up matching campaign plan's share_token
  try {
    const sb = getSupabaseServerClient();
    const { data } = await sb
      .from("campaign_plans")
      .select("share_token")
      .eq("client_id", submitted)
      .eq("archived", false)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (data && data.length > 0 && data[0].share_token) {
      return NextResponse.redirect(
        new URL(`/share/kampanj/${data[0].share_token}`, request.url),
        { status: 303 }
      );
    }
  } catch {
    // Supabase env vars not set or query failed — fall through to error
  }

  return NextResponse.redirect(new URL("/login?error=1", request.url), { status: 303 });
}
