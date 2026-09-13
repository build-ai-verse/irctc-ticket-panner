---
title: IRCTC Ticket Planner
status: final
created: 2026-09-12
updated: 2026-09-12
---

# PRD: IRCTC Ticket Planner

## 0. Document Purpose

This PRD is for the builder (Avinash) and any downstream architecture/build work. It is deliberately lean and **build-ready**: features with nested Functional Requirements (FR-N), plus implementable Stories (Story-N) at the end, so it doubles as the epics/stories artifact and can flow straight into `bmad-build` without a separate CE step. It builds on the product brief (`_bmad-output/planning-artifacts/briefs/brief-irctc-date-calculator-2026-09-12/brief.md`) and does not duplicate its market/monetization reasoning. Vocabulary is fixed in the Glossary (§3); FRs and Stories use those terms exactly.

## 1. Vision

Millions of Indian Railways passengers miss the moment their booking window opens because working out the exact date by hand is error-prone. **IRCTC Ticket Planner** answers one anxious question instantly: *"What is the exact date and time I can book my ticket?"* Enter a journey date, get the booking-open date, the 60-day window on a calendar, and the Tatkal timings — nothing else in the way.

It is deliberately minimal, ad-free, and mobile-first — faster and cleaner than the ad-cluttered clones that dominate the niche. It runs on Vercel at near-zero cost and grows through SEO. v1's job is to be the best free tool for this micro-decision, cover its trivial costs, and quietly build an audience so monetization stays possible later without ever adding ads.

## 2. Target User

### 2.1 Jobs To Be Done

- **Functional:** "Tell me the exact date (and time) I can book my train ticket, so I don't miss it."
- **Functional:** "Tell me when the Tatkal window opens for my train, and which time applies to my class."
- **Emotional:** "Reassure me I've got the date right so I stop second-guessing my calendar math."
- **Contextual:** "Let me do this in five seconds on my phone, on a patchy connection."

### 2.2 Key User Journeys

- **UJ-1. Ramesh nails the booking date weeks ahead.** Ramesh is planning a family trip for a festival two months out and doesn't want to land on the waitlist. On his phone, he opens the site, types his journey date, and instantly sees "Booking opens 8:00 AM, 14 July" with that date highlighted on a calendar. He sets a mental note (and taps *"notify me on my booking day"*). He closes the tab reassured. **Climax:** the highlighted date + time removes all doubt. **Resolution:** he knows exactly when to open IRCTC.
- **UJ-2. Sunita checks the Tatkal window in a hurry.** Sunita needs a last-minute ticket tomorrow. She enters tomorrow's date, and the tool shows the Tatkal window — 10:00 AM for AC, 11:00 AM for Sleeper — one day before travel. **Resolution:** she knows exactly when to log in and for which class.

## 3. Glossary

- **Journey date** — The date the passenger intends to travel; the single required user input.
- **Booking-open date** — The date the advance reservation window opens for that journey: **journey date minus 60 days**, at **8:00 AM IST**.
- **ARP (Advance Reservation Period)** — Indian Railways' 60-day advance booking window (excluding the journey day), counted from the train's source-station departure.
- **Tatkal window** — The last-minute quota booking window: opens **one day before** the journey, at **10:00 AM IST for AC classes** and **11:00 AM IST for non-AC (Sleeper)**.
- **Accuracy note** — The standing on-result disclaimer covering the mid-route long-distance edge case (see FR-4).
- **Booking-day reminder** — Opt-in email capture where a user asks to be notified on their booking-open date (capture only in v1; see FR-6).

## 4. Features

### 4.1 Booking Date Calculator

**Description:** The core of the product. The user enters a single input — their journey date — and the tool computes and displays the booking-open date and Tatkal window, visualized on a calendar, entirely client-side. All date math is anchored to **IST regardless of the user's device timezone**. Realizes UJ-1, UJ-2.

**Functional Requirements:**

#### FR-1: Compute booking-open date

A user can enter a journey date and receive the booking-open date (journey date − 60 days) with the fixed time **8:00 AM IST**.

**Consequences (testable):**
- Journey date 2026-05-30 → booking-open date 2026-03-31, 8:00 AM IST.
- Computation uses IST; a user on a non-IST device still sees the IST-anchored date/time.
- If the booking-open date is today or in the past (journey date ≤ 60 days away), the tool states "Booking is already open" instead of a future date.

