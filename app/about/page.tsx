import type { Metadata } from "next";
import {
  SITE_NAME,
  CONTACT_EMAIL,
  INSTAGRAM_URL,
  INSTAGRAM_HANDLE,
} from "@/lib/site";
import ContactEmail from "@/components/ContactEmail";

export const metadata: Metadata = {
  title: "About",
  description: `${SITE_NAME} is a free, ad-free tool that shows the exact date your IRCTC advance booking window opens. Independent — not affiliated with IRCTC or Indian Railways.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="container guide-shell">
      <article className="prose">
        <h1>About {SITE_NAME}</h1>
        <p>
          {SITE_NAME} answers one anxious question: <em>what is the exact date
          and time I can book my train ticket?</em> Enter your journey date and
          it shows the day your Indian Railways advance reservation window opens
          — 60 days before travel, at 8:00 AM IST — along with the Tatkal
          timings and the whole window on a calendar.
        </p>

        <h2>Independent and ad-free</h2>
        <p>
          {SITE_NAME} is an independent tool and is{" "}
          <strong>not affiliated with, endorsed by, or connected to IRCTC or
          Indian Railways</strong>. There are no ads and no tracking networks.
          Dates are calculated from the reservation rules published by Indian
          Railways; always confirm on the official IRCTC website before you plan
          around them.
        </p>

        <h2>How it stays accurate</h2>
        <p>
          Every date is anchored to Indian Standard Time (UTC+05:30) and
          computed on calendar dates, so a visitor abroad sees the same answer
          as one in India. Booking opens 60 days before the journey, counted
          from the train&apos;s source station — if you board mid-route on a
          long-distance train, your window can open a day or two earlier, and
          the result says so rather than pretending to a precision it
          doesn&apos;t have.
        </p>

        {(CONTACT_EMAIL || INSTAGRAM_URL) && (
          <>
            <h2>Contact</h2>
            <p>
              Spotted a wrong date, or have a suggestion?{" "}
              {CONTACT_EMAIL && <ContactEmail>Email us</ContactEmail>}
              {CONTACT_EMAIL && INSTAGRAM_URL && " · "}
              {INSTAGRAM_URL && (
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="me noopener noreferrer"
                >
                  Instagram ({INSTAGRAM_HANDLE})
                </a>
              )}
              .
            </p>
          </>
        )}
      </article>
    </div>
  );
}
