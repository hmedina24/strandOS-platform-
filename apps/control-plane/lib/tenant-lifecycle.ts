import { bookingLaunchReadiness, tenantConfigurationContractVersion, validateTenantConfiguration, type TenantConfiguration, type TenantLifecycleStatus } from "@strandos/tenant-configuration";

export type { TenantLifecycleStatus } from "@strandos/tenant-configuration";

export type TenantAction = "configure" | "deploy" | "redeploy";
export type LifecycleExecutionState = "requested" | "queued" | "running" | "succeeded" | "failed";
export type LifecycleStatus = TenantLifecycleStatus | LifecycleExecutionState;
export type ExecutionMode = "simulated";

export type TenantAuditEvent = {
  id: string;
  tenantId: string;
  action: string;
  detail: string;
  status: LifecycleStatus;
  occurredAt: string;
  runId?: string;
  executionMode?: ExecutionMode;
};

export type LifecycleRun = {
  id: string;
  tenantId: string;
  action: TenantAction;
  executionMode: ExecutionMode;
  state: LifecycleExecutionState;
  configurationVersion: number;
  templateVersion: string;
  requestedAt: string;
  startedAt?: string;
  completedAt?: string;
  errorSummary?: string;
  retryOfRunId?: string;
};

export type MockTenantInput = { businessName: string; salonType: string; contactEmail: string; publicPhoneDisplay: string; publicPhoneE164: string; primaryColor: string; serviceSummary: string; enabledFeatures: string[]; domain: string; bookingProviderName?: string; bookingUrl?: string };
export type MockTenant = MockTenantInput & { id: string; status: TenantLifecycleStatus; configuration: TenantConfiguration; configurationVersion: number; createdAt: string; updatedAt: string };
export type MockTenantRecord = { tenant: MockTenant; auditEvents: TenantAuditEvent[] };
export type LifecycleActionResult = { tenant: MockTenant; run: LifecycleRun; auditEvents: TenantAuditEvent[] };

export const tenantTemplateVersion = "salon-tenant-template@0.1.0";

const onboardingLifecycle: Array<Pick<TenantAuditEvent, "action" | "detail" | "status">> = [
  { action: "Tenant draft created", detail: "A version 1 mock tenant configuration was created from onboarding.", status: "draft" },
  { action: "Configuration validated", detail: "The configuration passed schema-aligned validation before simulated provisioning.", status: "validating" },
  { action: "Provisioning queued", detail: "Simulated provisioning was queued. No external resources were created.", status: "provisioning" },
  { action: "Simulated deployment recorded", detail: "The mock tenant is deployed in the Control Plane prototype; no external deployment occurred.", status: "deployed" },
];

function createId(prefix: string) { return `${prefix}-${crypto.randomUUID()}`; }
function slugify(value: string) { return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "new-salon"; }
export function actionLabel(action: TenantAction) { return action === "redeploy" ? "Redeploy" : action[0].toUpperCase() + action.slice(1); }

