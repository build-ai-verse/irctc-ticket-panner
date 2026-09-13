"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ACCURACY_NOTE,
  BOOKING_OPEN_TIME_IST,
  daysUntil,
  formatDateParts,
  formatLongDate,
  toISODate,
  type PlanResult,
} from "@/lib/booking-dates";
import {
  buildBookingICS,
  buildGoogleCalendarUrl,
  downloadICS,
  type BookingReminder,
} from "@/lib/calendar";

const IRCTC_URL = "https://www.irctc.co.in/nget/train-search";

function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" rx="2.5" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" strokeLinecap="round" />
    </svg>
  );
}

function IconExternal() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M14 4h6v6M20 4l-9 9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" strokeLinecap="round" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 4v11m0 0 4-4m-4 4-4-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17v1.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V17" strokeLinecap="round" />
    </svg>
  );
}

/** Google's four-colour mark, so the option is recognisable at a glance. */
function IconGoogle() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285f4"
        d="M23.04 12.26c0-.82-.07-1.6-.21-2.36H12v4.47h6.19a5.3 5.3 0 0 1-2.3 3.47v2.89h3.72c2.18-2 3.43-4.96 3.43-8.47z"
      />
      <path
        fill="#34a853"
        d="M12 24c3.1 0 5.7-1.03 7.6-2.79l-3.72-2.88c-1.03.69-2.35 1.1-3.88 1.1-2.99 0-5.52-2.02-6.43-4.73H1.73v2.97A11.5 11.5 0 0 0 12 24z"
      />
      <path
        fill="#fbbc05"
        d="M5.57 14.7a6.9 6.9 0 0 1 0-4.41V7.32H1.73a11.5 11.5 0 0 0 0 10.35l3.84-2.97z"
      />
      <path
        fill="#ea4335"
        d="M12 4.75c1.69 0 3.2.58 4.4 1.72l3.29-3.29C17.7 1.2 15.1 0 12 0 7.48 0 3.57 2.6 1.73 6.4l3.84 2.97C6.48 6.77 9.01 4.75 12 4.75z"
      />
    </svg>
  );
}

/**
 * "Add reminder" with a choice of destination.
 *
 * Google Calendar is first and is a plain link: most visitors here are on
 * Android, where a downloaded .ics file usually lands in the Downloads tray and
 * is never opened. The file stays as the second option for Apple Calendar,
 * Outlook and everything else.
 */
