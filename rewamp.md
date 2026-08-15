BloodRaven.in Purple Redesign Implementation Plan

1. Objective

Redesign bloodraven.in into a dark, minimal, purple-accented personal
engineering site based on the approved purple mockup.

The redesign should communicate three things immediately:

Who Ishan Jain is.

What he builds and works on.

What he writes, speaks about, and contributes to open source.

The implementation should remain Hugo-native, fast, accessible,
responsive, and easy to maintain.

2. Non-Negotiable Content Preservation

The existing website content must remain unchanged at any cost.

This redesign is strictly a visual, structural, and UX overhaul.

Do not:

Rewrite existing content.

Summarize existing content.

Remove existing content.

Change the meaning of existing content.

Replace existing articles with new versions.

Rename existing articles unless explicitly required for technical
reasons.

Change existing article body text.

Change existing descriptions.

Change existing dates.

Change existing author information.

Change existing links.

Change existing code examples.

Change existing front matter values unless required for the new Hugo
structure.

Delete existing pages.

Replace existing content with placeholder content.

Invent new content and present it as existing content.

Existing content should be migrated into the new design verbatim
wherever possible.

If a new page or section requires content that does not currently exist,
use a clearly marked placeholder or leave the section empty. Do not
fabricate content.

If the new design conflicts with the current content structure, adapt
the design to the content rather than changing the content.

Before implementation:

Create an inventory of all existing content.

Record existing URLs and slugs.

Record existing front matter.

Record existing links.

Record existing page titles and descriptions.

Use the inventory as the source of truth during migration.

After implementation, compare the old and new content to verify that
nothing has been unintentionally changed.

3. Design Direction

Use a dark technical aesthetic with purple as the only strong accent.

Core characteristics:

Near-black background.

Deep navy/indigo undertones.

Electric violet as the primary interactive color.

Lavender as a secondary highlight.

Off-white primary text.

Muted gray secondary text.

Thin, subtle borders.

Small purple glow effects only where they improve hierarchy.

No stock images.

No article thumbnails.

No decorative illustrations.

No large background photographs.

Minimal icons only for technologies, social links, and small UI
affordances.

Generous spacing.

Strong typography hierarchy.

Subtle terminal/monospace elements.

The site should feel like an engineering portfolio and personal
knowledge base, not a generic developer template.

4. Target Information Architecture

Replace the current simple navigation with:

Home
Writing
Projects
Talks
About
Now

Recommended routes:

/
  Homepage

/writing/
  Blog/article index

/writing/<slug>/
  Individual article

/projects/
  Project index

/projects/<slug>/
  Individual project

/talks/
  Speaking index

/talks/<slug>/
  Individual talk

/about/
  About Ishan

/now/
  Current interests and work

Recommendations can remain available as /recommendations/, but should
not be a primary navigation item unless the section grows substantially.

The information architecture must not require changing or deleting
existing content.

5. Content Inventory and Migration

Before modifying templates or content:

List every page under content/.

List every article.

List every existing URL/slug.

Record front matter for every content item.

Record title, description, date, tags, categories, and other
metadata.

Record internal links.

Record external links.

Record images/assets referenced by content, even if the
redesigned UI does not display them.

Record shortcodes used by existing content.

Record any custom Markdown features.

Create a content migration mapping if directories or content
types change.

The migration must be lossless.

A redesign should never be used as an excuse to clean up or rewrite
existing writing.

6. Homepage

6.1 Header

Create a compact sticky or semi-sticky header.

Left:

⚡ BLOODRAVEN

Right:

Home
Writing
Projects
Talks
About
Now
GitHub
LinkedIn
Theme

Requirements:

Active navigation item uses purple.

Header background should be slightly different from the page
background.

Use a subtle bottom border.

Mobile navigation collapses into a menu.

Do not make the header excessively tall.

Existing important navigation destinations must remain accessible.

6.2 Hero

The hero should use existing site content wherever equivalent content
already exists.

If new copy is needed for the redesigned hero, do not replace existing
content. Use existing content elsewhere and only add new copy when
explicitly approved.

Primary visual structure:

Hi, I'm

Ishan Jain.

Cloud & Platform Engineer.

Kubernetes enthusiast. Open source contributor.

I build, operate, and talk about reliable infrastructure,
distributed systems, Kubernetes, cloud platforms,
and developer tooling.

