import { describe, it, expect } from "vitest";
import { buildBookingICS, buildGoogleCalendarUrl } from "./calendar";
import { parseISODate } from "./booking-dates";

// The canonical example used across the suite: booking for a 13 Nov 2026
// journey opens on 14 Sep 2026 at 8:00 AM IST.
const openDate = parseISODate("2026-09-14")!;
const journeyDate = parseISODate("2026-11-13")!;

const advance = {
  openDate,
  journeyDate,
  hourIST: 8,
  title: "IRCTC booking opens",
};

function googleParams(url: string) {
  return new URL(url).searchParams;
}

describe("calendar reminders", () => {
  it("converts the 8:00 AM IST opening to the correct UTC instant", () => {
    // 08:00 IST = 02:30 UTC, same calendar day. A 15-minute event.
    expect(googleParams(buildGoogleCalendarUrl(advance)).get("dates")).toBe(
      "20260914T023000Z/20260914T024500Z",
    );
  });

  it("converts the 10:00 AM IST Tatkal opening too", () => {
    const url = buildGoogleCalendarUrl({ ...advance, hourIST: 10 });
    expect(googleParams(url).get("dates")).toBe(
      "20260914T043000Z/20260914T044500Z",
    );
  });

  it("points at the Google Calendar event template", () => {
    const url = new URL(buildGoogleCalendarUrl(advance));
    expect(url.origin + url.pathname).toBe(
      "https://calendar.google.com/calendar/render",
    );
    expect(url.searchParams.get("action")).toBe("TEMPLATE");
    expect(url.searchParams.get("text")).toBe("IRCTC booking opens");
    // The journey date belongs in the description, so the event explains itself.
    expect(url.searchParams.get("details")).toContain("13 November 2026");
  });

  it("gives the .ics file the same instant as the Google link", () => {
    const ics = buildBookingICS(advance);
    expect(ics).toContain("DTSTART:20260914T023000Z");
    expect(ics).toContain("DTEND:20260914T024500Z");
  });

  it("emits a valid, CRLF-delimited VEVENT with a 15-minute alarm", () => {
    const ics = buildBookingICS(advance);
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("TRIGGER:-PT15M");
    expect(ics.split("\n").every((line) => line === "" || line.endsWith("\r")))
      .toBe(true);
  });

  it("escapes the characters ICS treats as field separators", () => {
    const ics = buildBookingICS({
      ...advance,
      title: "Booking opens; AC, Sleeper",
    });
    expect(ics).toContain("SUMMARY:Booking opens\\; AC\\, Sleeper");
    // The generated description contains commas from the formatted date.
    expect(ics).toContain("DESCRIPTION:");
    expect(ics).not.toMatch(/DESCRIPTION:[^\r\n]*[^\\],/);
  });
});
