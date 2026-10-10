# Harshad Fozdar · Portfolio

Personal portfolio of a Full Stack & AI Engineer working in cybersecurity, OSINT and AI investigation
systems. It is designed as an investigator's case file and built with Next.js 16, React 19 and TypeScript.

## Highlights

- **"Case File" design system.** Paper-and-ink palette with one vermilion signal colour, editorial
  type, hairline rules and a warm "night desk" dark mode. Tokens, principles and primitives are
  documented in [`docs/DESIGN.md`](docs/DESIGN.md).
- **Evidence-board hero.** A pinned link-analysis board and a teleprinter-style investigation log
  open the page, as if the work were the case under investigation.
- **Content-driven architecture.** Every word on the page comes from one typed file,
  `src/content/profile.ts`. Components only render data.
- **Accessible by default.** Semantic landmarks, one `h1`, a skip link, visible focus and 44px touch
  targets. Every animation respects `prefers-reduced-motion`, and pages work from 320px wide.
- **No third-party requests.** Fonts are self-hosted through `next/font`, and there are no analytics,
  tag managers or external embeds.
- **SEO and sharing.** Metadata API, `Person` JSON-LD, a generated 1200×630 Open Graph card, SVG
  favicon, `robots.txt` and `sitemap.xml`.
- **Hardened responses.** HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` and
  `Permissions-Policy` on every route, with the `X-Powered-By` banner removed.
- **Tested.** Playwright end-to-end tests on desktop and mobile Chromium, plus axe-core accessibility
  scans in both themes.
- **CI.** GitHub Actions runs lint, type-check, format check, production build and the Playwright
  suite on every push and pull request. Dependabot keeps dependencies current.

## Tech stack

| Area      | Choice                                                                         |
| --------- | ------------------------------------------------------------------------------ |
| Framework | Next.js 16 (App Router, Cache Components, partial prefetching)                 |
| UI        | React 19, Server Components by default                                         |
| Language  | TypeScript (strict)                                                            |
| Styling   | CSS Modules on top of CSS custom-property design tokens                        |
| Motion    | Motion (`motion/react`) with `reducedMotion="user"`                            |
| Type      | Instrument Serif, IBM Plex Sans and IBM Plex Mono via `next/font`              |
| OG image  | `next/og` (`ImageResponse`), with fonts read from local `@fontsource` packages |
| Testing   | Playwright and `@axe-core/playwright`                                          |
| Quality   | ESLint 9 (`eslint-config-next`), Prettier, EditorConfig                        |
| CI        | GitHub Actions, Dependabot                                                     |

## Architecture

- **Server Components by default.** Every section component renders on the server and is
  prerendered at build time. `"use client"` is limited to leaves that animate or hold state: reveals
  and highlighter marks, the nav and theme toggle, copy-email, counters, and the animated diagrams
  (evidence board, pipeline, exhibit visuals). That keeps client JavaScript small.
- **One source of truth for copy.** `src/content/profile.ts` holds all the content, typed by
  `src/content/types.ts`. To change what the site says, you edit data, not JSX.
- **Design tokens.** Colours, type, spacing and easing are CSS custom properties in
  `src/app/globals.css`, with light and dark values. Component styles use tokens only. See
  [`docs/DESIGN.md`](docs/DESIGN.md).
- **Static and deterministic.** No `Date.now()`, `new Date()` or `Math.random()` in Server
  Components, so the page stays fully prerenderable under Cache Components.
- **No theme flash.** A tiny inline script applies the saved theme before first paint. Without a
  saved choice, the OS preference applies.

## Project structure

```text
.
├── .github/
│   ├── workflows/ci.yml        # lint → types → format → build → Playwright
│   └── dependabot.yml
├── docs/
│   └── DESIGN.md               # "Case File" design system
├── src/
│   ├── app/
│   │   ├── layout.tsx          # fonts, metadata, JSON-LD, theme bootstrap
│   │   ├── page.tsx            # composes the sections
│   │   ├── globals.css         # design tokens, base styles, utilities
│   │   ├── opengraph-image.tsx # generated social card (also used for X)
│   │   ├── icon.svg            # favicon
│   │   ├── not-found.tsx       # "Case not found" 404
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── layout/             # Nav, ThemeToggle, Footer
│   │   ├── sections/           # Hero, Ticker, Profile, Record, Method, Exhibits, …
│   │   └── ui/                 # SectionHeader, Reveal, Redact, Highlight, Tag
│   ├── content/
│   │   ├── profile.ts          # all site copy
│   │   └── types.ts            # content types
│   └── lib/
│       └── site.ts             # public URL and deployment flag
├── tests/
│   └── e2e/                    # home, a11y (axe) and platform specs
├── next.config.ts              # security headers, Cache Components
└── playwright.config.ts
```

## Getting started

Requires **Node.js 22** (see `.nvmrc`).

```bash
nvm use            # optional
npm ci
npm run dev        # http://localhost:3000
```

## Scripts

| Script                 | What it does                                          |
| ---------------------- | ----------------------------------------------------- |
| `npm run dev`          | Start the dev server                                  |
| `npm run build`        | Production build                                      |
| `npm run start`        | Serve the production build                            |
| `npm run lint`         | ESLint (Next.js core-web-vitals and TypeScript rules) |
| `npm run lint:fix`     | ESLint with auto-fix                                  |
| `npm run typecheck`    | `tsc --noEmit` over app, tests and config             |
| `npm run format`       | Format everything with Prettier                       |
| `npm run format:check` | Verify formatting without writing                     |
| `npm run check`        | Lint, type-check and format check in one go           |
| `npm run test:e2e`     | Build, serve on :3100 and run the Playwright suite    |
| `npm run test:e2e:ui`  | The same suite in Playwright's interactive UI mode    |

## Testing

```bash
npx playwright install chromium   # once
npm run test:e2e
```

Playwright builds the app and serves it on port 3100, so it never clashes with `next dev`. Locally,
it reuses a server that is already running on that port. Specs run in two projects,
`desktop-chromium` (Desktop Chrome) and `mobile-chromium` (Pixel 7). Platform checks run on desktop only.

- **`home.spec.ts`**: one `h1`; every section present and in order; skip link; the primary nav
  scrolls to a section (desktop); the menu dialog opens and closes on Escape (mobile); the theme
  toggle persists across reloads; copy-email and `mailto:`; no console errors; no horizontal scroll
  down to 320px.
- **`a11y.spec.ts`**: a full-page axe-core scan in light and dark themes with reduced motion, after
  every reveal has fired. It fails on any `serious` or `critical` violation and attaches the full
  report.
- **`platform.spec.ts`**: security headers, `robots.txt` for the deployment mode, the Open Graph and
  X images, the favicon and the 404 page.

Tests use role- and text-based locators, not styling hooks, so restyling a component doesn't break
them. On CI, failures retry twice with a trace and upload an HTML report as an artifact.

## Deployment

The site runs on any platform that runs Next.js: Vercel, or any Node 22 host with
`npm ci && npm run build && npm run start`.

| Variable                         | Purpose                                                                                                        |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`           | Public origin, such as `https://example.com`. Turns on indexing and `sitemap.xml`, and points OG URLs at it.   |
| `NEXT_PUBLIC_PROFILE_PHOTO`      | Optional override for the colour portrait (default `/private/portrait.jpg`). Empty string hides it.            |
| `NEXT_PUBLIC_PROFILE_PHOTO_MONO` | Optional override for the duotone portrait (default `/private/portrait-mono.jpg`).                             |
| `NEXT_PUBLIC_RESUME_URL`         | Optional override for the résumé PDF (default `/private/Harshad_Fozdar_Resume.pdf`). Empty string hides links. |

`NEXT_PUBLIC_*` values are inlined at build time, so set them before `npm run build`.

**Private by default.** This repository is private. Until `NEXT_PUBLIC_SITE_URL` is set, every
build serves `noindex`, a `robots.txt` that disallows all crawlers, and an empty sitemap. Preview
and local builds can't end up in search results by accident.

**Security headers** are set in `next.config.ts`. A strict Content-Security-Policy is the next
hardening step and is deliberately not set yet. The root layout inlines a theme bootstrap script and
JSON-LD. A nonce-based policy (via `proxy.ts`) would force dynamic rendering of an otherwise static
page, so the preferred route is a hash-based policy built on Next's experimental SRI support.

## Updating content

1. Edit `src/content/profile.ts`. Types in `src/content/types.ts` catch missing or misspelled fields.
2. The published portrait (`portrait.jpg`, `portrait-mono.jpg`, 4:5 at 720×900) and résumé
   (`Harshad_Fozdar_Resume.pdf`) live in `public/private/`. Only those three files are committed;
   anything else placed in that folder stays git-ignored. Replace a file to update it.
3. Run `npm run check` and `npm run test:e2e` before pushing.

## License

All rights reserved. This is a personal portfolio.
