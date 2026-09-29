export const HERO_VIDEO = "/video/hero.mp4";

const queued = new Set<string>();

/** Hint the browser to fetch story clips without decoding them in the DOM yet. */
export function prefetchVideoUrls(urls: string[]) {  if (typeof document === "undefined") return;
  urls.forEach((href) => {
    if (queued.has(href)) return;
    queued.add(href);
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "fetch";
    link.href = href;
    document.head.appendChild(link);
  });
}

export const STORY_CLIPS = [
  "/video/booking-hands.mp4",
  "/video/patient-home.mp4",
  "/video/family-care.mp4",
  "/video/doctor-workspace.mp4",
] as const;
