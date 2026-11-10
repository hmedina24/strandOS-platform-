"use client";

import Link from "next/link";
import { useMockTenants } from "../../components/mock-tenant-provider";
import { statusLabel } from "../../lib/tenant-lifecycle";

export default function BusinessesPage() {
  const { isLoaded, tenants } = useMockTenants();

  if (!isLoaded) return <section className="empty-state"><p className="eyebrow">Businesses</p><h2>Loading mock tenants…</h2></section>;

  if (tenants.length === 0) {
    return <section className="empty-state"><p className="eyebrow">Businesses</p><h2>No salons onboarded yet.</h2><p>Complete the onboarding workflow to create the first mock tenant record.</p><Link className="button button-primary" href="/onboarding">Onboard salon</Link></section>;
  }

  return <section>
    <div className="page-intro"><p className="eyebrow">Businesses</p><h2>Managed salon tenants</h2><p>Mock tenant records are stored only in this browser for the current Control Plane prototype.</p></div>
    <div className="business-list" aria-label="Mock salon tenants">
      {tenants.map((tenant) => <article className="business-card" key={tenant.id}>
        <div className="business-identity"><span className="tenant-mark" style={{ backgroundColor: tenant.primaryColor }}>{tenant.businessName.slice(0, 1).toUpperCase()}</span><div><h3>{tenant.businessName}</h3><p>{tenant.salonType} · {tenant.domain || "StrandOS domain pending"}</p></div></div>
        <div className="business-meta"><span className={`status-badge status-${tenant.status}`}>{statusLabel(tenant.status)}</span><span>Configuration v{tenant.configurationVersion} · Created {new Date(tenant.createdAt).toLocaleString()}</span><Link className="button button-secondary" href={`/businesses/${tenant.id}`}>View tenant</Link></div>
      </article>)}
    </div>
  </section>;
}
