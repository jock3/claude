import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { createClient } from "@supabase/supabase-js";

async function computeToken(secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode("admin-session"));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

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
      const token = await computeToken(cookieSecret);
      const response = NextResponse.redirect(new URL("/", request.url), { status: 303 });
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

  // 2. Check client ID — look up matching plan's share_token
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey) {
    const sb = createClient(supabaseUrl, supabaseKey);
    const { data } = await sb
      .from("media_plans")
      .select("share_token")
      .eq("client_id", submitted)
      .single();

    if (data?.share_token) {
      return NextResponse.redirect(
        new URL(`/share/${data.share_token}`, request.url),
        { status: 303 }
      );
    }
  }

  return NextResponse.redirect(new URL("/login?error=1", request.url), { status: 303 });
}
