"use client";

import { useEffect, useRef } from "react";
import { useVisible } from "@/components/scenes/use-visible";

type Props = {
  src: string;
  className?: string;
  onReady?: () => void;
};

/** Loads and plays only when the block scrolls into view. No poster frame. */
export function LazySectionVideo({ src, className = "hero-video", onReady }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { setNode, visible } = useVisible<HTMLDivElement>("50% 0px");

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !visible) return;
    if (!video.getAttribute("src")) {
      video.preload = "auto";
      video.setAttribute("src", src);
      video.load();
    }
    video.play().catch(() => undefined);
  }, [visible, src]);

  return (
    <div className="lazy-video" ref={setNode}>
      <video
        ref={videoRef}
        className={className}
        muted
        loop
        playsInline
        preload="none"
        onLoadedData={(event) => {
          event.currentTarget.parentElement?.classList.add("is-playing");
          onReady?.();
        }}
        onPlaying={(event) => {
          event.currentTarget.parentElement?.classList.add("is-playing");
          onReady?.();
        }}
      />
    </div>
  );
}