#### FR-2: Compute Tatkal window

A user sees the Tatkal window for their journey: one day before the journey date, **10:00 AM IST (AC)** and **11:00 AM IST (non-AC / Sleeper)**.

**Consequences (testable):**
- Journey date 2026-05-30 → Tatkal opens 2026-05-29, 10:00 AM (AC) / 11:00 AM (Sleeper).
- Both class timings are shown, clearly labelled.

#### FR-3: Calendar view

Results render on a calendar that highlights the booking-open date and the 60-day window, glanceable on mobile, alongside a plain-text answer.

**Consequences (testable):**
- The booking-open date is visually highlighted on a month calendar.
- The span between booking-open date and journey date is visually distinguishable.
- A plain-text summary of both dates is present (not calendar-only), for accessibility and clarity.

#### FR-4: Accuracy note

The result always displays the accuracy note: *"Calculated from your journey date. If you board at a mid-route station on a long-distance train, booking may open 1–2 days earlier."*

**Consequences (testable):**
- The note is present on every result.
- The note is worded as guidance, not an error.

#### FR-5: Input validation & edge handling

The tool guards against invalid or unhelpful input.

**Consequences (testable):**
- Empty or non-date input yields a clear inline prompt, no computation.
- Past journey dates yield a friendly message ("that date has passed").
- Same-day / next-day journeys surface the Tatkal window as the primary answer (advance window not applicable).

**Out of Scope:** Train-specific source-station lookup — v1 uses journey date only (see §5).

### 4.2 Audience Capture

**Description:** A lightweight, opt-in email capture so a user can ask to be reminded on their booking-open date. v1 **captures only** — no sending, no accounts. This keeps "money later" open by building a list. Realizes the audience-building goal in the brief.

**Functional Requirements:**

#### FR-6: Booking-day reminder capture

A user can submit an email address tied to a computed booking-open date to request a reminder.

**Consequences (testable):**
- Email + associated booking-open date are stored `[ASSUMPTION: storage via a simple Vercel-friendly store — e.g. a serverless KV/DB or form provider; mechanism deferred to architecture]`.
- Invalid emails are rejected inline.
- No reminder is actually sent in v1; the UI sets that expectation honestly ("we'll add reminders soon").
- Basic anti-abuse on the submit endpoint (e.g. rate limiting) `[ASSUMPTION]`.

### 4.3 SEO & Content Foundation

**Description:** The growth engine. Static, fast, mobile-first pages targeting the real search queries, with clean technical SEO. Content lives around the calculator; the brand name must not crowd out the search terms.

**Functional Requirements:**

#### FR-7: SEO-ready pages & technical SEO

The site ships SEO fundamentals from day one.

**Consequences (testable):**
- Keyword-rich `<title>`/H1 (e.g. "IRCTC Ticket Planner — Booking Date Calculator").
- Content pages/sections answering top queries ("when can I book my train ticket", "IRCTC 60 day rule", "Tatkal timing").
- Meta description, semantic headings, sitemap.xml, robots.txt, Open Graph tags, and structured data (FAQ/HowTo) `[ASSUMPTION: exact schema set TBD in build]`.
- Strong Core Web Vitals (see NFRs).

## 5. Non-Goals (Explicit)

- **No on-site ads** — ever. This is a permanent product principle, not a v1 deferral.
- **No train data, train lookup, or third-party railway APIs** — the only input is the journey date.
- **Not an IRCTC booking replacement** — the tool does not book tickets, check PNR, or show seat availability in v1.
- **No user accounts, login, or reminder *delivery*** in v1 (capture only).
- **Not becoming an ad/affiliate portal in v1** — monetization is deferred, not designed in yet.

## 6. MVP Scope

### 6.1 In Scope

- Booking Date Calculator (FR-1–FR-5): journey date → booking-open date + Tatkal window, calendar view, accuracy note, input handling.
- Audience capture (FR-6): opt-in booking-day reminder email, capture only.
- SEO & content foundation (FR-7).
- Mobile-first, ad-free UI, hosted on Vercel at `irctc-ticket-plan.build-ai-verse.com` `[ASSUMPTION: exact subdomain spelling]`.

### 6.2 Out of Scope for MVP

