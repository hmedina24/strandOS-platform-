import { notFound } from "next/navigation";
import { PortalCapabilityPage } from "../../../components/portal-capability-page";
import { findCapability, staffCapabilities } from "../../../lib/capabilities";

export default async function StaffModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  const capability = findCapability(staffCapabilities, module);
  if (!capability) notFound();
  return <PortalCapabilityPage kind="staff" capability={capability} />;
}
