"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface StampProps {
  children: ReactNode;
  className?: string;
}

/**
 * Decorative rubber stamp that slams onto the card the first time it is seen:
 * it drops in large and fast, overshoots a touch, then settles at full ink.
 * Reduced-motion users get the fade only (MotionConfig reducedMotion="user").
 */
export function Stamp({ children, className }: StampProps) {
  return (
    <motion.span
      className={className}
      aria-hidden="true"
      initial={{ opacity: 0, scale: 1.6, rotate: -12 }}
      whileInView={{ opacity: [0, 1, 1], scale: [1.6, 0.96, 1] }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ delay: 0.35, duration: 0.55, times: [0, 0.72, 1], ease: ["easeIn", "easeOut"] }}
    >
      {children}
    </motion.span>
  );
}
