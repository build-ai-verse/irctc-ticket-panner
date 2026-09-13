"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  addDays,
  diffDays,
  formatDateParts,
  formatLongDate,
  parseISODate,
  toISODate,
} from "@/lib/booking-dates";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function startOfMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function addMonths(date: Date, delta: number): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + delta, 1));
}

function monthLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function sameDay(a: Date | null, b: Date | null): boolean {
  return !!a && !!b && a.getTime() === b.getTime();
}

function clamp(date: Date, min: Date, max: Date): Date {
  if (date.getTime() < min.getTime()) return min;
  if (date.getTime() > max.getTime()) return max;
  return date;
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path
        d={dir === "left" ? "M15 5 8 12l7 7" : "M9 5l7 7-7 7"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface DatePickerProps {
  /** Selected date as "YYYY-MM-DD", or "" when nothing is chosen yet. */
  value: string;
  onChange: (iso: string) => void;
  min: Date;
  max: Date;
  today: Date;
  label: string;
}

/**
 * A calendar date picker built for this one job.
 *
 * The native `<input type="date">` renders differently in every browser, hides
 * the month behind an OS chrome on mobile, and gives us nowhere to show "today"
 * or the travel window. This control is always visible, always the same, and
 * fully keyboard-operable (arrows move a day, PageUp/Down a month, Home/End the
 * week, Enter picks, Escape closes).
 *
 * All dates are UTC-midnight calendar dates, matching lib/booking-dates.
 */
export default function DatePicker({
  value,
  onChange,
  min,
  max,
  today,
  label,
}: DatePickerProps) {
  const selected = useMemo(() => parseISODate(value), [value]);
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState<Date>(() => selected ?? today);
  const [viewMonth, setViewMonth] = useState<Date>(() =>
    startOfMonth(selected ?? today),
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const shouldFocusDay = useRef(false);
  const dialogId = useId();

  // Reopening should always land on the current selection, not a stale month.
  useEffect(() => {
    if (!open) return;
    const start = selected ?? clamp(today, min, max);
    setCursor(start);
    setViewMonth(startOfMonth(start));
    shouldFocusDay.current = true;
  }, [open, selected, today, min, max]);

  // Move DOM focus onto the cursor day after the grid renders.
  useEffect(() => {
    if (!open || !shouldFocusDay.current) return;
    shouldFocusDay.current = false;
    gridRef.current
      ?.querySelector<HTMLButtonElement>('button[tabindex="0"]')
      ?.focus();
  }, [open, cursor, viewMonth]);

  const close = useCallback(
    (returnFocus = true) => {
      setOpen(false);
      if (returnFocus) triggerRef.current?.focus();
    },
    [],
  );

  // Dismiss on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        close();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  const inRange = useCallback(
    (date: Date) => date.getTime() >= min.getTime() && date.getTime() <= max.getTime(),
    [min, max],
  );

  function moveCursor(days: number) {
    const next = clamp(addDays(cursor, days), min, max);
    setCursor(next);
    setViewMonth(startOfMonth(next));
    shouldFocusDay.current = true;
  }

  function moveCursorMonths(months: number) {
    const next = clamp(addMonths(cursor, months), min, max);
    // Keep the day-of-month where possible, e.g. 31 Jan -> 28 Feb.
    const target = new Date(
      Date.UTC(
        next.getUTCFullYear(),
        next.getUTCMonth(),
        Math.min(
          cursor.getUTCDate(),
          new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0)).getUTCDate(),
        ),
      ),
    );
    const clamped = clamp(target, min, max);
    setCursor(clamped);
    setViewMonth(startOfMonth(clamped));
    shouldFocusDay.current = true;
  }

  function pick(date: Date) {
    if (!inRange(date)) return;
    onChange(toISODate(date));
    close();
  }

  function onGridKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        moveCursor(-1);
        break;
      case "ArrowRight":
        event.preventDefault();
        moveCursor(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveCursor(-7);
        break;
      case "ArrowDown":
        event.preventDefault();
        moveCursor(7);
        break;
      case "Home":
        event.preventDefault();
        moveCursor(-cursor.getUTCDay());
        break;
      case "End":
        event.preventDefault();
        moveCursor(6 - cursor.getUTCDay());
        break;
      case "PageUp":
        event.preventDefault();
        moveCursorMonths(-1);
        break;
      case "PageDown":
        event.preventDefault();
        moveCursorMonths(1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        pick(cursor);
        break;
      default:
        break;
    }
  }

  // --- Grid cells for the visible month, split into calendar weeks ---------
  // Rows are real rows in the markup: `role="grid"` requires `role="row"`
  // children, and it is the row/gridcell structure that lets a screen reader
  // announce "week 3, Tuesday" as you arrow around.
  const weeks = useMemo(() => {
    const year = viewMonth.getUTCFullYear();
    const month = viewMonth.getUTCMonth();
    const lead = new Date(Date.UTC(year, month, 1)).getUTCDay();
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

    const flat: Array<Date | null> = Array.from({ length: lead }, () => null);
    for (let day = 1; day <= daysInMonth; day++) {
      flat.push(new Date(Date.UTC(year, month, day)));
    }
    while (flat.length % 7 !== 0) flat.push(null);

    const rows: Array<Array<Date | null>> = [];
    for (let i = 0; i < flat.length; i += 7) rows.push(flat.slice(i, i + 7));
    return rows;
  }, [viewMonth]);

  const prevDisabled = addMonths(viewMonth, -1).getTime() < startOfMonth(min).getTime();
  const nextDisabled = addMonths(viewMonth, 1).getTime() > startOfMonth(max).getTime();

  const parts = selected ? formatDateParts(selected) : null;
  const daysAway = selected ? diffDays(selected, today) : null;

  return (
    <div className="dp" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`dp-trigger${selected ? "" : " is-empty"}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        aria-label={
          selected ? `${label}: ${formatLongDate(selected)}. Change date.` : label
        }
        onClick={() => setOpen((v) => !v)}
      >
        <span className="dp-cal-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="5" width="18" height="16" rx="3" />
            <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
          </svg>
        </span>
        <span className="dp-value">
          <span className="dp-main">
            {parts
              ? `${parts.weekday}, ${parts.day} ${parts.month} ${parts.year}`
              : "Select your journey date"}
          </span>
          <span className="dp-sub">
            {daysAway === null
              ? "Tap to open the calendar"
              : daysAway === 0
                ? "Travelling today"
                : `${daysAway} ${daysAway === 1 ? "day" : "days"} from today`}
          </span>
        </span>
        <span className="dp-caret" aria-hidden="true" />
      </button>

      {open && (
        <div
          className="dp-pop"
          id={dialogId}
          role="dialog"
          aria-modal="false"
          aria-label={`${label} calendar`}
        >
          <div className="dp-head">
            <button
              type="button"
              className="dp-nav"
              onClick={() => setViewMonth(addMonths(viewMonth, -1))}
              disabled={prevDisabled}
              aria-label="Previous month"
            >
              <Chevron dir="left" />
            </button>
            <span className="dp-title" aria-live="polite">
              {monthLabel(viewMonth)}
            </span>
            <button
              type="button"
              className="dp-nav"
              onClick={() => setViewMonth(addMonths(viewMonth, 1))}
              disabled={nextDisabled}
              aria-label="Next month"
            >
              <Chevron dir="right" />
            </button>
          </div>

          <div className="dp-weekdays" aria-hidden="true">
            {WEEKDAYS.map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </div>

          <div
            className="dp-days"
            ref={gridRef}
            role="grid"
            aria-label={monthLabel(viewMonth)}
            onKeyDown={onGridKeyDown}
          >
            {weeks.map((week, w) => (
              <div className="dp-row" role="row" key={w}>
                {week.map((date, d) => {
                  if (!date) {
                    return (
                      <span
                        key={`blank-${w}-${d}`}
                        role="gridcell"
                        aria-disabled="true"
                        className="dp-day is-blank"
                      />
                    );
                  }
                  const isSelected = sameDay(date, selected);
                  const isToday = sameDay(date, today);
                  const isCursor = sameDay(date, cursor);
                  const disabled = !inRange(date);

                  return (
                    <span
                      key={toISODate(date)}
                      role="gridcell"
                      aria-selected={isSelected}
                      className="dp-cell"
                    >
                      <button
                        type="button"
                        className={[
                          "dp-day",
                          isSelected ? "is-selected" : "",
                          isToday ? "is-today" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        disabled={disabled}
                        // Roving tabindex: the grid is a single tab stop.
                        tabIndex={isCursor ? 0 : -1}
                        aria-current={isToday ? "date" : undefined}
                        aria-label={`${WEEKDAY_NAMES[date.getUTCDay()]}, ${formatLongDate(date)}`}
                        onClick={() => pick(date)}
                        onFocus={() => setCursor(date)}
                      >
                        {date.getUTCDate()}
                      </button>
                    </span>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="dp-foot">
            <button
              type="button"
              onClick={() => {
                setViewMonth(startOfMonth(clamp(today, min, max)));
                setCursor(clamp(today, min, max));
                shouldFocusDay.current = true;
              }}
            >
              Jump to today
            </button>
            <button type="button" onClick={() => close()}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
