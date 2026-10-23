import { DelayClock } from "./DelayClock";
import { ArrowUp, Sparkle, Warning } from "./icons";

function DeckCards() {
  return (
    <div aria-hidden="true" className="flex flex-col items-start px-1 pb-2 pt-1.5">
      <div
        className="anim-fan-a box-border flex w-[min(100%,400px)] flex-col gap-3 rounded-[22px] bg-[#FFFEFB] p-[22px] text-ink shadow-[0_34px_80px_rgba(10,20,90,0.38)]"
        style={{ transform: "rotate(-3deg)" }}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[13px] text-brand">Outbox</span>
          <span className="rounded-full bg-brand-tint px-[11px] py-[3px] font-mono text-[13px] text-brand">
            <DelayClock />
          </span>
        </div>
        <p className="m-0 font-display text-[22px] font-bold tracking-[-0.02em]">Q3 investor update</p>
        <p className="m-0 text-sm text-muted">To: investors · held for 25 min</p>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-line-strong px-3.5 py-1.5 text-[13px]">Edit</span>
          <span className="rounded-full border border-line-strong px-3.5 py-1.5 text-[13px]">Cancel</span>
          <span className="rounded-full bg-brand px-3.5 py-1.5 text-[13px] font-semibold text-white">Send now</span>
        </div>
      </div>
      <div
        className="anim-fan-b -mt-3.5 ml-[clamp(0px,6vw,60px)] box-border flex w-[min(92%,370px)] items-center gap-3 rounded-[18px] border border-amber-line bg-amber-bg px-[18px] py-4 shadow-[0_26px_60px_rgba(10,20,90,0.3)]"
        style={{ transform: "rotate(2deg)" }}
      >
        <Warning />
        <p className="m-0 text-sm leading-[1.4] text-amber-ink">You said “attached” but nothing is attached.</p>
      </div>
    </div>
  );
}

function Phone() {
  return (
    <div
      role="img"
      aria-label="Phone showing Unsend's AI check catching a confidential file sent to the whole company"
      className="anim-phone box-border w-[min(100%,310px)] rounded-[48px] bg-ink p-[11px] shadow-[0_50px_100px_rgba(10,20,90,0.5),inset_0_0_0_1.5px_#3B4260]"
    >
      <div className="flex min-h-[590px] flex-col overflow-hidden rounded-[38px] bg-white text-ink">
        <div className="flex justify-center pt-2.5">
          <span className="h-[26px] w-[92px] rounded-full bg-ink" />
        </div>
        <div className="flex items-center justify-between border-b border-[#F1EFE9] px-[18px] pb-2.5 pt-3.5">
          <span className="text-sm text-brand">Cancel</span>
          <span className="text-[15px] font-semibold">New message</span>
          <span className="inline-flex size-[30px] items-center justify-center rounded-full bg-brand">
            <ArrowUp />
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-b border-[#F1EFE9] px-[18px] py-2.5 text-[13px]">
          <span className="text-subtle">To:</span>
          <span className="rounded-md bg-[#FDE7E4] px-[7px] py-0.5 font-semibold text-[#8A1A14]">All Staff (214)</span>
        </div>
        <div className="border-b border-[#F1EFE9] px-[18px] py-2.5 text-sm font-semibold">Salaries 2026, just for you</div>
        <div className="flex-auto px-[18px] py-3.5 text-sm leading-[1.55] text-body">
          Hi <span className="rounded-[3px] bg-highlight px-[3px] text-ink">David</span>, here&apos;s the full salary
          sheet you asked for. Please keep it between us.
          <div className="mt-3 inline-flex items-center gap-2 rounded-[10px] border border-line px-2.5 py-2 text-xs text-ink">
            salaries_2026.xlsx
          </div>
        </div>
        <div className="anim-sheet mx-2.5 mb-2.5 flex flex-col gap-2.5 rounded-3xl bg-ink p-4 text-[#FFFEFB]">
          <div className="flex items-center gap-2">
            <Sparkle />
            <span className="font-mono text-[11px] tracking-[0.04em] text-navy-text">WAIT, 2 THINGS</span>
          </div>
          {["This is going to 214 people, not just David.", "It contains salary data marked private."].map((t) => (
            <p key={t} className="m-0 flex gap-2 text-[13px] leading-[1.4]">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber" />
              {t}
            </p>
          ))}
          <div className="mt-0.5 flex gap-2">
            <span className="flex-1 rounded-full bg-[#FFFEFB] py-[9px] text-center text-[13px] font-semibold text-ink">Fix it</span>
            <span className="flex-1 rounded-full border border-navy-line py-[9px] text-center text-[13px]">Send anyway</span>
          </div>
        </div>
        <div className="flex justify-center pb-2.5 pt-1">
          <span className="h-1 w-[110px] rounded-full bg-ink" />
        </div>
      </div>
    </div>
  );
}

export function ProductShot() {
  return (
    <section aria-labelledby="shot-h" className="mx-auto max-w-[1200px] px-5 py-[clamp(32px,6vw,72px)]">
      <div className="anim-panel relative grid items-center gap-[clamp(36px,5vw,64px)] overflow-hidden rounded-[clamp(28px,4vw,40px)] bg-[radial-gradient(circle_at_78%_30%,#6A82FF_0%,#2E4CF6_42%,#2236C4_100%)] px-[clamp(20px,5vw,64px)] py-[clamp(28px,6vw,72px)] text-white [grid-template-columns:repeat(auto-fit,minmax(min(100%,400px),1fr))]">
        <div className="flex flex-col gap-[clamp(22px,3vw,32px)]">
          <div className="flex flex-col gap-3.5">
            <div className="flex flex-wrap gap-2">
              {["Smart Delay", "AI check", "Safe Send"].map((t) => (
                <span key={t} className="rounded-full border border-white/35 bg-white/14 px-3 py-[5px] font-mono text-xs">
                  {t}
                </span>
              ))}
            </div>
            <h2
              id="shot-h"
              className="m-0 font-display text-[clamp(40px,5.6vw,76px)] font-extrabold leading-[0.95] tracking-[-0.045em]"
            >
              Send without fear.
            </h2>
            <p className="m-0 max-w-[440px] text-[17px] leading-[1.6] text-on-brand">
              Your email waits a moment, gets a second look, and stays yours to take back for a full day.
            </p>
          </div>
          <DeckCards />
        </div>
        <div className="flex justify-center">
          <Phone />
        </div>
      </div>
    </section>
  );
}
