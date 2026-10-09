"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface CaseStampProps {
  children: ReactNode;
  className?: string;
  /** Seconds after load, so it lands once the name has risen into place. */
  delay?: number;
}

/**
 * Rubber stamp thumped onto the cover on load: drops in oversized, squashes a touch
 * past full size, then settles. The tilt lives on the parent so Motion only owns scale.
 * Reduced-motion users get the fade only (MotionConfig reducedMotion="user").
 */
export function CaseStamp({ children, className, delay = 1 }: CaseStampProps) {
  return (
    <motion.span
      className={className}
      aria-hidden="true"
      initial={{ opacity: 0, scale: 1.45 }}
      animate={{ opacity: [0, 1, 1], scale: [1.45, 0.94, 1] }}
      transition={{ delay, duration: 0.5, times: [0, 0.68, 1], ease: ["easeIn", "easeOut"] }}
    >
      {children}
    </motion.span>
  );
}
