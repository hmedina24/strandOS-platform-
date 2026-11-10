"use client";

import Link from "next/link";
import { useMockTenants } from "../../components/mock-tenant-provider";
import { actionLabel, statusLabel } from "../../lib/tenant-lifecycle";

export default function ProvisioningPage() {
  const { isLoaded, lifecycleRuns, tenants } = useMockTenants();
  if (!isLoaded) return <section className="empty-state"><p className="eyebrow">Provisioning</p><h2>Loading simulated runs…</h2></section>;
  if (!lifecycleRuns.length) return <section className="empty-state"><p className="eyebrow">Provisioning</p><h2>No lifecycle runs yet.</h2><p>Run Configure, Deploy, or Redeploy from a tenant detail view to create a traceable simulated operation.</p><Link className="button button-primary" href="/businesses">View businesses</Link></section>;
  const tenantName = (tenantId: string) => tenants.find((tenant) => tenant.id === tenantId)?.businessName ?? "Unknown tenant";
  return <section><div className="page-intro"><p className="eyebrow">Provisioning</p><h2>Tenant lifecycle runs</h2><p>All runs are simulated and browser-local. They do not represent provider activity.</p></div><div className="run-list">{lifecycleRuns.map((run) => <article className="run-card" key={run.id}><div><p className="eyebrow">{run.executionMode} · {run.templateVersion}</p><h3>{actionLabel(run.action)} — {tenantName(run.tenantId)}</h3><p>Configuration v{run.configurationVersion} · Requested {new Date(run.requestedAt).toLocaleString()}</p>{run.errorSummary && <p className="run-error">{run.errorSummary}</p>}</div><div className="business-meta"><span className={`status-badge status-${run.state}`}>{statusLabel(run.state)}</span><Link className="button button-secondary" href={`/businesses/${run.tenantId}`}>View status</Link></div></article>)}</div></section>;
}
