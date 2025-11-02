---
title: "The Curious Case of Request and Limit on AWS EKS Fargate"
date: 2025-11-02T14:53:00+05:30
draft: false
---


If you're running containers on AWS EKS with Fargate, you might have encountered a surprising reality about how billing works. Let me share a scenario that trips up many engineers:

## The Scenario

You have a pod with the following resource specifications:

```yamlThe Most Practical Way to Get Started on AWS: Build a Producation Grade Cloud Setup
resources:
  requests:
    cpu: 100m
    memory: 500Mi
  limits:
    cpu: 4000m
    memory: 8000Mi
```

At first glance, you might think: "Great! My pod will use minimal resources (100m CPU, 500Mi memory) but can burst up to 4 vCPUs and 8GB when needed."

**But here's the twist**: On AWS Fargate, you don't pay for what you use—you pay for what you *request*.

## How Fargate Billing Actually Works

Unlike traditional Kubernetes nodes where you pay for the entire EC2 instance, Fargate billing is based on the vCPU and memory resources **requested** by your pod. Here's what makes it curious:

### The Reality Check

With the configuration above:
- **Request**: 100m CPU (0.1 vCPU), 500Mi memory
- **Limit**: 4000m CPU (4 vCPU), 8000Mi memory

You might expect to pay for 0.1 vCPU and 500Mi of memory. However, Fargate has a catch.

### Fargate's Pod Size Calculation

Fargate doesn't provision resources based on individual container requests. Instead, it:

1. **Sums up all container requests** in your pod
2. **Rounds up to the nearest supported Fargate configuration**

The supported configurations follow specific vCPU and memory combinations:

| vCPU | Memory Options |
|------|----------------|
| 0.25 vCPU | 0.5 GB, 1 GB, 2 GB |
| 0.5 vCPU | 1 GB - 4 GB (1 GB increments) |
| 1 vCPU | 2 GB - 8 GB (1 GB increments) |
| 2 vCPU | 4 GB - 16 GB (1 GB increments) |
| 4 vCPU | 8 GB - 30 GB (1 GB increments) |

### What You Actually Pay For

In our example:
- CPU request: 100m = 0.1 vCPU → **Rounds up to 0.25 vCPU**
- Memory request: 500Mi ≈ 0.5 GB → **0.5 GB**

**You'll be billed for**: 0.25 vCPU and 0.5 GB memory

But here's where it gets interesting...

## The Limit Doesn't Matter (For Billing)

Your limit of 4 vCPU and 8GB memory is essentially **ignored for billing purposes**. Fargate provisions based on requests, not limits.

However, there's an important implication:

### Performance Impact

Since Fargate provisions 0.25 vCPU for your pod, even though you set a limit of 4 vCPU:
- Your container **cannot** actually use 4 vCPUs
- It's constrained by what Fargate provisioned (0.25 vCPU)
- The limit becomes effectively meaningless

The same applies to memory:
- Fargate provisions 0.5 GB
- Your 8GB limit won't help if the pod tries to use more than provisioned
- OOMKilled errors will occur at the provisioned boundary, not your limit

## Best Practices for Fargate

### 1. **Set Requests = Limits**

Since limits don't give you burst capacity on Fargate, it's cleaner to set them equal:

```yaml
resources:
  requests:
    cpu: 250m      # 0.25 vCPU
    memory: 512Mi  # 0.5 GB
  limits:
    cpu: 250m
    memory: 512Mi
```

### 2. **Understand the Rounding**

Always check which Fargate configuration your requests will round up to. A request of 251m CPU will round up to 0.5 vCPU, doubling your cost.

### 3. **Right-Size Your Pods**

Monitor actual resource usage and set requests accordingly. Over-requesting wastes money; under-requesting causes performance issues or OOM errors.

### 4. **Consider Multiple Containers**

If your pod has multiple containers, Fargate sums all their requests:

