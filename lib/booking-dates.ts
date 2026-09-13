// Pure, timezone-safe IRCTC booking-date logic.
//
// Every calculation is anchored to IST (UTC+05:30) and performed on calendar
// dates represented as Date objects at UTC midnight of that Y-M-D. We only ever
// read/write those Dates through UTC methods, so results are identical on any
// device timezone — a visitor in New York and one in Delhi see the same answer.

export const IST_OFFSET_MINUTES = 5 * 60 + 30; // +05:30
export const ARP_DAYS = 60;
export const BOOKING_OPEN_TIME_IST = "8:00 AM IST";
export const TATKAL_AC_TIME_IST = "10:00 AM IST";
export const TATKAL_NON_AC_TIME_IST = "11:00 AM IST";

export const ACCURACY_NOTE =
  "Calculated from your journey date. If you board at a mid-route station on a long-distance train, booking may open 1–2 days earlier.";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type JourneyClass =
  | "advance"
  | "already-open"
  | "last-minute"
  | "past"
  | "invalid";

/** Parse a "YYYY-MM-DD" string into a UTC-midnight calendar Date. Returns null if invalid. */
export function parseISODate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  // Reject overflow dates such as 2026-02-31.
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

/** Format a calendar Date as "YYYY-MM-DD" (UTC-based). */
export function toISODate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Current calendar date in IST, returned as a UTC-midnight Date.
 * Derived from the absolute instant, so the host's local timezone is irrelevant.
 */
export function todayIST(now: Date = new Date()): Date {
  const istWallClock = new Date(now.getTime() + IST_OFFSET_MINUTES * 60 * 1000);
  return new Date(
    Date.UTC(
      istWallClock.getUTCFullYear(),
      istWallClock.getUTCMonth(),
      istWallClock.getUTCDate(),
    ),
  );
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

/** Whole calendar days between two UTC-midnight dates (a - b). */
export function diffDays(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / MS_PER_DAY);
}

/** Booking-open date = journey date − 60 days (opens 8:00 AM IST). */
export function bookingOpenDate(journey: Date): Date {
  return addDays(journey, -ARP_DAYS);
}

export interface TatkalWindow {
  date: Date; // one day before the journey
  acTime: string;
  nonAcTime: string;
}

/** Tatkal window: opens one day before the journey; 10:00 AM IST (AC) / 11:00 AM IST (non-AC / Sleeper). */
export function tatkalWindow(journey: Date): TatkalWindow {
  return {
    date: addDays(journey, -1),
    acTime: TATKAL_AC_TIME_IST,
    nonAcTime: TATKAL_NON_AC_TIME_IST,
  };
}

/** Classify a journey relative to today (both IST calendar dates). */
export function classifyJourney(
  journey: Date | null,
  today: Date,
): JourneyClass {
  if (!journey) return "invalid";
  const delta = diffDays(journey, today); // days from today to journey
  if (delta < 0) return "past";
  if (delta <= 1) return "last-minute"; // today or tomorrow — advance window not applicable
  if (delta <= ARP_DAYS) return "already-open"; // booking-open date is today or in the past
  return "advance";
}

export interface PlanResult {
  classification: JourneyClass;
  journey: Date | null;
  bookingOpen: Date | null;
  tatkal: TatkalWindow | null;
  // True when the Tatkal window has already elapsed (e.g. the journey is today,
  // so Tatkal opened yesterday). Lets the UI avoid future-tense phrasing.
  tatkalPassed: boolean;
}

/**
 * Top-level planner the UI calls. Accepts the raw "YYYY-MM-DD" input and an
 * optional `now` (for testing); returns everything needed to render a result.
 */
export function planBooking(
  journeyISO: string | null | undefined,
  now: Date = new Date(),
): PlanResult {
  const journey = parseISODate(journeyISO);
  const today = todayIST(now);
  const classification = classifyJourney(journey, today);

  if (!journey || classification === "invalid") {
    return {
      classification: "invalid",
      journey: null,
      bookingOpen: null,
      tatkal: null,
      tatkalPassed: false,
    };
  }
  if (classification === "past") {
    return {
      classification,
      journey,
      bookingOpen: null,
      tatkal: null,
      tatkalPassed: false,
    };
  }
  const tatkal = tatkalWindow(journey);
  return {
    classification,
    journey,
    bookingOpen: bookingOpenDate(journey),
    tatkal,
    tatkalPassed: diffDays(tatkal.date, today) < 0,
  };
}

/** Human-friendly calendar date, e.g. "Tue, 31 March 2026". Timezone-independent. */
export function formatLongDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/**
 * Split a calendar Date into display parts, e.g.
 * { weekday: "Tue", day: "31", month: "March", year: "2026" }.
 * Lets the UI typeset the day number large without re-parsing a formatted string.
 */
export function formatDateParts(date: Date): {
  weekday: string;
  day: string;
  month: string;
  monthShort: string;
  year: string;
} {
  const part = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-IN", { ...options, timeZone: "UTC" }).format(date);
  return {
    weekday: part({ weekday: "short" }),
    day: part({ day: "numeric" }),
    month: part({ month: "long" }),
    monthShort: part({ month: "short" }),
    year: part({ year: "numeric" }),
  };
}

/** Whole days from today (IST) until `date`. Negative once the date has passed. */
export function daysUntil(date: Date, now: Date = new Date()): number {
  return diffDays(date, todayIST(now));
}
