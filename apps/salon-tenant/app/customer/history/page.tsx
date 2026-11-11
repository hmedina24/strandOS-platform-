import { PortalCapabilityPage } from "../../../components/portal-capability-page";
import { customerCapabilities, findCapability } from "../../../lib/capabilities";

const capability = findCapability(customerCapabilities, "history");

export default function CustomerHistoryPage() {
  if (!capability) return null;
  return <PortalCapabilityPage kind="customer" capability={capability} />;
}
