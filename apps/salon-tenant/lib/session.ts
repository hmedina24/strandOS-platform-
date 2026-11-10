import "server-only";

import type { TenantConfiguration } from "@strandos/tenant-configuration";

export type StaffRole = "owner" | "stylist" | "manager" | "receptionist";
export type PortalSession =
  | { kind: "customer"; userId: string; tenantSlug: string }
  | { kind: "staff"; userId: string; tenantSlug: string; role: StaffRole };

export type PortalKind = PortalSession["kind"];

/**
 * Production intentionally returns no session until issue #19 supplies a real identity
 * provider. The opt-in mock is server-only and exists exclusively for local shell checks.
 */
export function getPortalSession(kind: PortalKind): PortalSession | null {
  if (process.env.NODE_ENV === "production" || process.env.STRANDOS_DEMO_PORTAL !== kind) return null;
  const tenantSlug = process.env.STRANDOS_DEMO_TENANT_SLUG ?? "example-salon";
  return kind === "customer"
    ? { kind, userId: "demo-customer", tenantSlug }
    : { kind, userId: "demo-staff", tenantSlug, role: "owner" };
}

export function hasPortalAccess(kind: PortalKind, configuration: TenantConfiguration) {
  const session = getPortalSession(kind);
  return Boolean(session && session.tenantSlug === configuration.tenant.slug);
}
