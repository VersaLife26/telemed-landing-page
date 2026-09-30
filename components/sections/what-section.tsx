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
  /** Hard swap — next frame/image appears as soon as you leave the first half of the beat (no long empty crossfade). */
  const swap = 0.38;

  const frames = node.querySelectorAll<HTMLElement>(".what-frame");
  const images = node.querySelectorAll<HTMLElement>(".photo-seq img");
  const dots = node.querySelectorAll<HTMLElement>(".what-dot");
  const rail = node.querySelector<HTMLElement>(".what-rail-fill");
  const counter = node.querySelector<HTMLElement>(".what-counter");

  const displayIndex = blend >= swap && index < count - 1 ? index + 1 : index;

  frames.forEach((frame, i) => {
    const on = i === displayIndex;
    gsap.set(frame, {
      opacity: on ? 1 : 0,
      y: 0,
      visibility: on ? "visible" : "hidden",
      pointerEvents: on ? "auto" : "none",
    });
    frame.setAttribute("aria-hidden", on ? "false" : "true");
  });

  images.forEach((img, i) => {
    const on = i === displayIndex;
    gsap.set(img, {
      opacity: on ? 1 : 0,
      scale: 1,
      x: 0,
      visibility: on ? "visible" : "hidden",
    });
  });

  dots.forEach((dot, i) => {
    const on = i === displayIndex;
    gsap.set(dot, {
      scale: on ? 1 : 0.85,
      opacity: on ? 1 : 0.35,
    });
  });

  if (rail) {
    const horizontal = window.matchMedia("(max-width: 800px)").matches;
    if (horizontal) {
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
  if (counter) counter.textContent = `0${displayIndex + 1}`;
}

function resetWhat(node: HTMLElement) {
  node.classList.remove("what--live");
  applyProgress(node, 0);
}

export function WhatSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      applyProgress(node, 1);
      return;
    }

    const ctx = gsap.context(() => {
      const count = FRAMES.length;
      const step = scrollStepVh();

      ScrollTrigger.create({
        trigger: node,
        start: "top top",
        end: `+=${Math.round(count * step)}%`,
        pin: ".what-pin",
        scrub: 0.65,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: {
          snapTo: (value) => Math.round(value * (count - 1)) / (count - 1),
          duration: { min: 0.12, max: 0.28 },
          delay: 0,
          ease: "power2.out",
        },
        onEnter: () => {
          node.classList.add("what--live");
          applyProgress(node, 0);
        },
        onToggle: (self) => node.classList.toggle("is-pinned", self.isActive),
        onLeaveBack: () => {
          node.classList.remove("is-pinned");
          resetWhat(node);
        },
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
              {FRAMES.map((frame, i) => (
                <img
                  key={frame.src}
                  src={frame.src}
                  alt={frame.alt}
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={i === 0 ? "high" : i === 1 ? "high" : "auto"}
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
