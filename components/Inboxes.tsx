// Replace these text chips with official logo SVGs when you have them.
// Check each brand's guidelines for how a "works with" mention may show their mark.
const INBOXES = ["Gmail", "Outlook", "Yahoo Mail", "iCloud Mail", "Proton Mail", "Work email"];

export function Inboxes() {
  return (
    <section aria-label="Works with every inbox" className="mx-auto max-w-[1000px] px-5 pb-[clamp(64px,9vw,104px)] text-center">
      <p className="mb-[22px] mt-0 text-sm text-subtle">Your recipients don&apos;t need anything. It works with every inbox.</p>
      <ul className="anim-stagger m-0 flex list-none flex-wrap justify-center gap-2.5 p-0">
        {INBOXES.map((name) => (
          <li
            key={name}
            className="rounded-xl border border-line bg-white px-5 py-3 text-[15px] font-semibold text-body"
          >
            {name}
          </li>
        ))}
      </ul>
    </section>
  );
}
