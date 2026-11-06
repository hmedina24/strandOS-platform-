# Managed Tenant Platform Architecture

## Purpose

StrandOS provisions, deploys, monitors, and maintains a branded business application and public website for each salon. A salon owner manages content and daily operations; StrandOS manages application code, infrastructure, security, and reliability.

## Repository responsibilities

| Repository or directory | Responsibility |
| --- | --- |
| `strandos-platform` | Shared applications, APIs, provisioning, infrastructure blueprints, and operational tooling |
| `templates/salon-tenant` | Source blueprint for the future private salon configuration repository template |
| Future tenant repository | One salon's public brand configuration, approved content, enabled features, and non-secret deployment choices |

## Tenant runtime tiers

### Standard managed tenant

The default for independent stylists and small salons. The tenant uses the shared StrandOS application and API with tenant-isolated data, branding, custom domain support, and managed operations.

### Dedicated managed tenant

A future premium offering with separately deployed application resources for larger customers or contractual isolation requirements. It remains operated and updated by StrandOS.

## Security boundaries

- Tenant websites call the StrandOS API through a controlled API client or tenant SDK; they never connect directly to the database.
- Secrets, payment credentials, and production API keys stay in managed secret storage, never in a tenant repository.
- Appointment history, client details, payments, and private photos live in tenant-isolated managed data stores, not Git.
- Support access to sensitive data must be authorized, time-limited, and audited.

## Provisioning flow

```text
Create tenant in StrandOS Control Plane
        ↓
Create tenant configuration from the salon template
        ↓
Validate branding, content, domain, features, and integrations
        ↓
Provision selected runtime tier
        ↓
Deploy branded public site and salon workspace
        ↓
Monitor, update, back up, and audit the managed tenant runtime
```
