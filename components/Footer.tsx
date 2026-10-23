const LINKS: [string, string][][] = [
  [
    ["#how", "How it works"],
    ["#compare", "Compare"],
  ],
  [
    ["#faq", "FAQ"],
    ["#join", "Waitlist"],
  ],
];

export function Footer() {
  return (
    <footer className="overflow-hidden bg-brand text-white">
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-6 px-5 pt-[clamp(40px,6vw,64px)]">
        <div className="flex max-w-[320px] flex-col gap-2.5">
          <span className="font-display text-[22px] font-extrabold tracking-[-0.03em]">unsend</span>
          <p className="m-0 text-[15px] leading-[1.6] text-on-brand">Send without fear. Your recipients don&apos;t need Unsend.</p>
        </div>
        <nav aria-label="Footer" className="flex gap-10 text-[15px]">
          {LINKS.map((col, i) => (
            <div key={i} className="flex flex-col gap-2.5">
              {col.map(([href, label]) => (
                <a key={href} href={href} className="text-white no-underline hover:underline">
                  {label}
                </a>
              ))}
            </div>
          ))}
        </nav>
      </div>
      <p
        aria-hidden="true"
        className="anim-mark m-0 mt-[clamp(24px,4vw,40px)] whitespace-nowrap text-center font-display text-[clamp(96px,24vw,340px)] font-extrabold leading-[0.8] tracking-[-0.06em] text-white/14"
        style={{ transform: "translateY(14%)" }}
      >
        unsend
      </p>
      <div className="relative mx-auto max-w-[1200px] px-5 pb-[22px] pt-4 text-[13px] text-on-brand">
        © {new Date().getFullYear()} Unsend.io
      </div>
    </footer>
  );
}