Primary CTA:

Explore my work →

Secondary CTA:

View my talks →

Optional terminal card:

$ whoami
ishan

$ cat interests.txt
cloud
kubernetes
distributed-systems
observability
devops
open-source
coffee
books
movies

$ echo $STATUS
building things

The terminal element is optional. Keep it lightweight and avoid making
the page look like a terminal emulator.

Any content displayed in the hero that already exists elsewhere must
preserve its original wording.

6.3 Credentials / identity row

Show selected professional identities from existing/publicly verified
content.

Potential items:

Docker Captain

AWS Community Builder

Follow with technology tags where supported by existing content:

Kubernetes
Cloud
DevOps
Observability
Go

Keep this compact.

6.4 What I Work On

Create a five-column desktop section:

Kubernetes

Cloud

Platform Engineering

Observability

DevOps

Each item contains:

Small line/icon mark.

Title.

One or two sentence description.

If descriptions do not already exist in the site's content, do not
fabricate them. Either use approved copy or keep the description
minimal.

On smaller screens, convert this into a two-column or single-column
layout.

6.5 Featured

Two large content cards:

Latest Article

Show:

Category

Existing article title

Existing description

Existing date

Reading time if available

Read article link

Do not use an image.

Featured Talk

Show:

Existing event

Existing talk title

Existing date

Existing location

View details link

Do not use an image.

Do not create fake articles or talks just to fill the mockup.

6.6 Open Source

Show selected existing projects if they are already represented in the
current site/content or explicitly approved.

Each project card should contain:

Repository/project name.

Existing description.

Technology tags where available.

GitHub link.

Stars/forks only if reliable build-time data is available.

Do not hard-code GitHub statistics if they are likely to become stale.

End with:

View more on GitHub →

6.7 Footer

Three compact columns:

Let's connect

Use existing contact and social information.

Currently

Only include this if existing content supports it. Otherwise leave it
out until explicitly populated.

Built with

Hugo

Add:

© <year> Ishan Jain

Do not change existing copyright/content wording without approval.

7. Writing Page

Route:

/writing/

Page structure:

Writing

Thoughts on engineering, systems,
and everything in between.

Category filters:

All
Kubernetes
Cloud
DevOps
Databases
Observability
Valkey
Kafka

Use the existing article content as the source of truth.

Article cards should be text-first.

Each card:

CATEGORY · READING TIME

Existing article title

Existing description.

Existing date

No thumbnails.

Recommended visual treatment:

Subtle border.

Purple hover state.

Small category metadata.

Strong title.

Minimal animation.

8. Individual Writing Page

Article layout:

Category

Existing Title

Existing description

Existing date · Reading time

------------------------------------------------

Existing article content

------------------------------------------------

Existing tags

Previous / Next

Requirements:

Preserve article body content verbatim.

Preserve Markdown/code examples.

Preserve links.

Preserve images referenced by articles even if the new homepage does
not use images.

Excellent typography for long-form reading.

Maximum content width around 720 to 800px.

Comfortable line height.

Code blocks with syntax highlighting.

Copy-code button.

Heading anchor links.

Table of contents for long articles.

Previous/next navigation.

Social sharing should be optional and unobtrusive.

Use semantic HTML.

Do not rewrite existing articles to fit the new design.

9. Projects Page

Route:

/projects/

Header:

Projects

Things I build, maintain, and experiment with.

If this content does not currently exist, use only approved new copy.

Filters:

All
Featured
Kubernetes
DevOps
Cloud
Tools

Project cards should be image-free.

Each card:

Project name

Existing description

Kubernetes · Valkey · Helm · Go

GitHub →

Use subtle purple hover states.

Do not invent project descriptions.

10. Individual Project Page

Each project should support, where information exists:

Overview

Why it exists

Architecture

Technologies

Current status

Links

GitHub repository

Documentation

Demo if available

Avoid adding a project page just to duplicate a README.

Do not fabricate project details.

11. Talks Page

Route:

/talks/

Use a vertical timeline.

Each timeline entry:

YEAR / MONTH

Existing talk title

Existing event
Existing location

Existing status

Status examples:

UPCOMING
CONFIRMED
DELIVERED

Use purple nodes and connecting lines.

This should be one of the strongest visual sections on the site.

All talk metadata must come from existing content or explicitly approved
information.

