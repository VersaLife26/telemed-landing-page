"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollVideo, prefetchClip, primeClip } from "@/components/scroll-video";
import { scrollStepVh } from "@/lib/scroll-step-vh";

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
  { src: "/video/booking-hands.mp4", fallback: "/images/feature-consult.png", alt: "Booking a visit" },
  { src: "/video/patient-home.mp4", fallback: "/images/call-patient.png", alt: "A patient at home" },
  { src: "/video/family-care.mp4", fallback: "/images/call-patient.png", alt: "A visit for someone else" },
  { src: "/video/hero.mp4", fallback: "/images/call-doctor.png", alt: "The video visit" },
  { src: "/video/doctor-workspace.mp4", fallback: "/images/feature-imaging.png", alt: "Notes after the visit" },
];

const STEP_COUNT = STEPS.length;

function clampStep(index: number) {
  return Math.min(STEP_COUNT - 1, Math.max(0, index));
}

function progressForStep(index: number) {
  return (index + 0.18) / STEP_COUNT;
}

export function HowSection() {
  const root = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollStRef = useRef<ScrollTrigger | null>(null);
  const videosRef = useRef<HTMLVideoElement[]>([]);
  const stepRef = useRef(-1);
  const fromScrollRef = useRef(false);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, deltaX: 0, axis: null as "x" | "y" | null });

  const [step, setStep] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [dragging, setDragging] = useState(false);

  const waitForClipReady = useCallback(
    (node: HTMLElement, index: number, onReady: () => void, keepUi = false) => {
      const video = node.querySelectorAll<HTMLElement>(".clip")[index]?.querySelector("video");
      if (!video) return;

      const reveal = () => {
        if (stepRef.current !== index) return;
        node.classList.add("how--media-ready", "how--steps-visible");
        onReady();
      };

      if (video.readyState >= 2) {
        reveal();
        return;
      }

      if (!keepUi) {
        node.classList.remove("how--media-ready", "how--steps-visible");
      }
      video.addEventListener("loadeddata", reveal, { once: true });
      video.addEventListener("playing", reveal, { once: true });
      video.addEventListener("error", reveal, { once: true });
    },
    [],
  );

  const updateProgressUi = useCallback((_node: HTMLElement, _index: number) => {
    /* Step position is shown in the carousel index only (no progress bars). */
  }, []);

  const setActiveStep = useCallback(
    (next: number, source: "scroll" | "swipe" | "nav" | "key") => {
      const node = root.current;
      if (!node) return;
      const index = clampStep(next);
      if (index === stepRef.current) {
        if (source === "scroll") updateProgressUi(node, index);
        return;
      }

      const fromScroll = source === "scroll";
      stepRef.current = index;
      if (!fromScroll) {
        node.classList.remove("how--media-ready", "how--steps-visible");
      } else {
        node.classList.add("how--live", "how--steps-visible");
      }
      setStep(index);
      setDragPx(0);

      const clips = node.querySelectorAll<HTMLElement>(".clip");
      clips.forEach((clip, i) => {
        const on = i === index;
        clip.classList.toggle("is-on", on);
        if (!on) {
          gsap.set(clip, { opacity: 0, scale: 1.04, visibility: "hidden" });
        }
      });

      primeClip(clips[index]);
      prefetchClip(clips[index + 1]);
      prefetchClip(clips[index - 1]);
      videosRef.current.forEach((video, i) => {
        if (i === index) video.play().catch(() => undefined);
        else video.pause();
      });

      updateProgressUi(node, index);

      const showActive = () => {
        const active = clips[index];
        if (!active) return;
        if (fromScroll) {
          gsap.set(active, { opacity: 1, scale: 1, visibility: "visible" });
        } else {
          gsap.to(active, {
            opacity: 1,
            scale: 1,
            duration: 0.45,
            ease: "power2.out",
            visibility: "visible",
          });
        }
      };

      waitForClipReady(node, index, showActive, fromScroll);

      if (source !== "scroll") {
        fromScrollRef.current = true;
        const st = scrollStRef.current;
        if (st) {
          const p = progressForStep(index);
          st.scroll(st.start + p * (st.end - st.start));
        }
        requestAnimationFrame(() => {
          fromScrollRef.current = false;
        });
      }
    },
    [updateProgressUi, waitForClipReady],
  );

  const resetHow = useCallback(() => {
    const node = root.current;
    if (!node) return;
    node.classList.remove("how--live", "how--steps-visible", "how--media-ready");
    stepRef.current = -1;
    setStep(0);
    setDragPx(0);
    node.querySelectorAll<HTMLElement>(".clip").forEach((clip) => {
      gsap.set(clip, { opacity: 0, visibility: "hidden" });
      clip.classList.remove("is-on");
    });
    videosRef.current.forEach((video) => video.pause());
  }, []);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      node.classList.add("how--live");
      videosRef.current = gsap.utils.toArray<HTMLVideoElement>(".clip video");
      setStep(STEP_COUNT - 1);
      stepRef.current = STEP_COUNT - 1;
      const clips = node.querySelectorAll<HTMLElement>(".clip");
      primeClip(clips[STEP_COUNT - 1]);
      clips[STEP_COUNT - 1]?.classList.add("is-on");
      updateProgressUi(node, STEP_COUNT - 1);
      videosRef.current[STEP_COUNT - 1]?.play().catch(() => undefined);
      waitForClipReady(node, STEP_COUNT - 1, () => {
        gsap.set(clips[STEP_COUNT - 1], { opacity: 1, scale: 1, visibility: "visible" });
      });
      return;
    }

    const ctx = gsap.context(() => {
      videosRef.current = gsap.utils.toArray<HTMLVideoElement>(".clip video");
      videosRef.current.forEach((video) => {
        video.loop = true;
      });

      const warmClips = () => {
        const clips = node.querySelectorAll<HTMLElement>(".clip");
        prefetchClip(clips[0]);
        prefetchClip(clips[1]);
      };
      ScrollTrigger.create({
        trigger: node,
        start: "top bottom",
        end: "top top",
        onEnter: warmClips,
        onEnterBack: warmClips,
      });

      scrollStRef.current = ScrollTrigger.create({
        trigger: node,
        start: "top top",
        end: `+=${Math.round(STEP_COUNT * scrollStepVh() * 1.02)}%`,
        pin: ".how-pin",
        scrub: 0.9,
        anticipatePin: 1,
        onEnter: () => {
          node.classList.add("how--live");
          const clips = node.querySelectorAll<HTMLElement>(".clip");
          primeClip(clips[0]);
          prefetchClip(clips[1]);
          setActiveStep(0, "nav");
        },
        onLeaveBack: () => resetHow(),
        onLeave: () => resetHow(),
        onUpdate: (self) => {
          if (!self.isActive || fromScrollRef.current || dragRef.current.active) return;
          const scaled = self.progress * STEP_COUNT;
          const index = clampStep(Math.floor(Math.min(scaled, STEP_COUNT - 0.001)));
          if (index !== stepRef.current) setActiveStep(index, "scroll");
          else updateProgressUi(node, index);
        },
      });
    }, node);

    return () => ctx.revert();
  }, [resetHow, setActiveStep, updateProgressUi, waitForClipReady]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!root.current?.classList.contains("how--live")) return;
      if (event.key === "ArrowRight") setActiveStep(stepRef.current + 1, "key");
      if (event.key === "ArrowLeft") setActiveStep(stepRef.current - 1, "key");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setActiveStep]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!root.current?.classList.contains("how--media-ready")) return;
    dragRef.current = { active: true, startX: event.clientX, startY: event.clientY, deltaX: 0, axis: null };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.axis) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      drag.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (drag.axis !== "x") return;
    event.preventDefault();
    drag.deltaX = dx;
    const atEdge = (stepRef.current === 0 && dx > 0) || (stepRef.current === STEP_COUNT - 1 && dx < 0);
    setDragPx(atEdge ? dx * 0.2 : dx);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    drag.active = false;
    setDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);

    if (drag.axis === "x") {
      const threshold = Math.min(80, window.innerWidth * 0.14);
      if (drag.deltaX <= -threshold) setActiveStep(stepRef.current + 1, "swipe");
      else if (drag.deltaX >= threshold) setActiveStep(stepRef.current - 1, "swipe");
      else setDragPx(0);
    } else {
      setDragPx(0);
    }
    drag.axis = null;
    drag.deltaX = 0;
  };

  const trackShift = `calc(-${step * 100}% + ${dragPx}px)`;

  return (
    <section className="how" id="how" ref={root}>
      <div className="how-pin">
        <div className="how-media">
          <ScrollVideo clips={CLIPS} />
        </div>
        <div className="how-shade" aria-hidden />

        <div className="how-ui">
          <button
            type="button"
            className="how-nav how-nav-prev"
            aria-label="Previous step"
            disabled={step === 0}
            onClick={() => setActiveStep(step - 1, "nav")}
          >
            ←
          </button>

          <div
            className={dragging ? "how-swipe-viewport is-dragging" : "how-swipe-viewport"}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div
              ref={trackRef}
              className={dragging ? "how-swipe-track no-transition" : "how-swipe-track"}
              style={{ transform: `translateX(${trackShift})` }}
            >
              {STEPS.map((item, i) => (
                <article
                  className={i % 2 === 0 ? "how-slide is-left" : "how-slide is-right"}
                  key={item.title}
                  aria-hidden={step !== i}
                >
                  <div className="step-caption">
                    <p className="step-eyebrow">
                      <span className="step-num">0{i + 1}</span>
                      <span>How to use it</span>
                    </p>
                    <h2>{item.title}</h2>
                    <p className="step-body">{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="how-nav how-nav-next"
            aria-label="Next step"
            disabled={step === STEP_COUNT - 1}
            onClick={() => setActiveStep(step + 1, "nav")}
          >
            →
          </button>

          <p className="how-step-index" aria-live="polite">
            0{step + 1} / 0{STEP_COUNT}
          </p>
        </div>
      </div>
    </section>
  );
}
