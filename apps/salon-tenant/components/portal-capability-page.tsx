import { ActionLink, EmptyState } from "@strandos/ui";
import { ConfigurationError } from "./configuration-error";
import { PortalShell } from "./portal-shell";
import type { Capability } from "../lib/capabilities";
import { hasPortalAccess, type PortalKind } from "../lib/session";
import { loadTenantRuntime } from "../lib/tenant-runtime";

export function PortalCapabilityPage({
  capability,
  kind,
}: {
  capability: Capability;
  kind: PortalKind;
}) {
  const result = loadTenantRuntime();
  if (!result.ok) {
    return <ConfigurationError errors={result.errors} />;
  }

  if (!hasPortalAccess(kind, result.runtime.configuration)) {
    return (
      <main className="access-denied">
        <p className="eyebrow">
          {kind === "customer" ? "Customer application" : "Staff application"}
        </p>
        <h1>Sign-in is required.</h1>
        <p>This capability is available only to authorized members of this salon.</p>
      </main>
    );
  }

  return (
    <PortalShell runtime={result.runtime} kind={kind}>
      <EmptyState
        eyebrow={kind === "customer" ? "Customer application" : "Staff application"}
        title={capability.label}
        description={capability.description}
      >
        {kind === "customer" && capability.slug === "profile" ? (
          <ActionLink href="/customer/appointment/history" variant="secondary">
            View appointment history
          </ActionLink>
        ) : null}
      </EmptyState>
    </PortalShell>
  );
}
