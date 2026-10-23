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

export type Range = 7 | 30 | 90;

export function parseRange(value: string | string[] | undefined): Range {
  const v = Number(Array.isArray(value) ? value[0] : value);
  return v === 7 || v === 90 ? v : 30;
}

const DAY = 86_400_000;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type Analytics = {
  total: number;
  surveyed: number;
  surveyRate: number;
  today: number;
  yesterday: number;
  last7: number;
  prev7: number;
  avgPerDay: number; // last 30 days
  rangeTotal: number;
  rangePrev: number;
  daily: { day: string; count: number }[]; // `range` days, oldest first
  spark: number[]; // last 14 days
  cumulative: number[]; // last 30 days, running total
  sources: { source: string; count: number; surveyed: number }[];
  weekdays: { label: string; count: number }[]; // Mon..Sun
  hours: { label: string; count: number }[]; // 0..23, Lagos
  recent: Signup[];
};

export async function getAnalytics(range: Range): Promise<Analytics> {
  const supabase = getSupabaseAdmin();
  const rows = await fetchAll<Signup>((from, to) =>
    supabase
      .from("waitlist")
      .select("id, email, source, did_survey, created_at")
      .order("created_at", { ascending: false })
      .order("id")
      .range(from, to),
  );

  const now = Date.now();
  const perDay = new Map<string, number>();
  const perSource = new Map<string, { count: number; surveyed: number }>();
  const weekday = new Array(7).fill(0) as number[];
  const hour = new Array(24).fill(0) as number[];
  let surveyed = 0;

  for (const row of rows) {
    const day = lagosDay(row.created_at);
    perDay.set(day, (perDay.get(day) ?? 0) + 1);
    if (row.did_survey) surveyed++;
    const source = row.source?.trim() || "direct";
    const entry = perSource.get(source) ?? { count: 0, surveyed: 0 };
    entry.count++;
    if (row.did_survey) entry.surveyed++;
    perSource.set(source, entry);
    weekday[new Date(`${day}T12:00:00Z`).getUTCDay()]++;
    hour[(new Date(row.created_at).getUTCHours() + 1) % 24]++; // Lagos is UTC+1, no DST
  }

  // Lagos has no DST, so stepping back in 24h blocks gives exact calendar days.
  const keys = (n: number) => Array.from({ length: n }, (_, i) => lagosDay(new Date(now - (n - 1 - i) * DAY)));
  const count = (day: string) => perDay.get(day) ?? 0;
  const sum = (days: string[]) => days.reduce((a, d) => a + count(d), 0);

  const doubled = keys(range * 2);
  const daily = doubled.slice(range).map((day) => ({ day, count: count(day) }));
  const k30 = keys(30);
  let running = rows.length - sum(k30);
  const cumulative = k30.map((d) => (running += count(d)));
  const k14 = keys(14);
  const k14prev = keys(14 + 7);

  return {
    total: rows.length,
    surveyed,
    surveyRate: rows.length ? Math.round((1000 * surveyed) / rows.length) / 10 : 0,
    today: count(k14[13]),
    yesterday: count(k14[12]),
    last7: sum(k14.slice(7)),
    prev7: sum(k14prev.slice(0, 7)),
    avgPerDay: Math.round((10 * sum(k30)) / 30) / 10,
    rangeTotal: sum(doubled.slice(range)),
    rangePrev: sum(doubled.slice(0, range)),
    daily,
    spark: k14.map(count),
    cumulative,
    sources: [...perSource]
      .map(([source, v]) => ({ source, ...v }))
      .sort((a, b) => b.count - a.count),
    weekdays: [1, 2, 3, 4, 5, 6, 0].map((d) => ({ label: WEEKDAYS[d], count: weekday[d] })),
    hours: hour.map((count, h) => ({ label: `${String(h).padStart(2, "0")}:00`, count })),
    recent: rows.slice(0, 8),
  };
}

export function timeAgo(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)}d ago`;
  return formatLagos(iso).split(",")[0];
}

export function shortDay(day: string): string {
  return new Date(`${day}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}

export function longDay(day: string): string {
  return new Date(`${day}T12:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export function greeting(): string {
  const h = Number(new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "numeric", hourCycle: "h23" }).format(new Date()));
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
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
