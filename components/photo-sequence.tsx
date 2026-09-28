"use client";

import { useState } from "react";

export type Frame = { src: string; fallback: string; alt: string };

/** Photos swap with a wipe and a slight scale as the active index changes. */
export function PhotoSequence({ frames, index }: { frames: Frame[]; index: number }) {
  const [src, setSrc] = useState<Record<number, string>>({});
  const safe = Math.min(frames.length - 1, Math.max(0, index));

  return (
    <div className="photo-seq">
      {frames.map((frame, i) => (
        <img
          key={frame.src}
          src={src[i] || frame.src}
          alt={i === safe ? frame.alt : ""}
          className={i === safe ? "is-on" : ""}
          onError={() => setSrc((prev) => ({ ...prev, [i]: frame.fallback }))}
        />
      ))}
    </div>
  );
}
