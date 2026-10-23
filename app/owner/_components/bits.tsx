import Link from "next/link";

export const card = "rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(17,19,26,0.04)]";

export const btn =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-line-strong bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-brand-wash";

export function Sparkline({ values, className = "" }: { values: number[]; className?: string }) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const span = Math.max(max - min, 1);
  const w = 100;
  const h = 32;
  const pts = values.map((v, i) => [(i / Math.max(values.length - 1, 1)) * w, h - 3 - ((v - min) / span) * (h - 8)]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d={`${line} L${w} ${h} L0 ${h} Z`} fill="currentColor" opacity="0.16" />
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function Ring({ pct, size = 64 }: { pct: number; size?: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="-rotate-90">
      <circle cx="32" cy="32" r={r} fill="none" strokeWidth="7" className="stroke-brand-tint" />
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        strokeWidth="7"
        strokeLinecap="round"
        className="stroke-brand"
        strokeDasharray={`${(Math.min(pct, 100) / 100) * c} ${c}`}
      />
    </svg>
  );
}

export function Delta({ cur, prev, label }: { cur: number; prev: number; label: string }) {
  if (prev === 0 && cur === 0) return <span className="text-xs text-subtle">No change {label}</span>;
  const up = cur >= prev;
  const text = prev === 0 ? "New" : `${Math.abs(Math.round(((cur - prev) / prev) * 100))}%`;
  return (
    <span className="flex flex-wrap items-center gap-1.5 text-xs text-subtle">
      <span
        className={`inline-flex items-center rounded-full px-1.5 py-0.5 font-semibold ${
          up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
        }`}
      >
        {up ? "↑" : "↓"} {text}
      </span>
      {label}
    </span>
  );
}

export function Avatar({ email }: { email: string }) {
  return (
    <span className="font-display inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-tint text-sm font-bold uppercase text-brand-deep">
      {email[0]}
    </span>
  );
}

export function SurveyChip({ done }: { done: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        done ? "bg-emerald-50 text-emerald-700" : "bg-line text-muted"
      }`}
    >
      <span className={`size-1.5 rounded-full ${done ? "bg-emerald-500" : "bg-subtle"}`} />
      {done ? "Surveyed" : "Pending"}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && <p className="text-sm font-medium text-muted">{eyebrow}</p>}
        <h1 className="font-display text-[28px] leading-tight font-bold tracking-tight sm:text-3xl">{title}</h1>
      </div>
      {children}
    </div>
  );
}

export function SectionTitle({ title, sub, href, cta }: { title: string; sub?: string; href?: string; cta?: string }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="font-display text-lg font-bold tracking-tight">{title}</h2>
        {sub && <p className="text-xs text-muted">{sub}</p>}
      </div>
      {href && (
        <Link href={href} className="shrink-0 text-sm font-semibold text-brand hover:text-brand-deep">
          {cta ?? "View all"} →
        </Link>
      )}
    </div>
  );
}
