import { ConfigurationError } from "../../components/configuration-error";
import { PortalShell } from "../../components/portal-shell";
import { hasPortalAccess } from "../../lib/session";
import { loadTenantRuntime } from "../../lib/tenant-runtime";

export default function StaffPortalPage() {
  const result = loadTenantRuntime();
  if (!result.ok) return <ConfigurationError errors={result.errors} />;
  if (!hasPortalAccess("staff", result.runtime.configuration)) return <main className="access-denied"><p className="eyebrow">Staff portal</p><h1>Staff sign-in is required.</h1><p>This portal is for authorized members of this salon. StrandOS will connect production authentication separately.</p></main>;
  const enabledModules = Object.keys(result.runtime.configuration.modules).filter((module) => result.runtime.configuration.modules[module as keyof typeof result.runtime.configuration.modules]);
  return <PortalShell runtime={result.runtime} kind="staff"><p className="eyebrow">Staff portal</p><h1>Run {result.runtime.configuration.business.displayName} from one place.</h1><p>Enabled modules are ready for their future business workflows. This template does not load calendar, contact, sales, or report data.</p><ul className="module-list">{enabledModules.map((module) => <li key={module}>{module}</li>)}</ul></PortalShell>;
}
