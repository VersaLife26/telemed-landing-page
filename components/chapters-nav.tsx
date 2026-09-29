"use client";

import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PATIENT } from "@/lib/links";

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  { id: "what", href: "#what", label: "What it is" },
  { id: "how", href: "#how", label: "How to use" },
  { id: "why", href: "#why", label: "Why VersaLife", brand: true },
  { id: "doctors", href: "#doctors", label: "For doctors" },
  { id: "faq", href: "#faq", label: "Questions" },
] as const;

export function ChaptersNav() {
  const root = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const gliderRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [active, setActive] = useState<string>("what");

  useEffect(() => {
    const nodes = LINKS.map((link) => document.getElementById(link.id)).filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit?.target.id) setActive(hit.target.id);
      },
      { rootMargin: "-42% 0px -48% 0px", threshold: [0.08, 0.2, 0.45, 0.7] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const glider = gliderRef.current;
    const index = LINKS.findIndex((link) => link.id === active);
    const link = linkRefs.current[index];
    if (!track || !glider || !link) return;

    const trackBox = track.getBoundingClientRect();
    const linkBox = link.getBoundingClientRect();
    glider.style.width = `${linkBox.width}px`;
    glider.style.transform = `translateX(${linkBox.left - trackBox.left}px)`;
  }, [active]);

  useEffect(() => {
    const shell = root.current?.querySelector(".chapters-shell");
    if (!shell) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        shell,
        { y: -16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#what",
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        },
      );

      ScrollTrigger.create({
        trigger: "#what",
        start: "top 72px",
        end: "bottom top",
        toggleClass: { targets: root.current, className: "is-stuck" },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const jump = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const id = href.replace("#", "");
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    setActive(id);
  };

  return (
    <nav className="chapters" aria-label="On this page" ref={root}>
      <div className="chapters-shell">
        <div className="chapters-track" ref={trackRef}>
          <span className="chapters-glider" ref={gliderRef} aria-hidden />
          {LINKS.map((link, i) => (
            <a
              key={link.id}
              href={link.href}
              ref={(node) => {
                linkRefs.current[i] = node;
              }}
              className={active === link.id ? "chapters-link is-active" : "chapters-link"}
              aria-current={active === link.id ? "location" : undefined}
              onClick={(event) => jump(event, link.href)}
            >
              {"brand" in link && link.brand ? (
                <>
                  Why{" "}
                  <span className="chapters-wordmark">
                    <span className="is-navy">Versa</span>
                    <span className="is-mint">Life</span>
                  </span>
                </>
              ) : (
                link.label
              )}
            </a>
          ))}
        </div>
        <a className="btn btn-chapters" href={`${PATIENT}/register`}>
          Get started
          <span className="arrow" aria-hidden>
            →
          </span>
        </a>
      </div>
    </nav>
  );
}
