# Cowork: reports

Notes for Claude and Woodie. Cross-project habits live in
`~/workspace/woodie/docs/COWORK.md`.

## Layout

- `public/` is the published site; everything else in the repo stays private.
- Each year in `public/<year>/` is a prebuilt report dropped in as-is: 2022 is
  bookdown/GitBook, 2023-2025 are Quarto builds. Don't hand-edit their
  generated assets beyond what `bin/add-year` adds (see "Adding a new year").
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

## Adding a new year

Each year's report needs two small additions that the Quarto/bookdown build
doesn't produce, plus a line on the landing page. `bin/add-year` does all
three and is safe to re-run (it skips anything already present).

1. Copy the year's **entire** rendered output (Quarto's `_book/` or `_site/`)
   into `public/<year>/`. Don't hand-pick files: Quarto 1.6+ names its theme
   stylesheet with a hash (`site_libs/bootstrap/bootstrap-<hash>.min.css`), and
   2025 once shipped without it and rendered unstyled until it was restored
   from blackrockcitycensus.org.
2. Run the script:

   ```
   cd ~/workspace/reports
   bin/add-year 2026
   ```

   An optional second argument overrides the landing-page link text (default
   "2026 Population Report"). It prints how many pages got each fix, and exits
   with an error listing any file a page references that isn't in the folder.
3. Check it in a browser: `/reports/2026` and `/reports/2026/` should both load
   styled, and "Back" at the bottom of the sidebar should return to the list.
4. Commit `public/2026/` plus `public/index.html` together, then push; the
   workflow deploys it.

What the script adds, if it ever has to be done by hand:

- **Base fix**, `index.html` only, right after `<head>`. Opened as
  `.../2026` (no trailing slash), the browser would resolve relative assets
  against `.../reports/`; this writes `<base href=".../2026/">` first. A fixed
  `<base>` can't work, since it would break either the slash or no-slash URL.
  Copy the line verbatim from `public/2025/index.html` (`subdir-base`).
- **Back link**, every `.html` page: `<script src="../home-link.js"></script>`
  near the top of `<head>`, after the base fix in `index.html` so it resolves
  correctly. `public/home-link.js` appends a "Back" item (circled left-arrow
  icon, linking to `../`) to the end of the sidebar: Quarto's
  `#quarto-sidebar` menu, or GitBook's `ul.summary` for bookdown builds. Its
  icons come from fonts the reports already load (Bootstrap Icons in Quarto,
  Font Awesome 4 in GitBook).
- **Landing page**: a new `<li>` at the top of `ul.reports` in
  `public/index.html`, linking with a trailing slash (`2026/`).

The `$ is not defined` console error on pages with tables comes from
kableExtra's `kePrint.js` expecting jQuery, which Quarto doesn't load. It
predates these changes and is harmless.
