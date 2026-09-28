"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DOCTOR, PATIENT } from "@/lib/links";

gsap.registerPlugin(ScrollTrigger);

const VERSA = "Versa";
const LIFE = "Life";

export function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: node,
          start: "top top",
          end: "+=140%",
          scrub: 0.65,
          pin: ".hero-pin",
          anticipatePin: 1,
        },
      });
      tl.fromTo(
        ".hero-letter",
        { y: 56, rotateX: 70, opacity: 0 },
        { y: 0, rotateX: 0, opacity: 1, stagger: 0.035, duration: 0.7, ease: "power2.out" },
      )
        .fromTo(".hero-sub", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 }, "-=0.2")
        .to(".hero-film", { scale: 0.84, borderRadius: 32, duration: 0.55 });
    }, node);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero-pin">
        <header className="nav">
          <a className="mark" href="#top" aria-label="VersaLife">
            <img src="/logo.svg" alt="" width={40} height={42} />
          </a>
          <nav className="nav-pills" aria-label="Page">
            <a className="is-current" href="#top">Home</a>
            <a href="#what">What it is</a>
            <a href="#how">How to use</a>
            <a href="#why">Why VersaLife</a>
          </nav>
          <div className="nav-end">
            <a className="text-link" href="#faq">FAQ</a>
            <a className="text-link" href={DOCTOR}>Doctor sign in</a>
            <a className="btn btn-light" href={`${PATIENT}/login`}>Log in</a>
          </div>
        </header>
        <div className="hero-film">
          <video className="hero-video" autoPlay muted loop playsInline poster="/images/hero-clinician.png">
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="hero-copy">
          <h1 className="hero-title">
            {VERSA.split("").map((letter, i) => (
              <span className="hero-letter is-navy" key={`versa-${i}`}>
                {letter}
              </span>
            ))}
            {LIFE.split("").map((letter, i) => (
              <span className="hero-letter is-mint" key={`life-${i}`}>
                {letter}
              </span>
            ))}
          </h1>
          <p className="hero-sub">A doctor visit, from the room you are already in.</p>
        </div>
      </div>
    </section>
  );
}
