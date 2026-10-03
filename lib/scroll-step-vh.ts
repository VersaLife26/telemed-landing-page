/** Viewport-height scroll per story beat (What, How, scroll-story sections). */
const STEP_VH_DESKTOP = 46;
const STEP_VH_MOBILE = 32;

/** Hero shrink animation uses slightly less than one full story step. */
const HERO_PIN_STEP_RATIO = 1.55;

export function scrollStepVh() {
  if (typeof window === "undefined") return STEP_VH_DESKTOP;
  return window.matchMedia("(max-width: 800px)").matches ? STEP_VH_MOBILE : STEP_VH_DESKTOP;
}

export function scrollHeroPinVh() {
  return Math.round(scrollStepVh() * HERO_PIN_STEP_RATIO);
}
