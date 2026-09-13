# IRCTC Ticket Planner

A fast, ad-free, mobile-first tool that tells you the exact date your IRCTC
advance booking opens (60 days before your journey, 8:00 AM IST) plus Tatkal
timings — shown on a calendar.

Built with **Next.js (App Router)** + TypeScript, deployed on **Vercel**.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # unit tests for the date logic (the correctness core)
npm run build    # production build
```

## Structure

- `lib/booking-dates.ts` — pure, timezone-safe date logic (IST-anchored). The
  UI is a thin layer over this; it is fully unit-tested in
  `lib/booking-dates.test.ts`.
- `components/Calculator.tsx` — the only client component (holds the date input).
- `components/ResultCard.tsx`, `components/CalendarView.tsx` — presentational.
- `app/` — home page, three SEO guide pages, `sitemap.ts`, `robots.ts`, metadata
  and JSON-LD structured data in `app/layout.tsx` / pages.

## Deploy (Vercel)

1. Import the repo into Vercel (framework auto-detected as Next.js).
2. In **Project → Settings → Domains**, add the subdomain
   `irctc-ticket-plan.build-ai-verse.com` and point its DNS `CNAME` to Vercel as
   instructed. (No `vercel.json` is needed for a standard Next.js app.)
3. Update `SITE_URL` in `lib/site.ts` if the final subdomain differs.

## Configuration

- `lib/site.ts` — site name, description, canonical `SITE_URL`, and
  `GOOGLE_SITE_VERIFICATION` (paste the token from Google Search Console to
  verify the domain; leave empty to omit the tag).
- Analytics: [Vercel Web Analytics](https://vercel.com/docs/analytics)
  (cookieless) via `@vercel/analytics` — enable it in the Vercel dashboard.

## Not affiliated with IRCTC / Indian Railways. Always confirm on the official IRCTC site.
