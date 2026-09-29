export const SPLASH_SESSION_KEY = "versalife-hero-splash";

export function hasSeenSplash() {
  if (typeof window === "undefined") return true;
  try {
    return Boolean(sessionStorage.getItem(SPLASH_SESSION_KEY));
  } catch {
    return true;
  }
}

export function markSplashSeen() {
  try {
    sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
  } catch {
    /* private mode */
  }
  document.documentElement.classList.add("splash-seen");
}

export function waitForSplashDone() {
  if (typeof window === "undefined") return Promise.resolve();
  if (document.documentElement.classList.contains("splash-seen")) return Promise.resolve();

  return new Promise<void>((resolve) => {
    window.addEventListener("versalife:splash-done", () => resolve(), { once: true });
  });
}

export function dispatchSplashDone() {
  window.dispatchEvent(new CustomEvent("versalife:splash-done"));
}
