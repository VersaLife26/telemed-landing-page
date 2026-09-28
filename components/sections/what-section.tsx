"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

function showFrame(node: HTMLElement, index: number) {
  node.querySelectorAll<HTMLElement>(".what-frame, .photo-seq img").forEach((el) => {
    const group = el.classList.contains("what-frame") ? ".what-frame" : ".photo-seq img";
    const position = Array.from(node.querySelectorAll(group)).indexOf(el);
    el.classList.toggle("is-on", position === index);
  });
}

export function WhatSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      showFrame(node, FRAMES.length - 1);
      return;
    }

    const ctx = gsap.context(() => {
      let current = 0;
      ScrollTrigger.create({
        trigger: node,
        start: "top top",
        end: "+=180%",
        pin: ".what-pin",
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          const index = Math.min(
            FRAMES.length - 1,
            Math.floor(Math.min(self.progress * FRAMES.length, FRAMES.length - 0.001)),
          );
          if (index === current) return;
          current = index;
          showFrame(node, index);
        },
      });
    }, node);

    return () => ctx.revert();
  }, []);

  return (
    <section className="what" id="what" ref={root}>
      <div className="what-pin">
        <div className="what-copy">
          {FRAMES.map((frame, i) => (
            <div className={i === 0 ? "what-frame is-on" : "what-frame"} key={frame.src}>
              <p className="eyebrow">{frame.kicker}</p>
              <h2>{frame.title}</h2>
              <p>{frame.body}</p>
            </div>
          ))}
        </div>
        <div className="photo-seq">
          {FRAMES.map((frame, i) => (
            <img
              key={frame.src}
              src={frame.src}
              alt={i === 0 ? frame.alt : ""}
              className={i === 0 ? "is-on" : ""}
              onError={(event) => {
                event.currentTarget.src = frame.fallback;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
