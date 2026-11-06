# BRC_Census_Report
Historical reports in one site.

The published site lives in `public/` and is deployed to GitHub Pages by `.github/workflows/pages.yml`.

To add a new year, copy its rendered report into `public/<year>/` and run `bin/add-year <year>`.

Published reports are frozen; the site around them is not. See
[`docs/CHANGE-POLICY.md`](docs/CHANGE-POLICY.md) for what may and may not
change, and run `bin/check-frozen` before opening a pull request.
