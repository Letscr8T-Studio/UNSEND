import { NextResponse } from "next/server";
import { getSupabaseAdmin, normaliseEmail } from "@/lib/supabase-admin";

export const runtime = "nodejs";

// POST /api/waitlist  { email, company?, source? }
// Saves the email to the `waitlist` table. Joining twice is treated as success.
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real people never see or fill the "company" field. Bots usually do.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = normaliseEmail(body.email);
  if (!email) {
    return NextResponse.json({ ok: false, error: "That email doesn't look right." }, { status: 400 });
  }

  const source = typeof body.source === "string" ? body.source.slice(0, 200) : null;

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("waitlist")
      .upsert({ email, source }, { onConflict: "email", ignoreDuplicates: true });

    if (error) {
      console.error("[waitlist] insert failed:", error.message);
      return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
    }
  } catch (err) {
    console.error("[waitlist]", err);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
