# StrandOS UI

`@strandos/ui` contains small, dependency-light UI primitives shared by the StrandOS Control Plane and tenant applications.

## Public API

- `ActionLink` — accessible anchor styled as a primary or secondary action.
- `ActionButton` — accessible button styled as a primary or secondary action.
- `EmptyState` — semantic capability, no-data, or not-yet-enabled state with an optional action.

The consuming application owns theme tokens and imports its corresponding `.strandos-*` styles. Keep primitives free of tenant configuration, operational data, authentication decisions, and business workflows so they can be assembled by a future tenant repository.
