import { EmptyState } from "@strandos/ui";
import { ConfigurationError } from "../../components/configuration-error";
import { PublicShell } from "../../components/public-shell";
import { loadTenantRuntime } from "../../lib/tenant-runtime";

export default function LoginPage() {
  const result = loadTenantRuntime();
  if (!result.ok) {
    return (
      <ConfigurationError errors={result.errors} />
    );
  }
  return (
    <PublicShell runtime={result.runtime}>
      <main className="page empty-page">
        <EmptyState
          eyebrow="Log in"
          title="Secure sign-in is being prepared."
          description="Customer and staff accounts will use native StrandOS authentication when it is available. This page does not grant access or choose a customer or staff workspace yet."
        />
      </main>
    </PublicShell>
  );
}
