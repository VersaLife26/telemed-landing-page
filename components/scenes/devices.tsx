"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useVisible } from "@/components/scenes/use-visible";

function screenTexture(label: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);
  ctx.fillStyle = "#eef3fb";
  ctx.fillRect(0, 0, 512, 320);
  ctx.fillStyle = "#3b6cff";
  ctx.fillRect(36, 36, 180, 248);
  ctx.fillStyle = "#50c898";
  ctx.beginPath();
  ctx.arc(360, 120, 54, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#172033";
  ctx.font = "600 28px sans-serif";
  ctx.fillText(label, 36, 28);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** A phone and a laptop, slowly turning. */
export function FloatingDevices() {
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
    const camera = new THREE.PerspectiveCamera(32, el.clientWidth / Math.max(el.clientHeight, 1), 0.1, 30);
    camera.position.set(0, 0.4, 8);

    const group = new THREE.Group();
    scene.add(group);
    const body = new THREE.MeshStandardMaterial({ color: 0xf4f7fb, roughness: 0.35, metalness: 0.05 });
    const edge = new THREE.MeshStandardMaterial({ color: 0xd5deea, roughness: 0.5 });

    const laptop = new THREE.Group();
    const base = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 2.1), body);
    const lid = new THREE.Mesh(new THREE.BoxGeometry(3.1, 1.9, 0.08), edge);
    lid.position.set(0, 1.05, -1);
    lid.rotation.x = -0.25;
    const display = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 1.55), new THREE.MeshBasicMaterial({ map: screenTexture("Visit") }));
    display.position.set(0, 1.08, -0.9);
    display.rotation.x = -0.25;
    laptop.add(base, lid, display);
    laptop.position.x = -1.1;
    group.add(laptop);

    const phone = new THREE.Group();
    const shell = new THREE.Mesh(new THREE.BoxGeometry(1.05, 2.05, 0.08), body);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 1.7), new THREE.MeshBasicMaterial({ map: screenTexture("") }));
    glass.position.z = 0.05;
    phone.add(shell, glass);
    phone.position.set(1.7, 0.2, 0.4);
    phone.rotation.z = 0.08;
    group.add(phone);

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(2, 4, 3);
    scene.add(key);

    let raf = 0;
    const tick = () => {
      group.rotation.y += 0.004;
      group.position.y = Math.sin(performance.now() / 900) * 0.08;
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
      renderer.dispose();
      if (renderer.domElement.parentElement === el) el.removeChild(renderer.domElement);
    };
  }, [visible]);

  return <div ref={(node) => { host.current = node; setNode(node); }} className="scene" aria-hidden />;
}
