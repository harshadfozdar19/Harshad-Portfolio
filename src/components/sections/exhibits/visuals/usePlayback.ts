"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

/**
 * Playback state for a decorative diagram.
 * - `playing`: on screen and motion allowed. Loops pause otherwise (see `.svg` in Visuals.module.css).
 * - `started`: seen at least once, for one-shot "draw" transitions.
 * - `reduced`: read it in effects only. It can already be true on the client's first render, so
 *   rendering it would not match the server HTML. CSS handles the static reduced-motion drawing.
 *
 * Both flags start false on server and client alike (in-view state is only known after mount).
 */
export function usePlayback<T extends Element>() {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const seen = useInView(ref, { amount: 0.25, once: true });
  const reduced = useReducedMotion() === true;

  return { ref, playing: inView && !reduced, started: seen, reduced };
}
