---
title: '{{ replace .File.ContentBaseName "-" " " | title }}'
event: ""
event_url: ""
date: {{ .Date }}
location: ""
slides: ""
github: ""
video: ""
draft: true
# `status` is derived from `date` (future = upcoming, past = delivered).
# Set it explicitly only to override — e.g. status: "confirmed".
---

<!-- Abstract goes here. Leave empty if there isn't one yet. -->
