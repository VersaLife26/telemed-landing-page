"use client";

export type Clip = { src: string; fallback: string; alt: string };

/** All clips stay mounted so scroll can crossfade and scrub without remounting. */
export function ScrollVideo({ clips }: { clips: Clip[] }) {
  return (
    <div className="media-stack">
      {clips.map((clip, i) => (
        <div className={i === 0 ? "clip is-on" : "clip"} key={clip.src}>
          <video
            src={clip.src}
            muted
            playsInline
            preload="auto"
            poster={clip.fallback}
            onError={(event) => event.currentTarget.parentElement?.classList.add("is-failed")}
          />
          <img src={clip.fallback} alt={clip.alt} />
        </div>
      ))}
    </div>
  );
}
