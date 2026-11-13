import { ErrorState } from "@strandos/ui";

export function ConfigurationError({ errors }: { errors: string[] }) {
  return <main className="configuration-error"><ErrorState eyebrow="Tenant configuration needs attention" title="This salon application cannot start yet." description="StrandOS must correct the approved configuration before this runtime can render." errors={errors} /></main>;
}
