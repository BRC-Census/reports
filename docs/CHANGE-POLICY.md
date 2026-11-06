# Change policy: what may and may not change

This repo is an archive. Each report in `public/` is the record of what the
Census found in a given year, and people cite it. The site around those
reports is not an archive: it has to keep working in current browsers, on
phones, and with a screen reader, and that means it has to keep changing.

So the one rule is:

> **Presentation is ours to improve. Published findings are not ours to
> rewrite.**

A report's words, numbers, charts and PDFs stay exactly as published. The
markup, CSS, JavaScript, navigation and accessibility around them are fair
game, and improving them is the point of the repo being a live site rather
than a zip file.

`bin/check-frozen` enforces this, and `.github/workflows/change-policy.yml`
runs it on every pull request. The rest of this page is what it checks and
why.

## The three zones

A file's zone follows from its path, so a new year's folder is covered the
day it lands — nothing to register.

| Zone | What | Rule |
|---|---|---|
| **Frozen** | Images, PDFs and data files (`.png .jpg .jpeg .gif .webp .avif .bmp .tif .tiff .pdf .epub .csv .tsv .xls .xlsx`) inside any `public/<dir>/`, and everything in `public/pdf/` except its `index.html` | Add freely. Never modify, delete or rename. |
| **Page** | `.html` inside any `public/<dir>/` | Re-mark-up freely. The report words a reader sees, the chart files the page points at, and the chart crop geometry must all survive. Navigation regions are not compared — see below. |
| **Open** | `public/index.html`, `public/style.css`, `public/patch.js`, `public/pdf/index.html`, the icons and logos at the root of `public/`, generated CSS/JS/fonts/search indexes inside report folders, and everything outside `public/` (`bin/`, `docs/`, `.github/`, `README.md`) | Change as needed. |

## Always allowed

No exception, no discussion — this is the work the policy exists to protect:

- **Accessibility.** `alt` text (adding it, and fixing it when it is wrong or
  machine-generated), `aria-*`, `role`, `lang`, landmarks, heading structure
  that does not change heading *words*, skip links, focus styles, labels,
  contrast, `prefers-reduced-motion`, table headers and captions.
- **Mobile and modern browsers.** `<meta name="viewport">`, responsive CSS,
  `srcset`/`sizes` and new high-density image copies, `loading` and
  `decoding`, replacing a dead polyfill, dropping a vendor prefix, fixing a
  layout that breaks in a current browser.
- **Navigation.** Menus, the Back link, skip links, breadcrumbs, a search box,
  in-page anchors. The check skips navigation regions entirely when it
  compares text — every `<nav>`, plus the containers that carry navigation
  without being one: `.pinkbar`, bookdown's `.book-summary`/`.summary`/
  `.navigation`, Quarto's sidebars and page navigation, and the 2018–2019
  mirrors' `#ml-menu`. So nav text can be added, reworded, *or moved*. That
  exclusion exists because the pink-bar change moved "Back" out of each
  sidebar into a new top bar, and a text comparison reads a move as a deletion
  plus an insertion. Elsewhere on the page the check allows text to be added
  but objects to report text being changed, removed or reordered.
- **Site chrome.** The landing page, `style.css`, `patch.js`, favicons, the
  PDF index, the deploy workflow, the build scripts in `bin/` and
  `.afterburn/`.
- **New content.** A new year's folder, a new PDF, a new web version of a
  report that was previously PDF-only, extra image sizes.

## Never without a logged exception

- Editing, deleting or renaming a chart image, a PDF or a data file.
- Changing a word of a report's own text — including a typo. The After Burn
  pages keep "llived", "vising", "plya", "Blackrock" and "Sociodeomographic"
  on purpose; see `docs/COWORK.md`. Fixing one is a change to the historical
  record, not a fix.
- Removing a sentence, a heading, a figure or a whole page.
- Reordering charts or sections.
- Repointing an `<img>` or a link at a different file.
- Changing a chart's crop geometry (`--w`, `--h`, `--crop`, `--e`, `--max`),
  which decides which slice of a chart image a reader sees.
- Changing a published URL: a report folder's name, a page's filename, a PDF's
  filename, or an existing anchor `id`.

Those last two are easy to trip over while doing legitimate work, which is why
the check watches them specifically rather than trusting a reviewer to spot a
one-character diff in a `--crop` value.

## Running the check

```bash
bin/check-frozen
```

That compares your working tree against `origin/main` and needs nothing
installed beyond Python 3. It prints a line per breach saying what changed and
why it matters.

```bash
bin/check-frozen --propose
```

Same, and also prints the exact allowlist line to paste if the change is
genuinely needed.

CI runs `bin/check-frozen --base <base> --head <head>` on every pull request
and on pushes to `main`. A red check is not a formality: read what it says
before reaching for the allowlist.

One limit worth knowing: run locally it only sees files git tracks, so a brand
new file shows up as untracked and is skipped. That is harmless — additions are
allowed in every zone — but it means `git add` your work before trusting a
clean local run.

## Exceptions

Sometimes a frozen file genuinely has to change: a corrupt upload, a privacy
takedown, a filename being brought into line with the naming scheme. The
override is deliberate friction, not a veto.

1. Run `bin/check-frozen --propose` and copy the line it prints.
2. Paste it into `docs/frozen-exceptions.md` and replace the placeholder with a
   real reason: what changed, why it had to, who agreed, and the date. The
   check rejects the placeholder text, so this step cannot be skipped by
   pasting and moving on.
3. Say the same thing in the commit message.

The line pins a SHA-256 of the file as you are committing it (`sha256:` for a
frozen file, `page:` for a page's non-navigation text, chart references and
crop geometry together), so
an exception covers that one change and nothing else. A later edit to the same
file fails the check again and needs its own line, with its own reason. For a
page, note that the pinned fingerprint covers the approved text — a further
text addition to that page needs the line's digest updated, which
`--propose` will print for you.

`docs/frozen-exceptions.md` is therefore a permanent, readable log of every
time published report data was touched after publication. That log is the
point. An exception with no reason is not an exception.

**Prefer not needing one.** A correction is usually better published as new
content than as an edit: a new file beside the old one, a note on the page, or
a new year's report. The old URL keeps working and the record of what was
originally published survives.

## What the check cannot catch

It compares text, references and crop numbers. It cannot tell you whether:

- new `alt` text actually describes the chart (and OCR'd alt text in the
  2013–2016 reports often does not);
- a navigation change goes somewhere sensible, since nav text is deliberately
  not protected — a report heading moved *into* a nav region stops being
  compared;
- a CSS change moved a chart's visible window without touching the inline
  `--crop` value;
- a replacement image is the same chart;
Those are a reviewer's job. The checklist below is the short version.

## Reviewer checklist

- [ ] CI's change-policy check is green, or every exception line has a real
      reason and a name against it.
- [ ] No report wording, number, chart or heading differs from what was
      published.
- [ ] Every URL that worked before still works: folders, filenames, anchors.
- [ ] Charts still show the same slice of the same image at every width.
- [ ] Accessibility changes were checked against the chart, not just added.
- [ ] Pages still load styled at `/reports/<year>` and `/reports/<year>/`, and
      Back still returns to the list.
