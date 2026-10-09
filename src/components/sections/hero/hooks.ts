import { useSyncExternalStore } from "react";

/*
 * Small browser-state hooks shared by the hero's client leaves.
 * useSyncExternalStore gives a stable server snapshot (no hydration mismatch)
 * and re-renders only when the value actually changes.
 */

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

/** `false` while the tab is hidden, so loops can stop burning CPU in the background. */
export function usePageVisible(): boolean {
  return useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "visible",
    () => true,
  );
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Mirrors the OS "reduce motion" setting. Server render assumes motion is allowed. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}
