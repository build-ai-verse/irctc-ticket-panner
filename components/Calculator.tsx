"use client";

import { useMemo, useState } from "react";
import {
  addDays,
  planBooking,
  todayIST,
  toISODate,
  type PlanResult,
} from "@/lib/booking-dates";
import DatePicker from "./DatePicker";
import ResultCard from "./ResultCard";
import CalendarView from "./CalendarView";

/** Fast paths for the way people actually describe a trip. */
const QUICK_PICKS = [
  { label: "In 2 months", days: 61 },
  { label: "In 3 months", days: 92 },
  { label: "Next week", days: 7 },
  { label: "Tomorrow", days: 1 },
];

export default function Calculator() {
  const [journeyISO, setJourneyISO] = useState("");

  const today = useMemo(() => todayIST(), []);
  // A year out covers every real booking question and stops fat-finger years.
  const maxDate = useMemo(() => addDays(today, 366), [today]);

  const result: PlanResult | null = useMemo(
    () => (journeyISO ? planBooking(journeyISO) : null),
    [journeyISO],
  );

  const activePick = useMemo(() => {
    if (!journeyISO) return null;
    return (
      QUICK_PICKS.find((p) => toISODate(addDays(today, p.days)) === journeyISO)
        ?.label ?? null
    );
  }, [journeyISO, today]);

  const showCalendar =
    result?.classification === "advance" && result.bookingOpen && result.journey;

  return (
    <section className="panel" aria-labelledby="calc-heading">
      <div className="panel-head">
        <h2 id="calc-heading">Find your booking date</h2>
        <span className="panel-tag">60-day ARP</span>
      </div>

      <div className="panel-body">
        <span className="field-label" id="journey-label">
          Journey date
        </span>
        <DatePicker
          label="Journey date"
          value={journeyISO}
          onChange={setJourneyISO}
          min={today}
          max={maxDate}
          today={today}
        />

        <div className="chips" role="group" aria-label="Quick journey dates">
          {QUICK_PICKS.map((pick) => (
            <button
              key={pick.label}
              type="button"
              className="chip"
              aria-pressed={activePick === pick.label}
              onClick={() => setJourneyISO(toISODate(addDays(today, pick.days)))}
            >
              {pick.label}
            </button>
          ))}
        </div>

        {!result && (
          <p className="field-hint">
            We count back 60 days in IST and show the exact morning your window
            opens — plus the Tatkal fallback.
          </p>
        )}

        {result && <ResultCard result={result} />}

        {showCalendar && (
          <CalendarView
            bookingOpen={result.bookingOpen!}
            journey={result.journey!}
          />
        )}
      </div>
    </section>
  );
}
