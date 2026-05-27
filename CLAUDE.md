# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Serve locally with live reload
hugo server

# Build the site (outputs to public/)
hugo

# Create a new blog post
hugo new blogs/my-post-title.md

# Create a new recommendation
hugo new recommendations/my-recommendation.md

# Build for production (no drafts)
hugo --minify
```

New content is created as `draft: true` by default — set `draft: false` or remove the field before publishing. To preview drafts locally, use `hugo server -D`.

Blog filenames use spaces (e.g. `content/blogs/My Post Title.md`) — this is intentional and consistent with existing posts.

## Architecture

This is a custom Hugo site with **no theme** — all templates are hand-written in `layouts/`.

**Template hierarchy:**
- `layouts/_default/baseof.html` — root shell (loads `style.css`, includes header/footer partials, defines `main` block)
- `layouts/index.html` — home page (`/`)
- `layouts/blogs/list.html` — blog index (`/blogs/`)
- `layouts/recommendations/list.html` — recommendations index (`/recommendations/`)
- `layouts/socials/list.html` — socials page; hardcodes social links directly in the template (not content-driven)
- `layouts/_default/single.html` — all individual post pages
- `layouts/partials/header.html` — nav bar with active-link detection
- `layouts/partials/footer.html` — social links

**Content sections** (`content/`):
- `blogs/` — tech/cloud/devops articles; `_index.md` provides the section description
- `recommendations/` — books, shows, tools, etc.
- `socials/` — only `_index.md` exists; the actual links live in `layouts/socials/list.html`
- `_index.md` — home page copy

**Styling:** Single file at `static/css/style.css`. Dark theme (`#2d3748` background), monospace font, purple accent (`#c77dff`). No CSS preprocessor or build step — edit the file directly.

**Config:** `config.yaml` is the active Hugo config (`hugo.toml` exists but is minimal). `markup.goldmark.renderer.unsafe: true` is set to allow raw HTML in markdown. Nav menu order is controlled by `weight` in `config.yaml`.

**Deployment:** Push to `main` triggers the GitHub Actions workflow (`.github/workflows/aws.yml`), which builds with Hugo, syncs `public/` to S3 (`ap-south-1`), and invalidates the CloudFront distribution. Secrets (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`) must be set in the GitHub repo settings.

**Build output:** `public/` — committed to the repo and also the source for the S3 deploy.
