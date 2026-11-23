# MONOLITH — Private Villas

A portfolio concept site for a fictional collection of three private villas.
Built with **Vite + React** and **GSAP** (ScrollTrigger + SplitText). No backend.

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in /dist
npm run preview   # serve the build locally
```

Requires Node 20.19+.

## Project structure

```
src/
  data/site.js           ← ALL content: text, villas, gallery, images, links
  styles/tokens.css      ← colours, fonts, spacing, motion, photo grade
  styles/global.css      ← base styles + shared utilities (.btn, .zoom, .eyebrow…)
  hooks/useReveal.js     ← scroll animations driven by data-reveal attributes
  components/            ← one component + CSS Module per section
    Navbar / MobileMenu / Hero / Intro / Collection
    Experience / Gallery / Reservation / Footer
public/images/           ← photos (see CREDITS.md)
```

## Common edits

| I want to… | Edit |
| --- | --- |
| Change copy, prices, villa details | `src/data/site.js` |
| Add / remove a villa | Add an object to `villas` in `site.js` — carousel, form and footer update automatically |
| Swap a photo | Drop the file in `public/images/` and update its `src`, `width`, `height` in `site.js` |
| Change colours or fonts | `src/styles/tokens.css` |
| Turn off the photo colour grade | Set `--img-grade: none` in `tokens.css` |

Always keep `width` / `height` accurate for images — they prevent layout shift.

## Animations

Add a `data-reveal` attribute to any element inside a section that calls `useReveal(ref)`:

| Attribute | Effect |
| --- | --- |
| `data-reveal="up"` | Fade and rise |
| `data-reveal="stagger"` | Fade and rise each child in sequence |
| `data-reveal="lines"` | Split text into lines that slide up from a mask |
| `data-reveal="image"` | Wipe the container open while the image settles |

All motion is disabled automatically for users with *prefers-reduced-motion*.

## Interactions

- Hero image fades in (after load) with a slow scale and scroll parallax
- Navbar gains a blurred background after scrolling
- Scroll-triggered line reveals; the Intro statement brightens word-by-word
- Image hover zoom
- Villa carousel: arrows, drag / swipe, keyboard ←/→, progress bar
- "Reserve …" on a villa pre-selects it in the reservation form
- Full-screen mobile menu (Esc to close, body scroll locked)
- Gallery masonry with a keyboard-accessible lightbox (native `<dialog>`)
- Reservation form: client-side validation, minimum stay, guest capacity, live price estimate, simulated submit
- Breakpoints at 960px and 600px

## Deploy

`vite.config.js` uses `base: './'`, so `dist/` works from any path.

- **Vercel / Netlify** — import the repo; build command `npm run build`, output `dist`.
- **GitHub Pages** — `npm run build`, then publish the `dist` folder (e.g. with the
  `actions/deploy-pages` workflow or the `gh-pages` package).

## Credits

Photography from Unsplash — see `public/images/CREDITS.md`.
All names, places, prices and contact details are fictional.
