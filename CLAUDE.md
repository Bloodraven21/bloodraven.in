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

## Architecture

This is a custom Hugo site with **no theme** — all templates are hand-written in `layouts/`.

**Template hierarchy:**
- `layouts/_default/baseof.html` — root shell (loads `style.css`, includes header/footer partials, defines `main` block)
- `layouts/index.html` — home page (`/`)
- `layouts/blogs/list.html` — blog index (`/blogs/`)
- `layouts/recommendations/list.html` — recommendations index (`/recommendations/`)
- `layouts/_default/single.html` — all individual post pages
- `layouts/partials/header.html` — nav bar with active-link detection
- `layouts/partials/footer.html` — social links

**Content sections** (`content/`):
- `blogs/` — tech/cloud/devops articles; `_index.md` provides the section description
- `recommendations/` — books, shows, tools, etc.
- `socials/` — rendered via `_default/single.html`; displayed as a plain markdown list
- `_index.md` — home page copy

**Styling:** Single file at `static/css/style.css`. Dark theme (`#2d3748` background), monospace font, purple accent (`#c77dff`). No CSS preprocessor or build step — edit the file directly.

**Config:** `config.yaml` is the active Hugo config (`hugo.toml` exists but is minimal). `markup.goldmark.renderer.unsafe: true` is set to allow raw HTML in markdown.

**Build output:** `public/` — committed to the repo (likely for static hosting).
