import { ConfigurationError } from "../../components/configuration-error";
import { PublicShell } from "../../components/public-shell";
import { loadTenantRuntime } from "../../lib/tenant-runtime";

export default function BookPage() {
  const result = loadTenantRuntime();
  if (!result.ok) return <ConfigurationError errors={result.errors} />;
  const { configuration } = result.runtime;
  const provider = configuration.booking.provider;
  const bookingIsAvailable = configuration.booking.enabled && provider;
  return <PublicShell runtime={result.runtime}><main className="page empty-page"><p className="eyebrow">Booking</p><h1>{bookingIsAvailable ? `Book with ${provider.displayName}.` : "Online booking is not available."}</h1>{bookingIsAvailable ? <><p>You’ll continue to {provider.displayName} to choose your appointment. Availability, appointments, and client contact details are managed securely by the salon’s booking provider.</p><a className="button" href={provider.bookingUrl} target="_blank" rel="noopener noreferrer">Continue to booking<span className="sr-only"> (opens in a new tab)</span></a><p className="booking-note">Need help before booking? Email <a href={`mailto:${configuration.business.publicContactEmail}`}>{configuration.business.publicContactEmail}</a>.</p></> : <><p>Please email the salon to arrange your visit. We do not collect appointment or contact details through this website.</p><a className="button button-secondary" href={`mailto:${configuration.business.publicContactEmail}`}>Email the salon</a></>}</main></PublicShell>;
}
