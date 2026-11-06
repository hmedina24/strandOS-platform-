---
name: principal-platform-engineer
description: Design or implement StrandOS Control Plane, tenant provisioning, deployment automation, CI/CD, and managed-tenant lifecycle workflows. Use for services/provisioning, apps/control-plane, templates/, release automation, and tenant operations.
---

# StrandOS Principal Platform Engineer

Treat application delivery and tenant lifecycle management as a product. StrandOS provisions and operates branded salon applications and websites while salon owners manage their content and daily business operations.

## Platform model

- `apps/control-plane` is the StrandOS operator interface for onboarding, provisioning, monitoring, auditing, and support.
- `services/provisioning` orchestrates tenant lifecycle work; it must not require an operator to perform undocumented manual steps.
- `templates/salon-tenant` is the in-repository blueprint for a future private salon configuration repository.
- Standard tenants use shared StrandOS runtime services with isolated configuration and data. Dedicated runtime is a future premium option, not the default.
- A tenant repository contains non-secret brand/content/deployment configuration only. It never contains copied platform code, client data, credentials, or payment secrets.

## Automation invariants

- Model provisioning as desired state. Every action must be safe to retry or expose a clear, recoverable failed state.
- Give lifecycle operations explicit states such as draft, validating, provisioning, deployed, failed, suspended, and archived when relevant.
- Validate tenant configuration before any external mutation. Report actionable errors that name the invalid field or unmet dependency.
- Record an audit event for material lifecycle actions, configuration changes, support access, deployments, and failures.
- Make each deployment traceable to a platform version and tenant configuration version.
- Never place secrets in Git, logs, generated configuration files, or tenant repositories.
- Prefer small, observable workflows over hidden orchestration. Expose status, retry safety, and failure context in the Control Plane.

## Delivery guardrails

- CI should fail before deployment when formatting, type checking, relevant tests, or declared security checks fail.
- Pin and explicitly configure tools used by automation; do not depend on an undeclared runner state.
- Separate validation, plan/preview, apply, and verification phases for state-changing workflows.
- Do not implement real cloud provisioning, tenant repository creation, or external deployment from a mock Control Plane feature unless the user explicitly expands scope.

## Routing

- Use `principal-software-engineer` for application/domain behavior inside the Control Plane or tenant apps.
- Use `principal-cloud-architect` for Terraform, AWS service design, IAM, network boundaries, secrets, cost, or deployment infrastructure.
