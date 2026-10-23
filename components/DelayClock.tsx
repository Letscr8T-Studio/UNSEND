"use client";

import { useEffect, useState } from "react";

const START = 1499; // 24:59

function format(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m < 10 ? "0" : ""}${m}:${sec < 10 ? "0" : ""}${sec}`;
}

/** A small decorative countdown for the Outbox card. */
export function DelayClock() {
  const [secs, setSecs] = useState(START);

  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : START)), 1000);
    return () => clearInterval(id);
  }, []);

  return <span suppressHydrationWarning>{format(secs)}</span>;
}
