"use client";

import { useId, useState } from "react";
import { SectionHeading } from "./SectionHeading";

const QA: [string, string][] = [
  [
    "Does the person I email need Unsend?",
    "No. They get a normal email from your address, in whatever inbox they already use. Nothing to install, nothing to sign up for.",
  ],
  [
    "What if they already opened it?",
    "You can still unsend it. The message and any attachments disappear, so it can’t be reread, forwarded or downloaded.",
  ],
  [
    "How is this different from Undo Send?",
    "Undo Send gives you a few seconds before the email leaves. Unsend gives you 24 hours after it’s delivered, plus an AI check before you send.",
  ],
  [
    "When can I start using it?",
    "We’re opening to a small group first. Join the waitlist, and fill the short survey to move to the front of the line.",
  ],
];

export function Faq() {
  const [open, setOpen] = useState<number>(0);
  const baseId = useId();

  return (
    <section id="faq" aria-labelledby="faq-h" className="mx-auto max-w-[820px] px-5 py-[clamp(48px,8vw,96px)]">
      <SectionHeading id="faq-h" pill="FAQ" title="Good questions." />
      <div className="anim-stagger flex flex-col gap-2.5">
        {QA.map(([q, a], i) => {
          const isOpen = open === i;
          const panelId = `${baseId}-faq-${i}`;
          return (
            <div key={q} className="rounded-[18px] border border-line bg-white">
              <h3 className="m-0">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex min-h-[62px] w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-5 py-4 text-left font-sans text-base font-semibold text-ink"
                >
                  <span>{q}</span>
                  <span
                    aria-hidden="true"
                    className={`inline-flex size-[30px] shrink-0 items-center justify-center rounded-full text-lg transition-colors ${
                      isOpen ? "bg-brand text-white" : "bg-brand-wash text-brand"
                    }`}
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
              </h3>
              <div id={panelId} hidden={!isOpen}>
                <p className="m-0 px-5 pb-5 text-[15px] leading-[1.65] text-muted">{a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
