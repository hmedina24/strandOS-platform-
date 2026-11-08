export type TenantLifecycleStatus = "draft" | "validating" | "provisioning" | "ready";

export type TenantAuditEvent = {
  id: string;
  tenantId: string;
  action: string;
  detail: string;
  status: TenantLifecycleStatus;
  occurredAt: string;
};

export type MockTenantInput = {
  businessName: string;
  salonType: string;
  contactEmail: string;
  primaryColor: string;
  serviceSummary: string;
  enabledFeatures: string[];
  domain: string;
};

export type MockTenant = MockTenantInput & {
  id: string;
  status: TenantLifecycleStatus;
  createdAt: string;
  updatedAt: string;
};

export type MockTenantRecord = {
  tenant: MockTenant;
  auditEvents: TenantAuditEvent[];
};

const lifecycle: Array<Pick<TenantAuditEvent, "action" | "detail" | "status">> = [
  { action: "Tenant record created", detail: "A mock tenant configuration was created from onboarding.", status: "draft" },
  { action: "Configuration validated", detail: "The mock tenant configuration passed simulated validation.", status: "validating" },
  { action: "Provisioning queued", detail: "Simulated provisioning was queued. No external resources were created.", status: "provisioning" },
  { action: "Simulated provisioning ready", detail: "The mock tenant is ready for the next Control Plane workflow.", status: "ready" },
];

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function createMockTenantRecord(input: MockTenantInput, createdAt = new Date()): MockTenantRecord {
  const timestamp = createdAt.toISOString();
  const tenantId = createId("tenant");

  return {
    tenant: {
      ...input,
      id: tenantId,
      status: "ready",
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    auditEvents: lifecycle.map((event, index) => ({
      ...event,
      id: createId("audit"),
      tenantId,
      occurredAt: new Date(createdAt.getTime() + index * 1_000).toISOString(),
    })),
  };
}

export function statusLabel(status: TenantLifecycleStatus) {
  return status.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
