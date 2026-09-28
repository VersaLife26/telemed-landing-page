"use client";

import { useEffect, useRef } from "react";
import { useVisible } from "@/components/scenes/use-visible";

/** Soft moving blue and mint light, used when a filmed clip is not ready. */
export function LightField() {
  const host = useRef<HTMLCanvasElement>(null);
  const { setNode, visible } = useVisible<HTMLCanvasElement>();

  useEffect(() => {
    const canvas = host.current;
    if (!canvas || !visible) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const fit = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    fit();

    let raf = 0;
    const tick = (t: number) => {
      const w = canvas.width;
      const h = canvas.height;
      const shift = reduce ? 0 : t / 4000;
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#f4f8ff");
      g.addColorStop(0.45 + Math.sin(shift) * 0.08, "#d7e6ff");
      g.addColorStop(1, "#e7f8f1");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(80, 200, 152, 0.18)";
      ctx.beginPath();
      ctx.arc(w * 0.7, h * (0.4 + Math.sin(shift) * 0.05), Math.min(w, h) * 0.28, 0, Math.PI * 2);
      ctx.fill();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", fit);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
    };
  }, [visible]);

  return <canvas ref={(node) => { host.current = node; setNode(node); }} className="scene" aria-hidden />;
}
