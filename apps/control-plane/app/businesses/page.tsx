"use client";

import Link from "next/link";
import { EmptyState, LoadingState, StatusBadge } from "@strandos/ui";
import { useMockTenants } from "../../components/mock-tenant-provider";
import { statusLabel } from "../../lib/tenant-lifecycle";

export default function BusinessesPage() {
  const { isLoaded, tenants } = useMockTenants();

  if (!isLoaded) return <LoadingState eyebrow="Businesses" title="Loading mock tenants…" />;

  if (tenants.length === 0) {
    return <EmptyState eyebrow="Businesses" title="No salons onboarded yet." description="Complete the onboarding workflow to create the first mock tenant record."><Link className="button button-primary" href="/onboarding">Onboard salon</Link></EmptyState>;
  }

  return <section>
    <div className="page-intro"><p className="eyebrow">Businesses</p><h2>Managed salon tenants</h2><p>Mock tenant records are stored only in this browser for the current Control Plane prototype.</p></div>
    <div className="business-list" aria-label="Mock salon tenants">
      {tenants.map((tenant) => <article className="business-card" key={tenant.id}>
        <div className="business-identity"><span className="tenant-mark" style={{ backgroundColor: tenant.primaryColor }}>{tenant.businessName.slice(0, 1).toUpperCase()}</span><div><h3>{tenant.businessName}</h3><p>{tenant.salonType} · {tenant.domain || "StrandOS domain pending"}</p></div></div>
        <div className="business-meta"><StatusBadge tone={tenant.status === "failed" ? "danger" : tenant.status === "deployed" ? "success" : tenant.status === "provisioning" ? "warning" : "info"}>{statusLabel(tenant.status)}</StatusBadge><span>Configuration v{tenant.configurationVersion} · Created {new Date(tenant.createdAt).toLocaleString()}</span><Link className="button button-secondary" href={`/businesses/${tenant.id}`}>View tenant</Link></div>
      </article>)}
    </div>
  </section>;
}
