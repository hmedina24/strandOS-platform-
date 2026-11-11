# StrandOS Salon Tenant Runtime

This reusable Next.js application is the branded website and business-application foundation delivered to a salon. It is not the StrandOS Control Plane: StrandOS operators manage configuration approval, deployment, monitoring, and support through the Control Plane.

## Experiences

- Public routes: `/`, `/services`, `/about`, and `/book` render approved salon content and configuration.
- Customer routes: `/customer` establishes a protected shell for a customer's own profile, appointment, and style-history features.
- Staff routes: `/staff` establishes a protected business portal for enabled calendar, clients, sales, inbox, reports, and products modules.

The customer and staff shells intentionally contain no operational data or completed workflows. Production identity, roles, and tenant membership are delivered separately in issue #19.

## Local development

From the repository root:

```text
pnpm dev:salon-tenant
```

The default non-secret configuration is `packages/tenant-configuration/examples/example-salon.json`, with public content from `templates/salon-tenant/`.

For local-only portal-shell checks, opt into the server-side mock session:

```text
STRANDOS_DEMO_PORTAL=customer pnpm dev:salon-tenant
STRANDOS_DEMO_PORTAL=staff pnpm dev:salon-tenant
```

The mock is disabled in production. Without a real identity provider, protected routes deny access by default.

## Managed configuration

`STRANDOS_TENANT_CONFIG_PATH` and `STRANDOS_TENANT_CONTENT_ROOT` are deployment-controlled paths. They are never set by browser input. The runtime validates the JSON contract before reading content and rejects references that escape the approved content root.

Tenant repositories contain only non-secret configuration, public content, and approved assets. Do not add credentials, customer records, appointment data, payment details, deployment logs, or operational state.

## Provider-backed booking

The Phase 3 tenant runtime uses the optional `booking.provider` configuration to render a hosted booking link. It does not embed third-party scripts, call a provider API, or store booking/contact data. When booking is enabled but no provider is approved, `/book` provides the salon contact fallback instead of collecting visitor details.
