"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { usePageVisible, usePrefersReducedMotion } from "./hooks";
import styles from "./RoleTicker.module.css";

const INTERVAL_MS = 2800;

interface RoleTickerProps {
  roles: readonly string[];
}

function sentenceList(items: readonly string[]): string {
  if (items.length < 2) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/**
 * Cycles the phrases after "I engineer …": the new one slides up from below, then the
 * highlighter sweeps behind it. All phrases share one grid cell, so the box is always
 * as wide and tall as the longest one and nothing around it shifts.
 * Screen readers get the whole list once instead of a moving target.
 */
export function RoleTicker({ roles }: RoleTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const pageVisible = usePageVisible();
  const reducedMotion = usePrefersReducedMotion();
  const [{ index, previous }, setCursor] = useState({ index: 0, previous: -1 });

  const running = inView && pageVisible && !reducedMotion && roles.length > 1;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setCursor((cursor) => ({ index: (cursor.index + 1) % roles.length, previous: cursor.index }));
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [running, roles.length]);

  const activeIndex = reducedMotion ? 0 : index;

  return (
    <span ref={ref} className={styles.ticker}>
      <span className={styles.stack} aria-hidden="true">
        {roles.map((role, i) => (
          <span
            key={role}
            className={styles.item}
            data-state={
              i === activeIndex ? "active" : i === previous && !reducedMotion ? "leaving" : "waiting"
            }
          >
            <span className={styles.mark}>{role}</span>
          </span>
        ))}
      </span>
      <span className="visually-hidden">{sentenceList(roles)}.</span>
    </span>
  );
}
