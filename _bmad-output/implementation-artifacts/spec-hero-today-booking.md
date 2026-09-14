---
title: 'Hero "today you can book up to" dynamic headline'
type: 'feature'
created: '2026-09-14'
status: 'done'
route: 'oneshot'
baseline_commit: 'NO_VCS'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/planning-artifacts/prds/prd-irctc-date-calculator-2026-09-12/prd.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The home hero asks visitors to enter a date, but never answers the question they arrive with: *as of right now, how far ahead can I book?* That at-a-glance fact is the strongest hook (a known competitor leads with it).

**Approach:** Add a prominent element in the existing hero (`app/page.tsx`, alongside `RailScene` and `Calculator` — keep both) that states, in IST: **"Today you can book train tickets up to <DATE>"**, where DATE is the latest journey date bookable right now, with an "(opens 8:00 AM IST)" note. Optionally links/scrolls to the calculator.

**Correctness (the whole point):**
- **Client-computed.** The site is statically prerendered, so a server/build-time date would be stale for visitors. Compute on the client in IST, mirroring `components/ISTClock.tsx` (stable placeholder on server → fill after mount; `suppressHydrationWarning` only on the genuinely dynamic node).
- **8:00 AM IST release rule.** Latest bookable journey = `todayIST + 60` once it is 8:00 AM IST or later; **before** 8:00 AM IST it is `todayIST + 59` (today's batch hasn't opened yet).
- **Pure, tested helper** `latestBookableJourney(now: Date): Date` in `lib/booking-dates.ts`, reusing `ARP_DAYS` / `todayIST` / IST anchoring. Tests in `lib/booking-dates.test.ts` cover before 8 AM, exactly 8 AM, and after 8 AM IST with fixed `now` instants.

**Constraints:** Keep the design system (Sora/Inter, dark theme, existing hero classes) and accessibility. No backend. Verify with `npm test` and `npm run build`.

</frozen-after-approval>

## Implementation Notes

- `lib/booking-dates.ts`: added pure `latestBookableJourney(now)` — `todayIST + 60` at/after 8:00 AM IST, `+59` before (via IST wall-clock hour). Reuses `ARP_DAYS`/`todayIST`/`addDays`/`IST_OFFSET_MINUTES`.
- `lib/booking-dates.test.ts`: 4 tests — before 8 AM, one min before, exactly 8:00, after 8:00 (fixed UTC instants mapped to IST).
- `components/TodayBooking.tsx` (new, client): renders "Today you can book up to <date> · opens 8:00 AM IST"; stable `—` placeholder on server, fills after mount (`suppressHydrationWarning` on the dynamic `<b>`, like ISTClock); recomputes each minute so it flips at the 8 AM release / IST midnight; `aria-live="polite"`.
- `app/page.tsx`: rendered `<TodayBooking />` in the hero copy, between the eyebrow and the h1. RailScene + Calculator untouched.
- `app/globals.css`: `.today-booking` callout styling (saffron-tinted pill on the dark hero, Sora for the date, note wraps to its own line).

## Review Triage Log

Pass 1 (blind-hunter, inline for a small additive change):

- **No-JS visitors see the `—` placeholder (no date)** — `low`, rejected. The whole product (calculator) requires JS; a no-JS date-only fallback would be stale on a static site. Acceptable degradation.
- **Specific date absent from SSR HTML (SEO)** — `low`, rejected/by-design. The value is per-visitor and changes daily, so it must be client-computed; the label text still ships server-side.
- Verification: `npm test` → 36/36 (incl. 4 new 8 AM-boundary tests); `npm run build` → success, static. No hydration mismatch (stable placeholder; `suppressHydrationWarning` scoped to the dynamic node). No high/medium findings.
