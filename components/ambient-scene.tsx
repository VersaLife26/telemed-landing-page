"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/** Soft royal-blue orbs that drift behind the hero. Pointer tilt is gentle. */
export function AmbientScene() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, el.clientWidth / Math.max(el.clientHeight, 1), 0.1, 40);
    camera.position.set(0, 0, 8);

    const group = new THREE.Group();
    scene.add(group);

    const specs = [
      { color: 0x3b6cff, r: 0.72, p: [-2.4, 1.1, -1] as const },
      { color: 0x50c898, r: 0.38, p: [2.6, -0.6, 0.4] as const },
      { color: 0x9eb6ff, r: 0.95, p: [1.2, 1.6, -2.2] as const },
      { color: 0xffffff, r: 0.22, p: [-1.1, -1.4, 1.2] as const },
    ];

    const meshes = specs.map((s) => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(s.r, 48, 48),
        new THREE.MeshPhysicalMaterial({
          color: s.color,
          roughness: 0.18,
          metalness: 0.05,
          transmission: 0.55,
          thickness: 0.6,
          transparent: true,
          opacity: 0.72,
        }),
      );
      mesh.position.set(s.p[0], s.p[1], s.p[2]);
      group.add(mesh);
      return mesh;
    });

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.8, 0.015, 16, 80),
      new THREE.MeshBasicMaterial({ color: 0x50c898, transparent: true, opacity: 0.45 }),
    );
    ring.rotation.x = 1.1;
    group.add(ring);

    let raf = 0;
    let mx = 0;
    let my = 0;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      mx = ((e.clientX - rect.left) / rect.width - 0.5) * 0.6;
      my = ((e.clientY - rect.top) / rect.height - 0.5) * 0.4;
    };
    window.addEventListener("pointermove", onMove);

    const clock = new THREE.Clock();
    const tick = () => {
      const t = clock.getElapsedTime();
      if (!reduce) {
        meshes.forEach((m, i) => {
          m.position.y = specs[i].p[1] + Math.sin(t * 0.6 + i) * 0.18;
        });
        ring.rotation.z = t * 0.15;
        group.rotation.y += (mx - group.rotation.y) * 0.04;
        group.rotation.x += (-my - group.rotation.x) * 0.04;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      if (!el) return;
      camera.aspect = el.clientWidth / Math.max(el.clientHeight, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={host} className="ambient" aria-hidden />;
}
