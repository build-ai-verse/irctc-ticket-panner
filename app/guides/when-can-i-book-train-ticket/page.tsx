import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "When can I book my train ticket?",
  description:
    "Indian Railways opens advance booking 60 days before your journey at 8:00 AM IST. Here is how to find the exact date, and how Tatkal differs.",
  alternates: { canonical: "/guides/when-can-i-book-train-ticket" },
};

const howTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to find when you can book your train ticket",
  step: [
    {
      "@type": "HowToStep",
      text: "Note your journey date (the date the train departs its source station).",
    },
    {
      "@type": "HowToStep",
      text: "Count back 60 days from the journey date — that is the booking-open date.",
    },
    {
      "@type": "HowToStep",
      text: "Be ready at 8:00 AM IST on that date to book on IRCTC.",
    },
  ],
};

export default function Page() {
  return (
    <div className="container guide-shell">
      <article className="prose">
        <p className="breadcrumb">
          <a href="/">IRCTC Ticket Planner</a>{" "}
          <span aria-hidden="true">/</span> Guides
        </p>
      <h1>When can I book my train ticket?</h1>
      <p>
        You can book reserved Indian Railways tickets up to{" "}
        <strong>60 days in advance</strong> (excluding the journey day). The
        window opens at <strong>8:00 AM IST</strong> on the booking-open date,
        counted from the train&apos;s source station.
      </p>
      <h2>Find your exact date</h2>
      <p>
        The quickest way is to use the{" "}
        <a href="/">IRCTC Ticket Planner calculator</a> — enter your journey date
        and it shows the booking-open date and Tatkal timings instantly.
      </p>
      <h2>What about last-minute travel?</h2>
      <p>
        If your journey is within a day or two, the advance window has passed —
        use <a href="/guides/tatkal-timing">Tatkal</a>, which opens one day
        before travel.
      </p>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }}
      />
      </article>

      <aside className="guide-cta">
        <div>
          <h2>Get your exact date</h2>
          <p>
            Enter your journey date and see the morning your booking window
            opens, plus the Tatkal fallback.
          </p>
        </div>
        <a className="btn btn-primary" href="/">
          Open the planner
        </a>
      </aside>
    </div>
  );
}
