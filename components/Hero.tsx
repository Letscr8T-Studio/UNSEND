import { ArrowRight, Sparkle, UnsendArrow } from "./icons";

export function Announcement() {
  return (
    <a
      href="#join"
      className="block bg-ink px-4 py-2.5 text-center text-[13px] text-on-brand no-underline"
    >
      Early access is opening soon. <span className="font-semibold text-white">Join the waitlist →</span>
    </a>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className={`flex items-center gap-2.5 no-underline ${light ? "text-white" : "text-ink"}`}>
      <span aria-hidden="true" className="inline-flex size-8 items-center justify-center rounded-[10px] bg-brand">
        <UnsendArrow />
      </span>
      <span className="font-display text-[22px] font-extrabold tracking-[-0.03em]">unsend</span>
    </a>
  );
}

function Header() {
  return (
    <header className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-[18px]">
      <Logo />
      <nav className="hidden items-center gap-1 min-[721px]:flex" aria-label="Main">
        {[
          ["#how", "How it works"],
          ["#compare", "Compare"],
          ["#faq", "FAQ"],
        ].map(([href, label]) => (
          <a key={href} href={href} className="px-3.5 py-2.5 text-[15px] text-body no-underline hover:text-brand">
            {label}
          </a>
        ))}
      </nav>
      <a
        href="#join"
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand px-[18px] text-[15px] font-semibold text-white no-underline hover:bg-brand-deep"
      >
        Get early access <ArrowRight />
      </a>
    </header>
  );
}

function FloatingCards() {
  return (
    <>
      <div
        aria-hidden="true"
        className="anim-float-l absolute left-5 top-[60%] hidden w-60 flex-col gap-3 rounded-[20px] border border-[#E6E9F5] bg-white p-[18px] shadow-[0_30px_60px_-30px_rgba(46,76,246,0.35)] min-[1100px]:flex"
        style={{ transform: "rotate(-6deg)" }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold">Unsend window</span>
          <span className="rounded-full bg-brand-tint px-2 py-[3px] text-[11px] font-semibold text-brand-deep">Opened</span>
        </div>
        <p className="m-0 font-mono text-[26px] font-medium tracking-[-0.03em]">23:41:08</p>
        <div className="h-1.5 rounded-full bg-brand-tint">
          <div className="h-full w-[92%] rounded-full bg-brand" />
        </div>
        <span className="text-xs text-subtle">left to take it back</span>
      </div>

      <div
        aria-hidden="true"
        className="anim-float-r absolute right-5 top-[56%] hidden w-[250px] flex-col gap-2.5 rounded-[20px] border border-[#E6E9F5] bg-white p-[18px] shadow-[0_30px_60px_-30px_rgba(46,76,246,0.35)] min-[1100px]:flex"
        style={{ transform: "rotate(5deg)" }}
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex size-[26px] items-center justify-center rounded-lg bg-ink">
            <Sparkle size={13} />
          </span>
          <span className="text-[13px] font-semibold">AI check</span>
        </div>
        <p className="m-0 text-sm leading-[1.45] text-body">
          You said <span className="rounded-[3px] bg-highlight px-[3px]">attached</span>, but nothing is attached.
        </p>
        <div className="flex gap-1.5">
          <span className="rounded-full bg-ink px-3 py-[5px] text-xs font-semibold text-white">Fix it</span>
          <span className="rounded-full border border-line-strong px-3 py-[5px] text-xs text-muted">Send anyway</span>
        </div>
      </div>
    </>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-h"
      className="relative bg-[radial-gradient(ellipse_80%_70%_at_50%_0%,#DCE3FF_0%,#EEF1FF_38%,#FBFBF9_72%)]"
    >
      <Header />
      <div className="relative mx-auto max-w-[1200px] px-5 pb-[clamp(64px,10vw,140px)] pt-[clamp(48px,9vw,120px)]">
        <FloatingCards />
        <div className="relative mx-auto flex max-w-[760px] flex-col items-center gap-[clamp(20px,2.6vw,28px)] text-center">
          <span className="anim-load inline-flex items-center gap-2 rounded-full border border-brand-mist bg-white py-1.5 pl-2 pr-3.5 text-[13px] font-medium text-brand-deep shadow-[0_6px_20px_-10px_rgba(46,76,246,0.4)]">
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-brand">
              <UnsendArrow size={10} stroke={2.6} />
            </span>
            Email, without the regret
          </span>

          <h1
            id="hero-h"
            className="m-0 font-display text-[clamp(44px,7vw,88px)] font-bold leading-none tracking-[-0.045em]"
          >
            <span className="anim-word inline-block" style={{ animationDelay: "80ms" }}>
              Take back any email.
            </span>
            <br />
            <span className="anim-word inline-block text-brand" style={{ animationDelay: "220ms" }}>
              <span className="anim-ink">For a full 24 hours.</span>
            </span>
          </h1>

          <p
            className="anim-load m-0 max-w-[560px] text-[clamp(17px,1.6vw,20px)] leading-[1.6] text-muted"
            style={{ animationDelay: "380ms" }}
          >
            Unsend catches mistakes before your email leaves, and lets you pull it back after it&apos;s delivered, even
            if it&apos;s already been opened.
          </p>

          <div className="anim-load flex flex-wrap justify-center gap-2.5" style={{ animationDelay: "500ms" }}>
            <a
              href="#join"
              className="inline-flex min-h-[52px] items-center rounded-full bg-brand px-[26px] text-base font-semibold text-white no-underline shadow-[0_14px_30px_-12px_rgba(46,76,246,0.6)] hover:bg-brand-deep"
            >
              Join the waitlist
            </a>
            <a
              href="#how"
              className="inline-flex min-h-[52px] items-center rounded-full border border-line-strong bg-white px-6 text-base font-semibold text-ink no-underline hover:border-brand-mist"
            >
              See how it works
            </a>
          </div>

          <p className="anim-load m-0 text-[13px] text-subtle" style={{ animationDelay: "620ms" }}>
            Free during early access · Recipients install nothing
          </p>
        </div>
      </div>
    </section>
  );
}
