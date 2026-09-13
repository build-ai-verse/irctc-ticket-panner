import { describe, it, expect } from "vitest";
import {
  parseISODate,
  toISODate,
  todayIST,
  bookingOpenDate,
  tatkalWindow,
  classifyJourney,
  planBooking,
  formatLongDate,
} from "./booking-dates";

// A fixed "now" whose IST calendar date is 2026-01-01.
// 2026-01-01T04:00:00Z == 2026-01-01 09:30 IST.
const NOW = new Date("2026-01-01T04:00:00Z");

describe("parseISODate", () => {
  it("parses a valid date", () => {
    expect(toISODate(parseISODate("2026-05-30")!)).toBe("2026-05-30");
  });
  it("rejects empty / null", () => {
    expect(parseISODate("")).toBeNull();
    expect(parseISODate(null)).toBeNull();
    expect(parseISODate(undefined)).toBeNull();
  });
  it("rejects malformed and overflow dates", () => {
    expect(parseISODate("30-05-2026")).toBeNull();
    expect(parseISODate("2026-13-01")).toBeNull();
    expect(parseISODate("2026-02-31")).toBeNull();
  });
});

describe("bookingOpenDate — canonical example", () => {
  it("30 May 2026 → 31 March 2026", () => {
    const open = bookingOpenDate(parseISODate("2026-05-30")!);
    expect(toISODate(open)).toBe("2026-03-31");
  });
});

describe("tatkalWindow", () => {
  it("opens one day before with correct class timings", () => {
    const t = tatkalWindow(parseISODate("2026-05-30")!);
    expect(toISODate(t.date)).toBe("2026-05-29");
    expect(t.acTime).toContain("10:00");
    expect(t.nonAcTime).toContain("11:00");
  });
});

describe("todayIST — timezone anchoring", () => {
  it("uses the IST calendar date, not the UTC date, near the day boundary", () => {
    // 2026-01-01T20:00:00Z is 2026-01-02 01:30 IST — a different calendar day.
    const nowLateUTC = new Date("2026-01-01T20:00:00Z");
    expect(toISODate(todayIST(nowLateUTC))).toBe("2026-01-02");
  });
  it("resolves the plain-daytime instant to the same IST date", () => {
    expect(toISODate(todayIST(NOW))).toBe("2026-01-01");
  });
});

describe("classifyJourney (I/O & edge-case matrix)", () => {
  const today = todayIST(NOW); // 2026-01-01

  it("advance: journey more than 60 days out", () => {
    expect(classifyJourney(parseISODate("2026-05-30"), today)).toBe("advance");
  });
  it("advance boundary: exactly 61 days out", () => {
    expect(classifyJourney(parseISODate("2026-03-03"), today)).toBe("advance"); // Jan 1 + 61
  });
  it("already-open: within the 60-day window (but not last-minute)", () => {
    expect(classifyJourney(parseISODate("2026-02-15"), today)).toBe(
      "already-open",
    );
  });
  it("already-open boundary: exactly 60 days out", () => {
    expect(classifyJourney(parseISODate("2026-03-02"), today)).toBe(
      "already-open",
    ); // Jan 1 + 60
  });
  it("last-minute: tomorrow", () => {
    expect(classifyJourney(parseISODate("2026-01-02"), today)).toBe(
      "last-minute",
    );
  });
  it("last-minute: today", () => {
    expect(classifyJourney(parseISODate("2026-01-01"), today)).toBe(
      "last-minute",
    );
  });
  it("past: before today", () => {
    expect(classifyJourney(parseISODate("2025-12-31"), today)).toBe("past");
  });
  it("invalid: null journey", () => {
    expect(classifyJourney(null, today)).toBe("invalid");
  });
});

describe("planBooking (end-to-end per matrix)", () => {
  it("advance path returns booking-open date and Tatkal window", () => {
    const r = planBooking("2026-05-30", NOW);
    expect(r.classification).toBe("advance");
    expect(toISODate(r.bookingOpen!)).toBe("2026-03-31");
    expect(toISODate(r.tatkal!.date)).toBe("2026-05-29");
  });
  it("already-open path", () => {
    const r = planBooking("2026-02-15", NOW);
    expect(r.classification).toBe("already-open");
    expect(r.bookingOpen).not.toBeNull();
  });
  it("last-minute path (tomorrow)", () => {
    const r = planBooking("2026-01-02", NOW);
    expect(r.classification).toBe("last-minute");
    expect(r.tatkal).not.toBeNull();
  });
  it("tatkalPassed is true when the journey is today (Tatkal opened yesterday)", () => {
    const r = planBooking("2026-01-01", NOW);
    expect(r.classification).toBe("last-minute");
    expect(r.tatkalPassed).toBe(true);
  });
  it("tatkalPassed is false when the journey is tomorrow", () => {
    const r = planBooking("2026-01-02", NOW);
    expect(r.tatkalPassed).toBe(false);
  });
  it("tatkalPassed is false for an advance journey", () => {
    const r = planBooking("2026-05-30", NOW);
    expect(r.tatkalPassed).toBe(false);
  });
  it("past path returns no computation", () => {
    const r = planBooking("2025-12-31", NOW);
    expect(r.classification).toBe("past");
    expect(r.bookingOpen).toBeNull();
    expect(r.tatkal).toBeNull();
  });
  it("invalid / empty input", () => {
    const r = planBooking("", NOW);
    expect(r.classification).toBe("invalid");
    expect(r.journey).toBeNull();
  });
  it("non-IST device: same absolute instant, same IST-anchored result", () => {
    // Two hosts, different local clocks, but the same absolute instant → identical answer.
    const a = planBooking("2026-05-30", new Date("2026-01-01T04:00:00Z"));
    const b = planBooking("2026-05-30", new Date("2026-01-01T04:00:00Z"));
    expect(toISODate(a.bookingOpen!)).toBe(toISODate(b.bookingOpen!));
    expect(toISODate(a.bookingOpen!)).toBe("2026-03-31");
  });
});

describe("formatLongDate", () => {
  it("prints the stored calendar date regardless of host timezone", () => {
    expect(formatLongDate(parseISODate("2026-03-31")!)).toContain("31 March 2026");
  });
});
