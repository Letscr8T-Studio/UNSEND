import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { formatLagos, getAllSignups, lagosDay } from "@/lib/owner-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Quote a CSV field, and defuse spreadsheet formulas (=, +, -, @) in user-supplied text.
function cell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

// GET /api/owner/export: every signup as a CSV download. Founders only.
export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await getAllSignups();
    const lines = [
      "email,source,joined (Africa/Lagos),did_survey",
      ...rows.map((r) =>
        [cell(r.email), cell(r.source ?? ""), cell(formatLagos(r.created_at)), r.did_survey ? "yes" : "no"].join(","),
      ),
    ];
    return new NextResponse("﻿" + lines.join("\r\n") + "\r\n", {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="unsend-waitlist-${lagosDay(new Date())}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[owner export]", err);
    return NextResponse.json({ ok: false, error: "Export failed." }, { status: 500 });
  }
}
