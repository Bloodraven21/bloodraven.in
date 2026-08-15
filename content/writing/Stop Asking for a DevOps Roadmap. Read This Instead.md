---
title: "Stop Asking for a DevOps Roadmap. Read This Instead"
date: 2026-05-19T10:00:00+05:30
draft: false
aliases:
  - "/blogs/stop-asking-for-a-devops-roadmap.-read-this-instead/"
  - "/blogs/the-most-practical-way-to-get-started-on-aws-build-a-producation-grade-cloud-setup-copy/"
---

# Stop Asking for a DevOps Roadmap. Read This Instead

People who reach out to me and ask "give us a roadmap of becoming a DevOps engineer" or "what was your roadmap" - I go blank. What was my roadmap? I end up saying: learn Docker, K8s, Terraform, or AWS.

So I sat down and wrote my thoughts. If I needed to start again with no memory of being a DevOps engineer and read this blog, I should be able to get all the skills required to be good enough.

A job is an outcome of being a good engineer and problem solver. Learn to become that, not to get a job. That's the first thing I would have told my 21-year-old self.

---

## Programming Language

Start with **Go**.

Docker, K8s, and Terraform are all written in Go - it makes sense. But don't just learn the syntax.

- Build an HTTP server from scratch

- Understand what a request is: HTTP methods (GET, POST, PUT, DELETE), error codes, rate limiting, exponential backoffs, API contracts

- Packages, dependencies, supply chains

- Queuing, caching, goroutines, concurrency, graceful shutdown

- Observability: logging, traces (APM), profiling

- Performance testing, load testing, requests per second

**Resources to get started:**

