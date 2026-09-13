---
title: "Product Brief: IRCTC Ticket Planner"
status: ready
created: 2026-09-12
updated: 2026-09-12
---

# Product Brief: IRCTC Ticket Planner

> **Home:** `irctc-ticket-plan.build-ai-verse.com` `[ASSUMPTION: read "irct-ticket-plan" as this subdomain label — confirm]` — a subdomain property within the **build-ai-verse** umbrella of small tools.
> **Product name:** "IRCTC Ticket Planner" (also signals the broader toolkit vision). SEO note: keep the HTML `<title>`/H1 keyword-rich (e.g. "IRCTC Ticket Planner — Booking Date Calculator") so the descriptive search terms aren't lost behind the brand name.

## Executive Summary

Indian Railways lets passengers book reserved tickets up to **60 days in advance** (the Advance Reservation Period, or ARP), with bookings opening at 8:00 AM IST. Working out that exact date by hand is easy to get wrong — people check too late and land on the waitlist. Tatkal adds a second layer of timing confusion (opens one day prior, 10:00 AM for AC, 11:00 AM for non-AC).

This product is a **dead-simple, ad-free, mobile-first calculator** that answers one anxious question instantly: *"What is the exact date and time I can book my ticket?"* It is deliberately faster, cleaner, and less cluttered than the field of ad-heavy clones that dominate this niche today — running on Vercel at near-zero cost and growing through SEO.

The near-term goal is modest and honest: **cover its own trivial running costs and build an audience of high-intent travelers.** Monetization is deliberately deferred — but v1 is designed so it stays possible (lightweight audience capture), rather than foreclosing it.

## The Problem

- **The core mistake:** Passengers simply don't know — or miscount — the exact day the 60-day window opens, so they check too late, and the good berths (or any confirmed berth) are gone. Millions land on waitlists daily. (A subtler version of this — counting from the boarding station rather than the train's source — affects mid-route travelers on long-distance trains; v1 handles this with an honest note rather than train data.)
- **Tatkal confusion:** Different open times (10:00 AM AC / 11:00 AM non-AC), one day before departure, with no refund on cancellation — easy to get wrong under time pressure.
- **How they cope today:** Manual counting on a calendar, guesswork, or ad-cluttered calculator sites that are slow and unpleasant on mobile — which is where most Indian users actually are.
- **The cost of getting it wrong:** A missed booking window can mean no confirmed ticket for an important trip (family event, work, emergency). The stakes feel high and the moment is recurring.

## The Solution

A single-purpose calculator, optimized for the phone. Deliberately minimal — **no train data, no lookups, no dependencies**:

1. User enters a single input: their **journey date**.
2. The tool returns the **booking-open date** (60 days prior, at 8:00 AM IST) and the relevant **Tatkal window** timings.
3. Results render as a **calendar view** — the booking-open date and the 60-day window highlighted visually, glanceable on mobile — plus a clear text answer. No ads, no clutter, instant load.

A short, honest **accuracy note** accompanies the result: *"Calculated from your journey date. If you board at a mid-route station on a long-distance train, booking may open 1–2 days earlier."* This is deliberate: it turns the one edge case of the simple approach into a trust signal rather than a hidden error.

Around the calculator sits **SEO-focused content** — the questions people actually search ("when can I book my train ticket", "IRCTC 60 day rule", "Tatkal timing") — that earns organic traffic and builds trust.

## What Makes This Different

Honest assessment: **the calculator itself is a commodity** — a day of code, and 8+ near-identical competitors already rank. There is no technical moat. The advantage is entirely **execution and distribution**:

- **Ad-free, fast, mobile-first UX** in a field of ad-cluttered, slow clones. This is both a user promise *and* an SEO advantage (Core Web Vitals, mobile usability).
- **Accuracy & trust** — a clear, correct answer plus an honest note about the one edge case (mid-route boarding on long-distance trains), so users believe the result.
- **Audience, not just a page** — designed to capture high-intent visitors (opt-in booking-day reminders) so it can become a returning-user product, not a one-visit utility.
- **Room to expand** into a broader railway toolkit (PNR status, seat availability, fare/quota info) — a brand, not a single calculator.

The moat, stated plainly, is **better UX + patient SEO + trust**, with optionality to grow into a toolkit.

**Distribution reality check.** This lives on a subdomain of a generic umbrella (`build-ai-verse.com`), not a keyword-relevant domain like the incumbents (ticketdate.in, traindate.in). Two consequences to accept going in: (1) the domain name itself carries no topical signal, and (2) subdomain authority pools only weakly to/from the root. Net: this tool must **earn its rankings entirely on content quality, technical performance, and backlinks** — which is exactly the game the ad-free/fast/mobile-first bet is built to win, just without a domain-name head start.

## Who This Serves

- **The advance planner** — booking a trip weeks out (family visit, festival travel, planned leave), anxious not to miss the ARP window. Wants certainty, fast, on their phone.
- **The Tatkal scrambler** — needs a last-minute ticket, under time pressure, must not fumble the exact open time.
- Both are overwhelmingly **mobile users**, often on variable connections — which is why speed and mobile-first design are non-negotiable.

## Success Criteria

Right-sized to a side project that must pay for itself:

- **Costs covered** — trivially, given Vercel free tier + domain (cleared at launch).
- **SEO traction** — page 1 for **long-tail, low-competition queries within 2–4 months**; head terms (e.g. "IRCTC date calculator", vs. 8 entrenched competitors) are a longer play (6–12+ months, likely needing backlinks). Growing organic sessions month over month is the real signal.
- **Technical quality** — strong Core Web Vitals / mobile performance (a ranking factor *and* the product promise).
- **Engagement** — low bounce on the calculator, and a growing opt-in list from booking-day reminder capture (the leading indicator that "money later" is real).

## Scope

**In (v1):**
- The core calculator: **journey date in → booking-open date + Tatkal windows out** (60 days, 8:00 AM IST). Pure date math, no external data.
- **Calendar view** of the booking-open date and 60-day window.
- Honest accuracy note for the mid-route / long-distance edge case.
- Mobile-first, fast, ad-free UI on the subdomain, hosted on Vercel.
- SEO foundation: content pages targeting the real search queries; clean technical SEO.
- Lightweight audience capture (opt-in "notify me on my booking day" email) — build only the capture in v1; the sending can come later.

**Out (for now):**
- On-site ads (permanently excluded).
- Any train data, train lookup, or APIs (explicitly dropped — the input is only the journey date).
- Actual reminder *delivery* infrastructure (WhatsApp/push), payments, user accounts.
- PNR status, seat availability, fare calc, and other toolkit tools (future).
- Any monetization mechanics.

## Vision

If the traffic shows up, this grows from a single calculator into a **trusted, ad-free railway toolkit** — the fast, clean alternative to the cluttered incumbents. The audience captured along the way unlocks the deferred monetization options (contextual affiliate/lead-gen, premium reminders) *on your terms*, without ever compromising the ad-free promise that differentiated it in the first place.
