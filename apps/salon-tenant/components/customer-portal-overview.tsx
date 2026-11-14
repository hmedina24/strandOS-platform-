import Link from "next/link";
import { StatusBadge } from "@strandos/ui";
import { customerCapabilities } from "../lib/capabilities";

/**
 * Customer-facing navigation only. Capability data deliberately stays out of
 * this component until the native customer services supply tenant-scoped data.
 */
export function CustomerPortalOverview() {
  return (
    <section className="customer-overview">
      <div className="customer-overview-heading">
        <div>
          <p className="eyebrow">Customer portal</p>
          <h1>Your salon space.</h1>
          <p>
            Keep your appointments, profile, and salon updates in one place as
            this salon enables native StrandOS capabilities.
          </p>
        </div>
        <StatusBadge tone="info">Private workspace</StatusBadge>
      </div>

      <section
        className="customer-capabilities"
        aria-labelledby="customer-tools-heading"
      >
        <div>
          <p className="eyebrow">Your salon tools</p>
          <h2 id="customer-tools-heading">Everything, ready when you are.</h2>
        </div>
        <div className="customer-capability-grid">
          {customerCapabilities.map((capability) => (
            <Link
              key={capability.slug}
              className="customer-capability-card"
              href={`/customer/${capability.slug}`}
            >
              <span>{capability.label}</span>
              <p>{capability.description}</p>
              <strong>
                Open {capability.label.toLowerCase()}{" "}
                <span aria-hidden="true">→</span>
              </strong>
            </Link>
          ))}
        </div>
      </section>

      <aside className="customer-privacy-note" aria-label="Customer privacy">
        <p className="eyebrow">Built for your privacy</p>
        <p>
          When available, your information is shown only inside your signed-in
          salon account.
        </p>
      </aside>
    </section>
  );
}
