import { getSupabaseAdmin } from "@/lib/supabase-admin";

// Server-only data helpers for the founders dashboard.

export const TZ = "Africa/Lagos";
export const PAGE_SIZE = 50;

export type Signup = {
  id: string;
  email: string;
  source: string | null;
  did_survey: boolean;
  created_at: string;
};

const dayFormat = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
const dateTimeFormat = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, dateStyle: "medium", timeStyle: "short" });

// "2026-10-23" in Lagos time.
export function lagosDay(date: Date | string): string {
  return dayFormat.format(typeof date === "string" ? new Date(date) : date);
}

export function formatLagos(iso: string): string {
  return dateTimeFormat.format(new Date(iso));
}

// Read every row of a query in 1000-row pages (Supabase caps a single response).
async function fetchAll<T>(
  build: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>,
): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await build(from, from + 999);
    if (error) throw new Error(error.message);
    rows.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }
  return rows;
}

export type Overview = {
  total: number;
  today: number;
  last7: number;
  surveyed: number;
  surveyRate: number;
  daily: { day: string; count: number }[];
  sources: { source: string; count: number }[];
};

export async function getOverview(): Promise<Overview> {
  const supabase = getSupabaseAdmin();
  const rows = await fetchAll<{ source: string | null; created_at: string; did_survey: boolean }>((from, to) =>
    supabase
      .from("waitlist")
      .select("source, created_at, did_survey")
      .order("created_at", { ascending: false })
      .range(from, to),
  );

  const now = Date.now();
  const today = lagosDay(new Date(now));
  const perDay = new Map<string, number>();
  const perSource = new Map<string, number>();
  let todayCount = 0;
  let last7 = 0;
  let surveyed = 0;

  for (const row of rows) {
    const day = lagosDay(row.created_at);
    perDay.set(day, (perDay.get(day) ?? 0) + 1);
    if (day === today) todayCount++;
    if (new Date(row.created_at).getTime() > now - 7 * 86_400_000) last7++;
    if (row.did_survey) surveyed++;
    const source = row.source?.trim() || "direct";
    perSource.set(source, (perSource.get(source) ?? 0) + 1);
  }

  // Last 30 Lagos days, oldest first. Lagos has no DST, so stepping by 24h is exact.
  const daily = Array.from({ length: 30 }, (_, i) => {
    const day = lagosDay(new Date(now - (29 - i) * 86_400_000));
    return { day, count: perDay.get(day) ?? 0 };
  });

  return {
    total: rows.length,
    today: todayCount,
    last7,
    surveyed,
    surveyRate: rows.length ? Math.round((1000 * surveyed) / rows.length) / 10 : 0,
    daily,
    sources: [...perSource].map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count),
  };
}

export type SignupFilters = { q: string; survey: "all" | "yes" | "no"; page: number };

export async function getSignups({ q, survey, page }: SignupFilters) {
  let query = getSupabaseAdmin()
    .from("waitlist")
    .select("id, email, source, did_survey, created_at", { count: "exact" })
    .order("created_at", { ascending: false });

  if (q) query = query.ilike("email", `%${q.replace(/[\\%_]/g, "\\$&")}%`);
  if (survey === "yes") query = query.eq("did_survey", true);
  if (survey === "no") query = query.eq("did_survey", false);

  const from = (page - 1) * PAGE_SIZE;
  const { data, count, error } = await query.range(from, from + PAGE_SIZE - 1);
  if (error) throw new Error(error.message);
  return { rows: (data ?? []) as Signup[], total: count ?? 0 };
}

export async function getAllSignups(): Promise<Signup[]> {
  const supabase = getSupabaseAdmin();
  return fetchAll<Signup>((from, to) =>
    supabase
      .from("waitlist")
      .select("id, email, source, did_survey, created_at")
      .order("created_at", { ascending: false })
      .order("id")
      .range(from, to),
  );
}
