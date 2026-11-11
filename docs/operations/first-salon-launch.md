# First managed salon launch runbook

## Scope

This runbook covers the Phase 3 provider-backed launch. StrandOS delivers the branded public website and a public link to the approved booking provider. The provider is the system of record for availability, appointments, calendar workflow, and client contacts.

It does not authorize native scheduling, provider API integration, credential storage in tenant configuration, client-data collection, or external deployment from the current simulated Control Plane.

## Preflight

- Confirm approved brand assets, public content, services, hours, policies, and domain.
- Confirm the provider-account owner and StrandOS support-access arrangement.
- Add `booking.provider.displayName` and an approved public HTTPS `booking.provider.bookingUrl` to the tenant configuration.
- Validate configuration before any deploy action. Do not add credentials, account identifiers, webhook values, or client data to the configuration.
- Confirm the booking destination is the intended provider-owned page and that the public contact email is staffed.

## Deploy and verify

1. Use Control Plane Configure to record the approved configuration revision.
2. Review the booking-provider readiness card. A tenant with enabled booking cannot complete simulated Deploy or Redeploy without a provider destination.
3. Run Deploy, then record the configuration version, template version, execution mode, and terminal status in audit history.
4. After a real deployment path is approved, verify the deployed URL, mobile layout, services and hours, booking CTA, external-link behavior, and email fallback.
5. Confirm the provider—not StrandOS—shows and manages the appointment calendar and client contact records.

## Rollback and handoff

- To stop directing visitors to an incorrect provider page, remove or replace the public provider configuration through the approved configuration workflow and redeploy.
- Preserve the prior configuration revision and audit history for recovery. Do not attempt to modify provider records from StrandOS.
- Hand the salon owner the provider-account ownership details, public website URL, support contact, and the process for requesting content or booking-link changes.
