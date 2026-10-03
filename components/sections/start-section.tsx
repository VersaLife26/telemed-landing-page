"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DOCTOR, PATIENT } from "@/lib/links";

gsap.registerPlugin(ScrollTrigger);

export function StartSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = node.querySelectorAll<HTMLElement>(".start-reveal");

    if (reduce) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(items, { opacity: 0, y: 36 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: node,
        start: "top 78%",
        once: true,
        onEnter: () => {
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: "power3.out",
          });
        },
      });
    }, node);

    return () => ctx.revert();
  }, []);

  return (
    <section className="start" id="start" ref={root}>
      <div className="start-bg" aria-hidden>
        <span className="start-orb start-orb-a" />
        <span className="start-orb start-orb-b" />
        <span className="start-line" />
      </div>

      <div className="start-inner">
        <p className="start-eyebrow start-reveal">Start</p>
        <h2 className="start-title start-reveal">
          Book the next visit
          <em>when you need it.</em>
        </h2>
        <p className="start-lead start-reveal">
          Create a patient account, or sign in if you already have one. Doctors use a separate sign-in.
        </p>
        <div className="start-actions start-reveal">
          <a className="btn btn-start-primary" href={`${PATIENT}/register`}>
            Create a patient account
            <span className="arrow" aria-hidden>
              →
            </span>
          </a>
          <a className="btn btn-start-secondary" href={DOCTOR}>
            Doctor sign in
          </a>
        </div>
      </div>
    </section>
  );
}
