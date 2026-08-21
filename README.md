# Rosa Cleans — Nashville

A one-page marketing site for **Rosa Cleans**, an independent house cleaner serving East Nashville and surrounding areas.

Three static files. No dependencies, no package manager, nothing to compile. A GitHub Actions workflow builds and deploys it to GitHub Pages via Jekyll.

| File | Contents |
| --- | --- |
| `index.html` | All markup, plus the `LocalBusiness` JSON-LD block |
| `styles.css` | All styling (design tokens live in `:root` at the top) |
| `script.js` | One IIFE — email de-obfuscation + contact-form submit |
| `.github/workflows/jekyll-gh-pages.yml` | Builds with Jekyll and deploys to GitHub Pages on push to `main` |

## Sections

Hero → About → Services → Pricing → Testimonials → Contact, with a sticky header and anchor nav.

- **Services**: Standard Clean, Deep Clean, Airbnb / short-term rental turnover
- **Pricing**: a bedrooms-and-bathrooms table for standard cleans, plus notes for deep cleans (from 1.5× standard) and turnovers ($60–250)

## Running it locally

```sh
python3 -m http.server
```

Then open the printed URL. Opening `index.html` as a `file://` URL also works, but serving it matches production.

## Deploying

**GitHub Pages (current setup).** Pushing to `main` triggers `.github/workflows/jekyll-gh-pages.yml`, which builds the repo root with `actions/jekyll-build-pages` and deploys the result to Pages. It can also be run by hand from the Actions tab. Enabling this on a fresh fork needs *Settings → Pages → Source: GitHub Actions*.

Jekyll here is a pass-through, not a templating layer: there is no `_config.yml`, `Gemfile`, or layouts, and no file has YAML front matter — so Jekyll copies all three files verbatim. The built site is identical to the source, which is why local preview matches production.

**Anywhere else.** Upload `index.html`, `styles.css`, and `script.js` to any static host (Netlify, Cloudflare Pages, S3, plain nginx). The workflow file is inert outside GitHub.

## ⚠️ Before it goes live

The contact form posts to [Web3Forms](https://web3forms.com) and **does not work until you drop in a real access key**. `access_key` is currently the placeholder `YOUR-WEB3FORMS-ACCESS-KEY-HERE` in `index.html`.

The endpoint URL is duplicated in two places — the `action` attribute on the `<form>` in `index.html` and the `fetch` call in `script.js`. Change both together.

## Notes for editing

- **Design tokens** — colors, radii, and the content width are CSS custom properties on `:root` in `styles.css` (`--sage`, `--cream`, `--ink`, `--line`, `--wrap`, …). Use them; don't hardcode hex values.
- **Layout** — `<section>` wrapped in `.wrap`; alternating bands use `class="alt"`. Card and quote grids use `repeat(auto-fit, minmax(Npx, 1fr))`, so they reflow without media queries.
- **Breakpoints** — only 780px (contact grid collapses) and 640px (mobile nav hidden, tighter padding), both at the bottom of `styles.css`. A `prefers-reduced-motion` block disables transitions and smooth scroll.
- **Accessibility is intentional** — skip link, `:focus-visible` outlines, `scope` on table headers, `aria-live` on the form status, `aria-label` on nav. Keep them when restyling.
- **Email obfuscation** — the address is never written literally in the markup. The page shows `…nashville [at] gmail.com`; `script.js` assembles the real address at runtime and rewrites every `a.js-email` (`href` + text). New email links need `class="js-email"` and the same placeholder pattern. The only plain-text copies are the JSON-LD block (for search engines) and `script.js` itself (split across `u`/`d`).
- **JSON-LD** — the `LocalBusiness` block at the bottom of `index.html` mirrors the page's services, description, and contact details. Update it whenever those change.
- **Script placement** — `script.js` loads at the end of `<body>` and queries the DOM immediately, so it has no `defer`/`DOMContentLoaded` guard. If you move the tag into `<head>`, add `defer`.
- **Jekyll** — adding YAML front matter to a file switches it into Liquid rendering, so `{{ … }}` and `{% … %}` in that file would start being interpreted (there are none today). Jekyll also skips paths beginning with `_` or `.`, so don't name a shipped asset that way. To disable Jekyll processing entirely, add an empty `.nojekyll` at the root.
- Plain static files are deliberate. Don't add a bundler or framework.

## External dependencies

Only two, both loaded at runtime: the Google Fonts stylesheet (Open Sans) and the Web3Forms API. The favicon and select chevron are inline SVG data URIs.

## License

MIT — see [LICENSE](LICENSE).
