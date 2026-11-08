export const tenantConfigurationContractVersion = "1.0" as const;

export type TenantLifecycleStatus = "draft" | "validating" | "provisioning" | "deployed" | "failed" | "suspended" | "archived";
export type TenantModule = "calendar" | "clients" | "sales" | "inbox" | "reports" | "products";

export type TenantConfiguration = {
  contractVersion: typeof tenantConfigurationContractVersion;
  tenant: { slug: string; plan: "standard"; runtimeTier: "shared" };
  business: {
    displayName: string;
    type: "independent-stylist" | "hair-salon" | "barbershop" | "beauty-studio";
    publicContactEmail: string;
    hours: Record<string, string>;
    services: Array<{ name: string; durationMinutes: number; priceCents: number }>;
    staff: Array<{ displayName: string; role: "owner" | "stylist" | "manager" | "receptionist" }>;
  };
  branding: { primaryColor: string; accentColor: string; logoAsset?: string };
  website: { template: "independent-stylist"; content: { homepage: string; about: string; navigation: string } };
  booking: { enabled: boolean; timezone: string };
  modules: Record<TenantModule, boolean>;
  deployment: { domain: string };
};

export type TenantConfigurationValidation = { valid: true } | { valid: false; errors: string[] };

const modules: TenantModule[] = ["calendar", "clients", "sales", "inbox", "reports", "products"];
const hexColor = /^#[0-9A-Fa-f]{6}$/;
const domain = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

/** Runtime validation mirrors the JSON Schema for the Control Plane's browser-only prototype. */
export function validateTenantConfiguration(value: unknown): TenantConfigurationValidation {
  const config = value as Partial<TenantConfiguration> | null;
  const errors: string[] = [];
  if (!config || typeof config !== "object" || Array.isArray(config)) return { valid: false, errors: ["configuration must be an object"] };
  if (config.contractVersion !== tenantConfigurationContractVersion) errors.push("contractVersion must be 1.0");
  if (!config.tenant?.slug?.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)) errors.push("tenant.slug must be lowercase kebab-case");
  if (config.tenant?.plan !== "standard") errors.push("tenant.plan must be standard");
  if (config.tenant?.runtimeTier !== "shared") errors.push("tenant.runtimeTier must be shared");
  if (!config.business?.displayName?.trim()) errors.push("business.displayName is required");
  if (!config.business?.publicContactEmail?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.push("business.publicContactEmail must be an email address");
  if (!Array.isArray(config.business?.services) || config.business.services.length === 0) errors.push("business.services must contain at least one service");
  if (!config.business?.hours || Object.keys(config.business.hours).length === 0) errors.push("business.hours must contain at least one day");
  if (!hexColor.test(config.branding?.primaryColor ?? "")) errors.push("branding.primaryColor must be a six-digit hex color");
  if (!hexColor.test(config.branding?.accentColor ?? "")) errors.push("branding.accentColor must be a six-digit hex color");
  if (!config.website?.content?.homepage?.startsWith("content/")) errors.push("website.content.homepage must reference content/");
  if (!config.website?.content?.about?.startsWith("content/")) errors.push("website.content.about must reference content/");
  if (!config.website?.content?.navigation?.startsWith("website/")) errors.push("website.content.navigation must reference website/");
  if (!config.booking?.timezone?.trim()) errors.push("booking.timezone is required");
  for (const module of modules) if (typeof config.modules?.[module] !== "boolean") errors.push(`modules.${module} must be a boolean`);
  if (!domain.test(config.deployment?.domain ?? "")) errors.push("deployment.domain must be a valid lowercase domain");
  return errors.length ? { valid: false, errors } : { valid: true };
}
