// Logos live in /public/inboxes. They are the providers' own marks, shown only to say
// "works with"; they remain trademarks of their owners.
const INBOXES = [
  { name: "Gmail", logo: "/inboxes/gmail.svg" },
  { name: "Outlook", logo: "/inboxes/outlook.svg" },
  { name: "Yahoo Mail", logo: "/inboxes/yahoo.svg" },
  { name: "iCloud Mail", logo: "/inboxes/icloud.svg" },
  { name: "Proton Mail", logo: "/inboxes/proton.svg" },
];

function WorkEmailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" fill="none" aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="3.5" className="fill-brand-tint stroke-brand" strokeWidth="1.6" />
      <path d="m4 7.5 8 6 8-6" className="stroke-brand" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Inboxes() {
  return (
    <section aria-label="Works with every inbox" className="mx-auto max-w-[1000px] px-5 pb-[clamp(64px,9vw,104px)] text-center">
      <p className="mb-7 mt-0 text-[15px] text-muted">
        Your recipients don&apos;t need anything. It works with every inbox.
      </p>
      <ul className="anim-stagger m-0 grid list-none grid-cols-2 gap-3 p-0 sm:flex sm:flex-wrap sm:justify-center">
        {INBOXES.map(({ name, logo }) => (
          <li
            key={name}
            className="flex items-center justify-center gap-3 rounded-2xl border border-line bg-white px-5 py-3.5 text-[15px] font-semibold text-ink shadow-[0_1px_2px_rgba(17,19,26,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_8px_24px_-8px_rgba(17,19,26,0.15)] sm:justify-start"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="" width={28} height={28} className="size-7 shrink-0 object-contain" />
            {name}
          </li>
        ))}
        <li className="col-span-2 flex items-center justify-center gap-3 rounded-2xl border border-brand-mist bg-brand-wash px-5 py-3.5 text-[15px] font-semibold text-brand-deep sm:col-span-1 sm:justify-start">
          <WorkEmailIcon />
          Any work email
        </li>
      </ul>
      <p className="mb-0 mt-6 text-xs text-subtle">
        Gmail, Outlook, Yahoo, iCloud and Proton are trademarks of their respective owners.
      </p>
    </section>
  );
}
