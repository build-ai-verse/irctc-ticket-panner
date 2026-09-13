import { formatLongDate } from "@/lib/booking-dates";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function cellState(t: number, openT: number, journeyT: number): string {
  if (t === openT) return "open";
  if (t === journeyT) return "journey";
  if (t > openT && t < journeyT) return "window";
  return "";
}

function MonthGrid({
  year,
  month,
  openT,
  journeyT,
}: {
  year: number;
  month: number;
  openT: number;
  journeyT: number;
}) {
  const monthLabel = new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month, 1)));

  const startWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const cells: Array<{ day: number; state: string } | null> = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      day,
      state: cellState(Date.UTC(year, month, day), openT, journeyT),
    });
  }

  return (
    <div className="cal-card">
      <table className="calendar-grid">
        <caption>{monthLabel}</caption>
        <thead>
          <tr>
            {WEEKDAYS.map((w) => (
              <th key={w} scope="col" abbr={w}>
                {w}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.ceil(cells.length / 7) }).map((_, row) => (
            <tr key={row}>
              {cells.slice(row * 7, row * 7 + 7).map((cell, col) => (
                <td
                  key={col}
                  className={cell?.state ? `cal-${cell.state}` : undefined}
                  aria-current={cell?.state === "open" ? "date" : undefined}
                >
                  {cell?.day ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Renders every month from the booking-open month through the journey month,
 * highlighting the booking-open date, the travel date, and the window between.
 * Pure/UTC-based so it renders identically on any device timezone.
 */
export default function CalendarView({
  bookingOpen,
  journey,
}: {
  bookingOpen: Date;
  journey: Date;
}) {
  const openT = bookingOpen.getTime();
  const journeyT = journey.getTime();

  const months: Array<{ year: number; month: number }> = [];
  let year = bookingOpen.getUTCFullYear();
  let month = bookingOpen.getUTCMonth();
  const endYear = journey.getUTCFullYear();
  const endMonth = journey.getUTCMonth();
  // Guard against pathological ranges; a 60-day window is at most 3 months.
  let safety = 0;
  while ((year < endYear || (year === endYear && month <= endMonth)) && safety < 4) {
    months.push({ year, month });
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
    safety += 1;
  }

  return (
    <figure className="calendar" aria-label="Booking window calendar">
      <div className="calendar-months">
        {months.map((m) => (
          <MonthGrid
            key={`${m.year}-${m.month}`}
            year={m.year}
            month={m.month}
            openT={openT}
            journeyT={journeyT}
          />
        ))}
      </div>
      <figcaption>
        <ul className="calendar-legend">
          <li>
            <span className="swatch cal-open" aria-hidden="true" />
            Booking opens · {formatLongDate(bookingOpen)}
          </li>
          <li>
            <span className="swatch cal-window" aria-hidden="true" />
            60-day window
          </li>
          <li>
            <span className="swatch cal-journey" aria-hidden="true" />
            Travel · {formatLongDate(journey)}
          </li>
        </ul>
      </figcaption>
    </figure>
  );
}
