import Link from "next/link";
import { ConfigurationError } from "../../components/configuration-error";
import { PublicShell } from "../../components/public-shell";
import { loadTenantRuntime } from "../../lib/tenant-runtime";

export default function BookPage() {
  const result = loadTenantRuntime();
  if (!result.ok) return <ConfigurationError errors={result.errors} />;
  const { configuration } = result.runtime;
  return <PublicShell runtime={result.runtime}><main className="page empty-page"><p className="eyebrow">Booking</p><h1>{configuration.booking.enabled ? "Online booking is coming soon." : "Online booking is not enabled."}</h1><p>{configuration.booking.enabled ? "This approved salon configuration enables booking. The booking workflow is delivered separately from this template." : "Please contact the salon to arrange your visit."}</p><Link className="button button-secondary" href="/services">View services</Link></main></PublicShell>;
}
