export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="self-center rounded-full bg-brand-tint px-3.5 py-1.5 text-[13px] font-semibold text-brand">
      {children}
    </span>
  );
}

export function SectionHeading({
  id,
  pill,
  title,
  accent,
  description,
}: {
  id: string;
  pill: string;
  title: string;
  accent?: string;
  description?: string;
}) {
  return (
    <div className="anim-reveal mb-[clamp(28px,5vw,52px)] flex flex-col items-center gap-3.5 text-center">
      <Pill>{pill}</Pill>
      <h2
        id={id}
        className="m-0 font-display text-[clamp(34px,4.6vw,56px)] font-bold leading-[1.05] tracking-[-0.04em]"
      >
        {title}
        {accent ? <span className="text-brand"> {accent}</span> : null}
      </h2>
      {description ? <p className="m-0 max-w-[520px] text-[17px] leading-[1.6] text-muted">{description}</p> : null}
    </div>
  );
}
