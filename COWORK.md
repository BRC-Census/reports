# Cowork: reports

Notes for Claude and Woodie. Cross-project habits live in
`~/workspace/woodie/docs/COWORK.md`.

## Layout

- `public/` is the published site; everything else in the repo stays private.
- Each year in `public/<year>/` is a prebuilt report dropped in as-is: 2022 is
  bookdown/GitBook, 2023-2025 are Quarto builds. Don't hand-edit their
  generated assets beyond what `bin/add-year` adds (see "Adding a new year").
- `public/index.html` + `public/style.css` are the hand-written landing page:
  the current Census overview and methodology on the right under
  "Black Rock City Census" (see "Editorial sources and conventions" below),
  and the list of
  reports on the right under "Census Archive" (column sized to its longest
  line, hidden ", PDF" included, so nothing wraps). The landing page alone is
  styled after burningman.org (October 2026, at Chipper's request, to support
  asking for a burningman.org subdomain): black top bar, peach title band,
  Bespoke Slab headings (burningman.org's own font, from Fontshare, with its
  Rockwell/Roboto Slab fallbacks), Roboto body, links `#534be7`, and the list
  as a ruled side menu like burningman.org's. Its rules are scoped to `.home`.
  No Burning Man Project logo. The
  intro comes first in the HTML, so on phones it shows first and the list
  follows its closing "...check out the Census results through the years:".
  The volunteer-team link points to https://volunteers.census.burningman.org/
  and the methodology link to its /training/welcome page.
  The report list is still a `.sidebar` (sticky, scrolls), restyled under `.home`.
- `public/style.css` (outside the `.home` rules) copies the look of the 2025 Quarto report without its
  Bootstrap layers: 17px root, Source Sans Pro, text `#343a40`, links
  `#2761e3`, headings weight 600 at Bootstrap's responsive sizes (h1 2rem, h2
  1.65rem, h3 1.45rem, h4 1.25rem regular, fixed from 1200px wide), menu links
  `#595959` with Quarto's sidebar spacing. If the look changes, re-measure
  2025's computed styles and update these values, not per-page overrides.
  It is the one stylesheet for every page built here: the
  landing page (`<body class="home">`, rules scoped to `.home`), the pre-2013
  After Burn pages (unscoped base rules: sidebar, headings, `.chart` crops),
  and the reports rebuilt from PDFs (`<body class="popanalysis">`). The
  Quarto, bookdown and 2018/2019 reports keep their own CSS (2022's own
  `2022/style.css` is a different file).
- Every image on the pages built here (2001-2017) is a link to its full image
  file, so a click shows it larger: on the After Burn pages, the uncropped
  chart's @2x upscale. The builders all write these links.
- After Burn charts (2001, 2005-2011) also have a sharpened 2x copy served to
  high-density screens via `srcset`, made by `.afterburn/upscale.py <year>...`
  (2001: `upscale-2001.py`, same settings): 200% Lanczos + unsharp mask
  (radius 1.2, 80%, threshold 2); GIFs become `<name>@2x.png` (256 colors),
  JPEGs `<name>@2x.jpg` (quality 90). Originals are untouched; layout and
  crops don't change, since `srcset` 2x keeps the image's size.
- `public/pdf/index.html` lists every PDF in `public/pdf/` with its size,
  newest first, in the menu style. `bin/pdf-index` writes it; re-run it after
  adding or replacing a PDF.
- `public/patch.js` is the one script added to the prebuilt reports (the Back
  link; see "Adding a new year").

## Editorial sources and conventions

- Treat "data" as plural in new and edited site copy: "data are",
  "data help", and "these data". Preserve original wording in archived
  reports, as described below.
- The landing-page introduction was updated on October 29, 2026, at
  Chipper's request. It replaces copy carried over from the old Census
  Archive, much of which also appeared in an October 2014 Journal post.
  Do not restore that older introduction as the current Census description.
