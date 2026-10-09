"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import styles from "./ThemeToggle.module.css";

type Theme = "light" | "dark";

const DARK_QUERY = "(prefers-color-scheme: dark)";
const STORAGE_KEY = "theme";

function readStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

/** The theme actually on screen: an explicit choice on <html>, else the OS preference. */
function getTheme(): Theme {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "light" || explicit === "dark") return explicit;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const query = window.matchMedia(DARK_QUERY);
  query.addEventListener("change", onChange);
  return () => {
    observer.disconnect();
    query.removeEventListener("change", onChange);
  };
}

/**
 * Light / "night desk" switch. The no-flash script in the root layout applies a saved
 * choice before paint; this button only flips `data-theme` and remembers it.
 * Both icons are always rendered and CSS picks one from the root theme, so the
 * server HTML and first client render match with no icon pop.
 */
export function ThemeToggle({ className }: { className?: string }) {
  // null on the server and during hydration, then the real theme.
  const theme = useSyncExternalStore<Theme | null>(subscribe, getTheme, () => null);

  // In development, Strict Mode's remount resets <html> attributes and drops the one
  // the inline script set. Re-apply it before paint. A no-op in production.
  useLayoutEffect(() => {
    const stored = readStoredTheme();
    if (stored && document.documentElement.dataset.theme !== stored) {
      document.documentElement.dataset.theme = stored;
    }
  }, []);

  function toggle() {
    const next: Theme = getTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode, blocked cookies); the switch still works for this visit.
    }
  }

  const label =
    theme === null
      ? "Toggle colour theme"
      : theme === "dark"
        ? "Switch to light theme"
        : "Switch to dark theme";

  return (
    <button
      type="button"
      className={`${styles.toggle} ${className ?? ""}`}
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      <svg
        className={styles.moon}
        viewBox="0 0 24 24"
        width="18"
        height="18"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M20 14.6A8.2 8.2 0 0 1 9.4 4a8.2 8.2 0 1 0 10.6 10.6Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        className={styles.sun}
        viewBox="0 0 24 24"
        width="18"
        height="18"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
