"use client";

import { useCallback, useRef } from "react";
import { LazySectionVideo } from "@/components/lazy-section-video";
import { useScrollStory } from "@/components/use-scroll-story";

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

const BEAT_COUNT = 1 + FAQS.length;

export function FaqSection() {
  const root = useRef<HTMLElement>(null);
  useScrollStory(root, BEAT_COUNT, { pinSelector: ".story-pin", liveClass: "faq--live" });

  const onMediaReady = useCallback(() => {
    root.current?.classList.add("story--media-ready");
  }, []);

  return (
    <section className="story-scroll faq" id="faq" ref={root}>
      <div className="story-pin">
        <div className="story-media">
          <LazySectionVideo src="/video/patient-home.mp4" className="story-video" onReady={onMediaReady} />
        </div>
        <div className="story-shade" aria-hidden />

        <div className="story-ui">
          <article className="story-beat is-left" aria-hidden>
            <div className="story-caption story-caption-intro">
              <p className="story-eyebrow">Questions</p>
              <h2>Answers before you book.</h2>
            </div>
          </article>

          {FAQS.map((item, i) => (
            <article className={i % 2 === 0 ? "story-beat is-right" : "story-beat is-left"} key={item.q} aria-hidden>
              <div className="story-caption">
                <p className="story-eyebrow">Questions</p>
                <h3>{item.q}</h3>
                <p className="story-body">{item.a}</p>
              </div>
            </article>
          ))}

          <p className="story-step-index" aria-live="polite">
            01 / 0{BEAT_COUNT}
          </p>
        </div>
      </div>
    </section>
  );
}
