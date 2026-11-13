"use client";

import { Fragment, useState } from "react";
import { useMockTenants } from "../../components/mock-tenant-provider";
import { statusLabel } from "../../lib/tenant-lifecycle";

export default function AuditLogPage() {
  const { auditEvents, isLoaded, tenants } = useMockTenants();
  const [expandedEventIds, setExpandedEventIds] = useState<string[]>([]);
  if (!isLoaded)
    return (
      <section className="empty-state">
        <p className="eyebrow">Audit log</p>
        <h2>Loading lifecycle events…</h2>
      </section>
    );
  if (auditEvents.length === 0)
    return (
      <section className="empty-state">
        <p className="eyebrow">Audit log</p>
        <h2>No auditable events yet.</h2>
        <p>Mock tenant lifecycle events will appear here after onboarding.</p>
      </section>
    );

  const tenantName = (tenantId: string) =>
    tenants.find((tenant) => tenant.id === tenantId)?.businessName ??
    "Unknown tenant";
  const toggleEvent = (eventId: string) =>
    setExpandedEventIds((current) =>
      current.includes(eventId)
        ? current.filter((id) => id !== eventId)
        : [...current, eventId],
    );
  return (
    <section>
      <div className="page-intro">
        <p className="eyebrow">Audit log</p>
        <h2>Tenant lifecycle history</h2>
        <p>
          These are simulated, browser-local events. Select a row to inspect its
          complete non-secret JSON payload.
        </p>
      </div>
      <div className="event-table-wrap">
        <table className="event-table">
          <colgroup>
            <col className="event-tenant-column" />
            <col className="event-description-column" />
            <col className="event-status-column" />
            <col className="event-time-column" />
            <col className="event-expand-column" />
          </colgroup>
          <caption className="sr-only">
            Tenant lifecycle audit events. Select an event row to view its JSON
            data.
          </caption>
          <thead>
            <tr>
              <th scope="col">Tenant</th>
              <th scope="col">Event</th>
              <th scope="col">Status</th>
              <th scope="col">Time</th>
              <th scope="col">
                <span className="sr-only">Expand JSON</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {auditEvents.map((event) => {
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
                    <td>
                      <strong>{tenantName(event.tenantId)}</strong>
                    </td>
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
                      <td colSpan={5}>
                        <pre>
                          {JSON.stringify(
                            {
                              tenantName: tenantName(event.tenantId),
                              ...event,
                            },
                            null,
                            2,
                          )}
                        </pre>
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
  );
}
