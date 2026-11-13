# StrandOS UI

`@strandos/ui` contains small, dependency-light UI primitives shared by the StrandOS Control Plane and tenant applications.

## Public API

- `ActionLink` — accessible anchor styled as a primary or secondary action.
- `ActionButton` — accessible button styled as a primary or secondary action.
- `EmptyState` — semantic capability, no-data, or not-yet-enabled state with an optional action.
- `LoadingState` — polite progress announcement for an in-progress page or capability.
- `ErrorState` — alerting error state with optional detail and recovery actions.
- `StatusBadge` — non-interactive neutral, info, success, warning, or danger label.
- `Card` and `Stack` — small composition primitives for surfaces and vertical layout.
- `NavigationList` — semantic navigation wrapper for framework-specific links.
- `FormField` — label, hint, and validation-message wrapper for native form controls.

The consuming application owns its `.strandos-*` theme styles and supplies framework-specific routing links. Shared primitives provide semantic HTML, accessible roles, and stable TypeScript contracts; they do not contain tenant configuration, operational data, authentication decisions, business workflows, or infrastructure credentials.
