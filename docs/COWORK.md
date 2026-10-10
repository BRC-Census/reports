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

## Pre-2013 After Burn reports

2005-2011 census results were AfterBurn pages on history.burningman.org,
mostly a column of chart images with each question baked into the image.
They're rebuilt as hand-written pages in `public/2005/`-`public/2011/`, all
sharing `public/afterburn.css`. Rule: **modernize the HTML only, never alter
the content.** Same chart order as the original, titles verbatim including
their typos ("llived", "martial status" in 2007; "vising", "Blackrock" in
2011), no invented headings. 2006 shows `past_help_with_group_art.jpg` twice
because the original does.

- Title: "Black Rock City Census <year> After Burn Report" in `<title>` and the
  sidebar; the `<h1>` is just "<year> After Burn Report". Landing-page link
  text: "<year> After Burn Report", newest first, below the 2013-2022 entry.
- First section is "Welcome" with exactly this text, on every pre-2013 page:

  > While BRC Census has been producing reports since 2002, it is hard to
  > compare recent data with reports from earlier years (before 2013) because
  > of important differences in methodology, from a convenience sample of
  > self-selected Census takers on-playa to a weighted online survey conducted
  > after the Man burns.

- Original structure is kept: 2007's four sub-pages become `<h2>` groups
  (Personal Attributes, Family and Relationships, Income and Spending,
  Participation and Activities) with each chart under an `<h3>`. 2009 already
  had its questions as HTML text above untitled charts, so those become the
  headings verbatim, with the "Question:" prefix styled as a muted label.
- Baked-in titles become HTML headings and are hidden with CSS only; the image
  files are untouched. `<figure class="chart" style="--w: W; --crop: N">`
  shifts the image up by N of its W native pixels (computed as a percentage of
  width, so it scales). Where a title shares rows with the chart (2011's age,
  attendance and education charts), cropping would cut the chart, so instead
  each title line gets a white `<span class="mask">` positioned in percentages.
  2005's money-opinions panel stays uncropped with no heading; images with more
  titled charts lower down are left whole.
- An image that is only text (2005's spending averages) becomes HTML text with
  the original wording.
- Each page carries the `subdir-base` script and its own inline "Back" link
  (inline SVG arrow, since these pages have no icon font), so it doesn't use
  `home-link.js` or `bin/add-year`.

How 2006-2011 were built, for adding another year (2001, 2012): download the
page HTML and images on the Mac (this sandbox can't reach
history.burningman.org; quote anything with `?` for zsh) into the gitignored
`.afterburn/` working folder and `public/<year>/images/`. Titles and crop
heights were read with tesseract OCR on each image's title band, stopping at
the first mostly-numeric line (axis labels), then every chart was checked by
eye in a rendered screenshot; OCR mistakes (`|` for "I", "woe" for "were")
were fixed by hand against the image.

## 2012 Weighted Results

`public/2012/` comes from the census team's 44-slide deck
`bm12_weighted_census_data-v6.pdf` (history.burningman.org uploads; a copy is
in the gitignored `.afterburn/`). Same rules as the After Burn pages: wording
verbatim (including the divider's "Sociodeomographic"), original order, the
Welcome section, `afterburn.css`. Title "Black Rock City Census 2012 Weighted
Results", `<h1>` "2012 Weighted Results" from the deck's cover.

The PDF has real text, so text slides became HTML word for word (no OCR), the
six black divider slides became `<h2>` sections, and each chart slide's title
became an `<h3>`. Chart images were rendered from the PDF at 200 dpi with the
slide title, census logo, left black bar and page number painted white (by
their PDF positions) and the rest trimmed to content, so callouts that reach
up beside the title survive. Charts that combine several sub-charts keep their
in-chart labels.
