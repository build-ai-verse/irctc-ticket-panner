import type { Metadata, Viewport } from "next";
import { Sora, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import ISTClock from "@/components/ISTClock";
import Enhancements from "@/components/Enhancements";
import ContactEmail from "@/components/ContactEmail";
import {
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_URL,
  GOOGLE_SITE_VERIFICATION,
  CONTACT_EMAIL,
  INSTAGRAM_URL,
  INSTAGRAM_HANDLE,
} from "@/lib/site";
import "./globals.css";

// Self-hosted at build time by next/font — no render-blocking request to a
// third party, which keeps the "fast and ad-free" promise honest.
const display = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s — ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#060a16",
  colorScheme: "dark",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  applicationCategory: "TravelApplication",
  operatingSystem: "Web",
  description: SITE_DESCRIPTION,
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  ...(INSTAGRAM_URL ? { sameAs: [INSTAGRAM_URL] } : {}),
  ...(CONTACT_EMAIL
    ? {
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: CONTACT_EMAIL,
          },
        ],
      }
    : {}),
};

const NAV = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#faq", label: "FAQ" },
  { href: "/guides/when-can-i-book-train-ticket", label: "Guides" },
  { href: "/about", label: "About" },
];

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M7 3.5h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3Z"
          fill="#1b1105"
          fillOpacity="0.28"
          stroke="#2a1a06"
          strokeWidth="1.4"
        />
        <path d="M6.6 7.4h10.8v4.2H6.6z" fill="#2a1a06" />
        <circle cx="8.4" cy="14.6" r="1.15" fill="#2a1a06" />
        <circle cx="15.6" cy="14.6" r="1.15" fill="#2a1a06" />
        <path
          d="M6 18.5 3.5 21.5M18 18.5l2.5 3"
          stroke="#2a1a06"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <header className="site-header">
          <div className="container header-inner">
            <a href="/" className="brand">
              <BrandMark />
              <span>
                IRCTC <span className="brand-sub">Ticket Planner</span>
              </span>
            </a>
            <nav className="site-nav" aria-label="Primary">
              {NAV.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
              <ISTClock />
            </nav>
          </div>
        </header>

        <main id="main">{children}</main>

        <footer className="site-footer">
          <div className="container">
            <div className="footer-grid">
              <div>
                <a href="/" className="brand" style={{ marginBottom: "0.75rem" }}>
                  <BrandMark />
                  <span>
                    IRCTC <span className="brand-sub">Ticket Planner</span>
                  </span>
                </a>
                <p style={{ margin: "0.75rem 0 0", maxWidth: "44ch" }}>
                  The exact date your Indian Railways advance reservation opens —
                  counted in IST, shown on a calendar, free of ads and trackers.
                </p>
              </div>
              <div>
                <p className="footer-title">Guides</p>
                <ul className="footer-links">
                  <li>
                    <a href="/guides/when-can-i-book-train-ticket">
                      When can I book my train ticket?
                    </a>
                  </li>
                  <li>
                    <a href="/guides/irctc-60-day-rule">The 60-day booking rule</a>
                  </li>
                  <li>
                    <a href="/guides/tatkal-timing">Tatkal timings explained</a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="footer-title">Project</p>
                <ul className="footer-links">
                  <li>
                    <a href="/about">About</a>
                  </li>
                  {CONTACT_EMAIL && (
                    <li>
                      <ContactEmail>Email us</ContactEmail>
                    </li>
                  )}
                  {INSTAGRAM_URL && (
                    <li>
                      <a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="me noopener noreferrer"
                      >
                        Instagram ({INSTAGRAM_HANDLE})
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <p className="footer-fine">
              {SITE_NAME} is an independent, ad-free tool and is{" "}
              <strong>not affiliated with IRCTC or Indian Railways</strong>. Dates
              are calculated from the rules published by Indian Railways; always
              confirm on the official IRCTC website before you plan around them.
            </p>
          </div>
        </footer>

        <Enhancements />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
