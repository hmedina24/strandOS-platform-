import { ConfigurationError } from "../../components/configuration-error";
import { PublicShell } from "../../components/public-shell";
import { loadTenantRuntime } from "../../lib/tenant-runtime";
import { ActionLink, EmptyState } from "@strandos/ui";

export default function BookPage() {
  const result = loadTenantRuntime();
  if (!result.ok) {
    return (
      <ConfigurationError errors={result.errors} />
    );
  }
  const { configuration } = result.runtime;
  return (
    <PublicShell runtime={result.runtime}>
      <main className="page empty-page">
        <EmptyState
          eyebrow="Book now"
          title="Native booking is coming soon."
          description="StrandOS is preparing this salon’s native booking and calendar experience. Please contact the salon to arrange your visit in the meantime."
        >
          <div className="public-action-row">
            <ActionLink
              href={`mailto:${configuration.business.publicContactEmail}`}
              variant="secondary"
            >
              Email the salon
            </ActionLink>
            <ActionLink
              href={`tel:${configuration.business.publicContactPhone.e164}`}
              variant="secondary"
            >
              Call {configuration.business.publicContactPhone.display}
            </ActionLink>
          </div>
        </EmptyState>
      </main>
    </PublicShell>
  );
}
