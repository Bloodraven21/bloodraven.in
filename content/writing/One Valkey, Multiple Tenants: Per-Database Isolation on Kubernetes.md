---
title: "One Valkey, Multiple Tenants: Per-Database Isolation on Kubernetes"
date: 2026-05-27
draft: false
tags: ["valkey", "kubernetes", "redis", "caching", "multitenancy", "golang"]
categories: ["infrastructure"]
summary: "How Valkey 9.1.0's per-database ACL selector lets you run multiple microservices off one shared cache instance, with hard access boundaries between them."

author: "Ishan"

coauthors:
  - name: "Gourav Sharma"
    role: "co-author"
    note: "cheerswithgourav@gmail.com"
aliases:
  - "/blogs/one-valkey-multiple-tenants-per-database-isolation-on-kubernetes/"
---

The default answer when a microservice needs a cache is to give it its own Redis or Valkey instance. It works, it is simple, and it never surprises you. It also means that a cluster running multiple services has one cache instance per service, most of them sitting at 2% utilisation.

Valkey 9.1.0, released May 2026, adds a feature that makes consolidation practical: **per-database ACL selectors**. You can lock an ACL user to a single logical database with one directive. A service that authenticates as `app3` physically cannot read or write database 4. The server rejects the attempt at the protocol level. That is the story this post tells.

---

## The problem with one instance per service

Valkey is fast and lightweight, but running a separate instance per service carries real overhead:

- Each instance needs its own memory headroom, CPU reservation, and PersistentVolumeClaim.
- Helm releases, Secrets, and Service objects multiply with every new tenant.
- Operating many small instances is not cheaper than one medium instance. It is just more fragile.

The consolidation argument is simple: if the working sets are small and the access patterns are independent, one instance can serve all your services at acceptable performance and lower operational cost.

The blocker has always been isolation. Without it, a bug in one service can read or corrupt another service's keys. Valkey's new `db=` ACL selector removes that blocker.

---

## Why a single instance can handle the load

Before getting into isolation, it is worth addressing the obvious question: can one Valkey instance actually keep up?

