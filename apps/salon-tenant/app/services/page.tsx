import { ConfigurationError } from "../../components/configuration-error";
import { PublicShell } from "../../components/public-shell";
import { loadTenantRuntime } from "../../lib/tenant-runtime";

export default function ServicesPage() {
  const result = loadTenantRuntime();
  if (!result.ok) return <ConfigurationError errors={result.errors} />;
  return <PublicShell runtime={result.runtime}><main className="page"><p className="eyebrow">Services</p><h1>Made for your next look.</h1><div className="service-grid">{result.runtime.configuration.business.services.map((service) => <article key={service.name}><h2>{service.name}</h2><p>{service.durationMinutes} minutes</p><strong>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(service.priceCents / 100)}</strong></article>)}</div></main></PublicShell>;
}