function createConfiguration(input: MockTenantInput): TenantConfiguration {
  return {
    contractVersion: tenantConfigurationContractVersion,
    tenant: { slug: slugify(input.businessName), plan: "standard", runtimeTier: "shared" },
    business: { displayName: input.businessName, type: input.salonType === "Hair salon" ? "hair-salon" : input.salonType === "Barbershop" ? "barbershop" : input.salonType === "Beauty studio" ? "beauty-studio" : "independent-stylist", publicContactEmail: input.contactEmail, publicContactPhone: { display: input.publicPhoneDisplay, e164: input.publicPhoneE164 }, hours: { monday: "09:00-18:00", tuesday: "09:00-18:00", wednesday: "09:00-18:00", thursday: "09:00-18:00", friday: "09:00-18:00", saturday: "closed", sunday: "closed" }, services: [{ name: input.serviceSummary || "Services to be confirmed", durationMinutes: 60, priceCents: 0 }], staff: [{ displayName: input.businessName, role: "owner" }] },
    branding: { primaryColor: input.primaryColor, accentColor: "#D4A373" },
    website: { template: "independent-stylist", content: { homepage: "content/homepage.md", about: "content/about.json", navigation: "website/navigation.example.json" } },
    booking: {
      enabled: true,
      timezone: "America/New_York",
      ...(input.bookingProviderName?.trim() && input.bookingUrl?.trim() ? { provider: { displayName: input.bookingProviderName.trim(), bookingUrl: input.bookingUrl.trim() } } : {}),
    },
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
  return { tenant: { ...input, id: tenantId, status: "deployed", configuration, configurationVersion: 1, createdAt: timestamp, updatedAt: timestamp }, auditEvents: onboardingLifecycle.map((event, index) => ({ ...event, id: createId("audit"), tenantId, occurredAt: new Date(createdAt.getTime() + index * 1_000).toISOString() })) };
}

/** Executes only a local, observable template simulation. It never mutates external systems. */
export function runMockTenantAction(tenant: MockTenant, action: TenantAction, now = new Date(), retryOfRunId?: string): LifecycleActionResult {
  const runId = createId("run");
  const requestedAt = now.toISOString();
  const baseRun: Omit<LifecycleRun, "state"> = { id: runId, tenantId: tenant.id, action, executionMode: "simulated", configurationVersion: tenant.configurationVersion, templateVersion: tenantTemplateVersion, requestedAt, retryOfRunId };
  const label = actionLabel(action);
  const events: TenantAuditEvent[] = [];
  const addEvent = (status: LifecycleExecutionState, detail: string, offset: number) => events.push({ id: createId("audit"), tenantId: tenant.id, runId, action: `${label} ${status}`, detail, status, executionMode: "simulated", occurredAt: new Date(now.getTime() + offset * 1_000).toISOString() });
  addEvent("requested", `${label} was requested for configuration v${tenant.configurationVersion}.`, 0);
  const validation = validateTenantConfiguration(tenant.configuration);
  if (!validation.valid) {
    const errorSummary = `Configuration validation failed: ${validation.errors.join("; ")}`;
    addEvent("failed", errorSummary, 1);
    return { tenant: { ...tenant, status: "failed", updatedAt: new Date(now.getTime() + 1_000).toISOString() }, run: { ...baseRun, state: "failed", completedAt: new Date(now.getTime() + 1_000).toISOString(), errorSummary }, auditEvents: events };
  }
  if ((action === "deploy" || action === "redeploy") && tenant.configuration.booking.enabled) {
    const readiness = bookingLaunchReadiness(tenant.configuration);
    if (!readiness.ready) {
      const errorSummary = `Booking launch validation failed: ${readiness.detail}`;
      addEvent("failed", errorSummary, 1);
      return { tenant: { ...tenant, status: "failed", updatedAt: new Date(now.getTime() + 1_000).toISOString() }, run: { ...baseRun, state: "failed", completedAt: new Date(now.getTime() + 1_000).toISOString(), errorSummary }, auditEvents: events };
    }
  }
  addEvent("queued", `${label} queued against ${tenantTemplateVersion}.`, 1);
  addEvent("running", `${label} is validating the approved configuration and preparing a template plan.`, 2);
  addEvent("succeeded", `${label} completed as a simulated tenant-template operation. No external deployment occurred.`, 3);
  return { tenant: { ...tenant, status: "deployed", updatedAt: new Date(now.getTime() + 3_000).toISOString() }, run: { ...baseRun, state: "succeeded", startedAt: new Date(now.getTime() + 2_000).toISOString(), completedAt: new Date(now.getTime() + 3_000).toISOString() }, auditEvents: events };
}

export function statusLabel(status: LifecycleStatus) { return status.replace(/\b\w/g, (letter) => letter.toUpperCase()); }
