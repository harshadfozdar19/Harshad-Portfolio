import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;
const isCI = Boolean(process.env.CI);

/**
 * End-to-end and accessibility tests run against a production build (`next build && next start`),
 * on a separate port so they never collide with `next dev` on :3000.
 */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 180_000,
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
});
