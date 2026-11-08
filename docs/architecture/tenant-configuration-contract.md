# Managed salon tenant configuration contract

`packages/tenant-configuration/tenant-configuration.schema.json` is the canonical JSON Schema for a managed salon's non-secret desired state. Its current version is `1.0`.

## Boundary

The configuration describes approved brand, public content references, business offerings, booking preferences, enabled modules, and deployment intent. It does not contain credentials, payment-provider values, private client content, appointment records, production health data, or deployment logs.

| Group | Owner | Notes |
| --- | --- | --- |
| `tenant.slug` | Generated system value | Stable identifier; never reused. |
| `tenant.plan`, `tenant.runtimeTier`, `modules`, `website.template`, `deployment.domain` | StrandOS operator | Operator approval is required before an apply workflow. |
| `business`, `branding`, `website.content`, `booking` | Tenant | Only approved public content belongs in the tenant repository. |
| Credentials and provider connection values | Secret-backed | Stored and resolved by managed secret storage, never in this schema or repository. |
| Lifecycle, health, deployment run IDs, timestamps | Generated/operational | Held by Control Plane records and audit events, not desired configuration. |

## Versioning and validation

The `contractVersion` is required. Additive optional fields are compatible within a major version. Removing or changing the meaning of a field requires a new major version and an explicit migration path.

The Control Plane validates a complete configuration before a provisioning workflow begins. The browser-only prototype uses `validateTenantConfiguration`; production provisioning must validate the same schema with a Draft 2020-12 JSON Schema validator. Validation errors must name the field path and prevent external mutation.

## Lifecycle and traceability

Desired configuration transitions through `draft`, `validating`, `provisioning`, `deployed`, `failed`, `suspended`, and `archived`. Each material transition is auditable. A production deployment record must retain both the platform version and the tenant configuration revision used for that deployment.

## Example

`packages/tenant-configuration/examples/example-salon.json` is the machine-readable, non-secret example. `templates/salon-tenant/strandos.tenant.example.yaml` is the equivalent tenant-repository template.