```yaml
# Container 1: 100m CPU, 256Mi memory
# Container 2: 100m CPU, 256Mi memory
# Total: 200m CPU, 512Mi memory
# Fargate provisions: 0.25 vCPU, 1 GB (rounds up memory to nearest supported config)
```

## The Cost Implication

Let's look at a real cost scenario (using approximate US East pricing):

**Scenario 1: Optimal Configuration**
- Request/Limit: 0.25 vCPU, 0.5 GB
- Cost: ~$0.012/hour per pod

**Scenario 2: Misunderstood Configuration**
- Request: 0.1 vCPU, 0.5 GB (thinking you're optimizing)
- Actual Fargate provision: 0.25 vCPU, 0.5 GB
- Cost: ~$0.012/hour per pod (same as Scenario 1!)

**Scenario 3: Accidental Waste**
- Request: 0.3 vCPU, 0.6 GB
- Actual Fargate provision: 0.5 vCPU, 1 GB (rounds up!)
- Cost: ~$0.024/hour per pod (2x more!)

## When Should You Actually Use EKS Fargate?

Given Fargate's unique billing model, it's not a one-size-fits-all solution. Here are the scenarios where Fargate shines and where it doesn't:

### ✅ Perfect Use Cases for Fargate

#### 1. **Batch Jobs with Predictable Resource Needs**

Fargate is ideal for batch processing workloads where you know exactly how much CPU and memory you need:

```yaml
# Example: Nightly ETL job
apiVersion: batch/v1
kind: Job
metadata:
  name: data-processing-job
spec:
  template:
    spec:
      containers:
      - name: processor
        resources:
          requests:
            cpu: 1000m
            memory: 2Gi
          limits:
            cpu: 1000m
            memory: 2Gi
```

**Why it works:**
- Jobs run to completion and terminate
- You pay only for the duration of execution
- No idle infrastructure costs
- Predictable resource usage = no wasted provisioning

#### 2. **Self-Hosted CI/CD Runners**

Jenkins agents, GitLab runners, GitHub Actions runners, or Argo Workflows on Fargate are excellent choices:

**Benefits:**
- Runners spin up on-demand for each build
- Terminate immediately after job completion
- No need to maintain a pool of idle EC2 instances
- Each build gets isolated, dedicated resources
- Perfect for security-sensitive environments

**Example use case:**
```yaml
# Ephemeral CI runner
resources:
  requests:
    cpu: 2000m      # 2 vCPU for fast builds
    memory: 4Gi     # 4 GB for build artifacts
  limits:
    cpu: 2000m
    memory: 4Gi
```

A typical build might take 5-10 minutes, so you only pay for that duration rather than keeping an EC2 instance running 24/7.

#### 3. **Microservices with Predictable, Steady Load**

If your service has consistent traffic patterns without significant bursts:

**Characteristics:**
- Stable request rates throughout the day
- Predictable resource consumption
- No need for aggressive autoscaling
- Clear understanding of CPU/memory requirements

**Example:** Internal APIs, admin dashboards, scheduled report generators

#### 4. **Isolated, Secure Workloads**

When you need strong workload isolation:
- Multi-tenant applications requiring tenant-level isolation
- Compliance-heavy workloads (each pod gets its own VM boundary)
- Different customers' workloads with security requirements

#### 5. **Development and Staging Environments**

For non-production environments where:
- You want to minimize operational overhead
- Resource requirements are well-understood
- Cost predictability matters more than absolute cost optimization
- You can terminate pods during non-business hours

### ❌ Where Fargate Doesn't Make Sense

#### 1. **Highly Variable or Bursty Workloads**

If your application has unpredictable spikes:

**Problem:** You must request resources for peak load, meaning you overpay during low-traffic periods.

**Better alternative:** EC2-based node groups with Cluster Autoscaler or Karpenter, where you can:
- Set low requests with high limits
- Burst into available node capacity
- Scale nodes down during off-peak

**Example of bad fit:**
```yaml
# E-commerce site with 10x traffic during flash sales
# You'd need to request for peak (expensive)
# Or risk OOMKills during spikes (unreliable)
```

#### 2. **Long-Running Services with Consistent Traffic**

For services running 24/7 with steady usage:

**Cost comparison:**
- **Fargate:** 0.25 vCPU, 0.5 GB = ~$8.76/month per pod
- **EC2 t3.small:** 2 vCPU, 2 GB = ~$15/month (can run 8+ pods efficiently)

At scale, EC2 nodes with efficient bin-packing become more cost-effective.

#### 3. **Stateful Applications Requiring Node-Level Access**

Fargate limitations:
- No daemonsets (can't run node-level agents)
- No privileged containers by default
- Limited access to underlying infrastructure
- No direct EBS volume mounting (only EFS)

**Not suitable for:**
- Databases requiring local SSD access
- Monitoring agents that need node-level metrics
- Custom networking or storage drivers

#### 4. **GPU or Specialized Hardware Workloads**

Fargate doesn't support:
- GPU instances
- High-performance networking requirements
- Custom instance types

Machine learning training, rendering, or HPC workloads need EC2-based nodes.

#### 5. **Cost-Sensitive, High-Density Workloads**

If you're running hundreds of small microservices:

**The math:**
- 100 pods × 0.25 vCPU × 0.5 GB on Fargate = high cost
- Same workload on 3-4 optimized EC2 instances = significant savings

Bin-packing efficiency matters at scale.

## Decision Framework: Fargate vs EC2 Nodes

Ask yourself these questions:

| Question | Fargate If... | EC2 Nodes If... |
|----------|---------------|-----------------|
| **Workload Duration** | Short-lived, intermittent | Long-running, 24/7 |
| **Resource Patterns** | Predictable, steady | Variable, bursty |
| **Scale** | <50 pods | >100 pods |
| **Operational Overhead** | Want zero node management | Have ops team/automation |
| **Cost Priority** | Simplicity > absolute cost | Optimize every dollar |
| **Isolation Needs** | Strong isolation required | Standard Kubernetes isolation OK |
| **Startup Speed** | Can tolerate 30-60s cold start | Need <10s pod scheduling |

## Hybrid Approach: Best of Both Worlds

Many organizations use both:

```yaml
# Fargate for CI/CD and batch jobs
apiVersion: v1
kind: Pod
metadata:
  labels:
    workload: batch
spec:
  nodeSelector:
    eks.amazonaws.com/compute-type: fargate
```

```yaml
# EC2 nodes for core services
apiVersion: v1
kind: Pod
metadata:
  labels:
    workload: production
spec:
  nodeSelector:
    node.kubernetes.io/instance-type: t3.large
```

This gives you:
- Cost efficiency for steady workloads (EC2)
- Operational simplicity for ephemeral workloads (Fargate)
- Flexibility to optimize each workload type

## Conclusion

The curious case of requests and limits on AWS EKS Fargate teaches us an important lesson: **requests are king**. Unlike traditional Kubernetes where limits provide burst capacity, Fargate provisions based solely on requests and rounds up to supported configurations.



Understanding this behavior is crucial for:
- **Cost optimization**: Avoiding unnecessary rounding up
- **Performance tuning**: Setting realistic expectations for your pods
- **Capacity planning**: Knowing exactly what resources your applications have
<br>

**When to use Fargate:**
- Batch jobs with fixed, predictable resource needs
- Self-hosted CI/CD runners that spin up on-demand
- Deployments with steady, predictable load patterns
- Workloads requiring strong isolation
- When operational simplicity outweighs cost optimization
<br>

**When to avoid Fargate:**
- Highly variable or bursty workloads
- Long-running services at scale
- Cost-sensitive, high-density deployments
- Stateful apps requiring node-level access
<br>

Remember: On Fargate, your limits are more of a documentation tool than a functional resource boundary. Set your requests wisely, choose the right compute type for each workload, and you'll master the art of Fargate cost management.

---
