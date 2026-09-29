"use client";

export type Clip = { src: string; fallback: string; alt: string };

/** Clips load when activated; no posters on idle videos. */
export function ScrollVideo({ clips }: { clips: Clip[] }) {
  return (
    <div className="media-stack">
      {clips.map((clip) => (
        <div className="clip" key={clip.src} data-src={clip.src}>
          <video muted playsInline preload="none" />
          <img src={clip.fallback} alt={clip.alt} />
        </div>
      ))}
    </div>
  );
}

function attachSrc(video: HTMLVideoElement, src: string, preload: "auto" | "metadata") {
  if (video.getAttribute("src")) return;
  video.preload = preload;
  video.setAttribute("src", src);
  video.load();
}

/** Buffer a clip off-screen so the next step starts faster. */
export function prefetchClip(clipEl: HTMLElement | undefined) {
  if (!clipEl) return;
  const video = clipEl.querySelector("video");
  const src = clipEl.getAttribute("data-src");
  if (!video || !src) return;
  attachSrc(video, src, "auto");
  video.pause();
}

export function primeClip(clipEl: HTMLElement | undefined) {
  if (!clipEl) return;
  const video = clipEl.querySelector("video");
  const src = clipEl.getAttribute("data-src");
  if (!video || !src) return;
  attachSrc(video, src, "auto");
  video.play().catch(() => undefined);
}
