type Tag = { label: string; fg: string; bg: string; dot: string };

const AI: Tag = { label: "Caught by AI check", fg: "#11131A", bg: "#F5F3EC", dot: "#E0A800" };
const UNSEND: Tag = { label: "Fixed with Unsend", fg: "#2236C4", bg: "#E8ECFF", dot: "#2E4CF6" };

const MOMENTS: { text: string; after: string; tag: Tag }[] = [
  { text: "“Hi David,”", after: "His name is Daniel.", tag: AI },
  { text: "“Please see attached.”", after: "Nothing was attached.", tag: AI },
  { text: "Reply all.", after: "All 214 of them.", tag: UNSEND },
  { text: "Sent before it was ready.", after: "Half a sentence, to a client.", tag: UNSEND },
  { text: "The angry one at 1:47am.", after: "You meant to sleep on it.", tag: UNSEND },
  { text: "The wrong price in the quote.", after: "Missing a zero.", tag: UNSEND },
];

export function Feeling() {
  return (
    <section aria-labelledby="feel-h" className="mx-auto max-w-[1200px] px-5 py-[clamp(40px,7vw,80px)]">
      <div className="grid items-start gap-[clamp(24px,4vw,56px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]">
        <div className="anim-reveal flex max-w-[380px] flex-col gap-3.5">
          <span className="self-start rounded-full bg-brand-tint px-3.5 py-1.5 text-[13px] font-semibold text-brand">
            You know the feeling
          </span>
          <h2
            id="feel-h"
            className="m-0 font-display text-[clamp(30px,3.6vw,44px)] font-bold leading-[1.08] tracking-[-0.035em]"
          >
            The stomach drop, <span className="ink-static ink-scroll text-brand">two seconds after send.</span>
          </h2>
          <p className="m-0 text-base leading-[1.6] text-muted">
            Everyone has one. The embarrassing reply. The follow-up apology. The email you still think about.
          </p>
        </div>

        <ul className="anim-focus m-0 grid list-none gap-3 p-0 [grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr))]">
          {MOMENTS.map((m) => (
            <li key={m.text} className="flex flex-col gap-2.5 rounded-[18px] border border-line bg-white p-[18px]">
              <p className="m-0 font-display text-lg font-semibold leading-[1.25] tracking-[-0.015em]">{m.text}</p>
              <p className="m-0 text-sm text-subtle">{m.after}</p>
              <span
                className="anim-tag inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-xs font-semibold"
                style={{ color: m.tag.fg, background: m.tag.bg }}
              >
                <span className="size-1.5 rounded-full" style={{ background: m.tag.dot }} />
                {m.tag.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
