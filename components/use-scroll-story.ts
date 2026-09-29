"use client";

import { type RefObject, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollStepVh } from "@/lib/scroll-step-vh";

gsap.registerPlugin(ScrollTrigger);

export function applyScrollBeats(node: HTMLElement, progress: number, beatCount: number) {
  const scaled = progress * beatCount;
  const index = Math.min(beatCount - 1, Math.max(0, Math.floor(Math.min(scaled, beatCount - 0.001))));
  const blend = scaled - index;

  const beats = node.querySelectorAll<HTMLElement>(".story-beat");
  const counter = node.querySelector<HTMLElement>(".story-step-index");

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

  if (counter) counter.textContent = `0${index + 1} / 0${beatCount}`;
}

type ApplyBeats = (node: HTMLElement, progress: number, beatCount: number) => void;

type Options = {
  pinSelector: string;
  liveClass: string;
  /** Viewport scroll length multiplier per beat (default 72). */
  stepVh?: number;
  scrub?: number;
  applyBeats?: ApplyBeats;
};

export function useScrollStory(root: RefObject<HTMLElement | null>, beatCount: number, options: Options) {
  const { pinSelector, liveClass, stepVh = scrollStepVh(), scrub = 0.85, applyBeats = applyScrollBeats } = options;
  const applyRef = useRef(applyBeats);
  applyRef.current = applyBeats;

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const runBeats = (progress: number) => applyRef.current(node, progress, beatCount);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      node.classList.add(liveClass, "story--media-ready");
      runBeats(1);
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: node,
        start: "top top",
        end: `+=${Math.round(beatCount * stepVh)}%`,
        pin: pinSelector,
        scrub,
        anticipatePin: 1,
        onEnter: () => node.classList.add(liveClass),
        onLeaveBack: () => {
          node.classList.remove(liveClass);
          runBeats(0);
        },
        onLeave: () => node.classList.remove(liveClass),
        onUpdate: (self) => runBeats(self.progress),
      });
    }, node);

    return () => ctx.revert();
  }, [root, beatCount, liveClass, pinSelector, stepVh, scrub]);
}
