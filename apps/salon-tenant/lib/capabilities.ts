export type Capability = { slug: string; label: string; description: string };
export type AppointmentSection = Capability;

export const customerCapabilities: Capability[] = [
  { slug: "profile", label: "Profile", description: "Your profile details will appear here when the customer profile capability is enabled." },
  { slug: "appointment", label: "Appointments", description: "Manage upcoming visits, booking, and appointment history in one place." },
  { slug: "messaging", label: "Messaging", description: "Messages from this salon will appear here when native messaging is enabled." },
  { slug: "products", label: "Products & merchandise", description: "Products and merchandise from this salon will appear here when the catalog is enabled." },
];

export const appointmentSections: AppointmentSection[] = [
  { slug: "calendar", label: "Calendar", description: "Your upcoming appointments will appear here after native scheduling is available." },
  { slug: "book", label: "Book appointment", description: "Native appointment booking is being prepared for this salon." },
  { slug: "history", label: "Appointment history", description: "Your past visits and service details will appear here when appointment history is available." },
];

export const staffCapabilities: Capability[] = [
  { slug: "calendar", label: "Calendar", description: "The salon calendar will appear here when native scheduling is enabled." },
  { slug: "book", label: "Book appointment", description: "Create appointments here when native scheduling is enabled." },
  { slug: "crm", label: "Client log / CRM", description: "Tenant-scoped client records will appear here when the native CRM is enabled." },
  { slug: "client-profile", label: "Client profile", description: "Read-only client profiles will appear here when authorized customer data is available." },
  { slug: "client-notes", label: "Client notes", description: "Authorized client notes will appear here when the native CRM is enabled." },
  { slug: "appointment-history", label: "Appointment history", description: "Historical appointments will appear here when native scheduling is enabled." },
  { slug: "messaging", label: "Messaging", description: "Tenant messaging will appear here when the capability is enabled." },
  { slug: "products", label: "Products", description: "Product and merchandise management will appear here when the catalog is enabled." },
  { slug: "reports", label: "Reports", description: "Business reports will appear here when reporting is enabled." },
  { slug: "receipts", label: "Receipts", description: "Receipts will appear here when the receipts capability is enabled." },
  { slug: "analytics", label: "Analytics", description: "Business analytics will appear here when analytics is enabled." },
  { slug: "inventory", label: "Inventory", description: "Inventory controls will appear here when the inventory capability is enabled." },
];

export function findCapability(capabilities: Capability[], slug: string) {
  return capabilities.find((capability) => capability.slug === slug);
}
