"use client";

import Link from "next/link";
import { EmptyState, LoadingState, StatusBadge } from "@strandos/ui";
import { useMockTenants } from "../../components/mock-tenant-provider";
import { actionLabel, statusLabel } from "../../lib/tenant-lifecycle";

export default function ProvisioningPage() {
  const { isLoaded, lifecycleRuns, tenants } = useMockTenants();
  if (!isLoaded) return <LoadingState eyebrow="Provisioning" title="Loading simulated runs…" />;
  if (!lifecycleRuns.length) return <EmptyState eyebrow="Provisioning" title="No lifecycle runs yet." description="Run Configure, Deploy, or Redeploy from a tenant detail view to create a traceable simulated operation."><Link className="button button-primary" href="/businesses">View businesses</Link></EmptyState>;
  const tenantName = (tenantId: string) => tenants.find((tenant) => tenant.id === tenantId)?.businessName ?? "Unknown tenant";
  return <section><div className="page-intro"><p className="eyebrow">Provisioning</p><h2>Tenant lifecycle runs</h2><p>All runs are simulated and browser-local. They do not represent provider activity.</p></div><div className="run-list">{lifecycleRuns.map((run) => <article className="run-card" key={run.id}><div><p className="eyebrow">{run.executionMode} · {run.templateVersion}</p><h3>{actionLabel(run.action)} — {tenantName(run.tenantId)}</h3><p>Configuration v{run.configurationVersion} · Requested {new Date(run.requestedAt).toLocaleString()}</p>{run.errorSummary && <p className="run-error">{run.errorSummary}</p>}</div><div className="business-meta"><StatusBadge tone={run.state === "failed" ? "danger" : run.state === "succeeded" ? "success" : run.state === "queued" ? "warning" : "info"}>{statusLabel(run.state)}</StatusBadge><Link className="button button-secondary" href={`/businesses/${run.tenantId}`}>View status</Link></div></article>)}</div></section>;
}
