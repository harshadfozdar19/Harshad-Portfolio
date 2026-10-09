import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { presetTheme, scrollThroughPage, settleAnimations, type Theme } from "./helpers";

/** Impacts that fail the build. "moderate" and "minor" findings are reported but not blocking. */
const BLOCKING_IMPACTS = new Set(["serious", "critical"]);

/*
 * Reduced motion drops movement and collapses CSS animations; any remaining fades are awaited
 * by settleAnimations(), so axe sees the final state (full opacity, real colours), never a
 * mid-animation frame.
 */
test.use({ reducedMotion: "reduce" });

for (const theme of ["light", "dark"] as const satisfies readonly Theme[]) {
  test(`has no serious or critical axe violations in ${theme} theme`, async ({ page }, testInfo) => {
    await presetTheme(page, theme);
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

    await scrollThroughPage(page);
    await settleAnimations(page);

    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter((v) => v.impact && BLOCKING_IMPACTS.has(v.impact));

    if (results.violations.length > 0) {
      await testInfo.attach(`axe-${theme}.json`, {
        body: JSON.stringify(results.violations, null, 2),
        contentType: "application/json",
      });
    }

    const summary = blocking.map(
      (v) => `${v.id} [${v.impact}] ${v.help}\n  ${v.nodes.map((n) => n.target.join(" ")).join("\n  ")}`,
    );
    expect(summary, `axe found ${blocking.length} blocking violation(s); see attachment`).toEqual([]);
  });
}
