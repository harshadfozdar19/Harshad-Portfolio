"use client";

import { useInView } from "motion/react";
import { useRef, type CSSProperties, type ReactNode } from "react";
import styles from "./primitives.module.css";

interface MarkProps {
  children: ReactNode;
  /** Seconds to wait after entering the viewport. */
  delay?: number;
}

/** Text that starts under a black redaction bar and is "declassified" when scrolled into view. */
export function Redact({ children, delay = 0 }: MarkProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  return (
    <span
      ref={ref}
      className={`${styles.redact} ${inView ? styles.redactOpen : ""}`}
      style={{ "--redact-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </span>
  );
}

/** Highlighter-pen sweep behind a phrase when it scrolls into view. */
export function Highlight({ children, delay = 0.15 }: MarkProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  return (
    <span
      ref={ref}
      className={`${styles.highlight} ${inView ? styles.highlightOn : ""}`}
      style={{ "--highlight-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </span>
  );
}
