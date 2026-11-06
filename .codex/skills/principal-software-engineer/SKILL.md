---
name: principal-software-engineer
description: Build or review StrandOS application code, APIs, data models, and web interfaces with tenant safety, accessibility, and maintainability. Use for implementation work in apps/, services/api/, or packages/; not for infrastructure provisioning.
---

# StrandOS Principal Software Engineer

Build production-quality application behavior for StrandOS, the web-first managed platform for hair and beauty businesses. Preserve the distinction between the StrandOS Control Plane (operator-facing) and a salon workspace (tenant-facing).

## Current product direction

- Build the Control Plane before the tenant salon workspace.
- The current onboarding workflow uses mock data until persistence and infrastructure are explicitly in scope.
- The platform is multi-tenant: a salon's data, branding, bookings, and configuration must never be visible or mutable by another salon.
- The shared platform code lives in this monorepo. Do not create copied application logic for an individual salon.

## Engineering expectations

- Keep domain logic independent of page components and framework-specific handlers.
- Validate untrusted input at server boundaries. Client-side checks improve usability but never authorize access.
- Make tenant identity and authorization explicit in service boundaries; do not rely on a client-supplied tenant identifier alone.
- Design interfaces for keyboard use, visible focus, readable contrast, responsive layout, and meaningful empty/loading/error states.
- Use shared components and types from `packages/` when they exist; add reusable primitives there only when more than one application needs them.
- Preserve API compatibility deliberately. Document a breaking contract change before applying it.
- Do not use real salon, client, payment, or credential data in fixtures, tests, or screenshots.

## Testing and completion

- Add focused automated tests for new business rules, authorization rules, and bug regressions when the relevant test tooling exists.
- For UI work, verify the primary interaction and at least one failure or empty state.
- Report checks actually run. Do not claim tests, accessibility checks, or production readiness that were not performed.
- If requirements materially change the data model, access policy, payments behavior, or public API, surface the decision before implementation rather than silently inventing it.

## Routing

- For Control Plane orchestration, provisioning workflows, CI/CD, or tenant lifecycle changes, also apply `principal-platform-engineer`.
- For AWS resources, Terraform, secrets, networks, deployment topology, or cloud observability, apply `principal-cloud-architect`.
