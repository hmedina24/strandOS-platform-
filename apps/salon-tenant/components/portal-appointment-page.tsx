import { ConfigurationError } from "./configuration-error";
import { CustomerAppointments } from "./customer-appointments";
import { PortalShell } from "./portal-shell";
import type { AppointmentSection } from "../lib/capabilities";
import { hasPortalAccess } from "../lib/session";
import { loadTenantRuntime } from "../lib/tenant-runtime";

export function PortalAppointmentPage({
  activeSection,
}: {
  activeSection?: AppointmentSection;
}) {
  const result = loadTenantRuntime();

  if (!result.ok) {
    return <ConfigurationError errors={result.errors} />;
  }

  if (!hasPortalAccess("customer", result.runtime.configuration)) {
    return (
      <main className="access-denied">
        <p className="eyebrow">Customer application</p>
        <h1>Sign-in is required.</h1>
        <p>Appointments are available only to authorized customers of this salon.</p>
      </main>
    );
  }

  return (
    <PortalShell runtime={result.runtime} kind="customer">
      <CustomerAppointments activeSection={activeSection} />
    </PortalShell>
  );
}
