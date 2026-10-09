import { expect, test, type Locator, type Page } from "@playwright/test";
import { EMAIL, SECTION_IDS, horizontalOverflow, scrollThroughPage, settleAnimations } from "./helpers";

/**
 * Clicks until `assertion` holds. Guards against a click landing before React has
 * hydrated the control (the first click would then be a no-op).
 */
async function clickUntil(target: Locator, assertion: () => Promise<void>): Promise<void> {
  await expect(async () => {
    await target.click();
    await assertion();
  }).toPass({ timeout: 10_000 });
}

/**
 * The toggle only knows the current theme after hydration (its server label is generic), so
 * wait for the "Switch to …" name. If it never shows in the header, look inside the menu.
 */
async function findThemeToggle(page: Page): Promise<Locator> {
  const toggle = page.getByRole("button", { name: /switch to (dark|light) theme/i }).first();
  try {
    await toggle.waitFor({ state: "visible", timeout: 5_000 });
  } catch {
    const menuButton = page.getByRole("button", { name: /menu/i }).first();
    await clickUntil(menuButton, () => expect(toggle).toBeVisible({ timeout: 1_000 }));
  }
  return toggle;
}

test.describe("home page", () => {
  test("renders one h1 and every case-file section in order", async ({ page }) => {
    await page.goto("/");

    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText("Harshad");
    await expect(h1).toContainText("Fozdar");

    for (const id of SECTION_IDS) {
      const section = page.locator(`section#${id}`);
      await expect(section, `section #${id} exists`).toHaveCount(1);
      await expect(section.locator("h2").first(), `section #${id} has an h2`).toBeAttached();
    }

    const renderedIds = await page.locator("section[id]").evaluateAll((els) => els.map((el) => el.id));
    const known: readonly string[] = SECTION_IDS;
    expect(renderedIds.filter((id) => known.includes(id))).toEqual([...SECTION_IDS]);
  });

  test("has a skip link that is first in the tab order and targets main", async ({ page }) => {
    await page.goto("/");

    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toHaveAttribute("href", "#main");
    await expect(page.locator("main#main")).toHaveCount(1);

    await page.keyboard.press("Tab");
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
  });

  test("exposes a primary navigation landmark", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Primary", includeHidden: true })).not.toHaveCount(0);
  });

  test("desktop nav scrolls to a section", async ({ page, isMobile }) => {
    test.skip(isMobile, "Inline nav links are desktop-only; mobile uses the menu");
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav).toBeVisible();

    const exhibits = page.locator("#exhibits");
    await expect(exhibits).not.toBeInViewport();
    await nav.getByRole("link", { name: /exhibits/i }).click();
    await expect(exhibits).toBeInViewport();
  });

  test("mobile menu opens an overlay of links and closes on Escape", async ({ page, isMobile }) => {
    test.skip(!isMobile, "The menu button is only shown on small screens");
    await page.goto("/");

    const menuButton = page.getByRole("button", { name: /menu/i }).first();
    // Follow the button's aria-controls to its overlay; fall back to a dialog role.
    const controls = await menuButton.getAttribute("aria-controls");
    const menu = controls ? page.locator(`[id="${controls}"]`) : page.getByRole("dialog");
    await expect(menu).toBeHidden();

    await clickUntil(menuButton, () => expect(menu).toBeVisible({ timeout: 1_000 }));
    await expect(menu.getByRole("link", { name: /exhibits/i })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
  });

  test.describe("theme", () => {
    test.use({ colorScheme: "light" });

    test("toggle switches theme and the choice survives a reload", async ({ page }) => {
      await page.goto("/");
      const html = page.locator("html");

      const toggle = await findThemeToggle(page);
      await expect(toggle).toHaveAccessibleName(/switch to dark theme/i);

      await clickUntil(toggle, () => expect(html).toHaveAttribute("data-theme", "dark", { timeout: 1_000 }));
      await expect(toggle).toHaveAccessibleName(/switch to light theme/i);

      await page.reload();
      await expect(html).toHaveAttribute("data-theme", "dark");
    });
  });

  test.describe("contact", () => {
    test.use({ permissions: ["clipboard-read", "clipboard-write"] });

    test("links to the email address", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator(`a[href^="mailto:${EMAIL}"]`).first()).toBeAttached();
    });

    test("copies the email address and confirms it", async ({ page }) => {
      await page.goto("/");

      const copy = page.getByRole("button", { name: /copy email/i }).first();
      await clickUntil(copy, () => expect(page.getByText(/copied/i).first()).toBeVisible({ timeout: 1_000 }));

      const clipboard = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboard).toContain(EMAIL);
    });
  });

  test("loads and scrolls without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/");
    await scrollThroughPage(page);
    await page.waitForLoadState("networkidle");

    expect(errors).toEqual([]);
  });

  test("never scrolls horizontally, down to 320px wide", async ({ page }) => {
    await page.goto("/");
    await scrollThroughPage(page);
    await settleAnimations(page);
    await expect
      .poll(() => horizontalOverflow(page), { message: "overflow at project viewport" })
      .toBeLessThanOrEqual(0);

    await page.setViewportSize({ width: 320, height: 720 });
    await scrollThroughPage(page);
    await settleAnimations(page);
    await expect
      .poll(() => horizontalOverflow(page), { message: "overflow at 320px" })
      .toBeLessThanOrEqual(0);
  });
});
