# The UFO Wizard

The website for [The UFO Wizard](https://www.theufowizard.com) — evidence-based UAP investigation by MUFON Investigator Josh Rutledge. Built with [Astro](https://astro.build) and deployed on [Cloudflare Pages](https://pages.cloudflare.com).

## Stack

- **Astro** — static site generator
- **Cloudflare Pages** — edge hosting
- **GitHub Pages** — interactive tools (iframed in)

## Interactive Tools (iframed)

All interactive tools are built separately and hosted on GitHub Pages, embedded via iframe:

| Tool | GitHub Pages URL | Route |
|---|---|---|
| Satellite Flare Checker | `spocktology.github.io/satellite-flare-check/` | `/sat-flare-checker` |
| Sat or UFO | `spocktology.github.io/sat-or-ufo/` | `/sat-or-ufo` |
| Evidence Lab | `spocktology.github.io/Evidence-Lab/` | `/evidence-lab` |
| UFO Disclosure Timeline | `spocktology.github.io/uapdisclosuretimeline/` | `/ufo-disclosure-timeline` |

## Pages

- `/` — Home (hero + tools grid + methods)
- `/about` — About Josh Rutledge
- `/research` — Research & methods
- `/contact` — Contact info
- `/speaking` — Speaking engagements (update events array in the page)
- `/press-kit` — Press kit (bio, headshot, assets)

## Local development

```bash
npm install
npm run dev           # http://localhost:4321
```

## Build & deploy

```bash
npm run build         # generates dist/
npx wrangler pages deploy
```

Or connect the GitHub repo to Cloudflare Pages for automatic deploys on push.

## satorufo.com redirect

satorufo.com is 301-redirected to `theufowizard.com/sat-or-ufo` via Cloudflare. Add satorufo.com as a custom domain on this Pages project and the `_redirects` file handles the redirect.

---

© 2026 The UFO Wizard — Josh Rutledge
