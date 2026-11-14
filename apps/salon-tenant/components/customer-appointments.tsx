import Link from "next/link";
import { EmptyState } from "@strandos/ui";
import {
  appointmentSections,
  type AppointmentSection,
} from "../lib/capabilities";

export function CustomerAppointments({
  activeSection,
}: {
  activeSection?: AppointmentSection;
}) {
  return (
    <section className="customer-appointments">
      <div className="customer-appointments-heading">
        <p className="eyebrow">Customer portal</p>
        <h1>Appointments</h1>
        <p>
          Plan a visit, review upcoming appointments, and revisit your salon
          history from one private workspace.
        </p>
      </div>

      <nav className="appointment-navigation" aria-label="Appointment tools">
        <ul>
          {appointmentSections.map((section) => {
            const href = `/customer/appointment/${section.slug}`;
            const isActive = activeSection?.slug === section.slug;

            return (
              <li key={section.slug}>
                <Link href={href} aria-current={isActive ? "page" : undefined}>
                  {section.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {activeSection ? (
        <EmptyState
          eyebrow="Appointments"
          title={activeSection.label}
          description={activeSection.description}
        />
      ) : (
        <div className="appointment-section-grid">
          {appointmentSections.map((section) => (
            <Link
              key={section.slug}
              className="appointment-section-card"
              href={`/customer/appointment/${section.slug}`}
            >
              <span>{section.label}</span>
              <p>{section.description}</p>
              <strong>
                Open {section.label.toLowerCase()} <span aria-hidden="true">→</span>
              </strong>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
