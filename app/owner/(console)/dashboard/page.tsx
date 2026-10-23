import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getAnalytics, greeting, longDay, parseRange, shortDay, timeAgo } from "@/lib/owner-data";
import BarChart from "../../_components/BarChart";
import { Avatar, Delta, PageHeader, Ring, SectionTitle, Sparkline, SurveyChip, card } from "../../_components/bits";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function OverviewPage({ searchParams }: { searchParams: SearchParams }) {
  const email = await requireAdmin();
  const range = parseRange((await searchParams).range);

  let a: Awaited<ReturnType<typeof getAnalytics>>;
  try {
    a = await getAnalytics(range);
  } catch (err) {
    console.error("[owner overview]", err);
    return (
      <div className={`${card} p-6`}>
        <h1 className="font-display text-2xl font-bold">Couldn't load the data</h1>
        <p className="mt-2 text-sm text-muted">Check your Supabase env vars and the server logs, then refresh.</p>
      </div>
    );
  }

  const name = email.split("@")[0];
  const pending = a.total - a.surveyed;
  const topSources = a.sources.slice(0, 5);
  const maxSource = Math.max(1, ...topSources.map((s) => s.count));
  const chartData = a.daily.map((d) => ({
    key: d.day,
    label: longDay(d.day),
    short: shortDay(d.day),
    count: d.count,
  }));

  return (
    <>
      <PageHeader eyebrow={`${greeting()}, ${name}`} title="Overview" />

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-brand p-6 text-white sm:p-8">
        <div className="relative z-10 max-w-md">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            <span className="size-1.5 rounded-full bg-amber" /> Waitlist
          </p>
          <p className="font-display mt-4 text-6xl leading-none font-extrabold tracking-tight tabular-nums sm:text-7xl">
            {a.total.toLocaleString()}
          </p>
          <p className="mt-2 text-on-brand">people are waiting for Unsend</p>
          <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold">
            <span>+{a.today} today</span>
            <span>+{a.last7} this week</span>
            <span>{a.surveyed} surveyed</span>
          </p>
        </div>
        <Sparkline
          values={a.cumulative}
          className="absolute inset-x-0 bottom-0 h-24 w-full text-white sm:h-32 sm:w-3/5 sm:left-auto sm:right-0"
        />
        <div aria-hidden="true" className="absolute -top-24 -right-16 size-72 rounded-full bg-brand-light/40 blur-3xl" />
      </section>

      {/* KPIs */}
      <section className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className={`${card} p-4 sm:p-5`}>
          <p className="text-xs font-medium text-muted">Today</p>
          <p className="font-display mt-1 text-3xl font-bold tracking-tight tabular-nums">{a.today}</p>
          <div className="mt-2">
            <Delta cur={a.today} prev={a.yesterday} label="vs yesterday" />
          </div>
        </div>
        <div className={`${card} p-4 sm:p-5`}>
          <p className="text-xs font-medium text-muted">Last 7 days</p>
          <p className="font-display mt-1 text-3xl font-bold tracking-tight tabular-nums">{a.last7}</p>
          <div className="mt-2">
            <Delta cur={a.last7} prev={a.prev7} label="vs prior week" />
          </div>
        </div>
        <div className={`${card} p-4 sm:p-5`}>
          <p className="text-xs font-medium text-muted">Avg per day</p>
          <p className="font-display mt-1 text-3xl font-bold tracking-tight tabular-nums">{a.avgPerDay}</p>
          <Sparkline values={a.spark} className="mt-2 h-6 w-full text-brand" />
        </div>
        <div className={`${card} flex items-center justify-between gap-2 p-4 sm:p-5`}>
          <div>
            <p className="text-xs font-medium text-muted">Survey rate</p>
            <p className="font-display mt-1 text-3xl font-bold tracking-tight tabular-nums">{a.surveyRate}%</p>
            <p className="mt-2 text-xs text-subtle">
              {a.surveyed} of {a.total}
            </p>
          </div>
          <div className="relative shrink-0">
            <Ring pct={a.surveyRate} />
          </div>
        </div>
      </section>

      {/* Chart + funnel */}
      <section className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className={`${card} p-5 lg:col-span-2`}>
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight">Signups</h2>
              <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted">
                <span className="font-semibold text-ink">{a.rangeTotal.toLocaleString()}</span> in the last {range} days
                <Delta cur={a.rangeTotal} prev={a.rangePrev} label="vs previous" />
              </p>
            </div>
            <div className="inline-flex rounded-xl border border-line-strong bg-paper p-1 text-sm font-semibold">
              {([7, 30, 90] as const).map((r) => (
                <Link
                  key={r}
                  href={`/owner/dashboard?range=${r}`}
                  scroll={false}
                  className={`rounded-lg px-3 py-1 transition ${
                    r === range ? "bg-white text-brand shadow-sm" : "text-muted hover:text-ink"
                  }`}
                >
                  {r}d
                </Link>
              ))}
            </div>
          </div>
          <BarChart data={chartData} labelEvery={range === 7 ? 1 : range === 30 ? 5 : 15} />
        </div>

        <div className={`${card} p-5`}>
          <SectionTitle title="Survey funnel" sub="Who unlocked priority access" />
          <div className="space-y-4">
            <div>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="font-medium">Joined</span>
                <span className="tabular-nums text-muted">{a.total}</span>
              </div>
              <div className="h-3 rounded-full bg-brand-tint">
                <div className="h-full w-full rounded-full bg-brand-light" />
              </div>
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="font-medium">Did the survey</span>
                <span className="tabular-nums text-muted">
                  {a.surveyed} · {a.surveyRate}%
                </span>
              </div>
              <div className="h-3 rounded-full bg-brand-tint">
                <div className="h-full rounded-full bg-brand" style={{ width: `${a.surveyRate}%` }} />
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-xl bg-brand-wash p-4">
            <p className="font-display text-2xl font-bold tabular-nums text-brand-deep">{pending}</p>
            <p className="text-sm text-body">haven't done the survey yet. A nudge email could convert them.</p>
          </div>
        </div>
      </section>

      {/* Sources + recent */}
      <section className="mt-4 grid gap-4 lg:grid-cols-5">
        <div className={`${card} p-5 lg:col-span-2`}>
          <SectionTitle title="Top sources" href="/owner/analytics" />
          {topSources.length === 0 ? (
            <p className="text-sm text-muted">No signups yet.</p>
          ) : (
            <ul className="space-y-4">
              {topSources.map((s) => (
                <li key={s.source}>
                  <div className="mb-1.5 flex justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate font-medium">{s.source}</span>
                    <span className="tabular-nums text-muted">
                      {s.count} · {Math.round((100 * s.count) / a.total)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-brand-tint">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${(s.count / maxSource) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`${card} p-5 lg:col-span-3`}>
          <SectionTitle title="Latest signups" href="/owner/signups" />
          {a.recent.length === 0 ? (
            <p className="text-sm text-muted">No signups yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {a.recent.map((r) => (
                <li key={r.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                  <Avatar email={r.email} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{r.email}</p>
                    <p className="truncate text-xs text-muted">
                      {r.source || "direct"} · {timeAgo(r.created_at)}
                    </p>
                  </div>
                  <SurveyChip done={r.did_survey} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
