"use client";

import * as React from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { cn } from "@/lib/utils";

export interface RevealImageMaskProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  /** Editorial block above the image (demo layout). Off when using `children`. */
  showCopy?: boolean;
  title?: string;
  caption?: string;
  shape?: "circle" | "rounded";
  /** Drive mask from a parent scroll timeline (e.g. GSAP-pinned sections). */
  progress?: MotionValue<number>;
  children?: React.ReactNode;
}

export const RevealImageMask = React.forwardRef<HTMLDivElement, RevealImageMaskProps>(
  function RevealImageMask(
    {
      className,
      src,
      alt = "",
      showCopy = false,
      title = "Images should arrive with ceremony.",
      caption = "A mask that blooms from a restrained shape into a full editorial frame as the page advances.",
      shape = "rounded",
      progress: externalProgress,
      children,
      ...props
    },
    ref,
  ) {
    const localRef = React.useRef<HTMLDivElement | null>(null);
    const shouldReduceMotion = useReducedMotion();
    const { scrollYProgress } = useScroll({
      target: localRef,
      offset: ["start 90%", "start 38%"],
    });
    const scrollProgress = useSpring(scrollYProgress, {
      stiffness: 170,
      damping: 24,
      mass: 0.95,
    });
    const progress = externalProgress ?? scrollProgress;

    const radiusCircle = useTransform(progress, [0, 1], ["16%", "75%"]);
    const radiusRounded = useTransform(progress, [0, 1], ["10%", "0%"]);
    const insetRounded = useTransform(progress, [0, 1], ["30%", "0%"]);
    const clipCircle = useTransform(radiusCircle, (latest) => `circle(${latest} at 50% 50%)`);
    const clipRounded = useTransform(
      [radiusRounded, insetRounded],
      ([latestRadius, latestInset]) =>
        `inset(${latestInset} ${latestInset} ${latestInset} ${latestInset} round ${latestRadius})`,
    );
    const clipPath = shape === "circle" ? clipCircle : clipRounded;

    const setRefs = (node: HTMLDivElement | null) => {
      localRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    const media = children ?? (
      <img
        src={
          src ??
          "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1600&q=80"
        }
        alt={alt}
        className="reveal-image-mask__img"
      />
    );

    return (
      <div ref={setRefs} className={cn("reveal-image-mask", className)} {...props}>
        {showCopy ? (
          <div className="reveal-image-mask__copy">
            <p className="reveal-image-mask__kicker">Reveal image mask</p>
            <h3 className="reveal-image-mask__title">{title}</h3>
            <p className="reveal-image-mask__caption">{caption}</p>
          </div>
        ) : null}
        {shouldReduceMotion ? (
          <div className="reveal-image-mask__inner">{media}</div>
        ) : (
          <motion.div className="reveal-image-mask__inner" style={{ clipPath, willChange: "clip-path" }}>
            {media}
          </motion.div>
        )}
      </div>
    );
  },
);
