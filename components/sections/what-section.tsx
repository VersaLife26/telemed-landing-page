"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollStepVh } from "@/lib/scroll-step-vh";

gsap.registerPlugin(ScrollTrigger);

const FRAMES = [
  {
    src: "/images/what-1.png",
    fallback: "/images/call-patient.png",
    alt: "A patient on a video visit at home",
    kicker: "What this is",
    title: "A booked visit, not an open chat.",
    body: "You choose a doctor and a time. The room opens for that appointment and closes when it ends.",
  },
  {
    src: "/images/what-2.png",
    fallback: "/images/feature-consult.png",
    alt: "A doctor on a video consultation",
    kicker: "Who it is for",
    title: "You, or someone you care for.",
    body: "Name and date of birth are saved on the visit. Age on the prescription is their age that day.",
  },
  {
    src: "/images/what-3.png",
    fallback: "/images/feature-imaging.png",
    alt: "Notes and a prescription after a visit",
    kicker: "What you keep",
    title: "Notes and a prescription, on that visit.",
    body: "The summary, clinical notes, and PDF stay attached. Doctors can open the same visit later.",
  },
];

function applyProgress(node: HTMLElement, progress: number) {
  const count = FRAMES.length;
  const scaled = progress * count;
  const index = Math.min(count - 1, Math.max(0, Math.floor(Math.min(scaled, count - 0.001))));
  const blend = scaled - index;
  const mobile = window.matchMedia("(max-width: 800px)").matches;
  const swap = mobile ? 0.42 : 1;

  const frames = node.querySelectorAll<HTMLElement>(".what-frame");
  const images = node.querySelectorAll<HTMLElement>(".photo-seq img");
  const dots = node.querySelectorAll<HTMLElement>(".what-dot");
  const rail = node.querySelector<HTMLElement>(".what-rail-fill");
  const counter = node.querySelector<HTMLElement>(".what-counter");

  frames.forEach((frame, i) => {
    let opacity = 0;
    let y = mobile ? 0 : 40;

    if (mobile) {
      if (i === index) {
        opacity = blend < swap ? 1 : 0;
      } else if (i === index + 1) {
        opacity = blend >= swap ? 1 : 0;
      }
    } else if (i === index) {
      opacity = 1 - blend;
      y = -blend * 32;
    } else if (i === index + 1) {
      opacity = blend;
      y = 40 * (1 - blend);
    }

    const visible = opacity > 0.02;
    gsap.set(frame, {
      opacity,
      y,
      visibility: visible ? "visible" : "hidden",
      pointerEvents: opacity > 0.45 ? "auto" : "none",
    });
    frame.setAttribute("aria-hidden", visible ? "false" : "true");
  });

  images.forEach((img, i) => {
    let opacity = 0;
    let scale = 1.08;
    let x = mobile ? 0 : 48;

    if (mobile) {
      if (i === index) opacity = blend < swap ? 1 : 0;
      else if (i === index + 1) opacity = blend >= swap ? 1 : 0;
      scale = 1;
    } else if (i === index) {
      opacity = 1 - blend * 0.55;
      scale = 1 + blend * 0.04;
      x = blend * 24;
    } else if (i === index + 1) {
      opacity = blend;
      scale = 1.08 - blend * 0.08;
      x = 48 * (1 - blend);
    } else if (i < index) {
      opacity = 0;
      scale = 1.02;
      x = -20;
    }

    gsap.set(img, { opacity, scale, x, visibility: opacity > 0.02 ? "visible" : "hidden" });
  });

  dots.forEach((dot, i) => {
    const on = i === index;
    const next = i === index + 1;
    gsap.set(dot, {
      scale: on ? 1 : next ? 0.85 + blend * 0.15 : 0.85,
      opacity: on ? 1 : next ? 0.45 + blend * 0.55 : 0.35,
    });
  });

  if (rail) {
    if (mobile) {
      gsap.set(rail, {
        scaleX: Math.max(0.08, progress),
        scaleY: 1,
        transformOrigin: "left center",
      });
    } else {
      gsap.set(rail, {
        scaleY: Math.max(0.08, progress),
        scaleX: 1,
        transformOrigin: "top center",
      });
    }
  }
  if (counter) counter.textContent = `0${index + 1}`;
}

function resetWhat(node: HTMLElement) {
  node.classList.remove("what--live");
  applyProgress(node, 0);
  node.querySelectorAll<HTMLElement>(".photo-seq img").forEach((img) => {
    gsap.set(img, { visibility: "hidden", opacity: 0 });
  });
}

export function WhatSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      node.classList.add("what--live");
      applyProgress(node, 1);
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: node,
        start: "top top",
        end: `+=${Math.round(FRAMES.length * scrollStepVh() * 1.02)}%`,
        pin: ".what-pin",
        scrub: 0.85,
        anticipatePin: 1,
        onEnter: () => {
          node.classList.add("what--live");
          applyProgress(node, 0);
        },
        onLeaveBack: () => resetWhat(node),
        onUpdate: (self) => {
          if (!self.isActive) return;
          applyProgress(node, self.progress);
        },
      });
    }, node);

    return () => ctx.revert();
  }, []);

  return (
    <section className="what" id="what" ref={root}>
      <div className="what-pin">
        <div className="what-layout">
          <div className="what-copy-wrap">
            <div className="what-meta">
              <div className="what-rail" aria-hidden>
                <span className="what-rail-fill" />
              </div>
              <div className="what-dots" aria-hidden>
                {FRAMES.map((frame) => (
                  <span className="what-dot" key={frame.src} />
                ))}
              </div>
              <p className="what-counter" aria-live="polite">
                01
              </p>
            </div>
            <div className="what-copy">
              {FRAMES.map((frame) => (
                <div className="what-frame" key={frame.src}>
                  <p className="eyebrow">{frame.kicker}</p>
                  <h2>{frame.title}</h2>
                  <p>{frame.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="what-visual">
            <div className="what-visual-glow" aria-hidden />
            <div className="photo-seq">
              {FRAMES.map((frame) => (
                <img
                  key={frame.src}
                  src={frame.src}
                  alt={frame.alt}
                  loading="lazy"
                  decoding="async"
                  onError={(event) => {
                    event.currentTarget.src = frame.fallback;
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
