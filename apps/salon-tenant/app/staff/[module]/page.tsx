import { notFound } from "next/navigation";
import { ConfigurationError } from "../../../components/configuration-error";
import { PortalShell } from "../../../components/portal-shell";
import { hasPortalAccess } from "../../../lib/session";
import { loadTenantRuntime } from "../../../lib/tenant-runtime";

export default async function StaffModulePage({ params }: { params: Promise<{ module: string }> }) {
  const result = loadTenantRuntime();
  if (!result.ok) return <ConfigurationError errors={result.errors} />;
  if (!hasPortalAccess("staff", result.runtime.configuration)) return <main className="access-denied"><p className="eyebrow">Staff portal</p><h1>Staff sign-in is required.</h1><p>This protected area is available only to authorized salon staff.</p></main>;
  const { module } = await params;
  if (!(module in result.runtime.configuration.modules) || !result.runtime.configuration.modules[module as keyof typeof result.runtime.configuration.modules]) notFound();
  return <PortalShell runtime={result.runtime} kind="staff"><p className="eyebrow">{module}</p><h1>This business module is not active yet.</h1><p>The route and tenant-level module boundary are ready. Its business workflow will be implemented in a later issue.</p></PortalShell>;
}
