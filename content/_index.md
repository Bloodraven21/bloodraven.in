---
title: "Welcome to BloodRaven"

# ---------------------------------------------------------------------------
# Homepage content.
#
# Everything the homepage renders lives here, not in the templates — edit this
# file to change the hero, the credential row, the terminal card or the
# "What I work on" strip.
# ---------------------------------------------------------------------------

hero:
  greeting: "Hi, I'm"
  name: "Ishan Jain."
  role: "Devops & SRE Engineer."
  tagline: "Devops and Coffee enthusiast. Open source Maintainer."
  lede: >-
    I build, operate, and talk about reliable infrastructure, distributed
    systems, Kubernetes, cloud platforms, and developer tooling.
  primaryCta:
    label: "Explore my work"
    url: "/writing/"
  secondaryCta:
    label: "View my talks"
    url: "/talks/"

# Professional identities. Keep this row short.
credentials:
  - "Docker Captain"
  - "AWS Community Builder"

techTags:
  - "Kubernetes"
  - "Cloud"
  - "DevOps"
  - "Observability"
  - "Go"

# Optional terminal card beside the hero. Delete this block to remove it.
terminal:
  title: "~/ishan"
  blocks:
    - cmd: "whoami"
      out: ["ishan"]
    - cmd: "cat interests.txt"
      out:
        - "cloud"
        - "kubernetes"
        - "distributed-systems"
        - "observability"
        - "devops"
        - "open-source"
        - "coffee"
        - "books"
        - "movies"
    - cmd: "echo $STATUS"
      out: ["building things"]
      accent: true

# "What I work on". Descriptions are intentionally blank — add a sentence or
# two per item when you want them; the card renders fine without one.
capabilities:
  - title: "Kubernetes"
    icon: "hexagon"
    description: ""
  - title: "Cloud"
    icon: "cloud"
    description: ""
  - title: "Site Reliability Engineering"
    icon: "layers"
    description: ""
  - title: "Observability"
    icon: "activity"
    description: ""
  - title: "DevOps"
    icon: "infinity"
    description: ""

# Extra output: the legacy /blogs/index.xml feed (see hugo.yaml).
outputs: ["HTML", "RSS", "blogsrss"]
---
