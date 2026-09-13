---
title: 'IRCTC Ticket Planner — Calculator Site (v1)'
type: 'feature'
created: '2026-09-13'
status: 'done'
route: 'dispatch'
baseline_commit: 'NO_VCS'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/planning-artifacts/prds/prd-irctc-date-calculator-2026-09-12/prd.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Indian Railways passengers miss the moment their advance booking window opens because working the date out by hand is error-prone, and the existing tools are ad-cluttered and slow on mobile.

**Approach:** Ship a fast, ad-free, mobile-first site whose core is a single-input calculator — enter a journey date, instantly see the booking-open date and Tatkal window on a calendar with an honest accuracy note — surrounded by SEO content pages, deployed on Vercel. (Email reminder capture is deferred — see deferred-work.md.)

## Boundaries & Constraints

**Always:**
- Date math is IST-anchored and timezone-safe regardless of device timezone: booking-open date = journey date − 60 days at 08:00 IST; Tatkal = journey date − 1 day at 10:00 IST (AC) / 11:00 IST (non-AC / Sleeper).
- Calculation runs client-side (no backend needed for the calc).
- Every result shows a plain-text answer alongside the calendar, and always displays the accuracy note: *"Calculated from your journey date. If you board at a mid-route station on a long-distance train, booking may open 1–2 days earlier."*
- Mobile-first, one-handed usable, ad-free, accessible (semantic HTML, keyboard-usable, readable contrast).
- SEO fundamentals ship day one: keyword-rich `<title>`/H1, meta description, semantic headings, `sitemap.xml`, `robots.txt`, Open Graph tags, and FAQ/HowTo structured data.
- Strong Core Web Vitals; near-instant load on a mid-tier mobile connection.
- Built with **Next.js (App Router)**, deployed on Vercel; pages are static/server-rendered by default with the calculator as the only client component, keeping the JS baseline minimal to protect CWV.

**Never:**
- No on-site ads, ever. No ad/tracking networks.
- No train data, train lookup, or third-party railway APIs — the only input is the journey date.
- No PNR status, seat availability, or fare tools.
- No user accounts or login.
- No email/reminder capture or delivery in this build (deferred Goal B).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Advance booking (normal) | Journey date > 60 days away, e.g. 2026-05-30 | Booking-open date 2026-03-31 @ 08:00 IST, highlighted on calendar with the 60-day window; Tatkal window shown; accuracy note | N/A |
| Window already open | Journey date ≤ 60 days away | "Booking is already open" (no future advance date) + Tatkal window | N/A |
| Last-minute | Journey date is today or tomorrow | Tatkal window shown as the primary answer; advance window marked not applicable | N/A |
| Past date | Journey date before today | Friendly message: "That date has already passed" | No computation |
| Empty / invalid input | No date or unparseable | Inline prompt to pick a valid date | No computation |
| Non-IST device | Any valid date, device in another timezone | Dates/times still computed and shown anchored to IST | N/A |

</frozen-after-approval>

## Code Map

- Greenfield. No application code exists yet.
- `package.json` -- currently only declares `bmad-method`; Next.js app dependencies/scripts will be added here (app lives at repo root).
- `_bmad/`, `_bmad-output/`, `node_modules/` -- BMad tooling and deps. DO NOT modify.

## Tasks & Acceptance

