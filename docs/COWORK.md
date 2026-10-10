# Cowork: reports

Notes for Claude and Woodie. Cross-project habits live in
`~/workspace/woodie/docs/COWORK.md`.

## Layout

- `public/` is the published site; everything else in the repo stays private.
- Each year in `public/<year>/` is a prebuilt report dropped in as-is: 2022 is
  bookdown/GitBook, 2023-2025 are Quarto builds. Don't hand-edit their
  generated assets beyond the small fixes below.
- `public/index.html` + `public/style.css` are the hand-written landing page.
  The CSS is small and standalone, matching the reports' sidebar: Source Sans
  Pro, text `#343a40`, hover `#2761e3`, title 22.1px, links 15.725px, 46px left
  / 35px top margin (the Quarto sidebar's minimum offset).

## Deploy

Published by `.github/workflows/pages.yml`, which uploads `public/` on every
push to `main` that touches it. Settings -> Pages -> Source must be "GitHub
Actions" (branch mode can only serve `/` or `/docs`). Actions deploys the folder
as-is, so no Jekyll processing; folders starting with `_` (2022's
`_main_files`) are served normally. No custom domain; the CNAME was removed
deliberately.

## Subdirectory fix

Each `public/<year>/index.html` has one `subdir-base` script right after
`<head>`: when the page is opened without a trailing slash (`.../2025`), it
writes `<base href=".../2025/">` so relative assets resolve inside the year
folder. Re-add it when dropping in a new year's build, and link years from the
landing page with a trailing slash (`2026/`).

## Home link

`public/home-link.js` appends a "Home" item (linking to `../`) to the end of
each report's sidebar: Quarto's `#quarto-sidebar` menu or GitBook's
`ul.summary`. Every year page loads it with one `<script src="../home-link.js">`
line near the top of `<head>`, after `subdir-base` in each `index.html`. Add
that line to every page of a new year's build.

The `$ is not defined` console error on pages with tables comes from
kableExtra's `kePrint.js` expecting jQuery, which Quarto doesn't load. It was
there before and is harmless.

## New years: copy the whole build

Quarto 1.6+ names the theme stylesheet with a hash
(`site_libs/bootstrap/bootstrap-<hash>.min.css`). Copy a year's entire
rendered output, not hand-picked files: 2025 once shipped without that
stylesheet and rendered unstyled until it was restored from
blackrockcitycensus.org.
