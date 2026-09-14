import Calculator from "@/components/Calculator";
import RailScene from "@/components/RailScene";
import TodayBooking from "@/components/TodayBooking";

const faqs = [
  {
    q: "How many days in advance can I book train tickets?",
    a: "Indian Railways lets you book reserved tickets up to 60 days in advance (excluding the journey day), counted from the train's source station. Bookings open at 8:00 AM IST on that date.",
  },
  {
    q: "What time does the booking window open?",
    a: "The advance reservation window opens at 8:00 AM IST on the booking-open date. Tatkal opens one day before the journey — 10:00 AM IST for AC classes and 11:00 AM IST for non-AC (Sleeper).",
  },
  {
    q: "Is this booking date always exact?",
    a: "For most journeys, yes. If you board at a mid-route station on a long-distance train, booking may open 1–2 days earlier, because the 60 days count from the train's source-station departure.",
  },
  {
    q: "Does the 60-day rule apply to every train?",
    a: "It applies to the general advance reservation period for reserved classes. A few special trains and quotas — such as certain day trains with a shorter window, and foreign-tourist quota bookings — follow their own rules, so confirm on IRCTC for those.",
  },
  {
    q: "I am travelling from outside India. Which timezone applies?",
    a: "All Indian Railways booking times are Indian Standard Time (UTC+05:30), regardless of where you are. This planner calculates everything in IST and shows a live IST clock in the header, so the date you see is the date the window actually opens in India.",
  },
];

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const FEATURES = [
  {
    tone: "",
    title: "Counted in IST, not your phone",
    body: "Indian Railways runs on a single clock. Every date here is anchored to IST (UTC+05:30), so a traveller in New Jersey and one in Nagpur get the same answer.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5.5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    tone: "cool",
    title: "Both windows, one screen",
    body: "The 60-day advance date and the Tatkal window — AC at 10:00 AM, Sleeper at 11:00 AM — laid out together, so you know which one you are actually racing for.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M3 12h18" strokeLinecap="round" />
        <path d="M7 7l-4 5 4 5M17 7l4 5-4 5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    tone: "violet",
    title: "No ads, no account, no tracking",
    body: "The page loads in one hop, works on a weak signal, and asks nothing of you. No sign-up wall between you and a date you could have counted on a calendar.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path
          d="M12 3.5 20 7v5.5c0 4.5-3.2 7.2-8 8.5-4.8-1.3-8-4-8-8.5V7z"
          strokeLinejoin="round"
        />
        <path d="m9 12 2.2 2.2L15.5 10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const STEPS = [
  {
    n: 1,
    title: "Pick your travel date",
    body: "The day you actually board — from the station where your journey begins.",
  },
  {
    n: 2,
    title: "We count back 60 days",
    body: "Excluding the journey day itself, exactly as the reservation rules define it.",
  },
  {
    n: 3,
    title: "You get the 8 AM date",
    body: "The morning the window opens on IRCTC, plus the Tatkal fallback if you miss it.",
  },
  {
    n: 4,
    title: "Set a reminder",
    body: "Add it to your calendar with one tap, so you are logged in before the rush.",
  },
];

const GUIDES = [
  {
    href: "/guides/when-can-i-book-train-ticket",
    title: "When can I book my train ticket?",
    body: "The short answer, the exceptions, and what to do when the date has already passed.",
  },
  {
    href: "/guides/irctc-60-day-rule",
    title: "The IRCTC 60-day booking rule",
    body: "Where the 60 days are counted from, and why your date can shift by a day or two.",
  },
  {
    href: "/guides/tatkal-timing",
    title: "Tatkal booking timings explained",
    body: "10:00 AM for AC, 11:00 AM for Sleeper — and how to be ready before the clock turns.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ---------- Hero: the 3D approach ---------- */}
      <section className="hero on-dark">
        <RailScene />
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="tag">60 DAYS</span>
              Advance Reservation Period
            </p>
            <TodayBooking />
            <h1 className="hero-title">
              Know the exact morning your{" "}
              <span className="grad">booking opens</span>.
            </h1>
            <p className="hero-sub">
              Indian Railways opens reservations 60 days ahead at{" "}
              <strong>8:00 AM IST</strong> — and the confirmed berths go in
              minutes. Enter your travel date and see the date, the Tatkal
              fallback, and the whole window on a calendar.
            </p>
            <ul className="hero-stats">
              <li>
                <b>60</b> day advance window
              </li>
              <li>
                <b>8:00 AM</b> IST opening
              </li>
              <li>
                <b>0</b> ads, logins, trackers
              </li>
            </ul>
          </div>

          <Calculator />
        </div>
      </section>

      {/* ---------- Why it exists ---------- */}
      <section className="section container">
        <div className="section-head reveal">
          <span className="section-kicker">Built for the 8 AM rush</span>
          <h2>A railway that modernised. A booking clock that did not.</h2>
          <p>
            Vande Bharat sets, electrified corridors, live running status — the
            network moved forward. The reservation window is still a date you
            have to count by hand. This does the counting.
          </p>
        </div>
        <div className="card-grid">
          {FEATURES.map((feature, i) => (
            <article
              key={feature.title}
              className={`card reveal ${feature.tone}`}
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
            >
              <span className="card-icon" aria-hidden="true">
                {feature.icon}
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="band on-dark" id="how-it-works">
        <div className="section container">
          <div className="section-head reveal">
          <span className="section-kicker">How it works</span>
          <h2>Four stops from travel date to booking date.</h2>
          <p>
            No account, no form to submit. The answer updates the moment you pick
            a date.
          </p>
        </div>
        <ol className="rail-steps">
          {STEPS.map((step, i) => (
            <li
              key={step.n}
              className="rail-step reveal"
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
            >
              <span className="node" aria-hidden="true">
                {step.n}
              </span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="section container" id="faq">
        <div className="section-head reveal">
          <span className="section-kicker">Questions</span>
          <h2>Frequently asked questions</h2>
        </div>
        <div className="faq reveal">
          {faqs.map((f, i) => (
            <details key={f.q} className="faq-item" open={i === 0}>
              <summary>{f.q}</summary>
              <div className="faq-body">
                <p>{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ---------- Guides ---------- */}
      <section className="section container">
        <div className="section-head reveal">
          <span className="section-kicker">Go deeper</span>
          <h2>Guides</h2>
          <p>
            Short, plain-English explanations of the rules this calculator is
            built on.
          </p>
        </div>
        <div className="card-grid">
          {GUIDES.map((guide, i) => (
            <a
              key={guide.href}
              href={guide.href}
              className="card cool reveal"
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
            >
              <h3>{guide.title}</h3>
              <p>{guide.body}</p>
              <span className="card-go">
                Read the guide <span aria-hidden="true">→</span>
              </span>
            </a>
          ))}
        </div>

        <div className="notice reveal" style={{ marginTop: "2rem" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8.2v4.6" strokeLinecap="round" />
            <circle cx="12" cy="16" r="0.9" fill="currentColor" stroke="none" />
          </svg>
          <p>
            Dates are calculated from the published Indian Railways reservation
            rules. If you board at a mid-route station, the window can open 1–2
            days earlier — always confirm the exact date on the official IRCTC
            site before you plan around it.
          </p>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
    </>
  );
}
