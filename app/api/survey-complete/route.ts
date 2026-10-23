import { NextResponse } from "next/server";
import { getSupabaseAdmin, normaliseEmail } from "@/lib/supabase-admin";

export const runtime = "nodejs";

// POST /api/survey-complete  { email }
// Called by the page when someone submits the Tally survey, to mark them as a "hot lead".
// It can only flip did_survey from false to true for an email already on the list,
// so the worst a bad actor can do is mark someone as having done the survey.
// For a tamper-proof version, use a Tally webhook instead (see README).
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const email = normaliseEmail(body.email);
  if (!email) return NextResponse.json({ ok: false }, { status: 400 });

  try {
    const { error } = await getSupabaseAdmin()
      .from("waitlist")
      .update({ did_survey: true, survey_completed_at: new Date().toISOString() })
      .eq("email", email)
      .eq("did_survey", false);

    if (error) {
      console.error("[survey-complete] update failed:", error.message);
      return NextResponse.json({ ok: false }, { status: 500 });
    }
  } catch (err) {
    console.error("[survey-complete]", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
