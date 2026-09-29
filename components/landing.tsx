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
import { ChaptersNav } from "@/components/chapters-nav";
import { HeroSplash } from "@/components/hero-splash";
import { SiteFooter } from "@/components/site-footer";
import { HERO_VIDEO, prefetchVideoUrls, STORY_CLIPS } from "@/lib/warm-videos";

gsap.registerPlugin(ScrollTrigger);

export function Landing() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const id = requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);

    prefetchVideoUrls([HERO_VIDEO]);
    const warm = () => prefetchVideoUrls([...STORY_CLIPS]);
    const hero = document.querySelector<HTMLVideoElement>(".hero-film video");
    if (hero && hero.readyState >= 2) warm();
    else hero?.addEventListener("loadeddata", warm, { once: true });
    const fallback = window.setTimeout(warm, 1200);

    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(fallback);
      window.removeEventListener("load", refresh);
    };
  }, []);

  return (
    <>
      <HeroSplash />
      <HeroSection />
      <ChaptersNav />
      <WhatSection />
      <HowSection />
      <WhySection />
      <DoctorsSection />
      <FaqSection />
      <StartSection />
      <SiteFooter />
    </>
  );
}
