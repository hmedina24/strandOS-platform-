import { ActionLink } from "@strandos/ui";
import { ConfigurationError } from "../components/configuration-error";
import { PublicShell } from "../components/public-shell";
import { loadTenantRuntime } from "../lib/tenant-runtime";

export default function HomePage() {
  const result = loadTenantRuntime();
  if (!result.ok) {
    return (
      <ConfigurationError errors={result.errors} />
    );
  }
  const { configuration, homepage } = result.runtime;
  return (
    <PublicShell runtime={result.runtime}>
      <main>
        <section className="hero public-hero">
          <p className="eyebrow">Welcome to</p>
          <h1>{configuration.business.displayName}</h1>
          <p>{homepage}</p>
          <ActionLink href="/book">Book now</ActionLink>
        </section>
        <section className="section public-section">
          <div className="section-intro">
            <p className="eyebrow">Services</p>
            <h2>Made for your next look.</h2>
            <p>
              Explore the approved services available at{" "}
              {configuration.business.displayName}.
            </p>
          </div>
          <div className="service-grid">
            {configuration.business.services.map((service) => (
              <article className="service-card" key={service.name}>
                <h3>{service.name}</h3>
                <p>{service.durationMinutes} minutes</p>
                <strong>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(service.priceCents / 100)}
                </strong>
              </article>
            ))}
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
