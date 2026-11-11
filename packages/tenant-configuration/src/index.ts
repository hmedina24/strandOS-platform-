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
  booking: {
    enabled: boolean;
    timezone: string;
    /** Public, non-secret provider details for the managed website's hosted booking link. */
    provider?: { displayName: string; bookingUrl: string };
  };
  modules: Record<TenantModule, boolean>;
  deployment: { domain: string };
};

export type TenantConfigurationValidation = { valid: true } | { valid: false; errors: string[] };
export type BookingLaunchReadiness = { ready: true; detail: string } | { ready: false; detail: string };

const modules: TenantModule[] = ["calendar", "clients", "sales", "inbox", "reports", "products"];
const hexColor = /^#[0-9A-Fa-f]{6}$/;
const domain = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;
function isHttpsUrl(value: string) {
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}

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
  if (config.booking?.provider) {
    if (!config.booking.provider.displayName?.trim()) errors.push("booking.provider.displayName is required when booking.provider is set");
    if (!isHttpsUrl(config.booking.provider.bookingUrl ?? "")) errors.push("booking.provider.bookingUrl must be an absolute HTTPS URL when booking.provider is set");
  }
  for (const module of modules) if (typeof config.modules?.[module] !== "boolean") errors.push(`modules.${module} must be a boolean`);
  if (!domain.test(config.deployment?.domain ?? "")) errors.push("deployment.domain must be a valid lowercase domain");
  return errors.length ? { valid: false, errors } : { valid: true };
}

/**
 * A launch-specific check. This preserves the valid disabled-booking state while
 * requiring an approved public provider destination for any enabled booking flow.
 */
export function bookingLaunchReadiness(configuration: TenantConfiguration): BookingLaunchReadiness {
  if (!configuration.booking.enabled) return { ready: false, detail: "Online booking is disabled in the tenant configuration." };
  if (!configuration.booking.provider) return { ready: false, detail: "booking.provider must be approved before an enabled booking flow can launch." };
  return { ready: true, detail: `Hosted booking is configured for ${configuration.booking.provider.displayName}.` };
}
