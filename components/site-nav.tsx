"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { MobileMenuTrigger } from "@/components/mobile-menu";
import { DOCTOR, PATIENT } from "@/lib/links";
import { NAV_SECTIONS, activeSectionId, type NavSectionId } from "@/lib/nav-sections";

export function SiteNav() {
  const trackRef = useRef<HTMLDivElement>(null);
  const gliderRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const activeRef = useRef<NavSectionId>(NAV_SECTIONS[0].id);
  const rafRef = useRef<number | null>(null);

  const [active, setActive] = useState<NavSectionId>(NAV_SECTIONS[0].id);

  const positionGlider = useCallback(() => {
    const track = trackRef.current;
    const glider = gliderRef.current;
    const index = NAV_SECTIONS.findIndex((link) => link.id === activeRef.current);
    const link = linkRefs.current[index];
    if (!track || !glider || !link || index < 0) return;

    const trackBox = track.getBoundingClientRect();
    const linkBox = link.getBoundingClientRect();
    const x = linkBox.left - trackBox.left + track.scrollLeft;
    glider.style.width = `${linkBox.width}px`;
    glider.style.transform = `translate3d(${x}px, 0, 0)`;

  }, []);

  const syncFromScroll = useCallback(() => {
    const next = activeSectionId();
    if (next !== activeRef.current) {
      activeRef.current = next;
      setActive(next);
      window.dispatchEvent(new CustomEvent("versalife:section", { detail: next }));
    } else {
      positionGlider();
    }
  }, [positionGlider]);

  useLayoutEffect(() => {
    positionGlider();
  }, [active, positionGlider]);

  useEffect(() => {
    const schedule = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        syncFromScroll();
        positionGlider();
      });
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);

    const track = trackRef.current;
    const ro = track ? new ResizeObserver(schedule) : null;
    if (track && ro) ro.observe(track);

    document.fonts?.ready.then(schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
      ro?.disconnect();
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [syncFromScroll, positionGlider]);

  const jump = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const id = href.replace("#", "");
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    activeRef.current = id as NavSectionId;
    setActive(id as NavSectionId);
    window.dispatchEvent(new CustomEvent("versalife:section", { detail: id }));
    requestAnimationFrame(() => positionGlider());
  };

  return (
    <header className="site-nav" aria-label="Site">
      <div className="site-nav-shell">
        <a className="site-nav-mark" href="#top" aria-label="VersaLife home">
          <img src="/logo.svg" alt="" width={40} height={42} />
        </a>

        <nav className="site-nav-track" aria-label="On this page" ref={trackRef}>
          <span className="site-nav-glider" ref={gliderRef} aria-hidden />
          {NAV_SECTIONS.map((link, i) => (
            <a
              key={link.id}
              href={link.href}
              ref={(node) => {
                linkRefs.current[i] = node;
              }}
              className={active === link.id ? "site-nav-link is-active" : "site-nav-link"}
              aria-label={link.label}
              aria-current={active === link.id ? "location" : undefined}
              onClick={(event) => jump(event, link.href)}
            >
              <span className="site-nav-label site-nav-label--full" aria-hidden>
                {"brand" in link && link.brand ? (
                  <>
                    Why{" "}
                    <span className="site-nav-wordmark">
                      <span className="is-navy">Versa</span>
                      <span className="is-mint">Life</span>
                    </span>
                  </>
                ) : (
                  link.label
                )}
              </span>
              <span className="site-nav-label site-nav-label--short" aria-hidden>
                {"brand" in link && link.brand ? (
                  <>
                    Why{" "}
                    <span className="site-nav-wordmark">
                      <span className="is-mint">Life</span>
                    </span>
                  </>
                ) : (
                  link.shortLabel
                )}
              </span>
            </a>
          ))}
        </nav>

        <div className="site-nav-end">
          <a className="site-nav-text" href={DOCTOR}>
            Doctor sign in
          </a>
          <a className="btn btn-light site-nav-login" href={`${PATIENT}/login`}>
            Log in
          </a>
          <a className="btn btn-chapters site-nav-cta" href={`${PATIENT}/register`}>
            Get started
            <span className="arrow" aria-hidden>
              →
            </span>
          </a>
          <MobileMenuTrigger className="mobile-menu-trigger site-nav-menu" label="Open page menu" />
        </div>
      </div>
    </header>
  );
}
