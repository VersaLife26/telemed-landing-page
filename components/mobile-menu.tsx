"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";
import { DOCTOR, PATIENT } from "@/lib/links";
import { NAV_SECTIONS, activeSectionId } from "@/lib/nav-sections";

const LINKS = [
  { href: "#top", label: "Home" },
  { href: "#what", label: "What it is" },
  { href: "#how", label: "How to use" },
  { href: "#why", label: "Why VersaLife", brand: true },
  { href: "#doctors", label: "For doctors" },
  { href: "#start", label: "Start" },
] as const;

type MenuContextValue = {
  open: boolean;
  toggle: () => void;
  close: () => void;
};

const MenuContext = createContext<MenuContextValue | null>(null);

function useMobileMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("MobileMenuTrigger must be used within MobileMenuProvider");
  return ctx;
}

export function MobileMenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(NAV_SECTIONS[0].id);
  const panelId = useId();

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((on) => !on), []);

  useEffect(() => {
    const sync = () => setActiveSection(activeSectionId());
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    const onSection = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      if (typeof id === "string") setActiveSection(id);
    };
    window.addEventListener("versalife:section", onSection);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("versalife:section", onSection);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add("mobile-menu-open");
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.classList.remove("mobile-menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const jump = (href: string) => {
    close();
    if (!href.startsWith("#")) return;
    const target = document.querySelector(href);
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <MenuContext.Provider value={{ open, toggle, close }}>
      {children}
      <div className={open ? "mobile-menu is-open" : "mobile-menu"} aria-hidden={!open}>
        <button type="button" className="mobile-menu-backdrop" aria-label="Close menu" onClick={close} />
        <div className="mobile-menu-panel" id={panelId} role="dialog" aria-modal="true" aria-label="Menu">
          <div className="mobile-menu-head">
            <a className="mobile-menu-mark" href="#top" onClick={() => jump("#top")}>
              <img src="/logo.svg" alt="" width={32} height={34} />
              VersaLife
            </a>
            <button type="button" className="mobile-menu-close" aria-label="Close menu" onClick={close}>
              ×
            </button>
          </div>
          <nav className="mobile-menu-nav" aria-label="Site">
            {LINKS.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isSection = NAV_SECTIONS.some((s) => s.id === sectionId);
              const isActive = isSection && activeSection === sectionId;
              return (
              <a
                key={link.href}
                href={link.href}
                className={isActive ? "mobile-menu-link is-active" : "mobile-menu-link"}
                aria-current={isActive ? "location" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  jump(link.href);
                }}
              >
                {"brand" in link && link.brand ? (
                  <>
                    Why{" "}
                    <span className="mobile-menu-brand">
                      <span className="is-navy">Versa</span>
                      <span className="is-mint">Life</span>
                    </span>
                  </>
                ) : (
                  link.label
                )}
              </a>
            );
            })}
          </nav>
          <div className="mobile-menu-actions">
            <a className="btn btn-ink mobile-menu-cta" href={`${PATIENT}/register`} onClick={close}>
              Create patient account
            </a>
            <a className="btn btn-quiet mobile-menu-cta" href={`${PATIENT}/login`} onClick={close}>
              Patient log in
            </a>
            <a className="btn btn-quiet mobile-menu-cta" href={DOCTOR} onClick={close}>
              Doctor sign in
            </a>
          </div>
        </div>
      </div>
    </MenuContext.Provider>
  );
}

type TriggerProps = {
  className?: string;
  label?: string;
};

export function MobileMenuTrigger({ className = "mobile-menu-trigger", label = "Open menu" }: TriggerProps) {
  const { open, toggle } = useMobileMenu();

  return (
    <button
      type="button"
      className={open ? `${className} is-open` : className}
      aria-label={label}
      aria-expanded={open}
      onClick={toggle}
    >
      <span className="mobile-menu-bars" aria-hidden>
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}