function ReminderMenu({ reminder }: { reminder: BookingReminder }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const googleUrl = useMemo(() => buildGoogleCalendarUrl(reminder), [reminder]);

  useEffect(() => {
    if (!open) return;

    // Move focus into the menu so a keyboard user is not left behind.
    menuRef.current?.querySelector<HTMLElement>("[role='menuitem']")?.focus();

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      const items = Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>("[role='menuitem']") ?? [],
      );
      if (!items.length) return;
      event.preventDefault();
      const at = items.indexOf(document.activeElement as HTMLElement);
      const next =
        event.key === "ArrowDown"
          ? (at + 1) % items.length
          : (at - 1 + items.length) % items.length;
      items[next].focus();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function downloadFile() {
    downloadICS(
      `irctc-booking-${toISODate(reminder.openDate)}.ics`,
      buildBookingICS(reminder),
    );
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="menu-wrap" ref={wrapRef}>
      <button
        ref={triggerRef}
        type="button"
        className="btn btn-primary"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <IconCalendar />
        Add reminder
        <span className="btn-caret" aria-hidden="true" />
      </button>

      {open && (
        <div className="menu" role="menu" aria-label="Add reminder to a calendar" ref={menuRef}>
          <a
            role="menuitem"
            className="menu-item"
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            <IconGoogle />
            <span>
              <b>Google Calendar</b>
              <small>Opens a prefilled event in a new tab</small>
            </span>
          </a>
          <button role="menuitem" type="button" className="menu-item" onClick={downloadFile}>
            <IconDownload />
            <span>
              <b>Apple, Outlook or other</b>
              <small>Downloads an .ics file</small>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

/** The headline answer, typeset large: 31 / March / Tue. */
function BigDate({ date }: { date: Date }) {
  const parts = formatDateParts(date);
  return (
    <p className="big-date">
      <span className="dnum">{parts.day}</span>
      <span className="dmon">
        {parts.month} {parts.year}
      </span>
      <span className="dday">{parts.weekday}</span>
    </p>
  );
}

function TatkalMeta({ result }: { result: PlanResult }) {
  if (!result.tatkal) return null;
  return (
    <>
      <div className="meta">
        <dt>Tatkal · AC</dt>
        <dd>
          {result.tatkal.acTime}
          <small>{formatLongDate(result.tatkal.date)}</small>
        </dd>
      </div>
      <div className="meta">
        <dt>Tatkal · Sleeper</dt>
        <dd>
          {result.tatkal.nonAcTime}
          <small>{formatLongDate(result.tatkal.date)}</small>
        </dd>
      </div>
    </>
  );
}

export default function ResultCard({ result }: { result: PlanResult }) {
  const [copied, setCopied] = useState(false);

  if (result.classification === "invalid") {
    return (
      <p className="result-note" role="status">
        Please pick a valid journey date to see your booking date.
      </p>
    );
  }

  if (result.classification === "past") {
    return (
      <div className="result" data-tone="neutral" role="status">
        <p className="result-status">
          <span className="dot" aria-hidden="true" />
          Date passed
        </p>
        <p className="result-line">
          <strong>That date has already gone by.</strong>
        </p>
        <p className="result-note">
          Enter an upcoming journey date to find its booking-open date.
        </p>
      </div>
    );
  }

  const { classification, journey, bookingOpen, tatkal, tatkalPassed } = result;

  const tone =
    classification === "advance"
      ? "plan"
      : classification === "already-open"
        ? "open"
        : "urgent";

  const statusLabel =
    classification === "advance"
      ? "Booking opens"
      : classification === "already-open"
        ? "Open now"
        : "Last minute";

  const daysToOpen = bookingOpen ? daysUntil(bookingOpen) : null;
  const daysToJourney = journey ? daysUntil(journey) : null;

  function copyPlan() {
    if (!journey) return;
    const lines = [
      `Train journey: ${formatLongDate(journey)}`,
      classification === "advance" && bookingOpen
        ? `Booking opens: ${formatLongDate(bookingOpen)} at ${BOOKING_OPEN_TIME_IST}`
        : classification === "already-open"
          ? `Booking: already open — book now on IRCTC`
          : `Advance window has closed — use Tatkal`,
      tatkal
        ? `Tatkal: ${formatLongDate(tatkal.date)} — ${tatkal.acTime} (AC) / ${tatkal.nonAcTime} (Sleeper)`
        : "",
      "",
      "via IRCTC Ticket Planner (not affiliated with IRCTC)",
    ].filter(Boolean);
    const text = lines.join("\n");

    navigator.clipboard
      ?.writeText(text)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2200);
      })
      .catch(() => {
        /* Clipboard blocked (insecure context or denied) — leave the label as-is. */
      });
  }

  // Remind for whichever window is the one that still matters: the 8 AM advance
  // opening while it is still ahead, otherwise the 10 AM Tatkal window. Null
  // once nothing is left to wait for, and the button is dropped entirely.
  const reminder: BookingReminder | null = (() => {
    if (!journey) return null;
    const useAdvance = classification === "advance" && bookingOpen;
    const target = useAdvance ? bookingOpen : tatkalPassed ? null : tatkal?.date;
    if (!target) return null;
    return {
      openDate: target,
      journeyDate: journey,
      hourIST: useAdvance ? 8 : 10,
      title: useAdvance
        ? `IRCTC booking opens — journey ${formatLongDate(journey)}`
        : `IRCTC Tatkal opens (AC) — journey ${formatLongDate(journey)}`,
    };
  })();

  return (
    <div className="result" data-tone={tone} role="status">
      <p className="result-status">
        <span className="dot" aria-hidden="true" />
        {statusLabel}
      </p>

      {classification === "advance" && bookingOpen && (
        <>
          <BigDate date={bookingOpen} />
          <p className="result-line">
            Your window opens at <strong>{BOOKING_OPEN_TIME_IST}</strong> — 60 days
            before travel on <strong>{formatLongDate(journey!)}</strong>.
          </p>
          {daysToOpen !== null && (
            <p className="countdown">
              <span aria-hidden="true">⏱</span>
              {daysToOpen === 0 ? (
                <b>Today</b>
              ) : (
                <>
                  in <b>{daysToOpen}</b> {daysToOpen === 1 ? "day" : "days"}
                </>
              )}
            </p>
          )}
        </>
      )}

      {classification === "already-open" && (
        <>
          <BigDate date={journey!} />
          <p className="result-line">
            Booking is <strong>already open</strong> for this journey — the 60-day
            window has started, so you can book on IRCTC right now.
          </p>
          {daysToJourney !== null && (
            <p className="countdown">
              <span aria-hidden="true">⏱</span>
              travel in <b>{daysToJourney}</b>{" "}
              {daysToJourney === 1 ? "day" : "days"}
            </p>
          )}
        </>
      )}

      {classification === "last-minute" && (
        <>
          <BigDate date={journey!} />
          <p className="result-line">
            {tatkalPassed ? (
              <>
                This journey is <strong>today</strong> — advance and Tatkal
                booking have both closed. Check the current-booking counter or
                live availability on IRCTC.
              </>
            ) : (
              <>
                Too close for the 60-day advance window — <strong>Tatkal</strong>{" "}
                is your route in.
              </>
            )}
          </p>
        </>
      )}

      <dl className="meta-grid">
        {classification === "advance" && bookingOpen && (
          <div className="meta">
            <dt>Opens at</dt>
            <dd>
              8:00 AM
              <small>IST, {formatDateParts(bookingOpen).weekday}</small>
            </dd>
          </div>
        )}
        {classification === "already-open" && (
          <div className="meta">
            <dt>Advance quota</dt>
            <dd>
              Open
              <small>book any time now</small>
            </dd>
          </div>
        )}
        <TatkalMeta result={result} />
      </dl>

      <div className="actions">
        {reminder && <ReminderMenu reminder={reminder} />}
        <button type="button" className="btn" onClick={copyPlan}>
          <IconCopy />
          {copied ? "Copied" : "Copy plan"}
        </button>
        <a
          className="btn"
          href={IRCTC_URL}
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          <IconExternal />
          Open IRCTC
        </a>
      </div>

      <p className="result-accuracy">{ACCURACY_NOTE}</p>
    </div>
  );
}
