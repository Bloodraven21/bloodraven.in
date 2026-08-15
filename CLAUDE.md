# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Serve locally with live reload
hugo server

# Build the site (outputs to public/)
hugo

# Production build
hugo --gc --minify

# New content
hugo new writing/my-post-title.md
hugo new talks/my-talk.md
hugo new projects/my-project.md
hugo new recommendations/my-recommendation.md
```

New content is created as `draft: true` — set `draft: false` before publishing. Preview drafts with `hugo server -D`.

Blog filenames use spaces (e.g. `content/writing/My Post Title.md`) — intentional and consistent with existing posts.

## Architecture

Custom Hugo site with **no theme** — every template is hand-written in `layouts/`.

**Config:** `hugo.yaml` is the single config file. (The repo previously carried both
`hugo.toml` and `config.yaml`; Hugo only ever read `hugo.toml`, so `config.yaml` — menu,
`goldmark.unsafe` and all — was dead. They are now merged into `hugo.yaml`.) Nav order is
`menu.main` weights; filter chips and the TOC threshold are under `params`.

**Content sections** (`content/`):
- `writing/` — articles, at `/writing/<slug>/`. Each post carries an `aliases` entry
  preserving its old `/blogs/<slug>/` URL as a redirect. **Do not remove those aliases.**
- `talks/` — one file per talk; front matter carries `event`, `event_url`, `slides`,
  `github`, `video`, optional `location`. `status` is *derived from the date*
  (future = upcoming) unless set explicitly. Previously `data/talks.yaml`.
- `projects/` — empty by design; add a file and it appears on `/projects/` and in the
  homepage "Open source" section automatically.
- `recommendations/`, `socials/` — kept from the original site.
- `about/` — the long-form intro that used to live in `content/_index.md`.
- `now/` — placeholder; `lastmod` drives the "Last updated" line.
- `_index.md` — homepage *data only*: hero copy, credentials, tech tags, terminal card
  and the "What I work on" list all live in its front matter, not in templates.

**Templates:**
- `layouts/_default/baseof.html` — shell; builds/fingerprints CSS + JS, inline no-flash theme script
- `layouts/index.html` — homepage
- `layouts/<section>/{list,single}.html` — per-section pages
- `layouts/_default/{list,single,taxonomy,terms}.html` — fallbacks
- `layouts/_default/_markup/render-{heading,image}.html` — heading anchors, lazy images
- `layouts/partials/` — `icon.html` (inline SVG set), `hero.html`, `article-card.html`,
  `project-card.html`, `talk-card.html`, `timeline-item.html`, `terminal-card.html`,
  `filters.html`, `toc.html`, `pager.html`, `page-description.html`, `head/{meta,schema}.html`

**Styling:** `assets/css/*.css`, concatenated in filename order by `baseof.html`, minified and
fingerprinted in production. All colour, spacing, type and motion values are CSS custom
properties in `00-tokens.css` — change the palette there, never in a component rule. Dark by
default; the light theme is the same tokens redefined under `:root[data-theme="light"]`.
Code panels stay dark in both themes on purpose.

**JavaScript:** one file, `assets/js/site.js`, strictly progressive enhancement (theme toggle,
mobile nav, copy-code buttons, table wrapping, filter chips). Every page works without it.

**Data:** `data/social.yaml` is the single source for social links (header, footer, `/socials/`,
JSON-LD `sameAs`).

**Deployment:** push to `main` → `.github/workflows/aws.yml` builds with Hugo, syncs `public/`
to S3 (`ap-south-1`) and invalidates CloudFront. Secrets (`AWS_ACCESS_KEY_ID`,
`AWS_SECRET_ACCESS_KEY`, `BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`) live in repo settings.
The workflow uses `hugo-version: latest`, so CI may build with a newer Hugo than local.

**Build output:** `public/` — committed to the repo and also the source for the S3 deploy.
Rebuild with `hugo --gc --minify --cleanDestinationDir` so stale files do not get deployed.

## Content rules

Article bodies, titles, dates, descriptions, tags and links are the source of truth and are not
rewritten by template or design work. Cards fall back to a page's own Hugo summary rather than
inventing copy; sections with no content render an empty state instead of placeholder items.
