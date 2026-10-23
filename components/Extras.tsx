import { DelayClock } from "./DelayClock";
import { SectionHeading } from "./SectionHeading";

function ExtraCard({ title, body, visual }: { title: string; body: string; visual: React.ReactNode }) {
  return (
    <li className="grid items-center gap-[22px] rounded-3xl border border-line bg-white p-[clamp(22px,3vw,32px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr))]">
      <div className="flex flex-col gap-2.5">
        <h3 className="m-0 font-display text-[26px] font-bold tracking-[-0.02em]">{title}</h3>
        <p className="m-0 text-[15px] leading-[1.6] text-muted">{body}</p>
      </div>
      <div aria-hidden="true">{visual}</div>
    </li>
  );
}

export function Extras() {
  return (
    <section aria-labelledby="extra-h" className="mx-auto max-w-[1200px] px-5 py-[clamp(48px,8vw,96px)]">
      <SectionHeading id="extra-h" pill="Also included" title="Small things that save you." />
      <ul className="anim-stagger m-0 grid list-none gap-[18px] p-0 [grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr))]">
        <ExtraCard
          title="Smart Delay"
          body="Hold every email for a few minutes you choose. Edit or cancel before it leaves."
          visual={
            <div className="flex flex-col gap-2 rounded-2xl bg-brand-wash p-[18px]">
              <span className="text-xs text-subtle">Outbox</span>
              <span className="font-mono text-[30px] tracking-[-0.03em] text-brand">
                <DelayClock />
              </span>
              <span className="text-xs text-subtle">until it sends</span>
            </div>
          }
        />
        <ExtraCard
          title="Read status"
          body="See when it's opened, so you know if there's still time for a clean recall."
          visual={
            <div className="flex flex-col gap-2 rounded-2xl bg-brand-wash p-3.5">
              <div className="flex items-center justify-between rounded-[10px] bg-white px-3 py-2.5 text-[13px]">
                <span>Q3 proposal</span>
                <span className="rounded-full bg-ink px-[9px] py-[3px] text-[11px] font-semibold text-white">Opened</span>
              </div>
              <div className="flex items-center justify-between rounded-[10px] bg-white px-3 py-2.5 text-[13px]">
                <span>Invoice #0142</span>
                <span className="rounded-full bg-brand-tint px-[9px] py-[3px] text-[11px] font-semibold text-brand-deep">
                  Not yet
                </span>
              </div>
            </div>
          }
        />
      </ul>
    </section>
  );
}