12. Individual Talk Page

Each talk should support:

Title

Event

Date

Location

Abstract

Speaker information

Slides

Recording

GitHub/demo repository

Related articles

Preserve existing talk descriptions and abstracts exactly.

Do not invent recordings, slides, repositories, or event information.

13. About Page

Route:

/about/

Suggested structure:

About Ishan

Existing introduction

What I work on

Professional timeline

Open source

Community

Interests

Contact

Keep existing About content unchanged.

If additional sections are desired, add them only with explicitly
approved content.

Avoid turning the page into a traditional resume.

Provide a separate:

Download Resume

CTA only if a current resume is available.

14. Now Page

Route:

/now/

Purpose:

Show what is currently occupying attention.

This page can be introduced as a new page because it does not require
modifying existing content.

Potential sections:

Currently working on

Currently learning

Upcoming talks/events

Reading

Building

Tools being explored

Only populate it with information that is explicitly approved.

Add a visible last-updated date.

Example:

Last updated: August 2026

Keep this page easy to edit.

15. Recommendations

Keep /recommendations/ but redesign it using the same visual system.

Categories:

Books
Tools
Coffee
Movies
Shows

Each existing recommendation should retain its original:

Name.

Description.

Links.

Category.

Ordering where meaningful.

Do not rewrite recommendations.

Do not make Recommendations a primary navigation item unless the content
becomes substantial.

16. Typography

Use a strong sans-serif for general UI and a monospace font for
technical metadata.

Suggested combination:

Headings:
Space Grotesk

Body:
Inter

Technical:
JetBrains Mono

If adding external fonts increases complexity or privacy concerns, use
locally hosted/static font assets or a high-quality system fallback.

Typography priorities:

Large hero heading.

Strong page titles.

Comfortable article text.

Monospace only for metadata, labels, code, and terminal elements.

Avoid excessive uppercase text.

Changing typography must never alter or remove existing textual content.

17. Color System

Use CSS custom properties so the palette can be changed centrally.

Suggested starting palette:

--bg:          #080810
--bg-elevated: #0D0D18
--surface:     #11111F
--surface-2:   #161629

--border:      #25243A
--border-hover:#3A315A

--text:        #F2F0F7
--text-muted:  #A6A3B3
--text-subtle: #777487

--purple:      #9B5CFF
--purple-dark: #6D35C9
--purple-soft: #C39BFF
--purple-glow: rgba(155, 92, 255, 0.18)

The exact palette should be tuned against the generated mockup during
implementation.

Do not introduce multiple unrelated accent colors.

18. Component System

Build reusable Hugo partials/components rather than duplicating markup.

Suggested components:

partials/
├── header.html
├── footer.html
├── hero.html
├── social-links.html
├── badge.html
├── tech-tag.html
├── article-card.html
├── talk-card.html
├── project-card.html
├── timeline-item.html
├── terminal-card.html
├── section-header.html
└── pagination.html

If the current theme already provides equivalent components, adapt them
instead of duplicating functionality.

Components must render existing content without modifying it.

19. Hugo Content Model

Use front matter consistently.

Writing

---
title: ""
date: 2026-01-01
description: ""
tags: []
categories: []
draft: false
featured: false
readingTime: 8
---

Project

---
title: ""
description: ""
status: active
featured: false
technologies: []
github: ""
documentation: ""
---

Talk

---
title: ""
event: ""
date: 2026-01-01
location: ""
status: upcoming
description: ""
slides: ""
recording: ""
repository: ""
---

Do not overwrite existing front matter with these examples.

First inspect the existing front matter and preserve it.

Only introduce new fields when they are needed by the redesigned
templates.

Existing front matter values must remain unchanged unless a technical
migration requires a new representation and the original value can be
preserved.

20. Responsive Design

Design desktop-first only if it does not compromise mobile
implementation.

Required breakpoints should be based on layout needs rather than device
names.

Desktop:

Multi-column hero.

Five-column capability section.

Two-column featured section.

Four-column project section.

Tablet:

Two-column cards.

Reduced navigation spacing.

Mobile:

Single-column content.

Collapsible navigation.

Hero terminal card stacked below text.

One project per row.

Timeline becomes a compact vertical list.

No horizontal overflow.

Touch targets at least approximately 44px.

21. Accessibility

Implement:

Semantic landmarks.

Correct heading hierarchy.

