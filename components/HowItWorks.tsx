import { SectionHeading } from "./SectionHeading";

function Step({ num, title, body, visual }: { num: string; title: string; body: string; visual: React.ReactNode }) {
  return (
    <li className="flex flex-col gap-5 rounded-3xl border border-line bg-white p-[26px]">
      <div aria-hidden="true">{visual}</div>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[13px] text-brand">{num}</span>
        <h3 className="m-0 font-display text-[23px] font-bold tracking-[-0.02em]">{title}</h3>
        <p className="m-0 text-[15px] leading-[1.6] text-muted">{body}</p>
      </div>
    </li>
  );
}

export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-h" className="mx-auto max-w-[1200px] px-5 py-[clamp(48px,8vw,96px)]">
      <SectionHeading
        id="how-h"
        pill="How it works"
        title="Three steps."
        accent="Zero regret."
        description="Keep writing email the way you always have. Unsend works quietly in the background."
      />
      <ol className="anim-stagger m-0 grid list-none gap-[18px] p-0 [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]">
        <Step
          num="01"
          title="Write as usual"
          body="Unsend sits next to your Send button. No new inbox to learn."
          visual={
            <div className="box-border flex min-h-[150px] flex-col justify-center gap-2.5 rounded-2xl bg-brand-wash p-[18px]">
              <div className="flex items-center gap-2 text-[13px] text-muted">
                <span className="w-9">To</span>
                <span className="h-2.5 flex-1 rounded-full bg-brand-mist" />
              </div>
              <div className="flex items-center gap-2 text-[13px] text-muted">
                <span className="w-9">Subj</span>
                <span className="h-2.5 flex-[0.7] rounded-full bg-brand-mist" />
              </div>
              <div className="mt-1.5 flex justify-end">
                <span className="rounded-full bg-brand px-3.5 py-1.5 text-xs font-semibold text-white">Safe Send ✓</span>
              </div>
            </div>
          }
        />
        <Step
          num="02"
          title="AI checks it first"
          body="Wrong name, missing file, risky reply-all. It flags, you decide."
          visual={
            <div className="box-border flex min-h-[150px] flex-col justify-center gap-2 rounded-2xl bg-brand-wash p-[18px]">
              {["Wrong name: David → Daniel", "Attachment missing"].map((t) => (
                <div
                  key={t}
                  className="flex items-center gap-2 rounded-xl border border-amber-line bg-white px-3 py-2.5 text-[13px] text-amber-ink"
                >
                  <span className="size-[7px] rounded-full bg-amber-dot" />
                  {t}
                </div>
              ))}
            </div>
          }
        />
        <Step
          num="03"
          title="Take it back any time"
          body="Changed your mind within 24 hours? One click and it's gone from their side."
          visual={
            <div className="box-border flex min-h-[150px] flex-col items-center justify-center gap-3 rounded-2xl bg-ink p-[18px] text-center">
              <span className="font-mono text-[22px] tracking-[-0.02em] text-white">23:59:12</span>
              <span className="rounded-full bg-brand px-[18px] py-2 text-[13px] font-semibold text-white">Unsend</span>
            </div>
          }
        />
      </ol>
    </section>
  );
}
