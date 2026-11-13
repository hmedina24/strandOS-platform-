import { ConfigurationError } from "../../components/configuration-error";
import { PortalShell } from "../../components/portal-shell";
import { hasPortalAccess } from "../../lib/session";
import { loadTenantRuntime } from "../../lib/tenant-runtime";

export default function CustomerPortalPage() {
  const result = loadTenantRuntime();
  if (!result.ok) {
    return (
      <ConfigurationError errors={result.errors} />
    );
  }
  if (!hasPortalAccess("customer", result.runtime.configuration))
    return (
      <main className="access-denied">
        <p className="eyebrow">Customer portal</p>
        <h1>Sign-in is required.</h1>
        <p>
          This protected area will show only the authenticated customer’s own
          information once the salon authentication service is connected.
        </p>
      </main>
    );
  return (
    <PortalShell runtime={result.runtime} kind="customer">
      <p className="eyebrow">Customer portal</p>
      <h1>Your salon space is ready.</h1>
      <p>
        Profile, appointment, and style-history features will appear here when
        they are delivered. No customer records are loaded by this template.
      </p>
    </PortalShell>
  );
}
