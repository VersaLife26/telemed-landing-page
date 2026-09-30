"use client";

import { useCallback, useRef } from "react";
import { LazySectionVideo } from "@/components/lazy-section-video";

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

export function DoctorsSection() {
  const root = useRef<HTMLElement>(null);

  const onMediaReady = useCallback(() => {
    root.current?.classList.add("doctors--media-ready");
  }, []);

  return (
    <section className="doctors doctors--static" id="doctors" ref={root}>
      <div className="doctors-shell">
        <div className="doctors-media">
          <LazySectionVideo src="/video/doctor-workspace.mp4" className="story-video" onReady={onMediaReady} />
        </div>
        <div className="doctors-shade" aria-hidden />

        <div className="doctors-content">
          <header className="doctors-intro">
            <p className="story-eyebrow">For doctors</p>
            <h2>
              <span className="doctors-headline-lead">The same visit,</span>
              <em className="doctors-headline-sub">from the workspace.</em>
            </h2>
          </header>

          <ul className="doctors-points">
            {POINTS.map((point, index) => (
              <li key={point.title} className="doctors-point">
                <span className="doctors-point-index" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="doctors-point-copy">
                  <h3>{point.title}</h3>
                  <p className="story-body">{point.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
