# StrandOS Salon Tenant Template

This directory is the source blueprint for a future private GitHub template repository. Each managed salon repository will contain only its approved public content, branding, enabled features, and deployment configuration.

It must not contain a copy of the StrandOS application, client records, appointment data, payment data, secret values, or private client photos.

## Contents

- `strandos.tenant.yaml` — versioned tenant desired state: identity, business profile, branding, content references, booking, modules, and domain intent. It conforms to `packages/tenant-configuration/tenant-configuration.schema.json`.
- `brand/` — visual configuration and references to approved public assets.
- `content/` — versioned public website copy.
- `website/` — page and navigation configuration.
- `infrastructure/` — non-secret deployment choices.

## Ownership

StrandOS automation reads this configuration to provision and update the managed tenant runtime. Salon owners use the StrandOS content-management experience; they are not expected to edit this repository directly.

## Configuration boundary

This repository contains only non-secret desired configuration. Do not add credentials, payment provider values, customer records, appointment data, private photos, deployment logs, or operational status. Domain verification, deployment results, and lifecycle state are recorded by the Control Plane and its audit log.
