"use client";

import { useCallback, useRef } from "react";
import { LazySectionVideo } from "@/components/lazy-section-video";
import { useScrollStory } from "@/components/use-scroll-story";
import { applyDoctorsPanelBeats } from "@/lib/doctors-beat-motion";
import { scrollStepVh } from "@/lib/scroll-step-vh";

const POINTS = [
  {
    title: "From the workspace",
    body: "Open the call from the workspace, not a separate app.",
  },
  {
    title: "Visits that stay",
    body: "Completed visits stay on the Visits list.",
  },
  {
    title: "One step away",
    body: "Notes and the prescription are one step from that row.",
  },
];

const BEAT_COUNT = 1 + POINTS.length;

export function DoctorsSection() {
  const root = useRef<HTMLElement>(null);
  useScrollStory(root, BEAT_COUNT, {
    pinSelector: ".story-pin",
    liveClass: "doctors--live",
    scrub: 0.55,
    stepVh: scrollStepVh() + 6,
    applyBeats: applyDoctorsPanelBeats,
  });

  const onMediaReady = useCallback(() => {
    root.current?.classList.add("story--media-ready");
  }, []);

  return (
    <section className="story-scroll doctors doctors--panels" id="doctors" ref={root}>
      <div className="story-pin">
        <div className="story-media">
          <LazySectionVideo src="/video/doctor-workspace.mp4" className="story-video" onReady={onMediaReady} />
        </div>
        <div className="story-shade" aria-hidden />

        <div className="story-ui">
          <article className="story-beat is-left" aria-hidden>
            <div className="story-caption story-caption-intro">
              <p className="story-eyebrow">For doctors</p>
              <h2>
                The same visit, <em>from the workspace.</em>
              </h2>
            </div>
          </article>

          {POINTS.map((point, i) => (
            <article className={i % 2 === 0 ? "story-beat is-right" : "story-beat is-left"} key={point.title} aria-hidden>
              <div className="story-caption">
                <p className="story-eyebrow">For doctors</p>
                <h3>{point.title}</h3>
                <p className="story-body">{point.body}</p>
              </div>
            </article>
          ))}

          <div className="doctors-panel-rail" aria-hidden>
            <span className="doctors-panel-rail-fill" />
          </div>

          <p className="story-step-index" aria-live="polite">
            01 / 0{BEAT_COUNT}
          </p>
        </div>
      </div>
    </section>
  );
}
