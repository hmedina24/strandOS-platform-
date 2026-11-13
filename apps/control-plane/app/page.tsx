import { Card, EmptyState } from "@strandos/ui";

const metrics = [
  ["Managed businesses", "0", "Create the first salon tenant"],
  ["Provisioning runs", "0", "Mock workflow ready"],
  ["Platform alerts", "0", "Monitoring is not connected"],
];

export default function OverviewPage() {
  return (
    <>
      <section className="page-intro"><p className="eyebrow">Platform overview</p><h2>Operate every salon from one control plane.</h2><p>Onboard a business, validate its configuration, and prepare its branded StrandOS application without asking the owner to manage infrastructure.</p></section>
      <section className="metric-grid">{metrics.map(([label, value, detail]) => <Card className="metric-card" key={label}><p>{label}</p><strong>{value}</strong><span>{detail}</span></Card>)}</section>
      <EmptyState eyebrow="Getting started" title="Start with your first managed salon" description="The onboarding workflow creates a mock tenant configuration only. Real cloud provisioning remains intentionally out of scope for this phase." />
    </>
  );
}
