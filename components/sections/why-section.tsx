"use client";

import { PulseRibbon } from "@/components/scenes/pulse-ribbon";

const CLAIMS = [
  { title: "One person", body: "The name on the prescription is the name you entered at booking." },
  { title: "One price", body: "The fee is quoted with the slot, not guessed at checkout." },
  { title: "A call with an edge", body: "The room opens for the appointment and the camera stops when it ends." },
  { title: "A visit you can reopen", body: "Doctors return to notes and the prescription from their Visits list." },
];

export function WhySection() {
  return (
    <section className="why why--live" id="why">
      <div className="why-shell">
        <PulseRibbon />
        <div className="why-shade" aria-hidden />

        <div className="why-content">
          <header className="why-intro">
            <p className="why-eyebrow">Why VersaLife</p>
            <h2>
              <span className="why-headline-lead">Built for one consultation.</span>
              <em className="why-headline-sub">Not a chat thread.</em>
            </h2>
          </header>

          <div className="why-grid">
            <ul className="why-claims">
              {CLAIMS.map((claim, index) => (
                <li key={claim.title} className="why-claim">
                  <span className="why-claim-index" aria-hidden>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="why-claim-copy">
                    <h3>{claim.title}</h3>
                    <p className="why-body">{claim.body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="why-compare" role="group" aria-label="How VersaLife compares">
              <div className="why-compare-panel is-muted">
                <p className="why-eyebrow">Instead of</p>
                <h3>Open chat apps</h3>
                <p className="why-body">No slot, no named person, no record when it ends.</p>
              </div>
              <div className="why-compare-panel is-brand">
                <p className="why-eyebrow">The difference</p>
                <h3>VersaLife</h3>
                <p className="why-body">A time, a person, a fee, and a record that stays.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
