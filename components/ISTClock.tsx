"use client";

import { useEffect, useState } from "react";

const TIME_FMT = new Intl.DateTimeFormat("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: "Asia/Kolkata",
});

/**
 * Live Indian Standard Time in the header.
 *
 * Everything on this site hangs off an IST wall clock — 8:00 AM for the advance
 * window, 10/11 AM for Tatkal — and visitors are often in another timezone, so
 * showing the authoritative clock removes the main source of doubt.
 *
 * Renders a stable placeholder until mounted: the server has no business
 * guessing the second, and a mismatch would be a hydration error.
 */
export default function ISTClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(TIME_FMT.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="ist-clock" title="Current Indian Standard Time">
      <span className="pulse-dot" aria-hidden="true" />
      <span className="visually-hidden">Current Indian Standard Time:</span>
      <b suppressHydrationWarning>{time ?? "--:--:--"}</b>
      <span aria-hidden="true">IST</span>
    </span>
  );
}
