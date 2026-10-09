"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ElementType, ReactNode } from "react";

type RevealTag = "div" | "li" | "article" | "section" | "header" | "span" | "p" | "figure";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  as?: RevealTag;
  /** Seconds before the reveal starts — use for staggering siblings. */
  delay?: number;
  /** Vertical travel in px. */
  y?: number;
}

/**
 * Fades and lifts its children into view once, the first time they scroll in.
 * Reduced-motion users get the content immediately (see <MotionConfig reducedMotion="user">).
 */
export function Reveal({ children, as = "div", delay = 0, y = 28, ...rest }: RevealProps) {
  const Component = motion[as] as ElementType;
  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Component>
  );
}
