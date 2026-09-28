"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroSection } from "@/components/sections/hero-section";
import { WhatSection } from "@/components/sections/what-section";
import { HowSection } from "@/components/sections/how-section";
import { WhySection } from "@/components/sections/why-section";
import { DoctorsSection } from "@/components/sections/doctors-section";
import { FaqSection } from "@/components/sections/faq-section";
import { StartSection } from "@/components/sections/start-section";
import { PATIENT, DOCTOR } from "@/lib/links";

gsap.registerPlugin(ScrollTrigger);

export function Landing() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const id = requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("load", refresh);
    };
  }, []);

  return (
    <>
      <HeroSection />
      <nav className="chapters" aria-label="On this page">
        <a href="#what">What it is</a>
        <a href="#how">How to use</a>
        <a href="#why">Why VersaLife</a>
        <a href="#doctors">For doctors</a>
        <a href="#faq">Questions</a>
        <a className="btn btn-ink" href={`${PATIENT}/register`}>
          Get started
          <span className="arrow" aria-hidden>→</span>
        </a>
      </nav>
      <WhatSection />
      <HowSection />
      <WhySection />
      <DoctorsSection />
      <FaqSection />
      <StartSection />
      <footer>
        <a className="mark" href="#top">
          <img src="/logo.svg" alt="" width={28} height={30} />
          VersaLife Health
        </a>
        <a href={`${PATIENT}/login`}>Patient app</a>
        <a href={DOCTOR}>Doctor app</a>
        <a href="#faq">FAQ</a>
      </footer>
    </>
  );
}
