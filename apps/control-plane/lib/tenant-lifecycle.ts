import { tenantConfigurationContractVersion, validateTenantConfiguration, type TenantConfiguration, type TenantLifecycleStatus } from "@strandos/tenant-configuration";

export type { TenantLifecycleStatus } from "@strandos/tenant-configuration";

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
  configuration: TenantConfiguration;
  configurationVersion: number;
  createdAt: string;
  updatedAt: string;
};

export type MockTenantRecord = {
  tenant: MockTenant;
  auditEvents: TenantAuditEvent[];
};

const lifecycle: Array<Pick<TenantAuditEvent, "action" | "detail" | "status">> = [
  { action: "Tenant draft created", detail: "A version 1 mock tenant configuration was created from onboarding.", status: "draft" },
  { action: "Configuration validated", detail: "The configuration passed schema-aligned validation before simulated provisioning.", status: "validating" },
  { action: "Provisioning queued", detail: "Simulated provisioning was queued. No external resources were created.", status: "provisioning" },
  { action: "Simulated deployment recorded", detail: "The mock tenant is deployed in the Control Plane prototype; no external deployment occurred.", status: "deployed" },
];

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function slugify(value: string) { return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "new-salon"; }

function createConfiguration(input: MockTenantInput): TenantConfiguration {
  return {
    contractVersion: tenantConfigurationContractVersion,
    tenant: { slug: slugify(input.businessName), plan: "standard", runtimeTier: "shared" },
    business: { displayName: input.businessName, type: input.salonType === "Hair salon" ? "hair-salon" : input.salonType === "Barbershop" ? "barbershop" : input.salonType === "Beauty studio" ? "beauty-studio" : "independent-stylist", publicContactEmail: input.contactEmail, hours: { monday: "09:00-18:00", tuesday: "09:00-18:00", wednesday: "09:00-18:00", thursday: "09:00-18:00", friday: "09:00-18:00", saturday: "closed", sunday: "closed" }, services: [{ name: input.serviceSummary || "Services to be confirmed", durationMinutes: 60, priceCents: 0 }], staff: [{ displayName: input.businessName, role: "owner" }] },
    branding: { primaryColor: input.primaryColor, accentColor: "#D4A373" },
    website: { template: "independent-stylist", content: { homepage: "content/homepage.md", about: "content/about.md", navigation: "website/navigation.example.yaml" } },
    booking: { enabled: true, timezone: "America/New_York" },
    modules: { calendar: input.enabledFeatures.includes("calendar"), clients: input.enabledFeatures.includes("clients"), sales: input.enabledFeatures.includes("sales"), inbox: input.enabledFeatures.includes("inbox"), reports: input.enabledFeatures.includes("reports"), products: input.enabledFeatures.includes("products") },
    deployment: { domain: input.domain || `${slugify(input.businessName)}.strandos.local` },
  };
}

export function createMockTenantRecord(input: MockTenantInput, createdAt = new Date()): MockTenantRecord {
  const timestamp = createdAt.toISOString();
  const tenantId = createId("tenant");
  const configuration = createConfiguration(input);
  const validation = validateTenantConfiguration(configuration);
  if (!validation.valid) throw new Error(`Tenant configuration is invalid: ${validation.errors.join("; ")}`);

  return {
    tenant: {
      ...input,
      id: tenantId,
      status: "deployed",
      configuration,
      configurationVersion: 1,
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