Keyboard-accessible navigation.

Visible focus states.

Accessible icon buttons.

Sufficient text contrast.

Reduced-motion support.

Descriptive link text.

No information conveyed only through color.

Add:

@media (prefers-reduced-motion: reduce) {
  ...
}

Animations must not be necessary to understand the site.

Accessibility changes must not modify the actual content.

22. Motion

Keep animation subtle.

Allowed:

Header transition.

Card border/glow on hover.

Small CTA movement.

Fade/slide on page load if it remains fast.

Avoid:

Constant animated backgrounds.

Excessive particle effects.

Large scrolling animations.

Cursor-following effects.

WebGL.

Heavy JavaScript animation libraries.

The site should still feel excellent with JavaScript disabled.

23. Performance

The redesign should preserve Hugo's major advantage: static, fast pages.

Targets:

Minimal JavaScript.

No unnecessary frontend framework.

No image dependency for core content.

Self-host fonts if practical.

Minified CSS.

Hugo asset fingerprinting.

Lazy-load non-critical resources.

Avoid large JS bundles.

Target:

Lighthouse Performance: 95+
Lighthouse Accessibility: 95+
Best Practices: 95+
SEO: 95+

These are targets, not guarantees.

Images that are part of existing article content must remain available
even if the new UI does not use images for cards or sections.

24. SEO

Add:

Proper page titles.

Meta descriptions.

Canonical URLs.

Open Graph metadata.

Twitter/X card metadata.

sitemap.xml.

RSS feed for writing.

JSON-LD where appropriate.

Correct robots.txt.

Do not replace existing SEO metadata with generic text.

Preserve existing metadata wherever possible.

Homepage title example:

Ishan Jain | Cloud & Platform Engineer

Writing pages should use:

<Article Title> | Ishan Jain

25. Analytics

Do not introduce analytics unless needed.

If analytics are already configured, preserve them.

If adding analytics later, prefer a privacy-conscious solution and avoid
blocking page rendering.

Do not remove existing analytics configuration during the redesign.

26. Implementation Phases

Phase 1: Audit

Inspect current Hugo version.

Identify current theme.

Inspect config / hugo.yaml.

Inspect layouts/.

Inspect content/.

Inspect static assets.

Inventory existing shortcodes.

Inventory existing front matter.

Identify URLs that must remain stable.

Identify existing SEO/RSS configuration.

Identify deployment pipeline.

Create complete content inventory.

Create a backup or Git commit before changes.

Do not start changing content until this audit is complete.

Phase 2: Design System

Add CSS variables for the purple palette.

Select typography.

Define spacing scale.

Define border radius.

Define card styles.

Define buttons.

Define tags/badges.

Define focus states.

Define responsive breakpoints.

Define motion rules.

Build these before page-specific styling.

Phase 3: Global Shell

Replace header.

Implement desktop navigation.

Implement mobile navigation.

Add social links.

Implement footer.

Add global SEO metadata.

Add favicon/site icon.

Verify dark theme across every route.

Do not remove existing navigation destinations until their replacement
is confirmed.

Phase 4: Homepage

Implement in this order:

Header

Hero

Credential row

What I Work On

Featured writing

Featured talk

Open source

Footer

Do not implement advanced animations until the static layout matches the
mockup.

All existing homepage content must remain available after the redesign,
even if its visual location changes.

Phase 5: Content Sections

Writing index.

Writing single page.

Projects index.

Project single page.

Talks index.

Talk single page.

About.

Now.

Recommendations.

Phase 6: Polish

Responsive refinement.

Typography tuning.

Purple color tuning.

Hover states.

Focus states.

Reduced-motion behavior.

Code-block styling.

Timeline styling.

Empty states.

404 page.

Phase 7: Content Integrity Validation

Before deployment:

Compare every existing page against the pre-redesign version.

Verify every article body is unchanged.

Verify every title is unchanged.

Verify every description is unchanged.

Verify every date is unchanged.

Verify every tag/category is preserved.

Verify every external link is preserved.

Verify every internal link is preserved.

Verify existing images/assets remain accessible.

Verify existing shortcodes still render.

Verify no existing content was silently dropped.

Verify no placeholder content replaced real content.

Verify no generated copy was inserted into existing articles.

Any content difference should be treated as a migration defect unless
explicitly approved.

Phase 8: Technical Validation

