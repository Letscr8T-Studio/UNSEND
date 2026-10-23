import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { PAGE_SIZE, formatLagos, getSignups, timeAgo, type SignupFilters } from "@/lib/owner-data";
import { Avatar, PageHeader, SurveyChip, btn, card } from "../../_components/bits";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default async function SignupsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();

  const sp = await searchParams;
  const surveyParam = first(sp.survey);
  const filters: SignupFilters = {
    q: first(sp.q).trim().slice(0, 100),
    survey: surveyParam === "yes" || surveyParam === "no" ? surveyParam : "all",
    page: Math.max(1, Math.floor(Number(first(sp.page))) || 1),
  };

  let result: Awaited<ReturnType<typeof getSignups>>;
  try {
    result = await getSignups(filters);
  } catch (err) {
    console.error("[owner signups]", err);
    return (
      <div className={`${card} p-6`}>
        <h1 className="font-display text-2xl font-bold">Couldn't load the data</h1>
        <p className="mt-2 text-sm text-muted">Check your Supabase env vars and the server logs, then refresh.</p>
      </div>
    );
  }

  const pages = Math.max(1, Math.ceil(result.total / PAGE_SIZE));
  const page = Math.min(filters.page, pages);
  const href = (p: number) => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.survey !== "all") params.set("survey", filters.survey);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/owner/signups${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      <PageHeader eyebrow="Everyone on the waitlist" title="Signups">
        <a href="/api/owner/export" className={btn}>
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v12m0 0-4-4m4 4 4-4M4 21h16" />
          </svg>
          Export CSV
        </a>
      </PageHeader>

      <div className={`${card} p-4 sm:p-5`}>
        <form method="get" action="/owner/signups" className="flex flex-col gap-2 sm:flex-row">
          <input
            type="search"
            name="q"
            defaultValue={filters.q}
            placeholder="Search by email"
            aria-label="Search by email"
            className="min-w-0 flex-1 rounded-xl border border-line-strong bg-paper px-4 py-2.5 text-base outline-none focus:border-brand focus:bg-white"
          />
          <select
            name="survey"
            defaultValue={filters.survey}
            aria-label="Survey filter"
            className="rounded-xl border border-line-strong bg-paper px-3 py-2.5 text-base outline-none focus:border-brand"
          >
            <option value="all">All signups</option>
            <option value="yes">Did survey</option>
            <option value="no">Didn't do survey</option>
          </select>
          <button type="submit" className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-deep">
            Apply
          </button>
          {(filters.q || filters.survey !== "all") && (
            <Link href="/owner/signups" className={btn}>
              Clear
            </Link>
          )}
        </form>

        {/* Phone: list */}
        <ul className="mt-4 divide-y divide-line sm:hidden">
          {result.rows.map((r) => (
            <li key={r.id} className="flex items-center gap-3 py-3">
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

        {/* Tablet+: table */}
        <div className="mt-4 hidden overflow-x-auto sm:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs text-muted">
                <th className="py-2.5 pr-3 font-medium">Email</th>
                <th className="px-3 py-2.5 font-medium">Source</th>
                <th className="px-3 py-2.5 font-medium">Joined (Lagos)</th>
                <th className="py-2.5 pl-3 font-medium">Survey</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((r) => (
                <tr key={r.id} className="border-b border-line transition last:border-0 hover:bg-brand-wash">
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-3">
                      <Avatar email={r.email} />
                      <span className="max-w-[18rem] truncate font-semibold">{r.email}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="rounded-lg bg-paper px-2 py-1 text-xs font-medium text-body ring-1 ring-line-strong">
                      {r.source || "direct"}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-body">{formatLagos(r.created_at)}</td>
                  <td className="py-3 pl-3">
                    <SurveyChip done={r.did_survey} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {result.rows.length === 0 && <p className="py-12 text-center text-sm text-muted">No signups match.</p>}

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4 text-sm">
          <span className="text-muted">
            {result.total.toLocaleString()} result{result.total === 1 ? "" : "s"} · page {page} of {pages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={href(page - 1)} className={btn}>
                ← Prev
              </Link>
            )}
            {page < pages && (
              <Link href={href(page + 1)} className={btn}>
                Next →
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
