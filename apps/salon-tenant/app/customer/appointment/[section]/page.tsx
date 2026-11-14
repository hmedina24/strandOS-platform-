import { notFound } from "next/navigation";
import { PortalAppointmentPage } from "../../../../components/portal-appointment-page";
import { appointmentSections, findCapability } from "../../../../lib/capabilities";

export default async function CustomerAppointmentSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const activeSection = findCapability(appointmentSections, section);

  if (!activeSection) {
    notFound();
  }

  return <PortalAppointmentPage activeSection={activeSection} />;
}
