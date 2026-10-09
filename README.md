# Harshad Fozdar — Portfolio

Personal portfolio site. Plain HTML, CSS and JavaScript: no build step, no frameworks, no tracking.

## Run locally

Open `index.html` in a browser. Or serve the folder:

```bash
npx serve .
# or
python -m http.server 8000
```

## Profile photo

Add a square image named `photo.jpg` next to `index.html` and it appears in the About section.
Without one, the site shows an "HF" monogram.

## Structure

| File         | Purpose                                         |
| ------------ | ----------------------------------------------- |
| `index.html` | Content and section markup                      |
| `style.css`  | Design tokens, layout, animations, responsive   |
| `script.js`  | Hero graph canvas, typing terminal, reveals, UI |

The only external request is for Google Fonts (Inter, Space Grotesk, JetBrains Mono).
