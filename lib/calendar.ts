import { formatLongDate, IST_OFFSET_MINUTES } from "./booking-dates";

/**
 * Calendar reminders for the moment a booking window opens.
 *
 * Two destinations, one source of truth: a Google Calendar template URL, and an
 * RFC 5545 file for everything else. Both are built from the same instant and
 * the same wording, so the two routes can never describe different events.
 *
 * Times are emitted in UTC (`...Z`). IST has no daylight saving, so 8:00 AM IST
 * is always 02:30 UTC — the conversion is exact, no VTIMEZONE block is needed,
 * and a traveller whose calendar is set to another timezone still gets an alarm
 * at the real instant the window opens in India.
 */

const CRLF = "\r\n";
const REMINDER_MINUTES = 15;

export interface BookingReminder {
  /** Calendar date (UTC midnight) the window opens on. */
  openDate: Date;
  /** The journey the reminder is for. */
  journeyDate: Date;
  /** IST wall-clock hour the window opens (8 for ARP, 10/11 for Tatkal). */
  hourIST: number;
  minuteIST?: number;
  title: string;
}

/** An IST wall-clock time on a calendar date, as an absolute instant. */
function istInstant(date: Date, hourIST: number, minuteIST: number): Date {
  return new Date(
    date.getTime() + (hourIST * 60 + minuteIST - IST_OFFSET_MINUTES) * 60 * 1000,
  );
}

function windowFor({ openDate, hourIST, minuteIST = 0 }: BookingReminder) {
  const start = istInstant(openDate, hourIST, minuteIST);
  return { start, end: new Date(start.getTime() + REMINDER_MINUTES * 60 * 1000) };
}

function describe(journeyDate: Date): string {
  return (
    `Booking opens for your train journey on ${formatLongDate(journeyDate)}. ` +
    `Be signed in to IRCTC with passenger details saved before the window opens. ` +
    `Planned with IRCTC Ticket Planner (not affiliated with IRCTC).`
  );
}

/** Compact UTC stamp: 20260914T023000Z */
function stamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/**
 * A Google Calendar "add event" URL. Opening it lands the user on a prefilled
 * event they confirm — nothing is written to their calendar without consent,
 * and it works on Android and desktop without a download.
 */
export function buildGoogleCalendarUrl(reminder: BookingReminder): string {
  const { start, end } = windowFor(reminder);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: reminder.title,
    // UTC instants, so Google renders them in whatever timezone the calendar
    // uses. Passing `ctz` as well would be ambiguous, so we don't.
    dates: `${stamp(start)}/${stamp(end)}`,
    details: describe(reminder.journeyDate),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Escape the characters ICS treats specially. */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** The same event as an .ics file, for Apple Calendar, Outlook and the rest. */
export function buildBookingICS(reminder: BookingReminder): string {
  const { start, end } = windowFor(reminder);
  const description = escapeText(describe(reminder.journeyDate));

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//IRCTC Ticket Planner//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${stamp(start)}-${Math.random().toString(36).slice(2, 10)}@irctc-ticket-planner`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escapeText(reminder.title)}`,
    `DESCRIPTION:${description}`,
    "BEGIN:VALARM",
    `TRIGGER:-PT${REMINDER_MINUTES}M`,
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeText(reminder.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join(CRLF) + CRLF;
}

/** Trigger a client-side download of an .ics file. No network round-trip. */
export function downloadICS(filename: string, contents: string): void {
  const blob = new Blob([contents], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Revoke on the next tick so Safari has finished reading the blob.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
