"use client";

import { useEffect, useState } from "react";
import { dispatchSplashDone, hasSeenSplash, markSplashSeen } from "@/lib/splash";

const SPLASH_MS = 3000;
const FADE_MS = 420;

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function HeroSplash() {
  const [phase, setPhase] = useState<"run" | "out" | "off">("off");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (hasSeenSplash() || reduce) {
      markSplashSeen();
      dispatchSplashDone();
      return;
    }

    setPhase("run");
    document.documentElement.classList.add("splash-active");

    (async () => {
      await sleep(SPLASH_MS);

      setPhase("out");
      await sleep(FADE_MS);
      markSplashSeen();
      document.documentElement.classList.remove("splash-active");
      setPhase("off");
      dispatchSplashDone();
    })();

    return () => {
      document.documentElement.classList.remove("splash-active");
    };
  }, []);

  if (phase === "off") return null;

  return (
    <div className={phase === "out" ? "hero-splash is-out" : "hero-splash"} aria-hidden={phase === "out"}>
      <div className="hero-splash-inner">
        <img className="hero-splash-logo" src="/logo.svg" alt="" width={88} height={92} />
        <p className="hero-splash-wordmark">
          Versa<span>Life</span>
        </p>
      </div>
    </div>
  );
}
