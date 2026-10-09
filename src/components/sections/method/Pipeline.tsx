"use client";

import {
  animate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { PipelineStep } from "@/content/types";
import styles from "./Pipeline.module.css";

/* Timeline of one loop, in seconds: the packet fades in at the first station, rests at each
   station, travels to the next, fades out at the last, then rests before the next loop. */
const LEAD = 0.4;
const HOLD = 0.75;
const MOVE = 0.65;
const TAIL = 0.55;
const REST = 0.7;

const easeInOut = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);

interface Frame {
  /** Position along the track, 0 (first station) to 1 (last station). */
  progress: number;
  /** Packet opacity. */
  opacity: number;
  /** Index of the lit station, or -1 while the packet is between stations. */
  active: number;
}

function cycleLength(count: number): number {
  return LEAD + count * HOLD + Math.max(count - 1, 0) * MOVE + TAIL + REST;
}

function frameAt(time: number, count: number): Frame {
  const span = Math.max(count - 1, 1);
  let t = time;

  if (t < LEAD) return { progress: 0, opacity: t / LEAD, active: t > LEAD / 2 ? 0 : -1 };
  t -= LEAD;

  for (let i = 0; i < count; i++) {
    if (t < HOLD) return { progress: i / span, opacity: 1, active: i };
    t -= HOLD;
    if (i < count - 1) {
      if (t < MOVE) {
        const k = easeInOut(t / MOVE);
        // The station being left stays lit briefly; the next lights just before the packet docks.
        const active = k < 0.25 ? i : k > 0.75 ? i + 1 : -1;
        return { progress: (i + k) / span, opacity: 1, active };
      }
      t -= MOVE;
    }
  }

  if (t < TAIL) return { progress: 1, opacity: 1 - t / TAIL, active: count - 1 };
  return { progress: 1, opacity: 0, active: -1 };
}

const pad = (n: number) => String(n).padStart(2, "0");

interface PipelineProps {
  steps: PipelineStep[];
}

/**
 * The pipeline as an ordered list of stations. A vermilion packet travels the track from the first
 * station to the last, lighting each one as it docks. It only runs while on screen, and reduced-motion
 * users get the static list with no packet.
 */
export function Pipeline({ steps }: PipelineProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const entered = useInView(rootRef, { once: true, margin: "0px 0px -12% 0px" });
  const inView = useInView(rootRef, { amount: 0.3 });
  const reduced = useReducedMotion() === true;

  const count = steps.length;
  const cycle = cycleLength(count);
  const time = useMotionValue(0);
  const controlsRef = useRef<AnimationPlaybackControls | null>(null);
  const activeRef = useRef(-1);
  const [active, setActive] = useState(-1);

  // Write the packet's position straight to CSS variables (no re-render per frame);
  // only re-render when the lit station changes.
  useMotionValueEvent(time, "change", (t) => {
    const frame = frameAt(t, count);
    const root = rootRef.current;
    if (root) {
      root.style.setProperty("--p", frame.progress.toFixed(4));
      root.style.setProperty("--o", frame.opacity.toFixed(3));
    }
    if (frame.active !== activeRef.current) {
      activeRef.current = frame.active;
      setActive(frame.active);
    }
  });

  useEffect(() => {
    if (reduced) return;
    const controls = animate(time, [0, cycle], { duration: cycle, ease: "linear", repeat: Infinity });
    controls.pause();
    controlsRef.current = controls;
    return () => {
      controls.stop();
      controlsRef.current = null;
    };
  }, [reduced, time, cycle]);

  const running = entered && inView && !reduced;

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    if (running) controls.play();
    else controls.pause();
  }, [running]);

  // `reduced` is only read in effects: on the client's first render it can already be true, so
  // rendering it would not match the server HTML. Under reduced motion the loop never starts, no
  // station lights up, and CSS hides the packet.
  return (
    <div
      ref={rootRef}
      className={styles.pipeline}
      data-entered={entered || undefined}
      style={{ "--n": count } as CSSProperties}
    >
      <ol className={styles.stations}>
        {steps.map((step, i) => (
          <li
            key={step.title}
            className={styles.station}
            data-accent={step.accent || undefined}
            data-active={active === i || undefined}
            style={{ "--i": i } as CSSProperties}
          >
            <span className={styles.node} aria-hidden="true" />
            <div className={styles.card}>
              <span className={styles.num} aria-hidden="true">
                {pad(i + 1)}
              </span>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.detail}>{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className={styles.rail} aria-hidden="true">
        <span className={styles.trail} />
      </div>
      <div className={styles.runner} aria-hidden="true">
        <span className={styles.packet} />
      </div>
    </div>
  );
}
