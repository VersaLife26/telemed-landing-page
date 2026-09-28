"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useVisible } from "@/components/scenes/use-visible";

/** Mint pulse moving through a field of blue points. */
export function PulseRibbon() {
  const host = useRef<HTMLDivElement>(null);
  const { setNode, visible } = useVisible<HTMLDivElement>();

  useEffect(() => {
    const el = host.current;
    if (!el || !visible) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, el.clientWidth / Math.max(el.clientHeight, 1), 0.1, 40);
    camera.position.z = 8;

    const count = 80;
    const positions = new Float32Array(count * 3);
    const lineGeo = new THREE.BufferGeometry();
    const lineAttr = new THREE.BufferAttribute(positions, 3);
    lineGeo.setAttribute("position", lineAttr);
    const line = new THREE.Line(
      lineGeo,
      new THREE.LineBasicMaterial({ color: 0x50c898, transparent: true, opacity: 0.9 }),
    );
    scene.add(line);

    const dots = new THREE.BufferGeometry();
    const dotPos = new Float32Array(180 * 3);
    for (let i = 0; i < 180; i++) {
      dotPos[i * 3] = (Math.random() - 0.5) * 14;
      dotPos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      dotPos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    dots.setAttribute("position", new THREE.BufferAttribute(dotPos, 3));
    scene.add(new THREE.Points(dots, new THREE.PointsMaterial({ color: 0x3b6cff, size: 0.045, transparent: true, opacity: 0.55 })));

    let raf = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      const t = reduce ? 0 : clock.getElapsedTime();
      for (let i = 0; i < count; i++) {
        const x = (i / (count - 1) - 0.5) * 12;
        positions[i * 3] = x;
        positions[i * 3 + 1] = Math.sin(x * 0.9 + t * 1.6) * 0.85;
        positions[i * 3 + 2] = Math.cos(x * 0.4 + t) * 0.35;
      }
      lineAttr.needsUpdate = true;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      camera.aspect = el.clientWidth / Math.max(el.clientHeight, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      line.geometry.dispose();
      dots.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === el) el.removeChild(renderer.domElement);
    };
  }, [visible]);

  return <div ref={(node) => { host.current = node; setNode(node); }} className="scene" aria-hidden />;
}
