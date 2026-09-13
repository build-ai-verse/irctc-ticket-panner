import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tatkal booking timings explained",
  description:
    "Tatkal tickets open one day before the journey: 10:00 AM IST for AC classes and 11:00 AM IST for non-AC (Sleeper). Here's how the timings work.",
  alternates: { canonical: "/guides/tatkal-timing" },
};

const faq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What time does Tatkal open?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tatkal opens one day before the journey — 10:00 AM IST for AC classes and 11:00 AM IST for non-AC (Sleeper).",
      },
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
      <h1>Tatkal booking timings explained</h1>
      <p>
        Tatkal is the last-minute quota. It opens{" "}
        <strong>one day before</strong> the journey (counted from the source
        station):
      </p>
      <ul>
        <li>
          <strong>10:00 AM IST</strong> — AC classes (1A, 2A, 3A, CC, EC)
        </li>
        <li>
          <strong>11:00 AM IST</strong> — non-AC classes (Sleeper)
        </li>
      </ul>
      <p>
        Tatkal costs more and is non-refundable on cancellation, but it&apos;s
        often the only option for last-minute travel. Check your exact date with
        the <a href="/">IRCTC Ticket Planner</a>.
      </p>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
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
