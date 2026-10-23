"use client";

import Script from "next/script";
import { useEffect, useId, useState } from "react";
import { openSurvey, TALLY_SCRIPT_SRC } from "@/lib/tally";
import { Check } from "./icons";

type Status = "idle" | "loading" | "joined" | "error";

const STORAGE_KEY = "unsend-waitlist-email";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readSaved(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function save(email: string) {
  try {
    window.localStorage.setItem(STORAGE_KEY, email);
  } catch {
    // Private mode or storage blocked: fine, the form just won't remember.
  }
}

function sourceTag(): string {
  try {
    const params = new URLSearchParams(window.location.search);
    const utm = params.get("utm_source") || params.get("ref");
    if (utm) return utm;
    if (document.referrer) return new URL(document.referrer).hostname;
  } catch {
    // ignore
  }
  return "direct";
}

export function WaitlistForm() {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [surveyDone, setSurveyDone] = useState(false);

  // Remember people who already joined on this device.
  useEffect(() => {
    const saved = readSaved();
    if (saved) {
      setEmail(saved);
      setStatus("joined");
    }
  }, []);

  async function join() {
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setStatus("error");
      setMessage("That email doesn't look right. Try again?");
      return;
    }

    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, company, source: sourceTag() }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      save(value.toLowerCase());
      setStatus("joined");
    } catch {
      setStatus("error");
      setMessage("Couldn't reach the server. Check your connection and try again.");
    }
  }

  function startSurvey() {
    const value = email.trim().toLowerCase();
    openSurvey(value, () => {
      setSurveyDone(true);
      fetch("/api/survey-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      }).catch(() => {});
    });
  }

  return (
    <>
      <Script src={TALLY_SCRIPT_SRC} strategy="lazyOnload" />

      {status !== "joined" ? (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void join();
          }}
          className="flex flex-col gap-2.5"
        >
          <div className="flex max-w-[500px] flex-wrap gap-2 rounded-[clamp(16px,3vw,999px)] border border-line-strong bg-white p-1.5 shadow-[0_14px_30px_-18px_rgba(17,19,26,0.3)]">
            <label htmlFor={inputId} className="sr-only">
              Your email
            </label>
            <input
              id={inputId}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              aria-invalid={status === "error"}
              aria-describedby={status === "error" ? errorId : undefined}
              disabled={status === "loading"}
              className="min-h-12 min-w-0 flex-[999_1_200px] rounded-[clamp(12px,3vw,999px)] border-0 bg-transparent px-4 font-sans text-base text-ink outline-none focus-visible:outline-2 focus-visible:outline-brand"
            />
            {/* Honeypot: hidden from people and screen readers, bots tend to fill it. */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="absolute -left-[9999px] size-px opacity-0"
              aria-hidden="true"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="min-h-12 flex-[1_0_auto] cursor-pointer rounded-[clamp(12px,3vw,999px)] border-0 bg-brand px-[22px] font-sans text-[15px] font-semibold text-white hover:bg-brand-deep disabled:cursor-wait disabled:opacity-70"
            >
              {status === "loading" ? "Joining…" : "Join the waitlist"}
            </button>
          </div>
          <p id={errorId} role="alert" className="mx-3 my-0 min-h-5 text-sm font-medium text-[#B42318]">
            {status === "error" ? message : ""}
          </p>
        </form>
      ) : (
        <div
          role="status"
          className="flex max-w-[520px] flex-wrap items-center justify-between gap-3 rounded-[20px] border border-brand-mist bg-white px-5 py-[18px]"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-brand">
              <Check />
            </span>
            <p className="m-0 text-base font-medium">
              {surveyDone ? "Thanks! You're at the front of the line." : "You're on the list. Want to skip the line?"}
            </p>
          </div>
          {!surveyDone && (
            <button
              type="button"
              onClick={startSurvey}
              className="min-h-[46px] cursor-pointer rounded-full border-0 bg-brand px-[18px] font-sans text-[15px] font-semibold text-white hover:bg-brand-deep"
            >
              Get priority access
            </button>
          )}
        </div>
      )}
    </>
  );
}
