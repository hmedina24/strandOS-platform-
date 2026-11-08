"use client";

import { useMockTenants } from "../../components/mock-tenant-provider";
import { statusLabel } from "../../lib/tenant-lifecycle";

export default function AuditLogPage() {
  const { auditEvents, isLoaded, tenants } = useMockTenants();

  if (!isLoaded) return <section className="empty-state"><p className="eyebrow">Audit log</p><h2>Loading lifecycle events…</h2></section>;
  if (auditEvents.length === 0) return <section className="empty-state"><p className="eyebrow">Audit log</p><h2>No auditable events yet.</h2><p>Mock tenant lifecycle events will appear here after onboarding.</p></section>;

  const tenantName = (tenantId: string) => tenants.find((tenant) => tenant.id === tenantId)?.businessName ?? "Unknown tenant";
  return <section>
    <div className="page-intro"><p className="eyebrow">Audit log</p><h2>Tenant lifecycle history</h2><p>These are simulated, browser-local events. They do not represent cloud activity.</p></div>
    <ol className="audit-list">{auditEvents.map((event) => <li className="audit-event" key={event.id}>
      <span className={`audit-marker status-${event.status}`} aria-hidden="true" />
      <div><div className="audit-event-heading"><strong>{event.action}</strong><span className={`status-badge status-${event.status}`}>{statusLabel(event.status)}</span></div><p>{tenantName(event.tenantId)} · {event.detail}</p><time dateTime={event.occurredAt}>{new Date(event.occurredAt).toLocaleString()}</time></div>
    </li>)}</ol>
  </section>;
}
