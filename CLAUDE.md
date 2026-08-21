# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A one-page marketing site for Rosa Cleans, an independent house cleaner in East Nashville. Three static files, no build step, no dependencies, no package manager:

| File | Contents |
| --- | --- |
| `index.html` | Markup only, plus the `LocalBusiness` JSON-LD block |
| `styles.css` | All styling, loaded via `<link>` in `<head>` |
| `script.js` | One IIFE — email de-obfuscation + contact-form submit — loaded via `<script src>` before `</body>` |

`script.js` runs at the end of `<body>` and queries the DOM immediately, so it has no `defer`/`DOMContentLoaded` guard. If you move the tag into `<head>`, add `defer`.

## Working on it

- Preview: run `python3 -m http.server` from the repo root and open the printed URL. Opening `index.html` as a `file://` URL works too, but serving it matches production.
- Deploy by uploading all three files to any static host; there is nothing to build.
- There is no build, lint, or test tooling. Do not add a bundler or framework unless explicitly asked — plain static files are deliberate.
- The only external network dependencies are the Google Fonts stylesheet (Open Sans) and the Web3Forms API. Favicon and the select-chevron are inline SVG data URIs.

## Conventions to preserve when editing

- **Design tokens**: all colors, radii, and the content width are CSS custom properties on `:root` at the top of `styles.css` (`--sage`, `--cream`, `--ink`, `--line`, `--wrap`, …). Use them; never hardcode a hex value in a rule.
- **Layout**: sections are `<section>` inside `.wrap` (max-width container). Alternating bands use `class="alt"`. Card/quote grids use `repeat(auto-fit,minmax(Npx,1fr))` — no media queries needed for those.
- **Breakpoints**: only 780px (contact grid collapses) and 640px (mobile nav hidden, tighter padding). Both live at the bottom of `styles.css`. A `prefers-reduced-motion` block disables transitions and smooth scroll.
- **Accessibility is intentional** — keep the skip link, `:focus-visible` outlines, `scope` attributes on table headers, `aria-live` on the form status, and the `aria-label` on nav. Don't strip these while restyling.
- **Email obfuscation**: the address is never written literally in `index.html`. Markup shows `…nashville [at] gmail.com`; the JS assembles the real address at runtime from `u`, `d`, and `String.fromCharCode(64)`, then rewrites every `a.js-email` (`href` + text). New email links must use `class="js-email"` and follow the same placeholder pattern. Two exceptions hold the plain address: the JSON-LD block (for search engines) and `script.js` itself (split across `u`/`d`).
- **JSON-LD**: a `LocalBusiness` schema block at the bottom of `index.html` mirrors the page's services and description. Update it whenever services, description, or contact details change.

## Contact form

Posts to Web3Forms (`https://api.web3forms.com/submit`) via `fetch` with JSON; the `submit` handler prevents default, disables the button, and writes success/error text into `#form-msg`. There is a `botcheck` honeypot hidden off-screen via `.hp`.

`access_key` is currently the placeholder `YOUR-WEB3FORMS-ACCESS-KEY-HERE` — **the form does not work until a real key from web3forms.com is dropped in**. The `action` attribute on the `<form>` in `index.html` and the URL in the `fetch` call in `script.js` are duplicated; change both together.