- Use the current [Census Welcome and Overview](https://volunteers.census.burningman.org/training/welcome)
  for the project description, data uses, and two-phase data collection
  and weighting explanation. Use the
  [volunteer site](https://volunteers.census.burningman.org/) for joining
  the team.
- The [2025 Population Report](https://blackrockcitycensus.org/) explains
  the scope of the estimates (BRC participants, rather than the broader
  Burning Man community) and limits on comparisons with pre-2013 reports.
  Changes in questions and methods also affect comparability across years.
- Refer to Burning Man Project by its current name. Avoid relative dates
  such as "in the last few years" and claims that changes in travel behavior
  demonstrate a program's impact without supporting analysis.

## Deploy

Published by `.github/workflows/pages.yml`, which uploads `public/` on every
push to `main` that touches it. Settings -> Pages -> Source must be "GitHub
Actions" (branch mode can only serve `/` or `/docs`). Actions deploys the folder
as-is, so no Jekyll processing; folders starting with `_` (2022's
`_main_files`) are served normally. No custom domain; the CNAME was removed
deliberately.

## Favicon

The site is a project site under `/reports/`, so a browser's automatic request
for `/favicon.ico` goes to the domain root, which isn't ours. Every page must
name its icon, so each one carries
`<link rel="icon" href="../favicon.ico"><link rel="apple-touch-icon" href="../apple-touch-icon.png">`
(no `../` on the landing page). `public/favicon.ico` (16, 32 and 48px) is copied from
`.afterburn/favicon.ico`; `public/apple-touch-icon.png` is 180px, from
`2019/images/Logo.PNG`. 2018 and 2019 keep their own icon tags. `bin/add-year`
and the builders in `.afterburn/` add the tag to new pages.

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
- **Back link**, every `.html` page: `<script src="../patch.js"></script>`
  near the top of `<head>`, after the base fix in `index.html` so it resolves
  correctly. `public/patch.js` appends a "Back" item (circled left-arrow
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
They're rebuilt as hand-written pages in `public/2001/` and `public/2005/`-`public/2011/`, all
sharing `public/style.css`. Goals, in priority order:

1. **Maintain the original report content.** Same charts in the same order,
   titles verbatim including their typos ("llived", "martial status" in 2007;
   "vising", "Blackrock" in 2011), image files untouched. 2006 shows
   `past_help_with_group_art.jpg` twice because the original does.
2. **Extract the chart titles and CSS-crop the images**, so every chart's
   title is real HTML text and every chart in a multi-chart image is shown on
   its own.
3. **Apply some structure to organize the content:** short group labels and
   parent categories (see "Structure" below). These are the only words not
   taken from the original reports, and they never reorder charts.

- Title: "Black Rock City Census <year> After Burn Report" in `<title>` and the
  sidebar; the `<h1>` is just "<year> After Burn Report". Landing-page link
  text: "<year> After Burn Report", newest first, below the 2013-2022 entry.
- First section is "Welcome" with exactly this text, on every pre-2013 page:

  > While BRC Census has been producing reports since 2002, it is hard to
  > compare recent data with reports from earlier years (before 2013) because
  > of important differences in methodology, from a convenience sample of
  > self-selected Census takers on-playa to a weighted online survey conducted
  > after the Man burns.

- A question heading that only repeats its label (2001 and 2010 "Age") is left
  out; its anchor id moves to the figure.
- Structure, modeled on 2022's numbered sections but without numbers: an
  `<h2>` group label of a few words (from the image file name plus a read of
  its questions, e.g. `AB_05_projects_p.jpg` -> "Projects"), then each chart's
  title verbatim as an `<h3>`. Consecutive charts on one topic share a label
  ("Sexual Orientation" over 2006's bisexual/gay/straight); chart order never
  changes. Each question heading keeps the old section id, so earlier anchors
  still work.
- Above the labels sit a few parent categories as `<h2>` (label `<h3>`,
  question `<h4>`), and the sidebar nests labels under them. Parents cover
  consecutive labels only, never reordering: mostly "About You", "At Burning
  Man", then a page-specific one ("Money and Civic Life" 2005, "Money and
  Travel" 2006, "Relationships and Home" 2008, "Values and Opinions" and
  "Reasons" 2009). 2007's parents are its four original sub-pages (Personal
  Attributes, Family and Relationships, Income and Spending, Participation and
  Activities). 2010's labels alternate between personal and event topics, so following 2001
  its charts are regrouped under About You and At Burning Man (Dates and Theme
  Camp moved after Values).
- 2009 already had its questions as HTML text above untitled charts, so those
  are the question headings verbatim, with the "Question:" prefix styled as a
  muted label.
- An image holding several titled charts is shown once per chart, each under
  its own question heading (2005 has many, e.g. activism's four pies; 2007 has
  residence, religious services, decompressions, free services and the ten
  regional burns). Exceptions: 2005's money-opinions panel is one chart whose
  bar labels share a legend, and 2007's `years_BM.gif` is one chart in two
  panels, so both stay whole.
- Baked-in titles become HTML headings and are hidden with CSS only; the image
  files are untouched. `<figure class="chart" style="--w: W; --crop: N">`
  shifts the image up by N of its W native pixels (computed as a percentage of
  width, so it scales). For a chart in the middle of a multi-chart image, add
  class `part` and `--h: H` to show only H native pixels from there
  (`aspect-ratio` W/H). Crops were found by OCR'ing each title line's position
  and trimming blank rows between titles. Two iPhone (WebKit) pitfalls, both
  fine in desktop Chrome and its phone emulation: no `loading="lazy"` on
  chart images (a reused, shifted, clipped image can stay blank), and size
  the `part` window with the `::before` padding spacer, not `aspect-ratio`. Where a title shares rows with the chart (2011's age,
  attendance and education charts), cropping would cut the chart, so instead
  each title line gets a white `<span class="mask">` positioned in percentages
  (also used on four 2007 regional charts whose top axis number sits level
  with the title).
  2005's money-opinions panel stays uncropped with no heading; images with more
  titled charts lower down are left whole.
- An image that is only text (2005's spending averages) becomes HTML text with
  the original wording.
- Each page carries the `subdir-base` script and its own inline "Back" link
  (inline SVG arrow, since these pages have no icon font), so it doesn't use
  `patch.js` or `bin/add-year`.

2001 and 2010 are the exceptions to "never reorder charts" (2010: see
Structure above). Its old page was 43
chart GIFs in what looks like file-listing order with no text at all, so its
charts are regrouped to match 2005-2011's parents (About You, Burning Man
Experience, Arrival and Departure, Camping, Life on the Playa, Spending,
Afterward). Titles are typed from the images verbatim ("plya" x4, "loosing").
Built by `.afterburn/build-2001.py` (titles, grouping, hand-set crops); images
fetched by `.afterburn/fetch-2001.sh`. "Political Affiliation" shares rows with
its legend, so its title is masked rather than cropped. Each GIF has a 1px
dark frame, so every chart uses `.chart.edged` (`style.css`), which also
clips `--e: 3` px from the left, right and bottom and is shown up to
385px wide (`--max`) like the other years' charts, (the 2x copies' sharpening
rings about 2.5px in). Where a group's only chart title equals its label
(Age, Gender, Income, Industry, Political Affiliation) the repeat heading is
left out. High-density screens get
`images/<name>@2x.png` via `srcset`: 200% Lanczos + unsharp mask (radius 1.2,
80%, threshold 2), made by `.afterburn/upscale-2001.py`. The original GIFs are
untouched and still served at 1x; crops are in original-pixel units, so they
apply to both.

2009's chart GIFs have no title inside, only a 1px grey frame (2px along the
bottom of `age1.gif`) around white space, so each is `.chart.edged` with
`--e: 3; --crop: 3; --h: <height - 6>`: 3px trimmed on every side, shown at
its own width less 6px. Set by hand in `public/2009/index.html`.

How 2006-2011 were built, for adding another year: download the
page HTML and images on the Mac (this sandbox can't reach
history.burningman.org; quote anything with `?` for zsh) into the gitignored
`.afterburn/` working folder and `public/<year>/images/`. Titles and crop
heights were read with tesseract OCR on each image's title band, stopping at
the first mostly-numeric line (axis labels), then every chart was checked by
eye in a rendered screenshot; OCR mistakes (`|` for "I", "woe" for "were")
were fixed by hand against the image. The group labels and splits were
applied by `.afterburn/build.py` and `nest.py` (gitignored; already run, not re-runnable
on the new pages).

## 2012 Weighted Results

`public/2012/` comes from the census team's 44-slide deck
`bm12_weighted_census_data-v6.pdf` (history.burningman.org uploads; a copy is
in the gitignored `.afterburn/`). Same rules as the After Burn pages: wording
verbatim (including the divider's "Sociodeomographic"), original order, the
Welcome section, `style.css`. Title "Black Rock City Census 2012 Weighted
Results", `<h1>` "2012 Weighted Results" from the deck's cover.

The PDF has real text, so text slides became HTML word for word (no OCR), the
six black divider slides became `<h2>` sections, and each chart slide's title
became an `<h3>`. Chart images were rendered from the PDF at 200 dpi with the
slide title, census logo, left black bar and page number painted white (by
their PDF positions) and the rest trimmed to content, so callouts that reach
up beside the title survive. Charts that combine several sub-charts keep their
in-chart labels.

## 2018 Population Analysis (mirrored)

`public/2018/` is the original 2013-2018 web report, mirrored from its S3
site (`http://brccensus.2018.popanalysis.s3-website-us-west-1.amazonaws.com/`)
by `.afterburn/mirror-2018.sh`. It's R Markdown/pandoc output with charts
embedded as base64 PNGs and a Codrops "Multi-Level Menu" for navigation, not
Quarto or bookdown, and no source repo survives (murrs's public repos start at
2022). Changes from the mirror, all mechanical:

- wget saved the feather icon fonts with their `?1gafuo` cache-buster in the
  filename; renamed to plain `feather.*` and the CSS `url()`s to match.
- `bin/add-year 2018 "2013–2018 Population Analysis"`, then its landing-page
  line moved below the 2013-2022 entry (the script always inserts at the top).
- `patch.js` gained a third case for this menu (`#ml-menu
  ul[data-menu="main"]`), with an inline SVG arrow since the page has no icon
  font with one.

Main `<h1>` (index.html and toc.html) changed from "BRC Census Population
Analysis, 2013-2018" to "2013-2018 Population Analysis" to match the other
Population Analyses; `<title>`s are unchanged. Left as-is: the intro's "PDF version ... here" link still points at the
census team's Google Drive copy, and a never-triggered `.content--loading`
spinner in `demo.css` still references the S3 host.

## 2019 Population Analysis (recovered from the Internet Archive)

`public/2019/` is the 2013-2019 web report as it stood at
blackrockcitycensus.org before the 2013-2022 report replaced it: the same
R Markdown/Codrops-menu site as 2018, updated a year later. The Internet
Archive's Oct 31, 2020 snapshots (CSS/JS/fonts from 2021-22, byte-identical
scripts to 2018's) were fetched as original bytes (`id_` URLs) by
`.afterburn/fetch-2017-2019.sh`, which skips files it already has and waits
5 s between requests (the Archive refuses connections when rushed). The URL
list is `.afterburn/ia-2019.txt`.

Main `<h1>` changed to "2013-2019 Population Analysis" (as 2018). Otherwise
unchanged apart from `bin/add-year 2019 "2013–2019 Population Analysis"`
(base fix, Back link via `patch.js`'s menu case) and the landing line,
which carries the PDF too. One fix: leftover "2013-2018" metadata (the
`<title>` of `principles.html` and a stray one in `eventinfo.html`, plus four
pages' meta descriptions) now says "2013-2019" like the rest; a sentence in
`visualizations.html` that mentions 2013-2018 is the authors' text and stays.
Kept as found: the CSS keeps its `?1gafuo`
cache-busters (Pages ignores the query); `img/loading.svg` was never archived
and is unused.

## 2017 Population Analysis (rebuilt from its PDF)

`public/2017/` is generated from `public/pdf/2017-population-analysis.pdf`
(152 landscape slides) by `.afterburn/build-pdf-report.py`, styled by
`style.css` (`.popanalysis` rules):

    python3 .afterburn/build-pdf-report.py public/pdf/2017-population-analysis.pdf \
        public/2017 "Black Rock City Census 2013-2017 Population Analysis" \
        "2013-2017 Population Analysis"

(needs `pip install pymupdf pillow`). What it does, in visible (de-rotated)
coordinates:

- Divider slides become `<h2>` sections; each slide's header band becomes an
  `<h3>` topic and `<h4>` subtitle, repeated on continuation slides only once.
  Slides before the first divider go under "Report Information".
- Text stays text, verbatim: chart titles, notes (italic), fine print,
  paragraphs (lines merged; bold/italic runs kept), bullet lists, and URLs made
  clickable. Spaces the PDF omits between words are restored from glyph gaps.
- Every group of touching images is rendered from the page as displayed
  (not extracted raw: the PDF clips and overlays its images, e.g. a chart drawn
  as two pieces) and sized to its share of the slide width, so a separate
  legend stays legend-sized. Text lying on a group is rendered with it.
- "Complex" slides (more than three images, side-by-side pieces, or text over
  images) and slides 7-10 and 13 (annotated diagrams) are rendered whole under
  their HTML headings, with their text in the alt attribute: 53 of 152.
- Slide 6's small table, laid out as positioned text, is a hand-written HTML
  table (`OVERRIDES` in the script).
- Images are PNG, 256 colors, at most 1400px wide, lazy-loaded (fine here: none
  are cropped, unlike the After Burn charts) and link to themselves for zooming
  on phones. About 11 MB in all.

## 2013-2017 Summary Report, 2013-2016 Population Analysis, 2013-2015 decks

Every report on the old Census Archive now has a web version beside its PDF.
All are generated into `public/<dir>/` and styled by `style.css`
(`.popanalysis` rules); each script keeps text verbatim and shows charts as images
rendered from the PDF as displayed.

| Web dir | PDF | Built by |
|---|---|---|
| `2017-summary-report/` | `2017-summary-report.pdf` | `build-pdf-report.py` (2017 template; slide 3's survey table is an override) |
| `2016-population-analysis/` | `2016-population-analysis.pdf` | `build-scanned.py` (image-only PDF) with `.afterburn/2016-headings.tsv` |
| `2016/` | `2016-weighted-results.pdf` | `build-scanned.py` with `.afterburn/2016-wr-headings.tsv` |
| `2015/`, `2014/`, `2013/` | `<year>-weighted-results.pdf` | `build-deck.py` |
| `2015-annual-report/` | `2015-annual-report.pdf` | `build-deck.py` |

    python3 .afterburn/build-deck.py public/pdf/2014-weighted-results.pdf \
        public/2014 "Black Rock City Census 2014 Weighted Results" "2014 Weighted Results"

- `build-deck.py` (PowerPoint decks, three templates): divider slides become
  `<h2>`, slide titles `<h3>` (repeats merged). Text slides (at most 3 images,
  no text over an image, under half the slide) become paragraphs and bullet
  lists with any photos; every other slide's body, below its title band and
  left of the 2013-2014 template's black edge bar, is one rendered image with
  the slide's text as alt text.
- `build-scanned.py`: 2016 has no text layer. Headings are OCR'd from the
  white-on-black title band, then checked by eye; corrections live in
  `.afterburn/2016-headings.tsv` (tab-separated page and heading, " / "
  between topic and subtitle). Each slide body is one image with its OCR text
  as alt text only: OCR is never shown as visible text. The exception is the
  12 text-only slides (2013-2016 pages 3-5, 7, 8, 103, 104; 2016 Weighted
  Results pages 3-5, 39, 40): OCR'd, proofread against the slides, and kept in
  `.afterburn/2016-text-slides.py` as HTML that replaces those slide images.
  Their dead goo.gl link keeps its printed text but points to
  `../2016-population-analysis/`.
  The builder's OCR log goes to `.afterburn/<dir>.ocr-log.tsv`, never a
  `*-headings.tsv` name (that once overwrote the corrections file).

## Hand-edited pages in the PDF-built reports

Where a slide mixes text and a chart, the text can be pulled out of the slide
image by hand and the image cropped to just the chart. So a rebuild keeps
those edits, each lives in `.afterburn/hand-pages/<web dir>/`:

- `pNNN.html` is everything shown for PDF page NNN (between the page's
  `<!-- page NNN -->` marker and the next heading); the heading itself still
  comes from the builder.
- `images/pNNN-chart.png` is the cropped chart. No builder writes a
  `-chart.png` name, so it is never overwritten.
- `build-pdf-report.py` and `build-scanned.py` call
  `.afterburn/handpages.py` after building, which swaps each hand page in,
  copies its images into `public/<dir>/images/`, and deletes the generated
  images it replaced. (`build-deck.py` has no per-page markers, so it has no
  hand pages yet.)
- Give each cropped chart `width`/`height` (the file's pixel size),
  `loading="lazy" decoding="async"`, and alt text that states the chart's
  title and values. `.popanalysis` images never grow past their own width.

Current hand pages: `2017/` page 5 and `2016-population-analysis/` page 6
("Weighted Results: an Example"). Checked: rebuilding 2017 and the 2017
Summary Report reproduces the published files exactly; rebuilding 2013-2016
differs only in OCR alt text when the Tesseract version differs.

## 2013-2019 PDF reports

The old Census Archive linked these years only as PDFs, scattered across
history.burningman.org, S3 and Google Drive. We serve our own copies in one
folder, named:

    public/pdf/<year>-<type>.pdf

- `<year>` is the census year; a report covering several years (2013-2017,
  2013-2019) is filed under its last year.
- `<type>` comes from the report's own title, one of
  `weighted-results`, `annual-report`, `summary-report`,
  `population-analysis`. 2012 and later are all weighted results, so the
  2014-2015 decks the old site called "AfterBurn" reports are
  `weighted-results` too. The PDFs stay as published (2015's cover still says
  "AfterBurn Report"); everything in HTML, including any future web version of
  a 2013-2015 deck, calls them "<year> Weighted Results".
- Lowercase and hyphens only. The original filenames are recorded below, not
  reused. 2022's bookdown `_main.pdf` was moved here as
  `2022-population-analysis.pdf`; its pages' download button (the `"download"`
  list in each page's GitBook config) points to `../pdf/` (its `_main.epub`
  stays in `2022/`).

On the landing page, a PDF-only report is one link, "<years> <Title>, PDF",
using the report's own span of years where it covers several (e.g.
"2013–2016 Population Analysis, PDF", "2013–2017 Summary Report, PDF");
2012-2015 decks are titled "Weighted Results". A report with both a web page and a PDF is the web link followed by
`<span class="pdf">, <a>PDF</a></span>`, which `style.css` hides until the line
is hovered or keyboard-focused (`:has(:focus-visible)`, not `:focus-within`,
which kept it showing after a click; `opacity: 0`, not `visibility: hidden`,
so Tab can reach it) (always shown on touch screens): 2012, 2017, 2018, 2019
and 2022. 2012's PDF is the source
deck for the 2012 page, saved as `public/pdf/2012-weighted-results.pdf`.

`.afterburn/fetch-pdfs.sh` downloads them straight into `public/pdf/` under
these names and skips any already there (run it in your own Terminal: the
sandboxes can't reach these hosts).

| Local name | Original |
|---|---|
| `2013-weighted-results.pdf` | history.burningman.org `BM13_BRC_Census_Report.pdf` (cover: "Weighted Results Report") |
| `2014-weighted-results.pdf` | history.burningman.org `Census-2014-Afterburn.pdf` (cover: "Weighted Results Report") |
| `2015-weighted-results.pdf` | history.burningman.org `BRC-Census-2015.pdf` (cover: "AfterBurn Report") |
| `2015-annual-report.pdf` | history.burningman.org `2015-Expanded-Census-Report.pdf` |
| `2016-population-analysis.pdf` | Google Drive `0BxJfvV_7__jqRTlpVHRWbGZIMkE` (cover: "2013-2016 Population Analysis"; image-only, no text layer). The old page links both 2016 reports to this file. |
| `2016-weighted-results.pdf` | Supplied separately (cover: "2016 AfterBurn Report"; 40 slides, image-only) |
| `2017-summary-report.pdf` | S3 `brccensus.public.reports/2017 Docs/05.22.18 2013-2017 Summary Report.pdf` |
| `2017-population-analysis.pdf` | S3 `brccensus.public.reports/2017 Docs/05.22.18 2013-2017 Population Analysis.pdf` |
| `2018-population-analysis.pdf` | history.burningman.org `2019-BRC-Census-Population-Analysis-2.pdf` (filename says 2019, but the cover says "2013-2018 Population Analysis") |
| `2019-population-analysis.pdf` | history.burningman.org `BRC-Census-Population-Analysis-2013-2019.pdf` |

