"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Who is VersaLife for?",
    a: "Patients in Sri Lanka who want a booked video visit, and doctors who already practise on the platform. This page introduces the service. Care happens in the patient and doctor apps.",
  },
  {
    q: "Can I book for a child or a parent?",
    a: "Yes. Choose “for someone else”, enter their name and date of birth, and optionally how they are related to you.",
  },
  {
    q: "When can I join the video?",
    a: "The room opens around your appointment time. Arrive early and the page holds you. When the doctor ends the visit, the camera stops and you go to the summary.",
  },
  {
    q: "What do I receive after the visit?",
    a: "A visit summary, clinical notes, and a prescription when one is issued. Doctors reopen the same visit from their Visits list.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="faq" id="faq">
      <h2>Questions</h2>
      <div>
        {FAQS.map((item, i) => {
          const on = open === i;
          return (
            <div key={item.q} className={on ? "item open" : "item"}>
              <button type="button" aria-expanded={on} onClick={() => setOpen(on ? -1 : i)}>
                {item.q}
                <span aria-hidden>{on ? "–" : "+"}</span>
              </button>
              <div className="item-panel">
                <p>{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
