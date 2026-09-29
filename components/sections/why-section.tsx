"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PulseRibbon } from "@/components/scenes/pulse-ribbon";
import { scrollStepVh } from "@/lib/scroll-step-vh";

gsap.registerPlugin(ScrollTrigger);

const CLAIMS = [
  { title: "One person", body: "The name on the prescription is the name you entered at booking." },
  { title: "One price", body: "The fee is quoted with the slot, not guessed at checkout." },
  { title: "A call with an edge", body: "The room opens for the appointment and the camera stops when it ends." },
  { title: "A visit you can reopen", body: "Doctors return to notes and the prescription from their Visits list." },
];

const BEATS = [
  { kind: "intro" as const },
  ...CLAIMS.map((c) => ({ kind: "claim" as const, ...c })),
  {
    kind: "compare" as const,
    title: "Open chat apps",
    body: "No slot, no named person, no record when it ends.",
    tone: "dim" as const,
  },
  {
    kind: "compare" as const,
    title: "VersaLife",
    body: "A time, a person, a fee, and a record that stays.",
    tone: "brand" as const,
  },
];

const BEAT_COUNT = BEATS.length;

function applyProgress(node: HTMLElement, progress: number) {
  const scaled = progress * BEAT_COUNT;
  const index = Math.min(BEAT_COUNT - 1, Math.max(0, Math.floor(Math.min(scaled, BEAT_COUNT - 0.001))));
  const blend = scaled - index;

  const beats = node.querySelectorAll<HTMLElement>(".why-beat");
  const counter = node.querySelector<HTMLElement>(".why-step-index");

  beats.forEach((beat, i) => {
    let opacity = 0;
    let y = 28;
    if (i === index) {
      opacity = 1 - blend;
      y = -blend * 20;
    } else if (i === index + 1) {
      opacity = blend;
      y = 28 * (1 - blend);
    }
    gsap.set(beat, { opacity, y, pointerEvents: opacity > 0.5 ? "auto" : "none" });
    beat.setAttribute("aria-hidden", opacity < 0.45 ? "true" : "false");
  });

  if (counter) counter.textContent = `0${index + 1} / 0${BEAT_COUNT}`;
}

export function WhySection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      node.classList.add("why--live");
      applyProgress(node, 1);
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: node,
        start: "top top",
        end: `+=${Math.round(BEAT_COUNT * scrollStepVh())}%`,
        pin: ".why-pin",
        scrub: 0.85,
        anticipatePin: 1,
        onEnter: () => node.classList.add("why--live"),
        onLeaveBack: () => {
          node.classList.remove("why--live");
          applyProgress(node, 0);
        },
        onLeave: () => node.classList.remove("why--live"),
        onUpdate: (self) => applyProgress(node, self.progress),
      });
    }, node);

    return () => ctx.revert();
  }, []);

  return (
    <section className="why" id="why" ref={root}>
      <div className="why-pin">
        <PulseRibbon />
        <div className="why-shade" aria-hidden />

        <div className="why-ui">
          {BEATS.map((beat, i) => {
            const align = i % 2 === 0 ? "is-left" : "is-right";
            if (beat.kind === "intro") {
              return (
                <article className={`why-beat ${align}`} key="intro" aria-hidden={i !== 0}>
                  <div className="why-caption why-caption-intro">
                    <p className="why-eyebrow">Why VersaLife</p>
                    <h2>
                      Built for one consultation. <em>Not a chat thread.</em>
                    </h2>
                  </div>
                </article>
              );
            }
            if (beat.kind === "claim") {
              return (
                <article className={`why-beat ${align}`} key={beat.title} aria-hidden>
                  <div className="why-caption">
                    <p className="why-eyebrow">Why VersaLife</p>
                    <h3>{beat.title}</h3>
                    <p className="why-body">{beat.body}</p>
                  </div>
                </article>
              );
            }
            return (
              <article className={`why-beat ${align}`} key={beat.title} aria-hidden>
                <div className={beat.tone === "brand" ? "why-caption is-brand" : "why-caption is-dim"}>
                  <p className="why-eyebrow">{beat.tone === "brand" ? "The difference" : "Instead of"}</p>
                  <h3>{beat.title}</h3>
                  <p className="why-body">{beat.body}</p>
                </div>
              </article>
            );
          })}

          <p className="why-step-index" aria-live="polite">
            01 / 0{BEAT_COUNT}
          </p>
        </div>
      </div>
    </section>
  );
}
