import Link from "next/link";
import { ConfigurationError } from "../../components/configuration-error";
import { PortalShell } from "../../components/portal-shell";
import { staffCapabilities } from "../../lib/capabilities";
import { hasPortalAccess } from "../../lib/session";
import { loadTenantRuntime } from "../../lib/tenant-runtime";

export default function StaffPortalPage() {
  const result = loadTenantRuntime();
  if (!result.ok) return <ConfigurationError errors={result.errors} />;
  if (!hasPortalAccess("staff", result.runtime.configuration)) return <main className="access-denied"><p className="eyebrow">Staff portal</p><h1>Staff sign-in is required.</h1><p>This portal is for authorized members of this salon. StrandOS will connect production authentication separately.</p></main>;
  return <PortalShell runtime={result.runtime} kind="staff"><section className="staff-overview"><div className="staff-overview-heading"><div><p className="eyebrow">Staff workspace</p><h1>Good morning, salon team.</h1><p>Keep the day organized from one calm, branded workspace. Live appointments, clients, and business data arrive with the native StrandOS capabilities.</p></div><span className="staff-status">Demo workspace</span></div><section className="staff-quick-actions" aria-labelledby="staff-tools-heading"><div><p className="eyebrow">Workspace tools</p><h2 id="staff-tools-heading">Everything your team needs, in one place.</h2></div><div className="staff-action-grid">{staffCapabilities.map((capability) => <Link key={capability.slug} className="staff-action-card" href={`/staff/${capability.slug}`}><span>{capability.label}</span><p>{capability.description}</p><strong>Open workspace <span aria-hidden="true">→</span></strong></Link>)}</div></section><section className="staff-roadmap" aria-label="Workspace foundation"><article><p className="eyebrow">Today</p><h2>Plan the day</h2><p>Calendar and booking are ready for the native scheduling service.</p></article><article><p className="eyebrow">Client care</p><h2>Know every visit</h2><p>Client profiles, notes, and appointment history remain tenant-scoped.</p></article><article><p className="eyebrow">Operations</p><h2>See the business</h2><p>Reports, receipts, analytics, products, and inventory grow from the same foundation.</p></article></section></section></PortalShell>;
}
