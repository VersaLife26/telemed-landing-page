export const NAV_SECTIONS = [
  { id: "what", href: "#what", label: "What it is", shortLabel: "What" },
  { id: "how", href: "#how", label: "How to use", shortLabel: "How" },
  { id: "why", href: "#why", label: "Why VersaLife", shortLabel: "Why", brand: true as const },
  { id: "doctors", href: "#doctors", label: "For doctors", shortLabel: "Doctors" },
] as const;

export type NavSectionId = (typeof NAV_SECTIONS)[number]["id"];

export function sectionMarkerY() {
  if (typeof document === "undefined") return 120;
  const nav = document.querySelector<HTMLElement>(".site-nav");
  const navBottom = nav ? nav.getBoundingClientRect().bottom : 88;
  return navBottom + Math.min(48, window.innerHeight * 0.06);
}

export function activeSectionId(): NavSectionId {
  const marker = sectionMarkerY();
  let current: NavSectionId = NAV_SECTIONS[0].id;

  for (const link of NAV_SECTIONS) {
    const el = document.getElementById(link.id);
    if (!el) continue;
    const { top, bottom } = el.getBoundingClientRect();
    if (top <= marker && bottom > marker) return link.id;
    if (top <= marker) current = link.id;
  }

  return current;
}
