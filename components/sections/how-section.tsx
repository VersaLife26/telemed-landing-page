"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionValue } from "framer-motion";
import { ScrollVideo, prefetchClip, primeClip } from "@/components/scroll-video";
import { RevealImageMask } from "@/components/ui/reveal-image-mask";
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
const STEP_SWAP = 0.38;

function clampStep(index: number) {
  return Math.min(STEP_COUNT - 1, Math.max(0, index));
}

function progressForStep(index: number) {
  return (index + 0.18) / STEP_COUNT;
}

function stepFromProgress(progress: number) {
  const scaled = progress * STEP_COUNT;
  const index = clampStep(Math.floor(Math.min(scaled, STEP_COUNT - 0.001)));
  const blend = scaled - index;
  return blend >= STEP_SWAP && index < STEP_COUNT - 1 ? index + 1 : index;
}

export function HowSection() {
  const root = useRef<HTMLElement>(null);
  const scrollStRef = useRef<ScrollTrigger | null>(null);
  const videosRef = useRef<HTMLVideoElement[]>([]);
  const stepRef = useRef(-1);
  const fromScrollRef = useRef(false);

  const [step, setStep] = useState(0);
  const maskProgress = useMotionValue(0);
  const maskTweenRef = useRef<gsap.core.Tween | null>(null);

  const playMaskReveal = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      maskProgress.set(1);
      return;
    }
    maskTweenRef.current?.kill();
    maskProgress.set(0);
    const proxy = { t: 0 };
    maskTweenRef.current = gsap.to(proxy, {
      t: 1,
      duration: 1.1,
      ease: "power3.out",
      overwrite: true,
      onUpdate() {
        maskProgress.set(proxy.t);
      },
    });
  }, [maskProgress]);

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

  const setActiveStep = useCallback(
    (next: number, source: "scroll" | "nav" | "key") => {
      const node = root.current;
      if (!node) return;
      const index = clampStep(next);
      if (index === stepRef.current) return;

      const fromScroll = source === "scroll";
      stepRef.current = index;
      if (!fromScroll) {
        node.classList.remove("how--media-ready", "how--steps-visible");
      } else {
        node.classList.add("how--live", "how--steps-visible");
      }
      setStep(index);
      playMaskReveal();

      const clips = node.querySelectorAll<HTMLElement>(".clip");
      clips.forEach((clip, i) => {
        const on = i === index;
        clip.classList.toggle("is-on", on);
        if (!on) {
          gsap.set(clip, { opacity: 0, scale: 1.02, visibility: "hidden" });
        }
      });

      primeClip(clips[index]);
      prefetchClip(clips[index + 1]);
      prefetchClip(clips[index - 1]);
      videosRef.current.forEach((video, i) => {
        if (i === index) video.play().catch(() => undefined);
        else video.pause();
      });

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
    [playMaskReveal, waitForClipReady],
  );

  const resetHow = useCallback(() => {
    const node = root.current;
    if (!node) return;
    node.classList.remove("how--live", "how--steps-visible", "how--media-ready");
    stepRef.current = -1;
    setStep(0);
    node.querySelectorAll<HTMLElement>(".clip").forEach((clip) => {
      gsap.set(clip, { opacity: 0, visibility: "hidden" });
      clip.classList.remove("is-on");
    });
    videosRef.current.forEach((video) => video.pause());
    maskTweenRef.current?.kill();
    maskProgress.set(0);
  }, [maskProgress]);

  const bootstrapHow = useCallback(
    (index: number) => {
      const node = root.current;
      if (!node) return;
      node.classList.add("how--live", "how--steps-visible");
      stepRef.current = index;
      setStep(index);
      playMaskReveal();

      const clips = node.querySelectorAll<HTMLElement>(".clip");
      clips.forEach((clip, i) => {
        const on = i === index;
        clip.classList.toggle("is-on", on);
        gsap.set(clip, {
          opacity: on ? 1 : 0,
          scale: 1,
          visibility: on ? "visible" : "hidden",
        });
      });

      primeClip(clips[index]);
      prefetchClip(clips[index + 1]);
      videosRef.current.forEach((video, i) => {
        if (i === index) video.play().catch(() => undefined);
        else video.pause();
      });

      waitForClipReady(
        node,
        index,
        () => {
          const active = clips[index];
          if (active) gsap.set(active, { opacity: 1, scale: 1, visibility: "visible" });
        },
        true,
      );
    },
    [playMaskReveal, waitForClipReady],
  );

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      maskProgress.set(1);
      node.classList.add("how--live", "how--media-ready", "how--steps-visible");
      videosRef.current = gsap.utils.toArray<HTMLVideoElement>(".clip video");
      setStep(STEP_COUNT - 1);
      stepRef.current = STEP_COUNT - 1;
      const clips = node.querySelectorAll<HTMLElement>(".clip");
      primeClip(clips[STEP_COUNT - 1]);
      clips[STEP_COUNT - 1]?.classList.add("is-on");
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
        end: `+=${Math.round(STEP_COUNT * scrollStepVh())}%`,
        pin: ".how-pin",
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onEnter: () => bootstrapHow(stepRef.current >= 0 ? stepRef.current : 0),
        onToggle: (self) => node.classList.toggle("is-pinned", self.isActive),
        onLeaveBack: () => {
          node.classList.remove("is-pinned");
          resetHow();
        },
        onUpdate: (self) => {
          if (!self.isActive || fromScrollRef.current) return;
          const displayIndex = stepFromProgress(self.progress);
          if (displayIndex !== stepRef.current) setActiveStep(displayIndex, "scroll");
        },
      });
    }, node);

    return () => {
      maskTweenRef.current?.kill();
      ctx.revert();
    };
  }, [bootstrapHow, resetHow, setActiveStep, waitForClipReady]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!root.current?.classList.contains("how--live")) return;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") setActiveStep(stepRef.current + 1, "key");
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") setActiveStep(stepRef.current - 1, "key");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setActiveStep]);

  return (
    <section className="how" id="how" ref={root}>
      <div className="how-pin">
        <div className="how-split">
          <div className="how-visual">
            <div className="how-media-frame">
              <RevealImageMask shape="rounded" progress={maskProgress} className="how-reveal-mask">
                <div className="how-media">
                  <ScrollVideo clips={CLIPS} />
                </div>
              </RevealImageMask>
            </div>
          </div>

          <div className="how-copy">
            <p className="how-copy-eyebrow">How to use it</p>

            <div className="how-steps">
              {STEPS.map((item, i) => (
                <article
                  key={item.title}
                  className={step === i ? "how-step is-active" : "how-step"}
                  aria-hidden={step !== i}
                >
                  <div className="step-caption">
                    <p className="step-eyebrow">
                      <span className="step-num">0{i + 1}</span>
                      <span>Step {i + 1}</span>
                    </p>
                    <h2>{item.title}</h2>
                    <p className="step-body">{item.body}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="how-copy-foot">
              <button
                type="button"
                className="how-nav how-nav-prev"
                aria-label="Previous step"
                disabled={step === 0}
                onClick={() => setActiveStep(step - 1, "nav")}
              >
                ←
              </button>
              <p className="how-step-index" aria-live="polite">
                0{step + 1} / 0{STEP_COUNT}
              </p>
              <button
                type="button"
                className="how-nav how-nav-next"
                aria-label="Next step"
                disabled={step === STEP_COUNT - 1}
                onClick={() => setActiveStep(step + 1, "nav")}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
