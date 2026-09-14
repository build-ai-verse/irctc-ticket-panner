---
title: 'Contact & identity surfaces (About page, footer contact/social, JSON-LD)'
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

**Problem:** The IRCTC Ticket Planner has no About or contact presence. For a tool people must trust for accuracy, that's a missing E-E-A-T/SEO trust signal and no channel for accuracy feedback, press, or partnerships.

**Approach:** Add lightweight, backend-free contact + identity surfaces, consistent with the existing design system (Sora/Inter, dark theme, current header/footer markup):

1. **About page** — `app/about/page.tsx`: a concise explanation of what the tool is, that it is independent, ad-free, and **not affiliated with IRCTC / Indian Railways**, plus a contact line. Include Next `metadata` (title, description) and canonical `/about`. Add `/about` to `app/sitemap.ts`.
2. **Footer** (`app/layout.tsx`) — add an **About** link, a **Contact** email link, and an **Instagram** link, using existing footer markup/classes. Also add About to the header/footer nav for discoverability.
3. **Config** (`lib/site.ts`) — add empty-safe constants `CONTACT_EMAIL` (`blaze.avinash@gmail.com`) and `INSTAGRAM_URL` (`https://instagram.com/buildaiverse`, displayed as `@buildaiverse`). When a value is empty, its link/section simply does not render (mirrors the existing `GOOGLE_SITE_VERIFICATION` pattern).
4. **JSON-LD** — extend the existing `WebApplication` structured data in `app/layout.tsx` with `sameAs` (the Instagram URL) and a `contactPoint` (the contact email), both gated on the config being non-empty.
5. **Spam guard** — the visible footer email renders as an **obfuscated, client-assembled `mailto:`** (not a plain-text address in the server HTML), while staying clickable and accessible.

**Constraints:** No backend, no form — `mailto` only. Do not alter the calculator, the 3D hero, or unrelated design. Verify with `npm test` and `npm run build`.

</frozen-after-approval>

## Implementation Notes

- `lib/site.ts`: added `CONTACT_EMAIL`, `INSTAGRAM_HANDLE`, `INSTAGRAM_URL` (empty-safe).
- `components/ContactEmail.tsx` (new, client): assembles the `mailto:` after mount so the raw address isn't a plain-text node in SSR HTML. Renders nothing if `CONTACT_EMAIL` is empty.
- `app/about/page.tsx` (new): `container guide-shell` + `prose` shell matching the guide pages; metadata + canonical `/about`; contact section gated on config; Instagram link uses `rel="me"`.
- `app/layout.tsx`: added About to header `NAV`; new "Project" footer column (About / obfuscated email / Instagram, each gated); extended `WebApplication` JSON-LD with `sameAs` (Instagram) and `contactPoint` (email), both gated.
- `app/sitemap.ts`: added `/about`.
- `app/globals.css`: `.footer-grid` 2 → 3 columns (mobile still collapses to 1 via the existing breakpoint).
- Tradeoff noted: the visible footer email is obfuscated, but the JSON-LD `contactPoint` intentionally carries the plain email as a machine-readable identity/E-E-A-T signal (per the intent). User was advised of spam risk and chose their personal address.

## Review Triage Log

Pass 1 (blind-hunter, run inline for a small additive change):

- **Obfuscated email link has no `href` until hydration → no-JS users can't click it** — `low`, rejected. This is the intended behaviour of the spam guard; no-JS users are rare and the fix (rendering a scrapeable fallback) would defeat the guard. Documented tradeoff.
- **No "back to calculator" CTA on the About page** — `low`, rejected (enhancement, not a defect).
- **External Instagram link lacks a "opens in new tab" cue for screen readers** — `low`, rejected (has `rel`/`target`; marginal benefit vs. noise).
- Verification: `npm test` → 32/32 pass; `npm run build` → success, `/about` static (461 B, ~87.8 kB First Load). No high/medium findings; no hydration mismatch (children stable, only `href` set post-mount).
