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
    <section className="why" id="why">
      <PulseRibbon />
      <div className="why-copy">
        <p className="eyebrow">Why VersaLife</p>
        <h2>
          Built for one consultation. <em>Not a chat thread.</em>
        </h2>
        <ul>
          {CLAIMS.map((claim) => (
            <li key={claim.title}>
              <strong>{claim.title}</strong>
              <span>{claim.body}</span>
            </li>
          ))}
        </ul>
        <div className="compare">
          <div>
            <p>Open chat apps</p>
            <span>No slot, no named person, no record when it ends.</span>
          </div>
          <div>
            <p>VersaLife</p>
            <span>A time, a person, a fee, and a record that stays.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