**Execution:**
- [x] `package.json`, `next.config.mjs`, `tsconfig.json`, `app/layout.tsx` -- scaffold a Next.js App-Router + TypeScript project; mobile-first global styles; minimal dependencies to protect CWV -- greenfield setup.
- [x] `lib/booking-dates.ts` -- pure, timezone-safe date functions: `bookingOpenDate(journeyDate)`, `tatkalWindow(journeyDate)`, `classifyJourney(journeyDate, today)` returning the scenario (advance / already-open / last-minute / past / invalid). All IST-anchored via explicit +05:30 / date-only arithmetic, no local-`Date` pitfalls -- the correctness core.
- [x] `lib/booking-dates.test.ts` -- unit tests covering every row of the I/O & Edge-Case Matrix, including the non-IST-device case (fixed inputs) -- guards correctness.
- [x] `components/Calculator.tsx` (`"use client"`) -- the only client component: journey-date input (native date picker), runs calculation, renders result -- core UX, isolates JS.
- [x] `components/ResultCard.tsx` -- plain-text answer for booking-open date + Tatkal timings + the standing accuracy note -- text-answer requirement.
- [x] `components/CalendarView.tsx` -- month calendar highlighting the booking-open date and the 60-day window, mobile-first -- FR-3 visual.
- [x] `app/page.tsx` -- home page hosting the calculator (server component wrapping the client Calculator); keyword-rich H1 -- primary landing.
- [x] `app/page.tsx` metadata + `app/(content)/*/page.tsx` -- short SEO content pages/sections answering "when can I book my train ticket", "IRCTC 60 day rule", "Tatkal timing", each with `generateMetadata` -- long-tail SEO.
- [x] `app/layout.tsx` metadata + JSON-LD -- title template, meta description, canonical, Open Graph, FAQ/HowTo structured data -- SEO plumbing.
- [x] `app/sitemap.ts`, `app/robots.ts` -- Next.js metadata routes for `sitemap.xml` and `robots.txt` -- crawlability.
- [x] `app/layout.tsx` analytics -- Vercel Web Analytics (cookieless) + Google Search Console verification tag -- lets SM-1/SM-2 be measured without a tracking network.
- [x] `vercel.json` (if needed) / deploy config -- config for the `irctc-ticket-plan` subdomain -- hosting.

**Acceptance Criteria:**
- Given a journey date more than 60 days out, when the user submits it, then the booking-open date (journey − 60 days, 08:00 IST) is shown as text and highlighted on the calendar with the accuracy note present.
- Given the user's device is set to a non-IST timezone, when any date is calculated, then the displayed dates/times are identical to the IST-anchored expectation.
- Given a past journey date, when submitted, then a friendly "already passed" message shows and no calculation is attempted.
- Given the site is built, when audited with Lighthouse on mobile, then SEO and Performance scores are strong (target ≥ 90) and there are zero ad/tracking-network requests.
- Given a crawler, when it fetches the site, then `robots.txt`, `sitemap.xml`, canonical tags, and FAQ/HowTo structured data are present and valid.

## Implementation Notes

- Stack: Next.js 14.2 (App Router) + React 18 + TypeScript; Vitest for unit tests. Kept deps minimal to protect CWV.
- Correctness core is `lib/booking-dates.ts` — all date math anchored to IST via explicit +05:30 arithmetic on UTC-midnight calendar dates; never uses local `Date` getters. `formatLongDate` uses `timeZone: "UTC"` so display matches the stored calendar date on any host. `todayIST` derives the IST calendar day from the absolute instant.
- The only client component is `components/Calculator.tsx`; `ResultCard` and `CalendarView` are presentational. Home + 3 guide pages + robots/sitemap are static.
- SEO: title template + description + Open Graph + canonical in `app/layout.tsx`; `WebApplication` JSON-LD in layout, `FAQPage` on home + Tatkal guide, `HowTo` on the "when to book" guide; `app/sitemap.ts` + `app/robots.ts`.
- Analytics: `@vercel/analytics` (cookieless, first-party — not an ad/tracking network). GSC verification wired via `metadata.verification.google`, driven by `GOOGLE_SITE_VERIFICATION` in `lib/site.ts` (empty by default → tag omitted).
- Verification run: `npm test` → 22/22 pass (covers every I/O matrix row incl. non-IST device); `npm run build` → success, 9 static routes, First Load JS ~87–89 kB.
- NOT run in this environment (no headless browser): the Lighthouse mobile audit (Performance/SEO ≥ 90). Structural evidence supports it (static pages, minimal JS, zero ad/tracking scripts) but it should be run against a deploy/preview before launch.
- No VCS in the repo (`baseline_commit: NO_VCS`); recommend `git init` before further work.
- Post-review patches (see Review Triage Log): (1) added `tatkalPassed` to `PlanResult` + honest "window has passed" copy in `ResultCard` for same-day journeys; (2) rewrote `CalendarView` to render every month from booking-open→journey and highlight the travel day (`cal-journey`); (3) calendar now shown only for `advance`; (4) added `min={today}` to the date input; (5) `<html lang="en-IN">`; (6) fixed Vitest config (jsdom + `@vitejs/plugin-react` + `@/` alias + broadened glob) so component/`.tsx` tests actually run, and added `components/CalendarView.test.tsx`.
- Final verification after patches: `npm test` → 26/26 pass (25 unit + 1 component); `npm run build` → success, 9 static routes, First Load JS ~89.6 kB.
- Rejected/deferred (low): OG social-share image (needs an asset — optional pre-launch task); absurd far-future-year input cap. Future accuracy enhancement noted: a few trains (Taj/Gomti Express) use a 30-day ARP and foreign tourists 365 days — out of v1's journey-date-only scope.

