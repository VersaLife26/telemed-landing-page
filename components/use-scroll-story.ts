"use client";

import { type RefObject, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { beatDisplayIndex } from "@/lib/scroll-beat-progress";
import { scrollStepVh } from "@/lib/scroll-step-vh";

gsap.registerPlugin(ScrollTrigger);

export function applyScrollBeats(node: HTMLElement, progress: number, beatCount: number) {
  const displayIndex = beatDisplayIndex(progress, beatCount);

  const beats = node.querySelectorAll<HTMLElement>(".story-beat");
  const counter = node.querySelector<HTMLElement>(".story-step-index");

  beats.forEach((beat, i) => {
    const on = i === displayIndex;
    gsap.set(beat, {
      opacity: on ? 1 : 0,
      y: 0,
      visibility: on ? "visible" : "hidden",
      pointerEvents: on ? "auto" : "none",
    });
    beat.setAttribute("aria-hidden", on ? "false" : "true");
  });

  if (counter) counter.textContent = `0${displayIndex + 1} / 0${beatCount}`;
}

type ApplyBeats = (node: HTMLElement, progress: number, beatCount: number) => void;

type Options = {
  pinSelector: string;
  liveClass: string;
  /** Viewport scroll length multiplier per beat (see scrollStepVh). */
  stepVh?: number;
  scrub?: number;
  applyBeats?: ApplyBeats;
};

export function useScrollStory(root: RefObject<HTMLElement | null>, beatCount: number, options: Options) {
  const { pinSelector, liveClass, stepVh = scrollStepVh(), scrub = true, applyBeats = applyScrollBeats } = options;
  const applyRef = useRef(applyBeats);
  applyRef.current = applyBeats;

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const runBeats = (progress: number) => applyRef.current(node, progress, beatCount);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      node.classList.add("story--live", liveClass, "story--media-ready");
      runBeats(1);
      return;
    }

    const ctx = gsap.context(() => {
      const pinSt: ScrollTrigger.Vars = {
        trigger: node,
        start: "top top",
        end: `+=${Math.round(beatCount * stepVh)}%`,
        pin: pinSelector,
        scrub,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onEnter: () => {
          node.classList.add("story--live", liveClass);
          runBeats(0);
        },
        onToggle: (self) => node.classList.toggle("is-pinned", self.isActive),
        onLeaveBack: () => {
          node.classList.remove("is-pinned", "story--live", liveClass);
          runBeats(0);
        },
        onUpdate: (self) => runBeats(self.progress),
      };
      ScrollTrigger.create(pinSt);
    }, node);

    return () => ctx.revert();
  }, [root, beatCount, liveClass, pinSelector, stepVh, scrub]);
}
