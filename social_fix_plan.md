# Social Fix Plan

## Root Cause

The socials page (`/socials/`) is blank because **`layouts/_default/list.html` is a 0-byte empty file**.

Hugo's template lookup for `content/socials/_index.md` (a section index / list page):
1. `layouts/socials/list.html` → does not exist
2. `layouts/_default/list.html` → exists but is empty (0 bytes, no `{{ define "main" }}` block)

Result: `baseof.html`'s `{{ block "main" . }}{{ end }}` renders nothing. The page is built and deployed to S3, but its `<main>` is empty — the content from `_index.md` never appears.

## Secondary Bugs Found

**Bug 2 — Wrong active-state check in nav (header.html line 14)**

```html
<!-- current (wrong) -->
<a href="/socials/" class="nav-link{{ if eq .Section "recommendations" }} active{{ end }}">socials</a>

<!-- should be -->
<a href="/socials/" class="nav-link{{ if eq .Section "socials" }} active{{ end }}">socials</a>
```

The active class never fires on the socials page because it checks for the `recommendations` section (copy-paste oversight).

**Bug 3 — URL case mismatch in config.yaml**

```yaml
# current
- name: "Socials"
  url: "/Socials"   # capital S, no trailing slash

# should be
- name: "Socials"
  url: "/socials/"  # Hugo normalises section URLs to lowercase
```

This `config.yaml` menu isn't rendered anywhere currently (the nav is hardcoded in `header.html`), but it's incorrect and could cause a 404 if it ever gets wired up.

---

## Fix Steps

### Step 1 — Create `layouts/socials/list.html`

Create a dedicated template for the socials section that renders the markdown content from `_index.md`:

```html
{{ define "main" }}
<div class="post-header">
    <h1>{{ .Title }}</h1>
</div>
<div class="content">
    {{ .Content }}
</div>
{{ end }}
```

This is the correct fix. It mirrors how `single.html` renders content, but applies to the section list page. The `.Content` variable holds the rendered markdown from `content/socials/_index.md`.

> Do NOT try to "fix" this by filling in `layouts/_default/list.html` — that template is intentionally empty because blogs and recommendations have their own list layouts. Adding content there would affect any future section that doesn't have its own template.

### Step 2 — Fix active-state in `layouts/partials/header.html`

Change line 14 from:

```html
{{ if eq .Section "recommendations" }}
```

to:

```html
{{ if eq .Section "socials" }}
```

### Step 3 — Fix URL in `config.yaml`

Change:

```yaml
url: "/Socials"
```

to:

```yaml
url: "/socials/"
```

---

## Verification

After applying the fixes, run `hugo server` locally and confirm:
- `/socials/` renders the list of social links from `_index.md`
- Clicking "socials" in the nav highlights it as active while on that page
- `hugo` (production build) creates `public/socials/index.html` with visible content

Then push to `main` to trigger the GitHub Actions deploy.
