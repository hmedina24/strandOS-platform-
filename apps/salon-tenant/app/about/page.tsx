import { ConfigurationError } from "../../components/configuration-error";
import { PublicShell } from "../../components/public-shell";
import { loadTenantRuntime } from "../../lib/tenant-runtime";

export default function AboutPage() {
  const result = loadTenantRuntime();
  if (!result.ok) return <ConfigurationError errors={result.errors} />;
  return <PublicShell runtime={result.runtime}><main className="page prose"><p className="eyebrow">About us</p><h1>{result.runtime.configuration.business.displayName}</h1><p>{result.runtime.about}</p><h2>Hours</h2><dl>{Object.entries(result.runtime.configuration.business.hours).map(([day, hours]) => <div key={day}><dt>{day}</dt><dd>{hours}</dd></div>)}</dl></main></PublicShell>;
}
