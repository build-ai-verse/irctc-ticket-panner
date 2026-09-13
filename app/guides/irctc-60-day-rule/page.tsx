import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The IRCTC 60-day booking rule",
  description:
    "Indian Railways' Advance Reservation Period is 60 days, counted from the train's source station — not your boarding station. Here's what that means for you.",
  alternates: { canonical: "/guides/irctc-60-day-rule" },
};

export default function Page() {
  return (
    <div className="container guide-shell">
      <article className="prose">
        <p className="breadcrumb">
          <a href="/">IRCTC Ticket Planner</a>{" "}
          <span aria-hidden="true">/</span> Guides
        </p>
      <h1>The IRCTC 60-day booking rule</h1>
      <p>
        The Advance Reservation Period (ARP) is <strong>60 days</strong>,
        excluding the day of the journey. Bookings open at{" "}
        <strong>8:00 AM IST</strong>.
      </p>
      <h2>Counted from the source station</h2>
      <p>
        The 60 days are counted from the date the train departs its{" "}
        <strong>source station</strong>, not from your boarding station. For most
        passengers these are the same day. But if you board at a mid-route
        station on a long-distance train, the train may have left its source a
        day or two earlier — so booking can open 1–2 days before a naive count
        suggests.
      </p>
      <h2>Don&apos;t miscount</h2>
      <p>
        Miscounting the window is the most common reason people miss confirmed
        berths. Let the <a href="/">booking date calculator</a> do the maths for
        you.
      </p>
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