## Spec Change Log

## Review Triage Log

Pass 1 (blind-hunter, edge-case-hunter, verification-gap):

- **ARP is 120 days, not 60 (blind-hunter)** — `false`. Verified via official newsonair.gov.in (1 Nov 2024 change) + web search: current ARP IS 60 days (reduced from 120). Code correct; reviewer's world knowledge outdated.
- **Same-day journey shows a past Tatkal date (blind-hunter + edge-case)** — `medium` → **patch**. journey=today classifies last-minute; `tatkalWindow` returns journey−1 = yesterday; ResultCard prints "Tatkal opens on [yesterday]". Reachable and misleading. Fix: flag when Tatkal has passed and word it honestly.
- **Calendar renders only booking-open's month; journey never highlighted; window partial (blind-hunter + edge-case + verification-gap 'other')** — `medium` → **patch**. Spec AC promises the 60-day window on the calendar; CalendarView shows one month. Fix: render all months booking-open→journey and highlight the journey day.
- **`already-open` shows a calendar with a past booking-open date (edge-case)** — `low` → **patch** (folded). Fix: only show the calendar for `advance` (future booking-open).
- **Vitest `include` = `lib` only, excludes component/.tsx tests → future component tests silently never run (verification-gap)** — `medium` → **patch**. Fix: broaden glob, add jsdom env + testing-library, add a CalendarView test (also closes the untested-grid gap).
- **No min/max on date input; parseISODate accepts absurd far-future years (blind-hunter + edge-case)** — `low` → **reject** (unlikely in everyday use; upper-bound guard adds complexity). Mitigation: added `min=today` on the input as a trivial nicety; absurd-year cap not added.
- **OG/Twitter images missing; `lang` vs locale mismatch (blind-hunter)** — `low`. `lang` → **patch** (set `en-IN`, trivial). OG social image → **reject** (low; needs an asset — noted as optional pre-launch task).
- **GOOGLE_SITE_VERIFICATION empty with no docs (blind-hunter)** — `false`. README already documents how to populate it.
- **Input label gives no source-station hint (blind-hunter)** — `low` → **reject** (within intent: deliberate journey-date-only design with the accuracy note; guides explain it).

No `intent_gap` or `bad_spec` entries → no loopback. Patches applied directly (implementation was inline; no impl subagent to re-engage).

## Design Notes

- Correctness is the crux: compute in IST explicitly (e.g. work in a fixed +05:30 offset / use date-only arithmetic) rather than relying on the runtime's local `Date`, which would silently break for non-IST visitors. Keep the date functions pure and fully unit-tested — the UI is thin over them.
- "60 days" is journey date minus 60 calendar days (worked example: 2026-05-30 → 2026-03-31). ARP excludes the journey day; the minus-60 arithmetic already reflects that.
- Brand vs. SEO: brand name is "IRCTC Ticket Planner" but the `<title>`/H1 stay keyword-rich, e.g. "IRCTC Ticket Planner — Booking Date Calculator".

## Verification

**Commands:**
- `npm run build` -- expected: production build succeeds with no errors.
- `npm test` (or the stack's unit-test runner) -- expected: all `booking-dates` tests pass, covering every matrix row.
- `npx lighthouse <local-preview-url> --preset=desktop` and mobile run -- expected: Performance & SEO ≥ 90; no ad/tracking requests.

**Manual checks:**
- On a phone (or device-emulation), the calculator is usable one-handed, loads near-instantly, and shows the calendar + text answer + accuracy note for a sample date.
