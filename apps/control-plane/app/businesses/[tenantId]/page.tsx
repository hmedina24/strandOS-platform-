"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Fragment, useState } from "react";
import { useMockTenants } from "../../../components/mock-tenant-provider";
import { bookingLaunchReadiness } from "@strandos/tenant-configuration";
import {
  actionLabel,
  statusLabel,
  type TenantAction,
} from "../../../lib/tenant-lifecycle";

export default function TenantDetailPage() {
  const params = useParams<{ tenantId: string }>();
  const { isLoaded, tenants, lifecycleRuns, auditEvents, runTenantAction } =
    useMockTenants();
  const [notice, setNotice] = useState<string | null>(null);
  const [expandedEventIds, setExpandedEventIds] = useState<string[]>([]);
  if (!isLoaded)
    return (
      <section className="empty-state">
        <p className="eyebrow">Business</p>
        <h2>Loading tenant…</h2>
      </section>
    );
  const tenant = tenants.find((candidate) => candidate.id === params.tenantId);
  if (!tenant)
    return (
      <section className="empty-state">
        <p className="eyebrow">Business</p>
        <h2>Tenant not found.</h2>
        <p>This browser does not have a matching mock tenant record.</p>
        <Link className="button button-primary" href="/businesses">
          Return to businesses
        </Link>
      </section>
    );
  const runs = lifecycleRuns.filter((run) => run.tenantId === tenant.id);
  const events = auditEvents
    .filter((event) => event.tenantId === tenant.id)
    .slice(0, 12);
  const bookingReadiness = bookingLaunchReadiness(tenant.configuration);
  const active = runs.some((run) =>
    ["requested", "queued", "running"].includes(run.state),
  );
  const runAction = (action: TenantAction) => {
    const run = runTenantAction(tenant.id, action);
    setNotice(
      run
        ? `${actionLabel(action)} simulated successfully. Run ${run.id.slice(-8)} is ${run.state}.`
        : "This action is unavailable while another lifecycle run is active.",
    );
  };
  const toggleEvent = (eventId: string) =>
    setExpandedEventIds((current) =>
      current.includes(eventId)
        ? current.filter((id) => id !== eventId)
        : [...current, eventId],
    );
  return (
    <section>
      <div className="page-intro tenant-heading">
        <div>
          <p className="eyebrow">Managed tenant</p>
          <h2>{tenant.businessName}</h2>
          <p>
            {tenant.salonType} · {tenant.configuration.deployment.domain}
          </p>
        </div>
        <span className={`status-badge status-${tenant.status}`}>
          {statusLabel(tenant.status)}
        </span>
      </div>
      <p className="simulation-notice">
        Simulation only: actions validate configuration and record a
        tenant-template plan. No external deployment or credentials are used.
      </p>
      <div className="detail-grid">
        <article className="detail-card">
          <p className="eyebrow">Controlled actions</p>
          <h3>Operate this tenant</h3>
          <p>
            Every action is recorded with requested, queued, running, and
            terminal states.
          </p>
          <div className="launch-actions">
            <button
              className="button button-secondary"
              onClick={() => runAction("configure")}
              disabled={active}
            >
              Configure
            </button>
            <button
              className="button button-primary"
              onClick={() => runAction("deploy")}
              disabled={active}
            >
              Deploy
            </button>
            <button
              className="button button-secondary"
              onClick={() => runAction("redeploy")}
              disabled={active}
            >
              Redeploy
            </button>
            <a className="button button-secondary" href="#status">
              View status
            </a>
          </div>
          {notice && (
            <p className="action-notice" role="status">
              {notice}
            </p>
          )}
        </article>
        <article className="detail-card">
          <p className="eyebrow">Launch readiness</p>
          <h3>
            {bookingReadiness.ready
              ? "Booking provider ready"
              : "Booking provider needs setup"}
          </h3>
          <p>{bookingReadiness.detail}</p>
          <p>
            Website URL:{" "}
            <a
              href={`https://${tenant.configuration.deployment.domain}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {tenant.configuration.deployment.domain}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
          <p className="simulation-notice">
            Website health is not verified in this simulated Control Plane. No
            external deployment or provider check runs here.
          </p>
        </article>
        <article className="detail-card">
          <p className="eyebrow">Approved configuration</p>
          <h3>Revision {tenant.configurationVersion}</h3>
          <p>
            Template: {tenant.configuration.website.template} · Contract v
            {tenant.configuration.contractVersion}
          </p>
          <details>
            <summary>View non-secret configuration</summary>
            <pre>{JSON.stringify(tenant.configuration, null, 2)}</pre>
          </details>
        </article>
      </div>
      <section id="status" className="detail-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">View status</p>
            <h3>Lifecycle runs</h3>
          </div>
          <Link className="button button-secondary" href="/provisioning">
            All runs
          </Link>
        </div>
        {runs.length ? (
          <div className="run-list">
            {runs.map((run) => (
              <article className="run-card" key={run.id}>
                <div>
                  <h4>
                    {actionLabel(run.action)} · Configuration v
                    {run.configurationVersion}
                  </h4>
                  <p>
                    {run.executionMode} · {run.templateVersion} ·{" "}
                    {new Date(run.requestedAt).toLocaleString()}
                  </p>
                  {run.errorSummary && (
                    <p className="run-error">{run.errorSummary}</p>
                  )}
                </div>
                <span className={`status-badge status-${run.state}`}>
                  {statusLabel(run.state)}
                </span>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-inline">
            No controlled action has been requested for this tenant.
          </p>
        )}
      </section>
      <section className="detail-section">
        <p className="eyebrow">Audit history</p>
        <h3>Recent tenant events</h3>
        <p className="table-help">
          Select a row to expand its complete non-secret event payload.
        </p>
        <div className="event-table-wrap">
          <table className="event-table">
            <caption className="sr-only">
              Recent tenant events. Select an event row to view its JSON data.
            </caption>
            <thead>
              <tr>
                <th scope="col">Event</th>
                <th scope="col">Status</th>
                <th scope="col">Time</th>
                <th scope="col">
                  <span className="sr-only">Expand JSON</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => {
                const expanded = expandedEventIds.includes(event.id);
                return (
                  <Fragment key={event.id}>
                    <tr
                      className={
                        expanded
                          ? "event-table-row event-table-row-expanded"
                          : "event-table-row"
                      }
                      onClick={() => toggleEvent(event.id)}
                    >
                      <td className="event-cell" title={event.detail}>
                        <span className="event-summary">
                          {event.action} — {event.detail}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge status-${event.status}`}>
                          {statusLabel(event.status)}
                        </span>
                      </td>
                      <td>
                        <time dateTime={event.occurredAt}>
                          {new Date(event.occurredAt).toLocaleString()}
                        </time>
                      </td>
                      <td>
                        <button
                          className="event-row-toggle"
                          type="button"
                          aria-expanded={expanded}
                          aria-label={`${expanded ? "Collapse" : "Expand"} JSON for ${event.action}`}
                          onClick={(clickEvent) => {
                            clickEvent.stopPropagation();
                            toggleEvent(event.id);
                          }}
                        >
                          {expanded ? "−" : "+"}
                        </button>
                      </td>
                    </tr>
                    {expanded && (
                      <tr className="event-json-row">
                        <td colSpan={4}>
                          <pre>{JSON.stringify(event, null, 2)}</pre>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
