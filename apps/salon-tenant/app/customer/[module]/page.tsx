import { notFound } from "next/navigation";
import { PortalCapabilityPage } from "../../../components/portal-capability-page";
import { customerCapabilities, findCapability } from "../../../lib/capabilities";

export default async function CustomerModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  const capability = findCapability(customerCapabilities, module);
  if (!capability) notFound();
  return <PortalCapabilityPage kind="customer" capability={capability} />;
}
