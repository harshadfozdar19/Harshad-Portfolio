"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

interface TimelineProps {
  children: ReactNode;
  className?: string;
  /** The static hairline the progress line draws over. */
  trackClassName?: string;
  /** The vermilion line; drawn with scaleY, so give it `transform-origin: top`. */
  progressClassName?: string;
}

/**
 * Wraps the record entries with a vertical rule that draws itself as the reader scrolls
 * through the section. The spring only smooths the scroll value; reduced-motion users get
 * the raw scroll position, which never moves on its own.
 */
export function Timeline({ children, className, trackClassName, progressClassName }: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const smoothed = useSpring(scrollYProgress, { stiffness: 140, damping: 32, restDelta: 0.001 });
  const reduceMotion = useReducedMotion();

  return (
    <div ref={ref} className={className}>
      <span className={trackClassName} aria-hidden="true">
        <motion.span
          className={progressClassName}
          style={{ scaleY: reduceMotion ? scrollYProgress : smoothed }}
        />
      </span>
      {children}
    </div>
  );
}
