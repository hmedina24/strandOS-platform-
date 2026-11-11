import { ActionLink } from "@strandos/ui";
import { ConfigurationError } from "../components/configuration-error";
import { PublicShell } from "../components/public-shell";
import { loadTenantRuntime } from "../lib/tenant-runtime";

export default function HomePage() {
  const result = loadTenantRuntime();
  if (!result.ok) return <ConfigurationError errors={result.errors} />;
  const { configuration, homepage } = result.runtime;
  return <PublicShell runtime={result.runtime}><main><section className="hero"><p className="eyebrow">Welcome to</p><h1>{configuration.business.displayName}</h1><p>{homepage}</p><ActionLink href={configuration.booking.enabled ? "/book" : "/services"}>{configuration.booking.enabled ? "Book an appointment" : "Explore services"}</ActionLink></section><section className="section"><h2>Services</h2><div className="service-grid">{configuration.business.services.map((service) => <article key={service.name}><h3>{service.name}</h3><p>{service.durationMinutes} minutes</p><strong>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(service.priceCents / 100)}</strong></article>)}</div></section></main></PublicShell>;
}
