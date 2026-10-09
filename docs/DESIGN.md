# Design system: "Case File"

The site reads like an investigator's case file, because the work it presents is investigation systems
(OSINT, brand impersonation, AI verdicts). It should feel editorial, tactile and precise: not a SaaS
template, and not a dark glassmorphism portfolio.

## Principles

1. **Paper and ink.** Warm off-white paper, near-black ink, hairline rules. Dark mode is a "night desk": warm charcoal, never blue-black.
2. **One signal colour.** Vermilion marks what matters: the active case, the suspect node, an italic word in a title. Use it sparingly, about 5% of the page.
3. **Highlighter, not glow.** Emphasis comes from a yellow highlighter sweep (`<Highlight>`) or redaction bars that lift (`<Redact>`). No neon, no gradients on text, no glassmorphism, no purple, blue or violet anywhere.
4. **Editorial type.** Instrument Serif for display (large, light, italic accents). IBM Plex Sans for body. IBM Plex Mono for labels, metadata, codes and numbers.
5. **Sharp geometry.** `--radius: 4px` at most on cards. Hairline borders (`--line`, `--line-strong`). Shadows only on lifted "paper" (`--shadow-card`).
6. **Motion with intent.** Things _draw_, _declassify_ or _stamp_ into place. Easing is `--ease` (`cubic-bezier(0.22, 1, 0.36, 1)`). Respect `prefers-reduced-motion`; Motion is configured with `reducedMotion="user"`.

## Tokens (`src/app/globals.css`)

| Token                                        | Use                                           |
| -------------------------------------------- | --------------------------------------------- |
| `--paper`, `--paper-2`                       | page background, alternate band background    |
| `--card`, `--card-hover`                     | raised cards ("index cards")                  |
| `--ink`, `--ink-2`, `--muted`                | text: primary, secondary, metadata            |
| `--line`, `--line-strong`                    | hairlines, borders                            |
| `--signal`                                   | vermilion fills and graphics (not small text) |
| `--signal-ink`                               | vermilion text (AA contrast)                  |
| `--signal-soft`                              | tinted vermilion backgrounds                  |
| `--highlight`                                | highlighter yellow                            |
| `--pine`                                     | "active / verified / live" status dots        |
| `--redact`                                   | redaction bars                                |
| `--font-serif`, `--font-sans`, `--font-mono` | type families                                 |

Global classes: `.container`, `.section`, `.label` (mono uppercase metadata), `.serif`, `.mono`, `.visually-hidden`.

## Primitives (`src/components/ui`)

- `<SectionHeader index="02" label="Record" meta="3 entries" title={<>Where I’ve been <em>shipping</em></>} titleId="record-title" />`: hairline rule with `§ 02 RECORD … meta`, then a large serif title. `<em>` renders italic vermilion.
- `<Reveal delay={0.1}>`: fade and lift on first scroll into view. Accepts `as`.
- `<Redact delay={0.2}>text</Redact>`: black bar slides off the text when in view.
- `<Highlight>text</Highlight>`: highlighter sweep behind text when in view.
- `<Tag tone="signal" interactive>`: mono pill.

## Section map (`src/app/page.tsx`)

| Order | id            | Component     | § label             |
| ----- | ------------- | ------------- | ------------------- |
| 1     | (hero)        | `Hero`        | case-file cover     |
| 2     | (none)        | `Ticker`      | stack ticker tape   |
| 3     | `profile`     | `Profile`     | § 01 Profile        |
| 4     | `record`      | `Record`      | § 02 Record         |
| 5     | `method`      | `Method`      | § 03 Method         |
| 6     | `exhibits`    | `Exhibits`    | § 04 Exhibits       |
| 7     | `inventory`   | `Inventory`   | § 05 Inventory      |
| 8     | `research`    | `Research`    | § 06 Open Questions |
| 9     | `credentials` | `Credentials` | § 07 Credentials    |
| 10    | `contact`     | `Contact`     | § 08 Contact        |

Every section: `<section id="…" className="section" aria-labelledby="…-title">` containing `.container`.
All copy comes from `src/content/profile.ts`. Never hard-code copy in components.

## Conventions

- Server Components by default; add `"use client"` only to leaves that need state, effects or Motion.
- One CSS Module per component (`Component.module.css`), using tokens only. No raw hex except in SVG data URIs.
- Semantic HTML: one `h1` (hero), `h2` per section, `h3` for cards. Decorative glyphs get `aria-hidden`.
- Never use `new Date()`, `Math.random()` or `Date.now()` in Server Components, because they break static prerendering in Next 16. Use them only inside client effects.
- Mobile first. It must work at 320px with no horizontal scroll, and have 44px touch targets.
