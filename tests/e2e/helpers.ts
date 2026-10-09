import type { Page } from "@playwright/test";

export const EMAIL = "harshad622004fozdar@gmail.com";

/** Section ids in page order. Each must be a `<section>` containing an `h2`. */
export const SECTION_IDS = [
  "profile",
  "record",
  "method",
  "exhibits",
  "inventory",
  "research",
  "credentials",
  "contact",
] as const;

export type Theme = "light" | "dark";

/**
 * Scrolls the page top to bottom in viewport-sized steps so every scroll-triggered
 * reveal fires, then returns to the top. Uses instant scrolling to bypass the
 * site's CSS `scroll-behavior: smooth`.
 */
export async function scrollThroughPage(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
    const step = Math.max(200, Math.floor(window.innerHeight * 0.75));
    for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await frame();
      await frame();
    }
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
    await frame();
    window.scrollTo({ top: 0, behavior: "instant" });
    await frame();
  });
}

/**
 * Waits for finite Web Animations (CSS transitions/animations and Motion's WAAPI tweens)
 * to finish, so assertions see final opacity and colour. Infinite animations, such as a
 * ticker, are ignored. Gives up quietly after `timeoutMs`.
 */
export async function settleAnimations(page: Page, timeoutMs = 4_000): Promise<void> {
  await page.evaluate(async (timeout) => {
    const deadline = performance.now() + timeout;
    const pending = () =>
      document
        .getAnimations()
        .filter((a) => a.playState === "running" && a.effect?.getComputedTiming().endTime !== Infinity);
    while (pending().length > 0 && performance.now() < deadline) {
      await Promise.race([
        Promise.all(pending().map((a) => a.finished.catch(() => undefined))),
        new Promise((resolve) => setTimeout(resolve, Math.max(0, deadline - performance.now()))),
      ]);
    }
  }, timeoutMs);
}

/** Horizontal overflow in CSS pixels; > 0 means the page scrolls sideways. */
export function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

/** Persists a theme choice before any page script runs, the same way the theme toggle does. */
export async function presetTheme(page: Page, theme: Theme): Promise<void> {
  await page.emulateMedia({ colorScheme: theme });
  await page.addInitScript((value) => {
    try {
      window.localStorage.setItem("theme", value);
    } catch {
      // Storage can be unavailable; the OS colour scheme emulation above still applies.
    }
  }, theme);
}