Valkey 8.0 redesigned its I/O threading model. Rather than a single thread handling reads, writes, and event polling, it distributes that work across multiple I/O threads while keeping command execution single-threaded (preserving data-safety guarantees). The result is a [230% throughput increase over Redis 7.2, reaching 1.19 million requests per second](https://valkey.io/blog/unlock-one-million-rps/) on a single instance, with latency dropping by nearly 70%.

Thread count scales dynamically with load, and thread affinity is maintained for cache locality. The upshot: a single well-sized Valkey instance is no longer a bottleneck concern for most consolidation scenarios.

---

## How per-database ACL works

A standalone Valkey instance supports 16 logical databases by default, indexed 0 through 15. `SELECT 3` switches a connection to database 3. Keys in database 3 are invisible from database 4.

One important constraint before going further: **databases are addressed by number only**. There is no way to assign a human-readable name like `payments` or `inventory` to a database. Your ACL config maps a user to a number, and your service config maps to that same number. If you are planning this setup, that naming limitation is worth factoring in early.

With DB 0 reserved for admin use, a single instance gives you 15 databases for services (indices 1 through 15).

What was missing until 9.1.0 was an ACL primitive to enforce the database boundary at the user level. Valkey 9.1.0 adds the `db=` selector:

```
user app3 on >password3 ~* +@all db=3
```

This user:
- Can only authenticate with `password3`
- Has full read/write access to all keys and commands, but only within database 3
- If it issues `SELECT 4`, the server responds with `NOPERM user app3 has no permissions to access database 4`

That last line is the proof the demo is built around. One instance, hard per-service boundaries, enforced by the server.

---

## Architecture

```
                     Kubernetes namespace
  +-----------------------------------------------------------+
  |                                                           |
  |   hit-service-1 (DB 1, user app1) ---\                   |
  |   hit-service-2 (DB 2, user app2) ----\                  |
  |   hit-service-3 (DB 3, user app3) -----\                 |
  |            ...                    ------>  valkey (x1)   |
  |   hit-service-N (DB N, user appN) ----/                  |
  |                                                           |
  +-----------------------------------------------------------+
```

One Valkey instance. Multiple services. Same container image across all services; only config differs per deployment. Each service connects with its own ACL user and is physically locked to its own logical database.

---

## The app

The service is a minimal Go HTTP server (Gin + OpenTelemetry). One endpoint:

```
GET /hit
  -> generate a random 8-character alphanumeric key
  -> SETEX hit:<value> <HOT_TTL> <value>
  -> return { "value": "...", "db": N, "service": "hit-service-N" }
```

Connection details come from environment variables injected by Helm:

| Variable      | Example         |
|---------------|-----------------|
| `VALKEY_HOST` | `valkey`        |
| `VALKEY_DB`   | `3`             |
| `VALKEY_USER` | `app3`          |
| `VALKEY_PASS` | from a Secret   |
| `HOT_TTL`     | `60`            |

The client authenticates with `AUTH app3 password3` and selects database 3. Because the user is ACL-locked to that database, any attempt to `SELECT` a different index is rejected, which is exactly the isolation boundary the demo proves.

---

## Kubernetes deployment

Valkey is deployed via the official `valkey-io/valkey-helm` chart with the image overridden to `9.1.0-trixie` (the chart's default `appVersion` is 8.x, which does not have the `db=` selector). The full ACL config is supplied through `auth.aclConfig`:

```yaml
image:
  tag: "9.1.0-trixie"

auth:
  enabled: true
  aclConfig: |
    user default on nopass ~* +@all
    user admin  on >SUPERSECRET_ADMIN ~* +@all alldbs
    user app1   on >password1  ~* +@all db=1
    user app2   on >password2  ~* +@all db=2
    # ... up to db=15
```

Each service is deployed with the same Helm chart, differing only in its values file:

```yaml
# values-svc3.yaml
serviceName: hit-service-3
valkey:
  db: 3
  user: app3
  existingSecret: valkey-app3
```

Multiple releases, one chart, one image, one Valkey instance.

---

## Load test results

All tests were run with k6 as an in-cluster pod targeting services via cluster DNS. Full results are in [`test_log.md`](test_log.md).

### Steady load: 1 000 RPS per service (10 000 RPS total across 10 services)

| Metric         | Value       |
|----------------|-------------|
| Total requests | 599 374     |
| Actual RPS     | 9 987 /s    |
| p(95) latency  | 33.98 ms    |
| p(99) latency  | 84.86 ms    |
| Error rate     | 0.00 %      |

All thresholds passed. The instance handled the load with p95 under 34 ms.

### Ramp: 10 to 1 000 RPS per service

| Metric         | Value       |
|----------------|-------------|
| Total requests | 902 361     |
| Average RPS    | 7 519 /s    |
| p(95) latency  | 36.03 ms    |
| Error rate     | 0.00 %      |

Ramped up over 30 s, held at peak for 60 s, ramped back down. Zero errors across the entire arc.

### Spike: 4 services at 1 000 RPS, 6 at 100 RPS

| Metric         | Value       |
|----------------|-------------|
| Total requests | 276 006     |
| Actual RPS     | 4 599 /s    |
| p(95) latency  | 1.63 ms     |
| p(99) latency  | 6.26 ms     |
| Error rate     | 0.00 %      |

**Zero errors across all three runs. 1 777 741 total requests.**

---

## The honest caveat

`db=N` gives you **access isolation**, not **resource isolation**.

There is no fair CPU or memory sharing between logical databases. A service that floods the instance with large keys or expensive commands will raise latency for every other tenant. The spike test confirms this at the aggregate level, and per-service Prometheus metrics (exported via the OpenTelemetry pipeline) would show the per-tenant effect more clearly.

This is the right trade-off for most small-to-medium services: consolidation wins operationally, and the noisy-neighbour risk is manageable as long as you monitor per-tenant throughput. If you need hard resource guarantees, you need separate instances, or you wait for fair-scheduling primitives that are on the Valkey roadmap.

---

## Wrapping up

Valkey 9.1.0's `db=` ACL selector is a small directive with a large operational payoff. Multiple services, one instance, zero cross-tenant key access. The consolidation argument is proven; the caveat is honest.

Two things to keep in mind before adopting this pattern: databases are numbered, not named, and a single standalone instance gives you 15 slots for services. Both constraints are workable for most teams but worth planning around from the start.

The full source (Go service, Helm chart, k6 scripts, and deployment guide) is at [github.com/Bloodraven21/multitenant_valkey](https://github.com/Bloodraven21/multitenant_valkey).