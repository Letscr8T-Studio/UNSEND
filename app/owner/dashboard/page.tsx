import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { PAGE_SIZE, formatLagos, getOverview, getSignups, type SignupFilters } from "@/lib/owner-data";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

const card = "rounded-2xl border border-line bg-white p-4 sm:p-5";
const btn =
  "inline-flex items-center justify-center rounded-xl border border-line-strong bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-brand-wash";

export default async function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const adminEmail = await requireAdmin();

  const sp = await searchParams;
  const q = first(sp.q).trim().slice(0, 100);
  const surveyParam = first(sp.survey);
  const filters: SignupFilters = {
    q,
    survey: surveyParam === "yes" || surveyParam === "no" ? surveyParam : "all",
    page: Math.max(1, Math.floor(Number(first(sp.page))) || 1),
  };

  let data: Awaited<ReturnType<typeof loadAll>>;
  try {
    data = await loadAll(filters);
  } catch (err) {
    console.error("[owner dashboard]", err);
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <div className={card}>
          <h1 className="font-display text-2xl font-bold">Couldn't load the data</h1>
          <p className="mt-2 text-sm text-muted">Check your Supabase env vars and the server logs, then refresh.</p>
        </div>
      </main>
    );
  }
  const { overview, signups } = data;

  const stats = [
    { label: "Total signups", value: overview.total.toLocaleString() },
    { label: "Today", value: overview.today.toLocaleString() },
    { label: "Last 7 days", value: overview.last7.toLocaleString() },
    { label: "Did the survey", value: overview.surveyed.toLocaleString() },
    { label: "Survey rate", value: `${overview.surveyRate}%` },
  ];

  const maxDay = Math.max(1, ...overview.daily.map((d) => d.count));
  const maxSource = Math.max(1, ...overview.sources.map((s) => s.count));
  const pages = Math.max(1, Math.ceil(signups.total / PAGE_SIZE));
  const page = Math.min(filters.page, pages);

  const href = (p: number) => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.survey !== "all") params.set("survey", filters.survey);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/owner/dashboard${qs ? `?${qs}` : ""}`;
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-widest text-brand">Unsend founders</p>
          <h1 className="font-display text-3xl font-bold tracking-tight">Waitlist</h1>
          <p className="truncate text-sm text-muted">{adminEmail}</p>
        </div>
        <form action="/owner/logout" method="post">
          <button type="submit" className={btn}>
            Log out
          </button>
        </form>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className={card}>
            <p className="text-xs font-medium text-muted">{s.label}</p>
            <p className="font-display mt-1 text-3xl font-bold tracking-tight">{s.value}</p>
          </div>
        ))}
      </section>

      <section className={`${card} mt-4`}>
        <h2 className="font-display text-lg font-bold">Signups per day</h2>
        <p className="text-xs text-muted">Last 30 days, Lagos time</p>
        <div className="mt-4 flex h-40 items-end gap-[3px]" role="img" aria-label="Bar chart of signups per day, last 30 days">
          {overview.daily.map((d) => (
            <div key={d.day} title={`${d.day}: ${d.count}`} className="flex h-full min-w-0 flex-1 items-end rounded-sm bg-brand-wash">
              <div
                className="w-full rounded-sm bg-brand"
                style={{ height: d.count ? `${Math.max(4, (d.count / maxDay) * 100)}%` : "0" }}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>{overview.daily[0].day}</span>
          <span>peak {maxDay === 1 && overview.total === 0 ? 0 : maxDay}/day</span>
          <span>{overview.daily[29].day}</span>
        </div>
      </section>

      <section className={`${card} mt-4`}>
        <h2 className="font-display text-lg font-bold">Where signups come from</h2>
        {overview.sources.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No signups yet.</p>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {overview.sources.map((s) => (
              <li key={s.source}>
                <div className="flex justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate font-medium">{s.source}</span>
                  <span className="text-muted">{s.count.toLocaleString()}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-brand-tint">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${(s.count / maxSource) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={`${card} mt-4`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold">Signups</h2>
          <a href="/api/owner/export" className={btn}>
            Export CSV
          </a>
        </div>

        <form method="get" action="/owner/dashboard" className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            type="search"
            name="q"
            defaultValue={filters.q}
            placeholder="Search email"
            aria-label="Search email"
            className="min-w-0 flex-1 rounded-xl border border-line-strong bg-white px-4 py-2.5 text-base outline-none focus:border-brand"
          />
          <select
            name="survey"
            defaultValue={filters.survey}
            aria-label="Survey filter"
            className="rounded-xl border border-line-strong bg-white px-3 py-2.5 text-base outline-none focus:border-brand"
          >
            <option value="all">All signups</option>
            <option value="yes">Did survey</option>
            <option value="no">Didn't do survey</option>
          </select>
          <button type="submit" className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-deep">
            Apply
          </button>
        </form>

        <div className="-mx-4 mt-4 overflow-x-auto sm:mx-0">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs text-muted">
                <th className="px-4 py-2 font-medium sm:px-2">Email</th>
                <th className="px-2 py-2 font-medium">Source</th>
                <th className="px-2 py-2 font-medium">Joined (Lagos)</th>
                <th className="px-4 py-2 font-medium sm:px-2">Survey</th>
              </tr>
            </thead>
            <tbody>
              {signups.rows.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-0">
                  <td className="max-w-[16rem] truncate px-4 py-2.5 font-medium sm:px-2">{r.email}</td>
                  <td className="px-2 py-2.5 text-body">{r.source || "direct"}</td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-body">{formatLagos(r.created_at)}</td>
                  <td className="px-4 py-2.5 sm:px-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        r.did_survey ? "bg-brand-tint text-brand-deep" : "bg-line text-muted"
                      }`}
                    >
                      {r.did_survey ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))}
              {signups.rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted">
                    No signups match.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">
            {signups.total.toLocaleString()} result{signups.total === 1 ? "" : "s"} · page {page} of {pages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={href(page - 1)} className={btn}>
                Previous
              </Link>
            )}
            {page < pages && (
              <Link href={href(page + 1)} className={btn}>
                Next
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

async function loadAll(filters: SignupFilters) {
  const [overview, signups] = await Promise.all([getOverview(), getSignups(filters)]);
  return { overview, signups };
}
