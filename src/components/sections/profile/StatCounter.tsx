"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

interface StatCounterProps {
  value: number;
  decimals?: number;
  suffix?: string;
}

function format(value: number, decimals: number, suffix: string): string {
  return `${value.toFixed(decimals)}${suffix}`;
}

/**
 * A numeral that counts up from zero the first time it scrolls into view.
 * The server renders the final value (no-JS and crawlers see real numbers); screen readers
 * always get the final value from the visually hidden copy, never the moving one.
 */
export function StatCounter({ value, decimals = 0, suffix = "" }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(value);
  const display = useTransform(count, (latest) => format(latest, decimals, suffix));
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduceMotion = useReducedMotion();
  const armed = useRef(false);

  // After hydration, wind the counter back to zero only if it is still below the fold,
  // so a numeral that is already on screen never flashes to 0.
  useEffect(() => {
    const node = ref.current;
    if (!node || reduceMotion) return;
    if (node.getBoundingClientRect().top < window.innerHeight) return;
    count.set(0);
    armed.current = true;
  }, [count, reduceMotion]);

  useEffect(() => {
    if (!inView || !armed.current) return;
    const controls = animate(count, value, { duration: 1.6, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, count, value]);

  return (
    <>
      <motion.span ref={ref} aria-hidden="true">
        {display}
      </motion.span>
      <span className="visually-hidden">{format(value, decimals, suffix)}</span>
    </>
  );
}
