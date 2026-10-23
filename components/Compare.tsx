import { SectionHeading } from "./SectionHeading";

const ROWS: { feature: string; undo: string; unsend: string }[] = [
  { feature: "Time to take it back", undo: "~30 seconds", unsend: "24 hours" },
  { feature: "Works after it’s delivered", undo: "✕", unsend: "✓" },
  { feature: "Works after it’s opened", undo: "✕", unsend: "✓" },
  { feature: "Removes attachments too", undo: "✕", unsend: "✓" },
  { feature: "AI check before sending", undo: "✕", unsend: "✓" },
  { feature: "Shows when it’s opened", undo: "✕", unsend: "✓" },
];

function srText(v: string) {
  if (v === "✓") return "Yes";
  if (v === "✕") return "No";
  return v;
}

const cellX = "px-3 min-[640px]:px-4";

export function Compare() {
  return (
    <section id="compare" aria-labelledby="cmp-h" className="mx-auto max-w-[960px] px-5 py-[clamp(48px,8vw,96px)]">
      <SectionHeading id="cmp-h" pill="Compare" title="Undo Send gives you seconds." accent="We give you a day." />
      <div className="anim-reveal overflow-hidden rounded-3xl border border-line bg-white">
        <table className="w-full table-fixed border-separate border-spacing-0 text-sm min-[640px]:text-[15px]">
          <thead>
            <tr>
              <th scope="col" className={`border-b border-line py-[18px] text-left font-semibold text-muted ${cellX} min-[640px]:px-[22px]`}>
                Feature
              </th>
              <th scope="col" className={`w-[27%] border-b border-line py-[18px] text-center font-semibold text-muted min-[640px]:w-[22%] ${cellX}`}>
                Undo Send
              </th>
              <th scope="col" className={`w-[27%] bg-brand py-[18px] text-center font-bold text-white min-[640px]:w-[22%] ${cellX}`}>
                Unsend
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.feature} className="anim-row">
                <th scope="row" className={`border-b border-[#F1EFE9] py-4 text-left font-medium text-ink ${cellX} min-[640px]:px-[22px]`}>
                  {r.feature}
                </th>
                <td className={`border-b border-[#F1EFE9] py-4 text-center text-subtle ${cellX}`}>
                  <span aria-hidden="true">{r.undo}</span>
                  <span className="sr-only">{srText(r.undo)}</span>
                </td>
                <td className={`border-b border-[#4562F7] bg-brand py-4 text-center font-semibold text-white ${cellX}`}>
                  <span aria-hidden="true">{r.unsend}</span>
                  <span className="sr-only">{srText(r.unsend)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
