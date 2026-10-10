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

## Known gaps

- `2025/index.html` references `site_libs/bootstrap/bootstrap-8da5b4...min.css`,
  which isn't in the repo; re-copy `site_libs/bootstrap` from the 2025 Quarto
  build.
