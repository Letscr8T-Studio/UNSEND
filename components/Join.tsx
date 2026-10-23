import { WaitlistForm } from "./WaitlistForm";

const STATUS_CARDS = [
  { title: "Pricing deck v2", to: "amaka@client.co", label: "Withdrawn", cls: "bg-brand text-white", tilt: "rotate(-2deg)" },
  { title: "Re: contract terms", to: "legal@client.co", label: "Sending in 4:12", cls: "bg-brand-tint text-brand-deep", tilt: "rotate(1.5deg) translateX(18px)" },
  { title: "Q3 proposal, final", to: "daniel@northwind.co", label: "Opened", cls: "bg-ink text-white", tilt: "rotate(-1deg)" },
];

export function Join() {
  return (
    <section id="join" aria-labelledby="join-h" className="mx-auto max-w-[1200px] px-5 pb-[clamp(64px,9vw,112px)] pt-[clamp(40px,6vw,72px)]">
      <div className="anim-panel grid items-center gap-[clamp(28px,4vw,56px)] rounded-[32px] border border-brand-mist bg-[linear-gradient(180deg,#EEF1FF_0%,#FFFFFF_100%)] px-[clamp(20px,5vw,64px)] py-[clamp(32px,6vw,72px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))]">
        <div className="flex flex-col gap-4">
          <h2
            id="join-h"
            className="m-0 font-display text-[clamp(34px,4.6vw,56px)] font-bold leading-[1.05] tracking-[-0.04em]"
          >
            Never write <span className="text-brand">“please ignore my last email”</span> again.
          </h2>
          <p className="m-0 text-[17px] leading-[1.6] text-muted">
            We&apos;re opening to a small group first. Join the list and help shape what we build.
          </p>
          <WaitlistForm />
        </div>

        <ul aria-hidden="true" className="anim-stagger m-0 flex list-none flex-col items-center gap-3 p-0">
          {STATUS_CARDS.map((c) => (
            <li
              key={c.title}
              className="box-border flex w-[min(100%,360px)] items-center justify-between gap-3 rounded-[18px] border border-line bg-white px-[18px] py-4 shadow-[0_20px_40px_-24px_rgba(17,19,26,0.3)]"
              style={{ transform: c.tilt }}
            >
              <div>
                <p className="m-0 text-sm font-semibold">{c.title}</p>
                <p className="m-0 text-xs text-subtle">to {c.to}</p>
              </div>
              <span className={`rounded-full px-[11px] py-[5px] text-xs font-semibold ${c.cls}`}>{c.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
