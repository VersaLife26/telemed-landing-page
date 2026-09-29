"use client";

import gsap from "gsap";

const SWAP = 0.46;

function beatSide(beat: HTMLElement) {
  return beat.classList.contains("is-left") ? "left" : "right";
}

/** Panel push: one caption at a time, horizontal wipe from the aligned edge (not cross-fade). */
export function applyDoctorsPanelBeats(node: HTMLElement, progress: number, beatCount: number) {
  const scaled = progress * beatCount;
  const index = Math.min(beatCount - 1, Math.max(0, Math.floor(Math.min(scaled, beatCount - 0.001))));
  const blend = scaled - index;

  const beats = node.querySelectorAll<HTMLElement>(".story-beat");
  const counter = node.querySelector<HTMLElement>(".story-step-index");
  const rail = node.querySelector<HTMLElement>(".doctors-panel-rail-fill");

  beats.forEach((beat, i) => {
    const caption = beat.querySelector<HTMLElement>(".story-caption");
    const side = beatSide(beat);
    const exitX = side === "left" ? "-7vw" : "7vw";
    const enterX = exitX;

    let opacity = 0;
    let x = "0vw";
    let scale = 1;
    let clip = "inset(0 0 0 0 round 0px)";

    if (i < index) {
      opacity = 0;
      x = exitX;
      scale = 0.94;
    } else if (i > index + 1) {
      opacity = 0;
      x = enterX;
      scale = 0.96;
    } else if (i === index) {
      if (blend < SWAP) {
        const t = blend / SWAP;
        opacity = 1;
        x = side === "left" ? `${-7 * t}vw` : `${7 * t}vw`;
        scale = 1 - t * 0.06;
        clip =
          side === "left"
            ? `inset(0 ${t * 100}% 0 0 round 0px)`
            : `inset(0 0 0 ${t * 100}% round 0px)`;
      } else {
        opacity = 0;
        x = exitX;
        scale = 0.94;
      }
    } else if (i === index + 1) {
      const nextSide = beatSide(beat);
      if (blend >= SWAP) {
        const t = (blend - SWAP) / (1 - SWAP);
        opacity = 1;
        x = nextSide === "left" ? `${-7 * (1 - t)}vw` : `${7 * (1 - t)}vw`;
        scale = 0.94 + t * 0.06;
        clip =
          nextSide === "left"
            ? `inset(0 ${(1 - t) * 100}% 0 0 round 0px)`
            : `inset(0 0 0 ${(1 - t) * 100}% round 0px)`;
      } else {
        opacity = 0;
        x = nextSide === "left" ? "-7vw" : "7vw";
        scale = 0.96;
        clip =
          nextSide === "left" ? "inset(0 100% 0 0 round 0px)" : "inset(0 0 0 100% round 0px)";
      }
    }

    gsap.set(beat, { opacity, pointerEvents: opacity > 0.5 ? "auto" : "none" });
    if (caption) {
      gsap.set(caption, {
        x,
        scale,
        clipPath: clip,
        transformOrigin: side === "left" ? "left center" : "right center",
      });
    }
    beat.setAttribute("aria-hidden", opacity < 0.45 ? "true" : "false");
  });

  const segment = (index + Math.min(blend, 1)) / beatCount;
  if (rail) gsap.set(rail, { scaleX: Math.max(0.04, segment) });

  if (counter) counter.textContent = `0${index + 1} / 0${beatCount}`;
}
