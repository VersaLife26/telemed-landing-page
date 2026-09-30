"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DOCTOR, PATIENT } from "@/lib/links";
import { waitForSplashDone } from "@/lib/splash";
import { MobileMenuTrigger } from "@/components/mobile-menu";
import { scrollStepVh } from "@/lib/scroll-step-vh";
import { HERO_VIDEO } from "@/lib/warm-videos";

gsap.registerPlugin(ScrollTrigger);

const TITLE = "VersaLife";
const SUBTITLE = "A doctor visit, from the room you are already in.";
const VERSA_LEN = 5;

function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const id = window.setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      window.clearTimeout(id);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

function waitForHeroVideo(video: HTMLVideoElement, signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    if (video.readyState >= 2) {
      resolve();
      return;
    }

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      video.removeEventListener("loadeddata", finish);
      video.removeEventListener("canplay", finish);
      window.clearTimeout(cap);
      resolve();
    };

    video.addEventListener("loadeddata", finish, { once: true });
    video.addEventListener("canplay", finish, { once: true });
    video.load();

    const cap = window.setTimeout(finish, 1800);
    signal.addEventListener("abort", () => {
      window.clearTimeout(cap);
      finish();
    });
  });
}

export function HeroSection() {
  const root = useRef<HTMLElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [titleLen, setTitleLen] = useState(0);
  const [subLen, setSubLen] = useState(0);
  const [cursor, setCursor] = useState<"title" | "sub" | null>("title");

  const markVideoReady = () => {
    filmRef.current?.classList.add("is-playing");
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.setAttribute("fetchpriority", "high");
    if (video.readyState >= 2) markVideoReady();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    const ac = new AbortController();

    const revealAll = () => {
      setShowSkeleton(false);
      setTitleLen(TITLE.length);
      setSubLen(SUBTITLE.length);
      setCursor(null);
      root.current?.classList.add("hero--typed");
    };

    const fallback = window.setTimeout(revealAll, 5200);

    (async () => {
      if (reduce) {
        window.clearTimeout(fallback);
        revealAll();
        return;
      }

      await waitForSplashDone();
      if (cancelled) return;

      const video = videoRef.current;
      if (video) {
        await waitForHeroVideo(video, ac.signal);
        markVideoReady();
      }

      try {
        await sleep(320, ac.signal);
        if (cancelled) return;
        setShowSkeleton(false);

        for (let i = 1; i <= TITLE.length; i += 1) {
          await sleep(78, ac.signal);
          if (cancelled) return;
          setTitleLen(i);
        }

        await sleep(220, ac.signal);
        if (cancelled) return;
        setCursor("sub");

        for (let i = 1; i <= SUBTITLE.length; i += 1) {
          await sleep(26, ac.signal);
          if (cancelled) return;
          setSubLen(i);
        }

        if (cancelled) return;
        setCursor(null);
        root.current?.classList.add("hero--typed");
        window.clearTimeout(fallback);
      } catch {
        /* aborted between strict-mode remounts */
      }
    })();

    return () => {
      cancelled = true;
      ac.abort();
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: node,
          start: "top top",
          end: `+=${Math.round(scrollStepVh() * 1.95)}%`,
          scrub: 0.65,
          pin: ".hero-pin",
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onToggle: (self) => node.classList.toggle("is-pinned", self.isActive),
        },
      }).to(".hero-film", { scale: 0.84, borderRadius: 32, duration: 0.55 });
    }, node);

    return () => ctx.revert();
  }, []);

  const titleText = TITLE.slice(0, titleLen);
  const subText = SUBTITLE.slice(0, subLen);

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero-pin">
        <header className="nav">
          <a className="mark" href="#top" aria-label="VersaLife">
            <img src="/logo.svg" alt="" width={40} height={42} />
          </a>
          <nav className="nav-pills" aria-label="Page">
            <a className="is-current" href="#top">
              Home
            </a>
            <a href="#what">What it is</a>
            <a href="#how">How to use</a>
            <a href="#why">Why VersaLife</a>
          </nav>
          <div className="nav-end">
            <a className="text-link" href="#faq">
              FAQ
            </a>
            <a className="text-link" href={DOCTOR}>
              Doctor sign in
            </a>
            <a className="btn btn-light" href={`${PATIENT}/login`}>
              Log in
            </a>
            <MobileMenuTrigger className="mobile-menu-trigger nav-menu-trigger" />
          </div>
        </header>
        <div className="hero-film" ref={filmRef}>
          <video
            ref={videoRef}
            className="hero-video"
            src={HERO_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onLoadedData={markVideoReady}
            onPlaying={markVideoReady}
          />
        </div>
        <div className="hero-copy">
          <div className="hero-type-stack">
            <div className={showSkeleton ? "hero-skeleton is-visible" : "hero-skeleton"} aria-hidden={!showSkeleton}>
              <span className="hero-skel hero-skel-title" />
              <span className="hero-skel hero-skel-sub" />
            </div>

            <h1 className="hero-title" aria-label={TITLE}>
              <span className="hero-title-live">
                {titleText.split("").map((char, i) => (
                  <span className={i < VERSA_LEN ? "hero-char is-navy" : "hero-char is-mint"} key={`t-${i}`}>
                    {char}
                  </span>
                ))}
                {!showSkeleton && cursor === "title" && titleLen < TITLE.length && (
                  <span className="hero-cursor" aria-hidden>
                    |
                  </span>
                )}
              </span>
            </h1>

            <p className="hero-sub">
              <span className="hero-sub-live">
                {subText}
                {cursor === "sub" && subLen < SUBTITLE.length && (
                  <span className="hero-cursor is-sub" aria-hidden>
                    |
                  </span>
                )}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