- [A Tour of Go](https://go.dev/tour/) - the official interactive intro. Start here.
- [Go by Example](https://gobyexample.com/) - annotated examples for every concept. Keep this open as a reference.
- [Test-Driven Development](https://www.ibm.com/think/topics/test-driven-development) - understand TDD before you write real Go code.
- [Effective Go patterns](https://gist.github.com/stefanbirkner/835b7d0c498b4026f65a) - patterns worth knowing once you have the basics down.

---

## Linux

You will live in the terminal. Get comfortable here.

**Basic navigation:**

`cd`, `ls`, `pwd`, `mkdir`, `rm`, `cp`, `mv`, `find`, `grep`, `cat`, `less`, `head`, `tail`

**File system:**

Linux organizes everything under `/`. Know the key directories:

- `/etc` - configs
- `/var` - logs
- `/home` - users
- `/tmp` - throwaway stuff

**User space vs kernel space:**

User space is where your applications run. Kernel space is where the OS does the heavy lifting. Understanding this boundary helps you debug problems that feel invisible.

**File permissions:**

Create, edit, `chmod`, `chown`. Know what `755` and `644` mean.

**Streams:**

`stdout`, `stdin`, `stderr` - three streams. Redirect with `>`, `2>`, and pipe with `|`. This is how you compose commands.

**Bash:**

Write shell scripts. Not because bash is elegant, but because every server you will ever touch has it.

**Networking:**

- IP addresses, subnets, DNS
- Know what happens when you type a URL and hit enter
- Ports: 80 is HTTP, 443 is HTTPS, 22 is SSH

**SSH:**

How you talk to remote servers. Learn key-based auth, not passwords. You will SSH into things thousands of times in your career.

**Resources to get started:**

- [Linux Roadmap](https://roadmap.sh/linux) - a structured visual guide covering everything above and more.

---

## Git and GitHub

### Git

Git is version control. It tracks every change you make to your code. You can go back in time, work on features without breaking things, and merge it all together.

- `.gitignore` - tells Git what not to track: node modules, `.env` files, build artifacts. Set this up first.

- `git stash` - save work temporarily without committing

- `git log`, `git diff`, `git blame` - your debugging friends: who changed what, when, and why

- `git reset` - undo commits. `--soft` keeps changes staged, `--hard` throws everything away. Know the difference before you run it.

- `git revert` - creates a new commit that undoes a previous one. Safer than reset because it doesn't rewrite history.

- `git cherry-pick` - grab a specific commit from another branch and apply it to yours

- `git bisect` - binary search through commit history to find which commit broke something. Criminally underused.

- Squashing commits - combine messy commits into one clean one before merging

- Hooks - scripts that run on Git events. Pre-commit for linting, pre-push for tests.

- Interactive rebase (`git rebase -i`) - reorder, squash, edit, drop commits before anyone else sees them

- Tags - mark releases: `v1.0.0`, `v1.1.0`. Know semantic versioning.

- Upstream vs origin - origin is your fork, upstream is the original repo. Keep them in sync.

- Detached HEAD - you checked out a commit instead of a branch. Not broken, just confusing the first time.

Git is not hard. It's just badly explained. Practice by breaking things in a throwaway repo. Learn it from the terminal, not a GUI - GUIs hide what's actually happening.

**Resources to get started:**

- [Learn Git](https://git-scm.com/learn) - the official book and resources. Free, thorough, authoritative.

### GitHub

Git is the tool. GitHub is the platform where your code lives.

- **Commits** - small, meaningful save points with good messages. Not "fixed stuff."

- **Branches** - work on features in isolation. Main stays clean and always deployable.

- **Pull requests** - how code gets reviewed before it goes into main. No one pushes to main directly. Ever.

- **Merge vs rebase** - two ways to combine branches. Learn both, have an opinion on when to use which.

- **Merge conflicts** - they will happen. Don't panic. Read the diff, pick the right changes, move on.

**Resources to get started:**

- [GitHub Learning](https://learn.github.com/) - official GitHub courses covering PRs, Actions, and more.

---

## Docker

- **Containers** - a way to package your application with everything it needs to run, so it works the same everywhere. No more "it works on my machine."

- **How Docker works** - it uses Linux kernel features (namespaces and cgroups) to isolate processes. It's not a VM; it shares the host kernel.

- **Dockerfile** - a recipe that tells Docker how to build your image. Every line is an instruction.

- **Multi-stage builds** - use multiple `FROM` statements to keep your final image small. Build in one stage, copy only what you need into the next.

- **Layers** - every instruction in your Dockerfile creates a layer. Layers are cached. Order your Dockerfile smartly and builds get fast.

- **Networking** - containers can talk to each other. Learn bridge networks, host networking, and how to expose ports.

- **Container registries** - where your images live. Docker Hub is public. ECR, GCR, ACR are private.

- **Docker Compose** - define and run multi-container applications with a single YAML file. Your local dev environment lives here.

**Resources to get started:**

- [Docker 101 Tutorial](https://www.docker.com/101-tutorial/) - hands-on intro, runs a real container from minute one.
- [Docker Learning Basics](https://www.docker.com/learning-paths/learning-basics/) - official learning path covering the full basics.

---

## AWS

**What is AWS:**

Amazon needed infrastructure for itself, built way more than it needed, and started selling the rest. That's literally how AWS was born.

**How AWS is designed:**

- Regions are geographic locations (Mumbai, Virginia, Frankfurt)
- Each region has multiple availability zones (AZs)
- Each AZ is one or more physical data centres
- This is how AWS gives you redundancy - if one AZ goes down, your app stays up

**Start with the building blocks:** VPC, IAM, EC2, ECR, Lambda, S3. Everything else is built on top of these.

| Service | What it does |
|---------|-------------|
| **IAM** | Who can do what. Users, roles, policies. Bad IAM is how companies get hacked. |
| **S3** | Object storage. Versioning, lifecycle policies, bucket policies. Deceptively simple, incredibly powerful. |
| **EC2** | A virtual machine in the cloud. Pick your OS, pick your size, SSH in. |
| **ECR** | A private Docker registry on AWS. Push images here, services pull from here. |
| **Lambda** | Run code without managing servers. Triggered on events. You pay only when it runs. |

**VPC (go deeper):**

- **Subnets** - public subnets can reach the internet, private subnets cannot. Databases go in private, load balancers go in public.

- **Internet gateway** - the door between your VPC and the internet

- **NAT gateway** - lets private subnets reach the internet (for updates, API calls) without being reachable from the internet

- **Route tables** - rules that decide where traffic goes. Every subnet has one.

- **VPC PrivateLink** - lets services talk to each other without traffic ever leaving the AWS network

Understand how services interact: How does an EC2 instance in a private subnet pull an image from ECR? How does a Lambda write to S3? How does traffic flow from a browser to your app and back? Trace the path. Draw it out. This is how a list of services becomes a system.

**Resources to get started:**

- [The Most Practical Way to Get Started on AWS](https://www.bloodraven.in/blogs/the-most-practical-way-to-get-started-on-aws-build-a-producation-grade-cloud-setup/) - build a production-grade cloud setup from scratch.

---

## Terraform

**What is Terraform:**

You write code that describes your infrastructure, run it, and Terraform builds it for you. Infrastructure as Code. No more clicking around in the AWS console.

- **HCL** - HashiCorp Configuration Language. Not a programming language, just a way to describe what you want.

- **Providers** - plugins that let Terraform talk to cloud platforms: AWS, GCP, Kubernetes. One tool, many clouds.

- **Resources** - the actual things you're creating: an EC2 instance, a VPC, an S3 bucket.

- **State** - Terraform tracks what it has created in a state file. Lose it and you're in trouble. Store it remotely (S3 + DynamoDB) from day one.

- **Plan and Apply** - `terraform plan` shows what will change. `terraform apply` makes it happen. Always plan before you apply.

- **Modules** - reusable chunks of Terraform code. Write your VPC setup once, use it across every project.

- **Variables and Outputs** - variables are inputs, outputs are values you extract after creation. Keep things dynamic, not hardcoded.

- **Workspaces** - separate dev, staging, and production infrastructure. Same code, different state.

- **`terraform destroy`** - tears everything down. Powerful and terrifying. Respect it.

The real skill with Terraform isn't writing it - it's structuring it so a team can work on it without stepping on each other.

**Resources to get started:**

- [Terraform Tutorials](https://developer.hashicorp.com/terraform/tutorials) - official HashiCorp tutorials, hands-on from day one.

---

## Kubernetes

**What is Kubernetes:**

A container orchestrator. You tell it what you want running, how many copies, and it figures out the rest - scheduling, scaling, restarting, networking.

**Why it's used:**

Running one container is easy. Running hundreds across multiple servers, keeping them healthy, scaling them up and down, routing traffic between them - that's the hard part. Kubernetes solves that.

### Core Objects

| Object | What it does |
|--------|-------------|
| **Pod** | Smallest unit. One or more containers running together. |
| **ReplicaSet** | Ensures a specific number of pods are always running. |
| **Deployment** | Manages ReplicaSets. Rolling updates, rollbacks, scaling. |
| **DaemonSet** | Runs one pod on every node. Used for log collectors, monitoring agents. |
| **StatefulSet** | Like a Deployment but for stateful workloads (databases, brokers). Pods get predictable names and persistent storage. |
| **ConfigMap** | Key-value pairs for configuration. Keep config out of your container image. |
| **Secrets** | Like ConfigMap but for sensitive data. Base64 encoded by default - that's not encryption. |
| **External Secrets** | Pulls secrets from AWS Secrets Manager or HashiCorp Vault into Kubernetes. This is how you do secrets properly. |

### Services

- **ClusterIP** - internal only. Other pods inside the cluster can reach it, nothing outside can.

- **NodePort** - exposes the service on a port on every node. Quick and dirty, not for production.

- **LoadBalancer** - provisions a cloud load balancer (AWS ALB/NLB) and routes external traffic to your pods.

### Common Errors

| Error | Cause |
|-------|-------|
| `CrashLoopBackOff` | Container starts, crashes, restarts, crashes again. Check logs. |
| `ImagePullBackOff` | Kubernetes can't pull your image. Wrong name, wrong tag, or missing registry credentials. |
| `OOMKilled` | Container used more memory than allowed. Increase limits or fix the memory leak. |
| `Pending` | Pod is stuck. Usually means the cluster doesn't have enough resources. |

When something breaks, run `kubectl describe` and look at events first. Always.

### Architecture

**Control plane** (the brain - makes decisions, doesn't run your app):

- **API Server** - the front door to Kubernetes. Every `kubectl` command, every component request, goes through here. Nothing talks to anything else directly.

- **etcd** - a key-value store holding the entire cluster state. If etcd dies and you have no backup, your cluster is gone. Treat it like a database because it is one.

- **Scheduler** - watches for pods with no node assigned. Looks at resource requests, affinity rules, taints, tolerations, and picks the best node.

- **Controller Manager** - runs control loops in the background. ReplicaSet controller, Node controller, Job controller. Watches desired state in etcd and works to make reality match.

- **Cloud Controller Manager** - talks to your cloud provider. When you create a `LoadBalancer` service, this is what actually provisions the AWS/GCP load balancer.

**Worker node** (runs your actual workloads):

- **kubelet** - agent on every worker node. API server tells it what pods should run; kubelet makes it happen.

- **kube-proxy** - handles networking on each node. Maintains rules so traffic to a Service reaches the right pod.

- **Container runtime** - the thing that actually runs containers (`containerd`, `CRI-O`). Kubelet talks to it through the CRI.

**How it all fits together:**

You run `kubectl apply -f deployment.yaml`. That hits the API Server → stored in etcd → Controller Manager creates a ReplicaSet → ReplicaSet creates pod objects → Scheduler picks nodes → kubelet on each node pulls the image and starts the container → kube-proxy updates network rules.

That entire flow, from `kubectl apply` to a running container, is Kubernetes.

### Requests and Limits

- **Requests** - minimum resources guaranteed. The scheduler uses this to decide where to place your pod.

- **Limits** - maximum a pod can use. Exceed the memory limit and you get `OOMKilled`.

Without requests and limits, one greedy pod can starve everything else on a node. Set them. Always.

### Managed vs Vanilla Kubernetes

- **Vanilla Kubernetes** - you set up everything: control plane, networking, upgrades. Great for learning, painful for production.

- **EKS / GKE** - they manage the control plane. You worry about worker nodes and workloads. The Kubernetes API is identical.

Pick managed. Learn the concepts on vanilla if you want, but run production on managed. Life is too short to babysit etcd.

**Resources to get started:**

- [Kubernetes Basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/) - official interactive tutorial. Covers deployments, scaling, and updates.

---

## CI/CD

**Why it exists:**

You don't want humans manually building, testing, and deploying code. Humans make mistakes. CI/CD is how code goes from a developer's laptop to production without someone SSHing into a server and running commands.

**Common pipeline steps:**

1. **Lint** - catch style issues and obvious bugs before anything else runs

2. **Test** - unit tests, integration tests. If tests fail, the pipeline stops. Nothing broken gets further.

3. **Security / quality scans** - tools like SonarQube check for vulnerabilities and code smells

4. **Build the Docker image** - package your application. Tag it properly. Use multi-stage builds to keep it lean.

5. **Push to a registry** - ECR, GCR, Docker Hub. The image needs to live somewhere your deployment target can pull from.

6. **Deploy** - to Kubernetes, ECS, Lambda, EC2, whatever your setup is. The pipeline deploys, not you.

**The important part:**

Don't learn just Jenkins or just GitHub Actions. Learn what CI/CD is trying to achieve - code change, validate, build, ship. The tool just executes that flow. Jenkins, GitHub Actions, GitLab CI, CircleCI all do the same thing differently. Understand the "what" and "why" and picking up any tool takes a day.

**Resources to get started:**

- [Learn CI/CD](https://www.freecodecamp.org/news/learn-continuous-integration-delivery-and-deployment/) - freeCodeCamp's guide covering CI, CD, and deployment end to end.

---

## Observability

**What is observability:**

The ability to understand what is happening inside your system by looking at what it outputs. When something breaks at 3 AM, observability is the difference between fixing it in 10 minutes and staring at a screen for 3 hours.

**Three pillars:**

| Pillar | What it tells you |
|--------|------------------|
| **Logs** | What happened and when. Use structured logs (JSON) - makes searching and filtering possible. |
| **Metrics** | Numbers over time: CPU, memory, request count, error rate, latency. Tells you *something* is wrong. |
| **Traces** | Follow a single request across multiple services. Shows you *where* the slowdown or failure is. |

**Tools:**

- **Prometheus** - collects and stores metrics. Pull-based, scrapes your services at intervals.

- **Grafana** - visualizes everything. Dashboards for metrics, logs, traces.

- **ELK stack** (Elasticsearch, Logstash, Kibana) - log aggregation. Collect logs from everywhere, search in one place.

- **Loki** - like ELK but lighter. Pairs well with Grafana.

- **Jaeger / Tempo** - distributed tracing. Follow requests across services.

**Alerting:**

Set up smart alerts. Alert on symptoms (high error rate, high latency), not on causes (CPU at 80%). Noisy alerts get ignored - and ignored alerts kill production.

Don't add observability after things break. Build it in from day one. If you can't see inside your system, you don't understand your system.

**Resources to get started:**

- [What is Observability?](https://signoz.io/blog/o11y/) - a solid primer on the concepts before you touch any tooling.

---


  ## This is a starting point, not a guarantee.
  
  You can read every word here and still freeze when a production system goes down at 2 AM. You can know what etcd is and still not know why your pods are pending. You can understand CI/CD in theory and still ship
  broken code to production.

  Reading doesn't build the muscle doing does.

  The engineers who are actually good at this aren't the ones who had the best roadmap. They're the ones who shipped things, broke things, got paged at odd hours, fixed things, and kept going. They Googled the same
   errors you will. They felt lost in the same Kubernetes docs you will.

  This blog can point you in a direction. It cannot replace the hours you have to put in. It cannot replace the frustration of something not working and having to figure out why. It cannot replace the moment
  something finally clicks after you've stared at it long enough.

  The map is not the territory. Go touch some grass and by grass, I mean a terminal.


---
## The only advice that matters

Take your laptop. Start building, breaking, and documenting. That's how you'll know how things actually work.
