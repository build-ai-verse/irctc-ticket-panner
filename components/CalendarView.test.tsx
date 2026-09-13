import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import CalendarView from "./CalendarView";
import { parseISODate } from "@/lib/booking-dates";

describe("CalendarView", () => {
  it("renders every month from booking-open to journey and highlights both dates", () => {
    const bookingOpen = parseISODate("2026-03-31")!; // canonical example
    const journey = parseISODate("2026-05-30")!;
    const { container } = render(
      <CalendarView bookingOpen={bookingOpen} journey={journey} />,
    );

    // March, April, May 2026 — three month grids.
    expect(container.querySelectorAll(".calendar-grid caption").length).toBe(3);

    // Booking-open day highlighted.
    expect(container.querySelector("td.cal-open")?.textContent).toBe("31");

    // Travel day highlighted (in a later month, which the single-month bug missed).
    expect(container.querySelector("td.cal-journey")?.textContent).toBe("30");

    // Days between are shaded as the window.
    expect(container.querySelectorAll("td.cal-window").length).toBeGreaterThan(0);
  });
});
