"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollVideo } from "@/components/scroll-video";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    title: "Create your account",
    body: "Add your name and date of birth. Google sign-in works too — add the date of birth before the first booking.",
  },
  {
    title: "Choose a doctor and a time",
    body: "The fee is shown with the slot. The price you confirm is the price you pay.",
  },
  {
    title: "Say who the visit is for",
    body: "Yourself, or someone else. Their name and date of birth stay on that appointment.",
  },
  {
    title: "Pay, then join",
    body: "Near the start time, open a full-screen room. The camera stops when the visit ends.",
  },
  {
    title: "Leave with a record",
    body: "A summary, clinical notes, and a prescription when one is issued.",
  },
];

const CLIPS = [
  { src: "/video/booking-hands.mp4", fallback: "/images/hero-clinician.png", alt: "Booking a visit" },
  { src: "/video/patient-home.mp4", fallback: "/images/call-patient.png", alt: "A patient at home" },
  { src: "/video/family-care.mp4", fallback: "/images/call-patient.png", alt: "A visit for someone else" },
  { src: "/video/hero.mp4", fallback: "/images/call-doctor.png", alt: "The video visit" },
  { src: "/video/doctor-workspace.mp4", fallback: "/images/feature-imaging.png", alt: "Notes after the visit" },
];

function showStep(node: HTMLElement, index: number) {
  node.querySelectorAll<HTMLElement>(".step-card, .clip").forEach((el, i) => {
    const group = el.classList.contains("step-card") ? ".step-card" : ".clip";
    const position = Array.from(node.querySelectorAll(group)).indexOf(el);
    el.classList.toggle("is-on", position === index);
  });
}

function playClip(videos: HTMLVideoElement[], index: number) {
  videos.forEach((video, i) => {
    if (i === index) video.play().catch(() => undefined);
    else video.pause();
  });
}

export function HowSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      showStep(node, STEPS.length - 1);
      node.querySelector<HTMLVideoElement>(".clip.is-on video")?.play().catch(() => undefined);
      return;
    }

    const ctx = gsap.context(() => {
      const videos = gsap.utils.toArray<HTMLVideoElement>(".clip video");
      videos.forEach((video) => {
        video.loop = true;
      });
      let current = -1;

      ScrollTrigger.create({
        trigger: node,
        start: "top top",
        end: "+=320%",
        pin: ".how-pin",
        scrub: 0.6,
        anticipatePin: 1,
        onToggle: (self) => {
          if (self.isActive) return;
          videos.forEach((video) => video.pause());
          current = -1;
        },
        onUpdate: (self) => {
          const index = Math.min(
            STEPS.length - 1,
            Math.floor(Math.min(self.progress * STEPS.length, STEPS.length - 0.001)),
          );
          if (index === current) return;
          current = index;
          showStep(node, index);
          playClip(videos, index);
        },
      });
    }, node);

    return () => ctx.revert();
  }, []);

  return (
    <section className="how" id="how" ref={root}>
      <div className="how-pin">
        <div className="how-media">
          <ScrollVideo clips={CLIPS} />
        </div>
        <div className="how-steps">
          {STEPS.map((step, i) => (
            <article className={i === 0 ? "step-card is-on" : "step-card"} key={step.title}>
              <p className="eyebrow">How to use it · 0{i + 1}</p>
              <h2>{step.title}</h2>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
