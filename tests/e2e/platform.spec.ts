import { expect, test } from "@playwright/test";

/*
 * Server-level behaviour: headers, metadata routes and the 404 page.
 * Viewport-independent, so it runs once (desktop project only).
 */
test.skip(({ isMobile }) => isMobile, "Viewport-independent checks run on desktop only");

test("sends security headers and hides the framework banner", async ({ request }) => {
  const response = await request.get("/");
  expect(response.ok()).toBe(true);

  const headers = response.headers();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toContain("camera=()");
  expect(headers["strict-transport-security"]).toContain("max-age=");
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("robots.txt matches the deployment mode", async ({ request }) => {
  const body = await (await request.get("/robots.txt")).text();

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    expect(body).toMatch(/Allow: \//);
    expect(body).toMatch(/Sitemap: .+\/sitemap\.xml/);
  } else {
    expect(body).toMatch(/Disallow: \//);
    expect(body).not.toMatch(/Sitemap:/);
  }
});

test("serves a generated social card for Open Graph and X", async ({ page, request }) => {
  await page.goto("/");

  for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    const content = await page.locator(selector).first().getAttribute("content");
    expect(content, `${selector} is set`).toBeTruthy();

    // metadataBase points at the public origin; fetch the same path from the test server.
    const { pathname, search } = new URL(content!);
    const image = await request.get(pathname + search);
    expect(image.ok()).toBe(true);
    expect(image.headers()["content-type"]).toBe("image/png");
  }
});

test("serves the SVG favicon", async ({ page, request }) => {
  await page.goto("/");
  const href = await page.locator('link[rel="icon"]').first().getAttribute("href");
  expect(href).toBeTruthy();

  const icon = await request.get(href!);
  expect(icon.ok()).toBe(true);
  expect(icon.headers()["content-type"]).toContain("image/svg+xml");
});

test("unknown URLs render the case-not-found page with a 404", async ({ page }) => {
  const response = await page.goto("/this-file-does-not-exist");
  expect(response?.status()).toBe(404);

  await expect(page.getByRole("heading", { level: 1, name: /case not found/i })).toBeVisible();
  await page.getByRole("link", { name: /return to the case file/i }).click();
  await expect(page).toHaveURL(/\/$/);
});
