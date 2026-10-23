import { requireAdmin } from "@/lib/admin-auth";
import { getAnalytics } from "@/lib/owner-data";
import BarChart from "../../_components/BarChart";
import { PageHeader, SectionTitle, card } from "../../_components/bits";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  await requireAdmin();

  let a: Awaited<ReturnType<typeof getAnalytics>>;
  try {
    a = await getAnalytics(30);
  } catch (err) {
    console.error("[owner analytics]", err);
    return (
      <div className={`${card} p-6`}>
        <h1 className="font-display text-2xl font-bold">Couldn't load the data</h1>
        <p className="mt-2 text-sm text-muted">Check your Supabase env vars and the server logs, then refresh.</p>
      </div>
    );
  }

  const top = a.sources[0];
  const bestDay = [...a.weekdays].sort((x, y) => y.count - x.count)[0];
  const bestHour = [...a.hours].sort((x, y) => y.count - x.count)[0];
  const best = a.sources.filter((s) => s.count >= 3).sort((x, y) => y.surveyed / y.count - x.surveyed / x.count)[0];
  const maxSource = Math.max(1, ...a.sources.map((s) => s.count));
  const has = a.total > 0;

  const insights = [
    { label: "Top source", value: has ? top.source : "–", sub: has ? `${Math.round((100 * top.count) / a.total)}% of signups` : "" },
    { label: "Best weekday", value: has ? bestDay.label : "–", sub: has ? `${bestDay.count} signups` : "" },
    { label: "Peak hour (Lagos)", value: has ? bestHour.label : "–", sub: has ? `${bestHour.count} signups` : "" },
    {
      label: "Best survey converter",
      value: best ? best.source : "–",
      sub: best ? `${Math.round((100 * best.surveyed) / best.count)}% did the survey` : "Needs 3+ signups per source",
    },
  ];

  return (
    <>
      <PageHeader eyebrow="Where and when people join" title="Analytics" />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {insights.map((i) => (
          <div key={i.label} className={`${card} p-4 sm:p-5`}>
            <p className="text-xs font-medium text-muted">{i.label}</p>
            <p className="font-display mt-1 truncate text-2xl font-bold tracking-tight">{i.value}</p>
            <p className="mt-1 truncate text-xs text-subtle">{i.sub}</p>
          </div>
        ))}
      </section>

      <section className={`${card} mt-4 p-5`}>
        <SectionTitle title="Sources" sub="Which channels bring people, and who follows through on the survey" />
        {a.sources.length === 0 ? (
          <p className="text-sm text-muted">No signups yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[30rem] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs text-muted">
                  <th className="py-2.5 pr-3 font-medium">Source</th>
                  <th className="px-3 py-2.5 font-medium">Signups</th>
                  <th className="w-1/3 px-3 py-2.5 font-medium">Share</th>
                  <th className="py-2.5 pl-3 text-right font-medium">Survey rate</th>
                </tr>
              </thead>
              <tbody>
                {a.sources.map((s) => (
                  <tr key={s.source} className="border-b border-line last:border-0">
                    <td className="max-w-[12rem] truncate py-3 pr-3 font-semibold">{s.source}</td>
                    <td className="px-3 py-3 tabular-nums">{s.count}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 rounded-full bg-brand-tint">
                          <div className="h-full rounded-full bg-brand" style={{ width: `${(s.count / maxSource) * 100}%` }} />
                        </div>
                        <span className="w-9 text-right text-xs tabular-nums text-muted">
                          {Math.round((100 * s.count) / a.total)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pl-3 text-right tabular-nums">{Math.round((100 * s.surveyed) / s.count)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className={`${card} p-5`}>
          <SectionTitle title="By day of week" sub="All-time signups, Lagos time" />
          <BarChart
            height={180}
            data={a.weekdays.map((d) => ({ key: d.label, label: d.label, short: d.label, count: d.count }))}
          />
        </div>
        <div className={`${card} p-5`}>
          <SectionTitle title="By hour of day" sub="All-time signups, Lagos time" />
          <BarChart
            height={180}
            labelEvery={6}
            data={a.hours.map((h) => ({ key: h.label, label: h.label, short: h.label.slice(0, 2), count: h.count }))}
          />
        </div>
      </section>
    </>
  );
}
