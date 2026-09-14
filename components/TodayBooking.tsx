"use client";

import { useEffect, useState } from "react";
import { formatLongDate, latestBookableJourney } from "@/lib/booking-dates";

/**
 * "Today you can book up to <date>" — the reverse of the calculator, answered
 * on arrival. Computed on the client in IST (the site is statically prerendered,
 * so a server value would be stale) and recomputed each minute so it flips at
 * the 8:00 AM IST release and at IST midnight while the page is open.
 */
export default function TodayBooking() {
  const [date, setDate] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setDate(formatLongDate(latestBookableJourney()));
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p className="today-booking" aria-live="polite">
      <span className="today-booking-label">Today you can book up to</span>{" "}
      <b suppressHydrationWarning>{date ?? "—"}</b>
      <span className="today-booking-note">opens 8:00 AM IST</span>
    </p>
  );
}
