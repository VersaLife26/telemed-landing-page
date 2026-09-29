/** Shorter pinned scroll on phones so story sections are easier to move through. */
export function scrollStepVh() {
  if (typeof window === "undefined") return 72;
  return window.matchMedia("(max-width: 800px)").matches ? 48 : 72;
}
