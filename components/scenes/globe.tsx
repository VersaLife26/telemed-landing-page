"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useVisible } from "@/components/scenes/use-visible";

function latLon(lat: number, lon: number, radius: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

/** A quiet globe with a cluster over Sri Lanka and an arc to a doctor. */
export function ConnectionGlobe() {
  const host = useRef<HTMLDivElement>(null);
  const { setNode, visible } = useVisible<HTMLDivElement>();

  useEffect(() => {
    const el = host.current;
    if (!el || !visible) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, el.clientWidth / Math.max(el.clientHeight, 1), 0.1, 30);
    camera.position.z = 7;

    const group = new THREE.Group();
    scene.add(group);

    const globeDots = new Float32Array(420 * 3);
    for (let i = 0; i < 420; i++) {
      const v = latLon(Math.random() * 140 - 70, Math.random() * 360 - 180, 2.05);
      globeDots.set([v.x, v.y, v.z], i * 3);
    }
    const globe = new THREE.BufferGeometry();
    globe.setAttribute("position", new THREE.BufferAttribute(globeDots, 3));
    group.add(new THREE.Points(globe, new THREE.PointsMaterial({ color: 0x9eb6ff, size: 0.035, transparent: true, opacity: 0.7 })));

    const island = new Float32Array(80 * 3);
    for (let i = 0; i < 80; i++) {
      const v = latLon(6 + Math.random() * 4, 79.5 + Math.random() * 2.4, 2.12);
      island.set([v.x, v.y, v.z], i * 3);
    }
    const islandGeo = new THREE.BufferGeometry();
    islandGeo.setAttribute("position", new THREE.BufferAttribute(island, 3));
    group.add(new THREE.Points(islandGeo, new THREE.PointsMaterial({ color: 0x50c898, size: 0.07 })));

    const a = latLon(7.2, 80.6, 2.15);
    const b = latLon(28, 40, 2.15);
    const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(3.1);
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    group.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(40)),
        new THREE.LineBasicMaterial({ color: 0x2f6bff }),
      ),
    );

    let raf = 0;
    const tick = () => {
      group.rotation.y += 0.003;
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
      globe.dispose();
      islandGeo.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === el) el.removeChild(renderer.domElement);
    };
  }, [visible]);

  return <div ref={(node) => { host.current = node; setNode(node); }} className="scene" aria-hidden />;
}