Run:

hugo --gc --minify
hugo server

Validate:

No Hugo build warnings.

No broken links.

No missing assets.

No console errors.

No horizontal overflow.

All navigation works.

All article URLs work.

All talk URLs work.

All project URLs work.

RSS works.

Sitemap works.

Open Graph metadata works.

Mobile layout works.

Keyboard navigation works.

Reduced motion works.

Then run Lighthouse against:

/
 /writing/
 /projects/
 /talks/
 /about/
 /now/

27. URL Compatibility

Do not casually change existing URLs.

Before changing the content structure:

Export/list current URLs.

Map old URLs to new URLs.

Preserve existing slugs where possible.

Add redirects for changed URLs.

Verify inbound links if available.

SEO preservation is more important than having perfectly clean internal
directory names.

Changing a URL is acceptable only when necessary, and the old URL must
redirect to the new one.

28. Content Integrity Rules During Development

Treat the existing site as the source of truth.

Rule 1: Visual changes only

Templates and CSS should change first. Content files should not be
edited unless there is a specific technical reason.

Rule 2: No opportunistic rewriting

Do not "improve" grammar, titles, descriptions, or wording while
implementing the redesign.

Rule 3: No content deletion

If a piece of content does not fit the new design, find a better layout
for it.

Rule 4: No invented content

Do not invent project descriptions, talk abstracts, achievements, dates,
statistics, or biography details to make the mockup look complete.

Rule 5: Preserve links

Existing links are part of the content and must remain functional.

Rule 6: Preserve code

Code blocks inside existing articles must not be reformatted or modified
as part of the redesign.

Rule 7: Preserve media

Existing content images and media must remain available even though the
redesigned UI does not use decorative images.

Rule 8: Preserve metadata

Front matter should be migrated, not casually rewritten.

Rule 9: Verify before deleting

Before deleting any file, confirm that it is not referenced by existing
content, templates, shortcodes, or configuration.

Rule 10: Git makes every change reversible

Make small commits:

design: add purple theme tokens
design: redesign header
design: redesign homepage
design: redesign writing pages
design: redesign talks pages
design: redesign project pages
design: redesign about page
design: add responsive layouts
chore: validate content integrity

Never combine a content rewrite with a visual redesign commit.

29. What Not To Build

The purple design intentionally avoids:

Article thumbnail grids.

Stock photos.

AI-generated illustrations.

Full-screen video backgrounds.

3D effects.

Particle backgrounds.

Excessive gradients.

Giant animated logos.

Generic "developer portfolio" sections.

Skill percentage bars.

Fake GitHub statistics.

Excessive JavaScript.

A full terminal-only interface.

The visual identity should come from typography, spacing, purple
accents, borders, and content hierarchy.

30. Definition of Done

The redesign is complete when:

The homepage visually matches the purple mockup's design language.

No content cards require images.

Purple is the only major accent color.

Writing, Projects, Talks, About, and Now have consistent layouts.

Existing blog content remains accessible.

All existing website content remains unchanged.

Existing article text is preserved verbatim.

Existing metadata is preserved.

Existing links remain functional.

Existing important URLs remain valid or redirect correctly.

Existing images/media referenced by content remain accessible.

The site works well on desktop and mobile.

Hugo builds cleanly.

The site remains mostly static and JavaScript-light.

Accessibility and SEO metadata are implemented.

The visual system is reusable through Hugo partials and CSS
variables.

Adding a new article, project, or talk requires editing content, not
templates.

A final content integrity check shows no unintended content changes.

31. Recommended Implementation Order

The shortest path to the mockup is:

1. Audit current Hugo repo
2. Back up / commit current state
3. Inventory all existing content
4. Establish purple design tokens
5. Build header/footer
6. Build homepage
7. Build article card + writing page
8. Build project card + projects page
9. Build talk timeline + talks page
10. Build About
11. Build Now
12. Refine mobile
13. Add accessibility
14. Add SEO
15. Performance optimization
16. Run content integrity comparison
17. Run final technical validation
18. Final visual comparison against mockup
19. Deploy

The priority should be:

Content preservation
        ↓
Layout
        ↓
Typography
        ↓
Responsive behavior
        ↓
Accessibility
        ↓
Performance
        ↓
Animation

The existing content is the highest-priority constraint. The redesign
must adapt to the content, never the other way around.