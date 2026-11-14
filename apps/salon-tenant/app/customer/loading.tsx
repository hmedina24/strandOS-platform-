import { LoadingState } from "@strandos/ui";

export default function CustomerPortalLoading() {
  return (
    <main className="portal-loading">
      <LoadingState
        eyebrow="Customer portal"
        title="Loading your salon space"
        description="Preparing this customer workspace."
      />
    </main>
  );
}