- Reminder *delivery* (email/WhatsApp/push) — capture the list now, send later. `[NOTE FOR PM: emotionally load-bearing — this is the intended first monetization/retention lever; revisit right after launch.]`
- Train lookup / source-station accuracy — deferred; handled by the accuracy note instead.
- PNR status, seat availability, fare/quota tools — future "railway toolkit" vision.
- Any monetization mechanics (affiliate/lead-gen/premium).

## 7. Success Metrics

**Primary**
- **SM-1: SEO traction** — Page 1 for a set of long-tail, low-competition queries **within 2–4 months**; growing organic sessions month-over-month. Validates FR-7. (Head terms are a 6–12+ month play, likely needing backlinks.)

**Secondary**
- **SM-2: Engagement** — Low bounce on the calculator; a meaningful share of visitors complete a calculation. Validates FR-1–FR-3.
- **SM-3: List growth** — Number of booking-day reminder opt-ins captured — the leading indicator that "money later" is real. Validates FR-6.

**Counter-metrics (do not optimize)**
- **SM-C1: Speed vs. features** — Do not add features that degrade Core Web Vitals / load time. Counterbalances the urge to expand beyond the calculator. A fast, ad-free single-purpose tool is the whole differentiator.

## 8. Cross-Cutting NFRs

- **Performance:** Excellent Core Web Vitals; near-instant load on mobile over a mid-tier connection. Calculation is client-side and instantaneous. `[ASSUMPTION: target Lighthouse/CWV thresholds set in build]`
- **Mobile-first:** Designed for phones first; fully usable one-handed.
- **Accessibility:** Semantic HTML, keyboard-usable, readable contrast; text answer always accompanies the calendar.
- **Correctness:** Date math is timezone-safe and IST-anchored; unit-tested against known examples.
- **Privacy:** Collect only the email a user volunteers for reminders; a clear, minimal privacy note. No ad/tracking networks.
- **Cost:** Stays within Vercel free tier at expected traffic; capture storage chosen to avoid recurring cost.

## 9. Stories (implementable)

*Build-ready. Each maps to FRs above.*

- **Story-1 — Calculate booking-open date.** As a passenger, I can enter my journey date and see the booking-open date (journey − 60 days) at 8:00 AM IST. *Acceptance:* correct date for known examples; IST-anchored on any device; "already open" shown when journey ≤ 60 days away. *(FR-1)*
- **Story-2 — See Tatkal window.** As a passenger, I can see the Tatkal open date and both class timings (10 AM AC / 11 AM Sleeper) for my journey. *Acceptance:* correct one-day-prior date; both timings labelled. *(FR-2)*
- **Story-3 — See it on a calendar.** As a passenger, I can see the booking-open date and 60-day window highlighted on a mobile calendar, with a text summary. *Acceptance:* date highlighted; window distinguishable; text summary present. *(FR-3)*
- **Story-4 — Understand the accuracy caveat.** As a passenger, I see an honest note about the mid-route long-distance edge case on every result. *Acceptance:* note always present, worded as guidance. *(FR-4)*
- **Story-5 — Get sensible handling of bad/edge input.** As a passenger, I get clear guidance for empty, past, or same/next-day dates. *Acceptance:* per FR-5 consequences. *(FR-5)*
- **Story-6 — Ask for a booking-day reminder.** As a passenger, I can submit my email to be reminded on my booking-open date, and I'm told delivery is coming soon. *Acceptance:* valid email + date stored; invalid rejected; honest "not yet sending" copy. *(FR-6)*
- **Story-7 — Be findable on Google.** As the builder, the site ships with keyword-rich titles, query-targeted content, sitemap/robots/OG/structured data, and strong CWV. *Acceptance:* per FR-7 consequences; Lighthouse SEO/perf pass. *(FR-7)*

## 10. Open Questions

1. Exact subdomain spelling — `irctc-ticket-plan` vs. other. (Confirm.)
2. Reminder-capture storage/mechanism (KV, DB, or third-party form) — decided in architecture/build.
3. Which structured-data schemas (FAQ, HowTo) and how much content depth at launch.
4. Any brand/logo treatment, or purely descriptive for v1?

## 11. Assumptions Index

- §4.2 FR-6 — reminder-capture storage mechanism deferred to architecture.
- §4.2 FR-6 — basic anti-abuse/rate limiting on submit endpoint.
- §4.3 FR-7 — exact structured-data schema set TBD in build.
- §6.1 — exact subdomain spelling (`irctc-ticket-plan`).
- §8 — specific CWV/Lighthouse targets set during build.
