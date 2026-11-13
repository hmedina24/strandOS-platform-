# StrandOS Salon Tenant Runtime

This reusable Next.js application is the branded website and business-application foundation delivered to a salon. It is not the StrandOS Control Plane: StrandOS operators manage configuration approval, deployment, monitoring, and support through the Control Plane.

## Experiences

- Public routes: `/`, `/services`, `/about`, `/book`, and the role-neutral `/login` boundary render approved salon content and configuration.
- Customer routes: `/customer` provides Home and reusable route shells for `/customer/calendar`, `/customer/book`, `/customer/profile`, `/customer/history`, `/customer/messaging`, and `/customer/products`.
- Staff routes: `/staff` provides Home and reusable route shells for calendar, booking, CRM, client profile/notes/history, messaging, products, reports, receipts, analytics, and inventory.

The customer and staff shells intentionally contain no operational data or completed workflows. Their capability states make those boundaries clear while Phase 3 adds native identity, operational data, contacts, scheduling, and calendar services.

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

### Public website content contract

Contract version `1.1` requires approved public email, public phone display/E.164 values, business hours, services, and public navigation. The About content file is structured JSON with one lead introduction and at least three narrative sections. Invalid configuration or content renders a safe configuration-error state instead of a partial public website.

## Native booking boundary

`/book` is a branded public route with a safe contact fallback. It does not embed or redirect to third-party booking providers. Native booking and calendar workflows are delivered after the tenant's dedicated infrastructure and native scheduling service are available.

## Native authentication boundary

`/login` is a role-neutral public boundary only. It does not authenticate, authorize, or decide whether a visitor belongs in the customer or staff application. Native identity and post-login role resolution are delivered separately.
